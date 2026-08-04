import { db } from "@/db/client";
import { setting } from "@/db/schema";

export async function getSettings(): Promise<Record<string, string>> {
  const allSettings = await db.select().from(setting).all();

  return allSettings.reduce(
    (acc, item) => {
      acc[item.key] = item.value;
      return acc;
    },
    {} as Record<string, string>,
  );
}
