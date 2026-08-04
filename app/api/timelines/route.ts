import { db } from "@/db/client";
import { timeline } from "@/db/schema";
import { getTimelines } from "@/features/timeline/services/timeline.service";
import { UnauthorizedError, requireAdminSession } from "@/lib/require-admin";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all timelines
// Note: the timeline table has no `type` column; work/education filtering
// is handled by the separate /api/work-experiences endpoint.
export async function GET() {
  try {
    const timelines = await getTimelines();

    return NextResponse.json({
      success: true,
      data: timelines,
    });
  } catch (error) {
    console.error("Failed to fetch timelines:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch timelines" },
      { status: 500 },
    );
  }
}

// POST - Create new timeline
export async function POST(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const { title, year, description } = body;

    if (!title || !year) {
      return NextResponse.json(
        { success: false, error: "Title and year are required" },
        { status: 400 },
      );
    }

    const id = `timeline_${Date.now()}`;
    const now = new Date();

    await db.insert(timeline).values({
      id,
      title,
      year,
      description: description || null,
      order: 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      data: { id, title, year, description },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to create timeline:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create timeline",
      },
      { status: 500 },
    );
  }
}

// PUT - Update timeline
export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const { id, title, year, description } = body;
    console.log(id, description);

    if (!id || !title || !year) {
      return NextResponse.json(
        { success: false, error: "ID, title, and year are required" },
        { status: 400 },
      );
    }

    await db
      .update(timeline)
      .set({
        title,
        year,
        description: description || null,
        updatedAt: new Date(),
      })
      .where(eq(timeline.id, id));

    return NextResponse.json({
      success: true,
      data: { id, title, year, description },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to update timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update timeline" },
      { status: 500 },
    );
  }
}

// PATCH - Update timeline order
export async function PATCH(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const { timelines: updatedTimelines } = body;

    if (!updatedTimelines || !Array.isArray(updatedTimelines)) {
      return NextResponse.json(
        { success: false, error: "Invalid timelines data" },
        { status: 400 },
      );
    }

    await Promise.all(
      updatedTimelines.map((m: { id: string; order: number }) =>
        db
          .update(timeline)
          .set({ order: m.order, updatedAt: new Date() })
          .where(eq(timeline.id, m.id)),
      ),
    );

    return NextResponse.json({
      success: true,
      message: "timeline order updated successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to update timeline order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update timeline order" },
      { status: 500 },
    );
  }
}

// DELETE - Delete timeline
export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "timeline ID is required" },
        { status: 400 },
      );
    }

    await db.delete(timeline).where(eq(timeline.id, id));

    return NextResponse.json({
      success: true,
      message: "timeline deleted successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to delete timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete timeline" },
      { status: 500 },
    );
  }
}
