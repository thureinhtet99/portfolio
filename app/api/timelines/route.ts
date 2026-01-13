import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { experience, education } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch all timelines (both work experience and education)
export async function GET() {
  try {
    const experiences = await db.select().from(experience).all();
    const educations = await db.select().from(education).all();

    const formattedExperiences = experiences.map((exp) => ({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      location: exp.location,
      period: exp.period,
      description: exp.description,
      keyAchievements: exp.keyAchievements
        ? JSON.parse(exp.keyAchievements)
        : undefined,
      techStacks: exp.techStacks ? JSON.parse(exp.techStacks) : undefined,
      role: exp.role as "remote" | "on-site" | "internship" | undefined,
      type: "work" as const,
      order: exp.order,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt,
    }));

    const formattedEducations = educations.map((edu) => ({
      id: edu.id,
      degree: edu.degree,
      company: edu.institution,
      location: edu.location,
      period: edu.period,
      description: edu.description,
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
      { status: 500 }
    );
  }
}

// POST - Create new timeline
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      company,
      location,
      period,
      description,
      keyAchievements,
      techStacks,
      role,
      type,
    } = body;

    if (!company || !type) {
      return NextResponse.json(
        { success: false, error: "Company/Institution and type are required" },
        { status: 400 }
      );
    }

    if (type === "work" && !title) {
      return NextResponse.json(
        { success: false, error: "Title is required for work experience" },
        { status: 400 }
      );
    }

    const id = `${type}_${Date.now()}`;
    const now = new Date();

    if (type === "education") {
      // Insert into education table
      const insertData = {
        id,
        title: title || null,
        institution: company,
        location: location || null,
        period: period || null,
        description: description || null,
        order: 0,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(education).values(insertData);

      return NextResponse.json({
        success: true,
        data: {
          id,
          title,
          company,
          location,
          period,
          description,
          type,
        },
      });
    } else {
      // Insert into experience table
      const insertData = {
        id,
        title: title!,
        company,
        location: location || null,
        period: period || null,
        description: description || "",
        keyAchievements: keyAchievements
          ? JSON.stringify(keyAchievements)
          : null,
        techStacks: techStacks ? JSON.stringify(techStacks) : null,
        role: role || null,
        order: 0,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(experience).values(insertData);

      return NextResponse.json({
        success: true,
        data: {
          id,
          title,
          company,
          location,
          period,
          description,
          keyAchievements,
          techStacks,
          role,
          type,
        },
      });
    }
  } catch (error) {
    console.error("Failed to create timeline - Full error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create timeline",
      },
      { status: 500 }
    );
  }
}

// PUT - Update timeline
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      company,
      location,
      period,
      description,
      keyAchievements,
      techStacks,
      role,
      type,
    } = body;

    if (!id || !company || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "ID, company/institution, and type are required",
        },
        { status: 400 }
      );
    }

    if (type === "work" && !title) {
      return NextResponse.json(
        { success: false, error: "Title is required for work experience" },
        { status: 400 }
      );
    }

    if (type === "education") {
      // Update education table
      await db
        .update(education)
        .set({
          degree: title || null,
          institution: company,
          location: location || null,
          period: period || null,
          description: description || null,
          updatedAt: new Date(),
        })
        .where(eq(education.id, id));

      return NextResponse.json({
        success: true,
        data: {
          id,
          title,
          company,
          location,
          period,
          description,
          type,
        },
      });
    } else {
      // Update experience table
      await db
        .update(experience)
        .set({
          title: title!,
          company,
          location: location || null,
          period: period || null,
          description: description || "",
          keyAchievements: keyAchievements
            ? JSON.stringify(keyAchievements)
            : null,
          techStacks: techStacks ? JSON.stringify(techStacks) : null,
          role: role || null,
          updatedAt: new Date(),
        })
        .where(eq(experience.id, id));

      return NextResponse.json({
        success: true,
        data: {
          id,
          title,
          company,
          location,
          period,
          description,
          keyAchievements,
          techStacks,
          role,
          type,
        },
      });
    }
  } catch (error) {
    console.error("Failed to update timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update timeline" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    // Determine which table to delete from based on ID prefix or type parameter
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
      { status: 500 }
    );
  }
}
