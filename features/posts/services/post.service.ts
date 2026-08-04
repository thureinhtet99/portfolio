import { db } from "@/db/client";
import { post } from "@/db/schema";
import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getPublishedPosts = unstable_cache(
  async () => {
    const allPosts = await db
      .select()
      .from(post)
      .orderBy(asc(post.order), asc(post.createdAt))
      .all();
    return allPosts.filter((p) => p.published);
  },
  ["posts-published"],
  { revalidate: 600 },
);
