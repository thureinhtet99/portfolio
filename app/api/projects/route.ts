import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { project } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch all projects
export async function GET() {
  try {
    const projects = await db.select().from(project).all();

    const formattedProjects = projects.map((proj) => ({
      id: proj.id,
      title: proj.title,
      description: proj.description,
      technologies: proj.technologies
        ? JSON.parse(proj.technologies)
        : undefined,
      image: proj.image,
      githubUrl: proj.githubUrl,
      liveUrl: proj.liveUrl,
      objectives: proj.objectives ? JSON.parse(proj.objectives) : undefined,
      keyChallenges: proj.keyChallenges
        ? JSON.parse(proj.keyChallenges)
        : undefined,
      featured: proj.featured,
      order: proj.order,
      createdAt: proj.createdAt,
      updatedAt: proj.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      technologies,
      image,
      githubUrl,
      liveUrl,
      objectives,
      keyChallenges,
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const id = `project_${Date.now()}`;
    const now = new Date();

    const insertData = {
      id,
      title,
      description: description || "",
      technologies: technologies ? JSON.stringify(technologies) : null,
      image: image || null,
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      objectives: objectives ? JSON.stringify(objectives) : null,
      keyChallenges: keyChallenges ? JSON.stringify(keyChallenges) : null,
      featured: false,
      order: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(project).values(insertData);

    return NextResponse.json({
      success: true,
      data: {
        id,
        title,
        description,
        technologies,
        githubUrl,
        liveUrl,
        objectives,
        keyChallenges,
      },
    });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      description,
      technologies,
      image,
      githubUrl,
      liveUrl,
      objectives,
      keyChallenges,
    } = body;

    if (!id || !title) {
      return NextResponse.json(
        { success: false, error: "ID and title are required" },
        { status: 400 }
      );
    }

    await db
      .update(project)
      .set({
        title,
        description: description || "",
        technologies: technologies ? JSON.stringify(technologies) : null,
        image: image || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        objectives: objectives ? JSON.stringify(objectives) : null,
        keyChallenges: keyChallenges ? JSON.stringify(keyChallenges) : null,
        updatedAt: new Date(),
      })
      .where(eq(project.id, id));

    return NextResponse.json({
      success: true,
      data: {
        id,
        title,
        description,
        technologies,
        githubUrl,
        liveUrl,
        objectives,
        keyChallenges,
      },
    });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    await db.delete(project).where(eq(project.id, id));

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
