import { db } from "@/db/client";
import { timeline } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getTimelines() {
  return db.select().from(timeline).orderBy(asc(timeline.order)).all();
}
