import { db } from "@/db/client";
import { chatUnanswered, chatUsage } from "@/db/schema";
import type Anthropic from "@anthropic-ai/sdk";
import { desc, eq, like, lt, sql } from "drizzle-orm";
import { INPUT_LIMITS, PRICING, UNANSWERED_RETENTION_DAYS } from "../constants";

type TokenUsage = Pick<
  Anthropic.Usage,
  | "input_tokens"
  | "output_tokens"
  | "cache_creation_input_tokens"
  | "cache_read_input_tokens"
>;

const MICRO = 1_000_000;

/** UTC day key, e.g. `2026-10-30`. */
const dayKey = (date = new Date()) => date.toISOString().slice(0, 10);

/**
 * Cost of one request in integer micro-dollars. Cache reads are billed at the
 * normal input rate here on purpose: over-counting keeps the cap conservative.
 */
export function computeCostMicroUsd(usage: TokenUsage): number {
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  const promptTokens = usage.input_tokens + cacheWrite + cacheRead;
  const isLong = promptTokens > PRICING.longPromptThreshold;

  const inputRate = isLong ? PRICING.inputLong : PRICING.input;
  const outputRate = isLong ? PRICING.outputLong : PRICING.output;

  return Math.ceil(
    usage.input_tokens * inputRate +
      cacheWrite * inputRate * PRICING.cacheWriteMultiplier +
      cacheRead * inputRate +
      usage.output_tokens * outputRate,
  );
}

export async function recordUsage(usage: TokenUsage) {
  const costMicroUsd = computeCostMicroUsd(usage);
  const inputTokens =
    usage.input_tokens +
    (usage.cache_creation_input_tokens ?? 0) +
    (usage.cache_read_input_tokens ?? 0);

  await db
    .insert(chatUsage)
    .values({
      day: dayKey(),
      requests: 1,
      inputTokens,
      outputTokens: usage.output_tokens,
      costMicroUsd,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: chatUsage.day,
      set: {
        requests: sql`${chatUsage.requests} + 1`,
        inputTokens: sql`${chatUsage.inputTokens} + ${inputTokens}`,
        outputTokens: sql`${chatUsage.outputTokens} + ${usage.output_tokens}`,
        costMicroUsd: sql`${chatUsage.costMicroUsd} + ${costMicroUsd}`,
        updatedAt: new Date(),
      },
    });
}

export type UsageSummary = {
  todayUsd: number;
  monthUsd: number;
  monthRequests: number;
};

export async function getUsageSummary(): Promise<UsageSummary> {
  const today = dayKey();
  const month = today.slice(0, 7);

  const [todayRow] = await db
    .select()
    .from(chatUsage)
    .where(eq(chatUsage.day, today))
    .limit(1)
    .all();

  // At most 31 rows, so summing here avoids a typed aggregate select, which
  // doesn't type-check across the SQLite/Turso client union.
  const monthRows = await db
    .select()
    .from(chatUsage)
    .where(like(chatUsage.day, `${month}-%`))
    .all();

  return {
    todayUsd: (todayRow?.costMicroUsd ?? 0) / MICRO,
    monthUsd: monthRows.reduce((sum, row) => sum + row.costMicroUsd, 0) / MICRO,
    monthRequests: monthRows.reduce((sum, row) => sum + row.requests, 0),
  };
}

export async function isOverBudget(limits: {
  dailyUsd: number;
  monthlyUsd: number;
}): Promise<boolean> {
  const { todayUsd, monthUsd } = await getUsageSummary();
  return todayUsd >= limits.dailyUsd || monthUsd >= limits.monthlyUsd;
}

/** Collapse whitespace, strip control characters and cap the length. */
export function sanitizeQuestion(raw: string): string {
  return raw
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, INPUT_LIMITS.maxUnansweredChars);
}

export async function purgeOldUnanswered() {
  const cutoff = new Date(
    Date.now() - UNANSWERED_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );
  await db.delete(chatUnanswered).where(lt(chatUnanswered.createdAt, cutoff));
}

export async function logUnanswered(question: string, page?: string | null) {
  const clean = sanitizeQuestion(question);
  if (!clean) return;

  await db.insert(chatUnanswered).values({
    id: crypto.randomUUID(),
    question: clean,
    page: page ? page.slice(0, 200) : null,
    createdAt: new Date(),
  });

  await purgeOldUnanswered();
}

export async function listUnanswered() {
  await purgeOldUnanswered();

  return db
    .select()
    .from(chatUnanswered)
    .orderBy(desc(chatUnanswered.createdAt))
    .limit(200)
    .all();
}

export async function deleteUnanswered(id: string) {
  await db.delete(chatUnanswered).where(eq(chatUnanswered.id, id));
}
