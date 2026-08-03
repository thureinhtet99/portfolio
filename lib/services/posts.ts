import { db } from "@/db/client";
import { post } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getPublishedPosts() {
  const allPosts = await db
    .select()
    .from(post)
    .orderBy(asc(post.order), asc(post.createdAt))
    .all();
  return allPosts.filter((p) => p.published);
}
