import {
  ASSISTANT_MODEL,
  MAX_OUTPUT_TOKENS,
  RATE_LIMITS,
} from "@/features/assistant/constants";
import {
  DOCUMENTS_INTRO,
  SYSTEM_PROMPT,
  UNANSWERED_TOOL_NAME,
} from "@/features/assistant/prompt";
import {
  chatRequestSchema,
  unansweredToolInputSchema,
} from "@/features/assistant/schema";
import {
  logUnanswered,
  recordUsage,
} from "@/features/assistant/services/usage.service";
import type { ChatStreamEvent } from "@/features/assistant/types";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildContextDocs, findPageDoc } from "./build-context";
import {
  checkAssistantAccess,
  jsonError,
  toDocumentBlocks,
  toVisitorError,
} from "./shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const unansweredTool: Anthropic.Tool = {
  name: UNANSWERED_TOOL_NAME,
  description:
    "Record a genuine question about the portfolio owner's work or background that the documents cannot answer, so the owner can add the missing content. Call it once, after replying to the visitor.",
  input_schema: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description: "The visitor's question, restated briefly.",
      },
    },
    required: ["question"],
  },
};

export async function POST(req: Request) {
  if (
    isRateLimited(
      `chat:${getClientIp(req)}`,
      RATE_LIMITS.chat.limit,
      RATE_LIMITS.chat.windowMs,
    )
  ) {
    return jsonError(
      "rate_limited",
      "Too many messages. Please wait a few minutes and try again.",
      429,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const blocked = await checkAssistantAccess();
  if (blocked) return blocked;

  const docs = await buildContextDocs();
  const focus = findPageDoc(docs, parsed.data.page);

  const documentBlocks = toDocumentBlocks(docs, { citations: true });

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: [
        ...documentBlocks,
        {
          type: "text",
          text: focus
            ? `${DOCUMENTS_INTRO}\nThe visitor is currently viewing "${focus.title}" (${focus.url}). If their question is ambiguous, assume it is about this page.`
            : DOCUMENTS_INTRO,
        },
      ],
    },
    ...parsed.data.messages,
  ];

  const encoder = new TextEncoder();
  let stream: ReturnType<Anthropic["messages"]["stream"]> | undefined;

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatStreamEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      const cited = new Set<string>();

      try {
        const client = new Anthropic();
        stream = client.messages.stream(
          {
            model: ASSISTANT_MODEL,
            max_tokens: MAX_OUTPUT_TOKENS,
            system: SYSTEM_PROMPT,
            tools: [unansweredTool],
            tool_choice: { type: "auto" },
            output_config: { effort: "low" },
            messages,
          },
          { signal: req.signal },
        );

        for await (const event of stream) {
          if (event.type !== "content_block_delta") continue;

          if (event.delta.type === "text_delta") {
            send({ t: "text", v: event.delta.text });
          } else if (event.delta.type === "citations_delta") {
            const citation = event.delta.citation;
            if (!("document_index" in citation)) continue;

            const doc = docs[citation.document_index];
            if (doc && !cited.has(doc.id)) {
              cited.add(doc.id);
              send({ t: "cite", id: doc.id, title: doc.title, url: doc.url });
            }
          }
        }

        const final = await stream.finalMessage();
        await recordUsage(final.usage);

        if (final.stop_reason === "refusal") {
          send({
            t: "error",
            code: "refused",
            message: "I can't help with that request.",
          });
        } else {
          for (const block of final.content) {
            if (
              block.type !== "tool_use" ||
              block.name !== UNANSWERED_TOOL_NAME
            ) {
              continue;
            }
            const input = unansweredToolInputSchema.safeParse(block.input);
            if (input.success) {
              await logUnanswered(input.data.question, focus?.url ?? null);
            }
          }
          send({ t: "done" });
        }
      } catch (error) {
        const visitorError = toVisitorError(error);
        if (visitorError) send({ t: "error", ...visitorError });
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream?.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
