import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { SETTINGS_KEYS } from "@/features/admin/constants";

export const getSettings = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const allSettings = await db.select().from(setting).all();

    return allSettings.reduce(
      (acc, item) => {
        acc[item.key] = item.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  },
  ["settings"],
  { revalidate: 3600 },
);

/**
 * Read the live site view counter directly from the DB. Bypasses the
 * settings cache so the footer/navbar always reflect the latest count
 * after `incrementSiteViews()` has run.
 */
export async function getSiteViews(): Promise<number> {
  const result = await db
    .select()
    .from(setting)
    .where(eq(setting.key, SETTINGS_KEYS.SITE_VIEWS))
    .limit(1)
    .all();

  return result.length > 0 ? Number(result[0].value) || 0 : 0;
}

/**
 * Increment the siteViews counter, inserting the row on first hit.
 * Safe to call on every homepage render — each call is a single
 * SELECT + UPDATE/INSERT and is idempotent on the count only by
 * race (acceptable for a public view counter).
 */
export async function incrementSiteViews(): Promise<void> {
  const existing = await db
    .select()
    .from(setting)
    .where(eq(setting.key, SETTINGS_KEYS.SITE_VIEWS))
    .limit(1)
    .all();

  if (existing.length > 0) {
    const current = Number(existing[0].value) || 0;
    await db
      .update(setting)
      .set({ value: String(current + 1), updatedAt: new Date() })
      .where(eq(setting.key, SETTINGS_KEYS.SITE_VIEWS));
  } else {
    await db.insert(setting).values({
      id: crypto.randomUUID(),
      key: SETTINGS_KEYS.SITE_VIEWS,
      value: "1",
      updatedAt: new Date(),
    });
  }
}
