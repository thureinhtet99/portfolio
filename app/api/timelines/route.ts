import { db } from "@/db/client";
import { education, experience } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all timelines (both work experience and education with ?type)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "work" | "education" | null

    const formattedExperiences =
      type === "education"
        ? []
        : (
            await db
              .select()
              .from(experience)
              .orderBy(asc(experience.order))
              .all()
          ).map((exp) => ({
            id: exp.id,
            companyName: exp.companyName,
            companyLogo: exp.companyLogo,
            companyWebsite: exp.companyWebsite,
            positions: exp.positions ? JSON.parse(exp.positions) : [],
            type: "work" as const,
            order: exp.order,
            createdAt: exp.createdAt,
            updatedAt: exp.updatedAt,
          }));

    const formattedEducations =
      type === "work"
        ? []
        : (
            await db
              .select()
              .from(education)
              .orderBy(asc(education.order))
              .all()
          ).map((edu) => ({
            id: edu.id,
            institution: edu.institution,
            location: edu.location,
            period: edu.period,
            type: "education" as const,
            order: edu.order,
            createdAt: edu.createdAt,
            updatedAt: edu.updatedAt,
          }));

    return NextResponse.json({
      success: true,
      data: [...formattedExperiences, ...formattedEducations],
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
    const body = await req.json();
    const {
      companyName,
      companyLogo,
      companyWebsite,
      positions,
      type,
      // Education fields
      institution,
      location,
      period,
    } = body;

    if (type === "education") {
      if (!institution) {
        return NextResponse.json(
          { success: false, error: "Institution is required" },
          { status: 400 },
        );
      }

      const id = `education_${Date.now()}`;
      const now = new Date();

      await db.insert(education).values({
        id,
        institution,
        location: location || null,
        period: period || null,
        order: 0,
        createdAt: now,
        updatedAt: now,
      });

      return NextResponse.json({
        success: true,
        data: { id, institution, location, period, type },
      });
    }

    // Work experience
    if (!companyName) {
      return NextResponse.json(
        { success: false, error: "Company name is required" },
        { status: 400 },
      );
    }

    const id = `work_${Date.now()}`;
    const now = new Date();

    await db.insert(experience).values({
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
        type,
      },
    });
  } catch (error) {
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
    const body = await req.json();
    const {
      id,
      companyName,
      companyLogo,
      companyWebsite,
      positions,
      type,
      // Education fields
      institution,
      location,
      period,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    const isEducation = id.startsWith("education_") || type === "education";

    if (isEducation) {
      if (!institution) {
        return NextResponse.json(
          { success: false, error: "Institution is required" },
          { status: 400 },
        );
      }

      await db
        .update(education)
        .set({
          institution,
          location: location || null,
          period: period || null,
          updatedAt: new Date(),
        })
        .where(eq(education.id, id));

      return NextResponse.json({
        success: true,
        data: { id, institution, location, period, type: "education" },
      });
    }

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: "Company name is required" },
        { status: 400 },
      );
    }

    await db
      .update(experience)
      .set({
        companyName,
        companyLogo: companyLogo || null,
        companyWebsite: companyWebsite || null,
        positions: positions ? JSON.stringify(positions) : "[]",
        updatedAt: new Date(),
      })
      .where(eq(experience.id, id));

    return NextResponse.json({
      success: true,
      data: {
        id,
        companyName,
        companyLogo,
        companyWebsite,
        positions,
        type: "work",
      },
    });
  } catch (error) {
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
    const body = await req.json();
    const { timelines: updatedTimelines } = body;

    if (!updatedTimelines || !Array.isArray(updatedTimelines)) {
      return NextResponse.json(
        { success: false, error: "Invalid timelines data" },
        { status: 400 },
      );
    }

    await Promise.all(
      updatedTimelines.map((timeline: { id: string; order: number }) => {
        const isEducation = timeline.id.startsWith("education_");
        if (isEducation) {
          return db
            .update(education)
            .set({ order: timeline.order, updatedAt: new Date() })
            .where(eq(education.id, timeline.id));
        } else {
          return db
            .update(experience)
            .set({ order: timeline.order, updatedAt: new Date() })
            .where(eq(experience.id, timeline.id));
        }
      }),
    );

    return NextResponse.json({
      success: true,
      message: "Timeline order updated successfully",
    });
  } catch (error) {
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Timeline ID is required" },
        { status: 400 },
      );
    }

    const isEducation = id.startsWith("education_") || type === "education";

    if (isEducation) {
      await db.delete(education).where(eq(education.id, id));
    } else {
      await db.delete(experience).where(eq(experience.id, id));
    }

    return NextResponse.json({
      success: true,
      message: "Timeline deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete timeline" },
      { status: 500 },
    );
  }
}
