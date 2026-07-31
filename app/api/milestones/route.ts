import { db } from "@/db/client";
import { milestone } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all milestones
export async function GET() {
  try {
    const milestones = await db
      .select()
      .from(milestone)
      .orderBy(asc(milestone.order))
      .all();

    return NextResponse.json({
      success: true,
      data: milestones,
    });
  } catch (error) {
    console.error("Failed to fetch milestones:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch milestones" },
      { status: 500 },
    );
  }
}

// POST - Create new milestone
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, date, description } = body;

    if (!title || !date) {
      return NextResponse.json(
        { success: false, error: "Title and date are required" },
        { status: 400 },
      );
    }

    const id = `milestone_${Date.now()}`;
    const now = new Date();

    await db.insert(milestone).values({
      id,
      title,
      date,
      description: description || null,
      order: 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      data: { id, title, date, description },
    });
  } catch (error) {
    console.error("Failed to create milestone:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create milestone",
      },
      { status: 500 },
    );
  }
}

// PUT - Update milestone
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, date, description } = body;

    if (!id || !title || !date) {
      return NextResponse.json(
        { success: false, error: "ID, title, and date are required" },
        { status: 400 },
      );
    }

    await db
      .update(milestone)
      .set({
        title,
        date,
        description: description || null,
        updatedAt: new Date(),
      })
      .where(eq(milestone.id, id));

    return NextResponse.json({
      success: true,
      data: { id, title, date, description },
    });
  } catch (error) {
    console.error("Failed to update milestone:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update milestone" },
      { status: 500 },
    );
  }
}

// PATCH - Update milestone order
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { milestones: updatedMilestones } = body;

    if (!updatedMilestones || !Array.isArray(updatedMilestones)) {
      return NextResponse.json(
        { success: false, error: "Invalid milestones data" },
        { status: 400 },
      );
    }

    await Promise.all(
      updatedMilestones.map((m: { id: string; order: number }) =>
        db
          .update(milestone)
          .set({ order: m.order, updatedAt: new Date() })
          .where(eq(milestone.id, m.id)),
      ),
    );

    return NextResponse.json({
      success: true,
      message: "Milestone order updated successfully",
    });
  } catch (error) {
    console.error("Failed to update milestone order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update milestone order" },
      { status: 500 },
    );
  }
}

// DELETE - Delete milestone
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Milestone ID is required" },
        { status: 400 },
      );
    }

    await db.delete(milestone).where(eq(milestone.id, id));

    return NextResponse.json({
      success: true,
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete milestone:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete milestone" },
      { status: 500 },
    );
  }
}
