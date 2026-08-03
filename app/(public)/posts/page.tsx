import { PostsView } from "@/features/posts/components/posts-view";
import { getPublishedPosts } from "@/lib/services/posts";

export default async function PostsPage() {
  const rawPosts = await getPublishedPosts();
  const posts = rawPosts.map((p) => ({
    ...p,
    tags: p.tags ? JSON.parse(p.tags) : [],
  }));

  return <PostsView posts={posts} />;
}
