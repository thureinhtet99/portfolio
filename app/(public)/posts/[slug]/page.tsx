import { PostDetailView } from "@/features/posts/components/post-detail-view";
import { db } from "@/db/client";
import { post } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  try {
    const result = await db.select().from(post).where(eq(post.slug, slug)).all();
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const postData = await getPost(slug);
  if (!postData) return { title: "Post Not Found" };
  return {
    title: postData.title,
    description: postData.excerpt || postData.title,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const postData = await getPost(slug);
  if (!postData) notFound();
  return <PostDetailView post={postData} />;
}
