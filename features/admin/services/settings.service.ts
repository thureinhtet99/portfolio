import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

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

export async function getSiteViews(): Promise<number> {
  const result = await db
    .select()
    .from(setting)
    .where(eq(setting.key, "siteViews"))
    .limit(1)
    .all();

  return result.length > 0 ? Number(result[0].value) || 0 : 0;
}

export async function incrementSiteViews(): Promise<void> {
  const existing = await db
    .select()
    .from(setting)
    .where(eq(setting.key, "siteViews"))
    .limit(1)
    .all();

  if (existing.length > 0) {
    const current = Number(existing[0].value) || 0;
    await db
      .update(setting)
      .set({ value: String(current + 1), updatedAt: new Date() })
      .where(eq(setting.key, "siteViews"));
  } else {
    await db.insert(setting).values({
      id: crypto.randomUUID(),
      key: "siteViews",
      value: "1",
      updatedAt: new Date(),
    });
  }
}
