import { db } from "@/db/client";
import { timeline } from "@/db/schema";
import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getTimelines = unstable_cache(
  async () => {
    return db.select().from(timeline).orderBy(asc(timeline.order)).all();
  },
  ["timelines"],
  { revalidate: 600 },
);
