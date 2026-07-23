import { APP_CONFIG } from "@/config/app-config";
import { PostsView } from "@/features/posts/components/posts-view";

// export const dynamic = "force-dynamic";

async function getPublishedPosts() {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.POSTS}?published=true`,
    );
    const { success, data } = await response.json();
    if (success && data) return data;

    return [];
  } catch (error) {
    console.error("Failed to load published posts:", error);
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return <PostsView posts={posts} />;
}
