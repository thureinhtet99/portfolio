// Single place for the assistant's model, caps and prices. The model is fixed
// server-side; the client can never choose it.
// Safe to import from client code (unlike prompt.ts, which stays server-only).
export const OWNER_NAME = "Thu Rein Htet";

export const ASSISTANT_MODEL = "claude-haiku-5-5" as const;

// Cost cap with headroom: thinking tokens count against it, and answers are
// short, so a worst-case reply stays around a tenth of a cent.
export const MAX_OUTPUT_TOKENS = 2000;

// The fit check returns up to 10 requirements as structured JSON.
export const FIT_MAX_OUTPUT_TOKENS = 3500;
export const FIT_MAX_REQUIREMENTS = 10;

export const INPUT_LIMITS = {
  maxTurns: 10,
  maxMessageChars: 1000,
  // The model's own replies are sent back as history and can be long.
  maxAssistantMessageChars: 6000,
  maxTotalChars: 20000,
  maxJobDescriptionChars: 6000,
  maxUnansweredChars: 300,
} as const;

export const RATE_LIMITS = {
  chat: { limit: 20, windowMs: 10 * 60 * 1000 },
  fit: { limit: 5, windowMs: 60 * 60 * 1000 },
} as const;

// Used until the owner sets budgets in /admin.
export const DEFAULT_BUDGET_USD = { monthly: 3, daily: 1 } as const;

export const UNANSWERED_RETENTION_DAYS = 30;

// Claude Haiku 5.5 list prices in micro-dollars per token (USD per MTok equals
// micro-dollars per token). Prompts above 100K tokens are billed at a higher
// rate. Update these if the published prices change.
export const PRICING = {
  input: 0.1,
  output: 0.5,
  inputLong: 0.5,
  outputLong: 2.5,
  longPromptThreshold: 100_000,
  cacheWriteMultiplier: 1.25,
} as const;
