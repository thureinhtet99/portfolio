// One JSON object per line (NDJSON) on the `/api/chat` response stream.
export type ChatErrorCode =
  "disabled" | "paused" | "rate_limited" | "busy" | "refused" | "failed";

export type ChatSource = { id: string; title: string; url: string };

export type ChatStreamEvent =
  | { t: "text"; v: string }
  | ({ t: "cite" } & ChatSource)
  | { t: "done" }
  | { t: "error"; code: ChatErrorCode; message: string };

export type FitMatch = "strong" | "partial" | "gap";

export type FitCheckResult = {
  summary: string;
  requirements: {
    requirement: string;
    match: FitMatch;
    evidence: string;
    source: ChatSource | null;
  }[];
};
