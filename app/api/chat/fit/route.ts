import {
  ASSISTANT_MODEL,
  FIT_MAX_OUTPUT_TOKENS,
  FIT_MAX_REQUIREMENTS,
  RATE_LIMITS,
} from "@/features/assistant/constants";
import { FIT_JOB_INTRO, FIT_SYSTEM_PROMPT } from "@/features/assistant/prompt";
import { fitCheckRequestSchema } from "@/features/assistant/schema";
import { recordUsage } from "@/features/assistant/services/usage.service";
import type { FitCheckResult, FitMatch } from "@/features/assistant/types";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import * as z from "zod/v4";
import { buildContextDocs } from "../build-context";
import {
  checkAssistantAccess,
  jsonError,
  toDocumentBlocks,
  toVisitorError,
} from "../shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const isFitMatch = (value: string): value is FitMatch =>
  value === "strong" || value === "partial" || value === "gap";

export async function POST(req: Request) {
  if (
    isRateLimited(
      `fit:${getClientIp(req)}`,
      RATE_LIMITS.fit.limit,
      RATE_LIMITS.fit.windowMs,
    )
  ) {
    return jsonError(
      "rate_limited",
      "Too many fit checks. Please try again later.",
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

  const parsed = fitCheckRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const blocked = await checkAssistantAccess();
  if (blocked) return blocked;

  const docs = await buildContextDocs();

  // The SDK turns enums into description text instead of enforcing them, so
  // the allowed values are described here and re-checked below. A bad value
  // never reaches the visitor: unknown sources become "no link", unknown
  // matches are dropped.
  const outputSchema = z.object({
    summary: z.string(),
    requirements: z.array(
      z.object({
        requirement: z.string(),
        match: z.string().describe('One of "strong", "partial" or "gap".'),
        evidence: z.string(),
        sourceId: z
          .string()
          .describe(
            `Id of the best supporting document, one of: ${docs.map((doc) => doc.id).join(", ")}. Use "none" for a gap.`,
          ),
      }),
    ),
  });

  // The job description is untrusted: drop anything that could close our tag.
  const jobDescription = parsed.data.jobDescription.replace(
    /<\/?job_description>/gi,
    "",
  );

  try {
    const client = new Anthropic();
    const response = await client.messages.parse(
      {
        model: ASSISTANT_MODEL,
        max_tokens: FIT_MAX_OUTPUT_TOKENS,
        system: FIT_SYSTEM_PROMPT,
        output_config: {
          effort: "low",
          format: zodOutputFormat(outputSchema),
        },
        messages: [
          {
            role: "user",
            content: [
              // Citations cannot be combined with structured output.
              ...toDocumentBlocks(docs, { citations: false }),
              {
                type: "text",
                text: `${FIT_JOB_INTRO}\n<job_description>\n${jobDescription}\n</job_description>`,
              },
            ],
          },
        ],
      },
      { signal: req.signal },
    );

    await recordUsage(response.usage);

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return jsonError("refused", "I can't analyse that job description.", 422);
    }

    const sources = new Map(docs.map((doc) => [doc.id, doc]));
    const result: FitCheckResult = {
      summary: response.parsed_output.summary,
      requirements: response.parsed_output.requirements
        .flatMap(({ requirement, match, evidence, sourceId }) => {
          const normalized = match.trim().toLowerCase();
          if (!isFitMatch(normalized)) return [];

          const doc = sources.get(sourceId.trim());
          return [
            {
              requirement,
              match: normalized,
              evidence,
              source: doc
                ? { id: doc.id, title: doc.title, url: doc.url }
                : null,
            },
          ];
        })
        .slice(0, FIT_MAX_REQUIREMENTS),
    };

    return NextResponse.json(result);
  } catch (error) {
    const visitorError = toVisitorError(error);
    if (!visitorError) return new Response(null, { status: 499 });

    return jsonError(
      visitorError.code,
      visitorError.message,
      visitorError.code === "busy" ? 503 : 500,
    );
  }
}
