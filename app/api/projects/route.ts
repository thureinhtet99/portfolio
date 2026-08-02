import { db } from "@/db/client";
import { project } from "@/db/schema";
import { UnauthorizedError, requireAdminSession } from "@/lib/require-admin";
import { v2 as cloudinary } from "cloudinary";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch all projects (or featured only via ?featured=true)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";

    const allProjects = await db
      .select()
      .from(project)
      .orderBy(asc(project.order))
      .all();

    const filtered = featuredOnly
      ? allProjects.filter((p) => p.featured)
      : allProjects;

    const formattedProjects = await Promise.all(
      filtered.map(async (proj) => {
        let stargazersCount = 0;
        if (proj.githubUrl) {
          const parts = proj.githubUrl.split("/").slice(-2);
          if (parts.length === 2) {
            try {
              const ghRes = await fetch(
                `https://api.github.com/repos/${parts[0]}/${parts[1]}`,
                {
                  headers: {
                    Accept: "application/vnd.github.v3+json",
                    ...(process.env.GITHUB_TOKEN
                      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
                      : {}),
                  },
                  next: { revalidate: 86400 },
                },
              );
              if (ghRes.ok) {
                const ghData = await ghRes.json();
                stargazersCount = ghData.stargazers_count ?? 0;
              }
            } catch {
              // fallback to 0
            }
          }
        }
        return {
          id: proj.id,
          slug: proj.slug,
          title: proj.title,
          summary: proj.summary,
          startDate: proj.startDate,
          description: proj.description,
          technologies: proj.technologies
            ? JSON.parse(proj.technologies)
            : undefined,
          image: proj.image,
          githubUrl: proj.githubUrl,
          liveUrl: proj.liveUrl,
          objectives: proj.objectives ? JSON.parse(proj.objectives) : undefined,
          collaborators: proj.collaborators
            ? JSON.parse(proj.collaborators)
            : undefined,
          demoCredentials: proj.demoCredentials
            ? JSON.parse(proj.demoCredentials)
            : undefined,
          featured: proj.featured,
          order: proj.order,
          createdAt: proj.createdAt,
          updatedAt: proj.updatedAt,
          stargazersCount,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// POST - Create new project
export async function POST(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const {
      slug,
      title,
      summary,
      startDate,
      description,
      technologies,
      image,
      githubUrl,
      liveUrl,
      objectives,
      collaborators,
      demoCredentials,
      featured,
    } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { success: false, error: "Slug and title are required" },
        { status: 400 },
      );
    }

    const id = `project_${Date.now()}`;
    const now = new Date();

    const insertData = {
      id,
      slug,
      title,
      summary: summary || "",
      startDate: startDate || null,
      description: description || "",
      technologies: technologies ? JSON.stringify(technologies) : null,
      image: image || null,
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      objectives: objectives ? JSON.stringify(objectives) : null,
      collaborators: collaborators ? JSON.stringify(collaborators) : null,
      demoCredentials: demoCredentials
        ? demoCredentials.length > 0
          ? JSON.stringify(demoCredentials)
          : null
        : null,
      featured: featured || false,
      order: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(project).values(insertData);

    return NextResponse.json({
      success: true,
      data: {
        id,
        slug,
        title,
        summary,
        startDate,
        description,
        technologies,
        githubUrl,
        liveUrl,
        objectives,
        collaborators,
        demoCredentials,
        featured,
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to create project:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 500 },
    );
  }
}

// PUT - Update project
export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const {
      id,
      slug,
      title,
      summary,
      startDate,
      description,
      technologies,
      collaborators,
      image,
      githubUrl,
      liveUrl,
      objectives,
      demoCredentials,
      featured,
    } = body;

    if (!id || !slug || !title) {
      return NextResponse.json(
        { success: false, error: "ID, slug, and title are required" },
        { status: 400 },
      );
    }

    await db
      .update(project)
      .set({
        slug,
        title,
        summary: summary || "",
        startDate: startDate || null,
        description: description || "",
        technologies: technologies ? JSON.stringify(technologies) : null,
        image: image || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        objectives: objectives ? JSON.stringify(objectives) : null,
        collaborators: collaborators ? JSON.stringify(collaborators) : null,
        demoCredentials: demoCredentials
          ? demoCredentials.length > 0
            ? JSON.stringify(demoCredentials)
            : null
          : null,
        featured: featured !== undefined ? featured : false,
        updatedAt: new Date(),
      })
      .where(eq(project.id, id));

    return NextResponse.json({
      success: true,
      data: {
        id,
        slug,
        title,
        summary,
        startDate,
        description,
        technologies,
        githubUrl,
        liveUrl,
        objectives,
        collaborators,
        demoCredentials,
        featured,
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// PATCH - Update project order
export async function PATCH(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const body = await req.json();
    const { projects: updatedProjects } = body;

    if (!updatedProjects || !Array.isArray(updatedProjects)) {
      return NextResponse.json(
        { success: false, error: "Invalid projects data" },
        { status: 400 },
      );
    }

    // Update order for each project
    await Promise.all(
      updatedProjects.map((proj: { id: string; order: number }) =>
        db
          .update(project)
          .set({ order: proj.order, updatedAt: new Date() })
          .where(eq(project.id, proj.id)),
      ),
    );

    return NextResponse.json({
      success: true,
      message: "Project order updated successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to update project order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project order" },
      { status: 500 },
    );
  }
}

// DELETE - Delete project
export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Get the project to retrieve image URL before deleting
    const projectData = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .all();

    if (projectData.length === 0) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    const imageUrl = projectData[0].image;

    // Delete image from Cloudinary if it exists
    if (imageUrl) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split("/");
        const uploadIndex = urlParts.indexOf("upload");
        if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
          // Get everything after 'upload/v{version}/'
          const publicIdWithExtension = urlParts
            .slice(uploadIndex + 2)
            .join("/");
          const publicId = publicIdWithExtension.split(".")[0];

          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete image from Cloudinary:",
          cloudinaryError,
        );
        // Continue with project deletion even if Cloudinary deletion fails
      }
    }

    await db.delete(project).where(eq(project.id, id));

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
