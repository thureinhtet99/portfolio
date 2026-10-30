import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { SETTINGS_KEYS } from "@/features/admin/constants";
import { DEFAULT_BUDGET_USD } from "@/features/assistant/constants";
import { inArray } from "drizzle-orm";

export type AssistantConfig = {
  enabled: boolean;
  dailyUsd: number;
  monthlyUsd: number;
};

const parseBudget = (raw: string | undefined, fallback: number) => {
  if (raw === undefined || raw.trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
};

/**
 * Read straight from the DB on every request. `getSettings()` is cached for an
 * hour, which is far too slow for a kill switch or a spending cap.
 * The assistant is off unless the switch is exactly "true".
 */
export async function getAssistantConfig(): Promise<AssistantConfig> {
  const rows = await db
    .select()
    .from(setting)
    .where(
      inArray(setting.key, [
        SETTINGS_KEYS.CHAT_ENABLED,
        SETTINGS_KEYS.CHAT_DAILY_BUDGET_USD,
        SETTINGS_KEYS.CHAT_MONTHLY_BUDGET_USD,
      ]),
    )
    .all();

  const values = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return {
    enabled: values[SETTINGS_KEYS.CHAT_ENABLED] === "true",
    dailyUsd: parseBudget(
      values[SETTINGS_KEYS.CHAT_DAILY_BUDGET_USD],
      DEFAULT_BUDGET_USD.daily,
    ),
    monthlyUsd: parseBudget(
      values[SETTINGS_KEYS.CHAT_MONTHLY_BUDGET_USD],
      DEFAULT_BUDGET_USD.monthly,
    ),
  };
}
