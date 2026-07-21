import { PostsView } from "@/features/posts/components/posts-view";
import { db } from "@/db/client";
import { post } from "@/db/schema";

export const dynamic = "force-dynamic";

async function getPublishedPosts() {
  try {
    const allPosts = await db.select().from(post).all();
    return allPosts
      .filter((p) => p.published)
      .map((p) => ({
        ...p,
        tags: p.tags ? JSON.parse(p.tags) : [],
      }))
      .sort((a, b) => a.order - b.order || b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPublishedPosts();
  return <PostsView posts={posts} />;
}
