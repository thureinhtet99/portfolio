import { db } from "@/db/client";
import { post } from "@/db/schema";
import { UnauthorizedError, requireAdminSession } from "@/lib/require-admin";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all posts (or published only via ?published=true)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get("published") === "true";

    const allPosts = await db
      .select()
      .from(post)
      .orderBy(asc(post.order), asc(post.createdAt))
      .all();

    const filtered = publishedOnly
      ? allPosts.filter((p) => p.published)
      : allPosts;

    const formatted = filtered.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      tags: p.tags ? JSON.parse(p.tags) : [],
      published: p.published,
      order: p.order,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

// POST - Create new post
export async function POST(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const { slug, title, excerpt, body: postBody, tags, published } = body;

    if (!slug || !title || !postBody) {
      return NextResponse.json(
        { success: false, error: "Slug, title, and body are required" },
        { status: 400 },
      );
    }

    const id = `post_${Date.now()}`;
    const now = new Date();

    await db.insert(post).values({
      id,
      slug,
      title,
      excerpt: excerpt || null,
      body: postBody,
      tags: tags ? JSON.stringify(tags) : null,
      published: published || false,
      order: 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      data: { id, slug, title, excerpt, body: postBody, tags, published },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to create post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create post",
      },
      { status: 500 },
    );
  }
}

// PUT - Update post
export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const { id, slug, title, excerpt, body: postBody, tags, published } = body;

    if (!id || !slug || !title || !postBody) {
      return NextResponse.json(
        { success: false, error: "ID, slug, title, and body are required" },
        { status: 400 },
      );
    }

    await db
      .update(post)
      .set({
        slug,
        title,
        excerpt: excerpt || null,
        body: postBody,
        tags: tags ? JSON.stringify(tags) : null,
        published: published !== undefined ? published : false,
        updatedAt: new Date(),
      })
      .where(eq(post.id, id));

    return NextResponse.json({
      success: true,
      data: { id, slug, title, excerpt, body: postBody, tags, published },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 },
    );
  }
}

// PATCH - Update post order
export async function PATCH(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const { posts: updatedPosts } = body;

    if (!updatedPosts || !Array.isArray(updatedPosts)) {
      return NextResponse.json(
        { success: false, error: "Invalid posts data" },
        { status: 400 },
      );
    }

    await Promise.all(
      updatedPosts.map((p: { id: string; order: number }) =>
        db
          .update(post)
          .set({ order: p.order, updatedAt: new Date() })
          .where(eq(post.id, p.id)),
      ),
    );

    return NextResponse.json({
      success: true,
      message: "Post order updated successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to update post order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post order" },
      { status: 500 },
    );
  }
}

// DELETE - Delete post
export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 },
      );
    }

    const existing = await db.select().from(post).where(eq(post.id, id)).all();
    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    await db.delete(post).where(eq(post.id, id));

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
