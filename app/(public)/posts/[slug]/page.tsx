import { db } from "@/db/client";
import { post } from "@/db/schema";
import { PostDetailView } from "@/features/posts/components/post-detail-view";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const postData = await getPost(slug);
  if (!postData) return { title: "Post Not Found" };
  return {
    title: postData.title,
    description: postData.excerpt || postData.title,
  };
}

async function getPost(slug: string) {
  try {
    const result = await db
      .select()
      .from(post)
      .where(eq(post.slug, slug))
      .all();
    if (result.length === 0 || !result[0].published) return null;
    const p = result[0];
    return {
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
    };
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postData = await getPost(slug);

  if (!postData) notFound();

  return <PostDetailView post={postData} />;
}
