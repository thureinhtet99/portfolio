import { db } from "@/db/client";
import { workExperience } from "@/db/schema";
import { getWorkExperiences } from "@/features/timeline/services/work-experience.service";
import { UnauthorizedError, requireAdminSession } from "@/lib/require-admin";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const exps = await getWorkExperiences();

    return NextResponse.json({
      success: true,
      data: exps,
    });
  } catch (error) {
    console.error("Failed to fetch exps:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch exps",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const { companyName, companyLogo, companyWebsite, positions } = body;

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: "Company name is required" },
        { status: 400 },
      );
    }

    const id = `work_${Date.now()}`;
    const now = new Date();

    await db.insert(workExperience).values({
      id,
      companyName,
      companyLogo: companyLogo || null,
      companyWebsite: companyWebsite || null,
      positions: positions ? JSON.stringify(positions) : "[]",
      order: 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      data: {
        id,
        companyName,
        companyLogo,
        companyWebsite,
        positions,
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to create exp:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create exp",
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const { id, companyName, companyLogo, companyWebsite, positions } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: "Company name is required" },
        { status: 400 },
      );
    }

    await db
      .update(workExperience)
      .set({
        companyName,
        companyLogo: companyLogo || null,
        companyWebsite: companyWebsite || null,
        positions: positions ? JSON.stringify(positions) : "[]",
        updatedAt: new Date(),
      })
      .where(eq(workExperience.id, id));

    return NextResponse.json({
      success: true,
      data: {
        id,
        companyName,
        companyLogo,
        companyWebsite,
        positions,
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to update exp:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update exp" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const updatedTimelines = await req.json();

    await Promise.all(
      updatedTimelines.map((timeline: { id: string; order: number }) => {
        return db
          .update(workExperience)
          .set({ order: timeline.order, updatedAt: new Date() })
          .where(eq(workExperience.id, timeline.id));
      }),
    );

    return NextResponse.json({
      success: true,
      message: "Exp order updated successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to update exp order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update exp order" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Exp ID is required" },
        { status: 400 },
      );
    }

    await db.delete(workExperience).where(eq(workExperience.id, id));

    return NextResponse.json({
      success: true,
      message: "Exp deleted successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to delete exp:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete exp" },
      { status: 500 },
    );
  }
}
