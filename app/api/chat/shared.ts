import { isOverBudget } from "@/features/assistant/services/usage.service";
import type { ChatErrorCode } from "@/features/assistant/types";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { ContextDoc } from "./build-context";
import { getAssistantConfig } from "./config";

export const jsonError = (
  code: ChatErrorCode,
  message: string,
  status: number,
) => NextResponse.json({ error: code, message }, { status });

/**
 * Cheap guards shared by every assistant route, in the order they should run:
 * API key present, owner switch on, spending cap not reached.
 * Returns an error response to send, or null when the request may proceed.
 */
export async function checkAssistantAccess(): Promise<NextResponse | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError("disabled", "The assistant is not available.", 503);
  }

  const config = await getAssistantConfig();
  if (!config.enabled) {
    return jsonError("disabled", "The assistant is not available.", 503);
  }

  if (await isOverBudget(config)) {
    return jsonError(
      "paused",
      "The assistant is taking a break. Please use the contact form instead.",
      503,
    );
  }

  return null;
}

/** Map an SDK error to something safe to show a visitor, or null if they left. */
export function toVisitorError(
  error: unknown,
): { code: ChatErrorCode; message: string } | null {
  // The visitor closed the panel: nothing to report.
  if (error instanceof Anthropic.APIUserAbortError) return null;

  if (
    error instanceof Anthropic.RateLimitError ||
    (error instanceof Anthropic.APIError &&
      (error.status === 529 || error.status === 503))
  ) {
    return {
      code: "busy",
      message: "The assistant is busy right now. Please try again in a moment.",
    };
  }

  // Never forward upstream details to the visitor.
  console.error(
    "Assistant request failed:",
    error instanceof Anthropic.APIError
      ? `${error.status} ${error.message}`
      : error,
  );
  return {
    code: "failed",
    message: "Something went wrong. Please try again, or use the contact form.",
  };
}

/** The portfolio documents as API blocks; citations are optional per mode. */
export function toDocumentBlocks(
  docs: ContextDoc[],
  options: { citations: boolean },
): Anthropic.DocumentBlockParam[] {
  return docs.map((doc, index) => ({
    type: "document",
    source: { type: "text", media_type: "text/plain", data: doc.text },
    title: doc.title,
    // Not citable text, but lets the model refer to a document by id.
    context: `id: ${doc.id}`,
    ...(options.citations ? { citations: { enabled: true } } : {}),
    // One breakpoint after the last (stable) document caches everything in
    // front of it: tools, system prompt and all documents.
    ...(index === docs.length - 1
      ? { cache_control: { type: "ephemeral" as const } }
      : {}),
  }));
}
