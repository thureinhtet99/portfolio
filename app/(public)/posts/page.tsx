import { PostsView } from "@/features/posts/components/posts-view";
import { getPublishedPosts } from "@/features/posts/services/post.service";

function safeParseJson(value: string | null): unknown[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return value.split(",").map((s) => s.trim());
  }
}

export default async function PostsPage() {
  const rawPosts = await getPublishedPosts();
  const posts = rawPosts.map((p) => ({
    ...p,
    tags: safeParseJson(p.tags) as string[],
  }));

  return <PostsView posts={posts} />;
}
