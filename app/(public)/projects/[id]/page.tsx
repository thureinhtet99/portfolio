import { db } from "@/db/client";
import { project } from "@/db/schema";
import { ProjectDetailView } from "@/features/projects/components/project-detail-view";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const result = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .limit(1)
      .all();
    if (result.length === 0) return { title: "Project Not Found" };
    return { title: result[0].title };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let projectData = null;
  try {
    const result = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .limit(1)
      .all();

    if (result.length === 0) notFound();

    const p = result[0];

    projectData = {
      ...p,
      title: p.title ?? undefined,
      summary: p.summary ?? undefined,
      startDate: p.startDate ?? undefined,
      description: p.description ?? undefined,
      image: p.image ?? undefined,
      githubUrl: p.githubUrl ?? undefined,
      liveUrl: p.liveUrl ?? undefined,
      technologies: p.technologies ? JSON.parse(p.technologies) : [],
      objectives: p.objectives ? JSON.parse(p.objectives) : [],
      collaborators: p.collaborators ? JSON.parse(p.collaborators) : [],
      demoCredentials: p.demoCredentials ? JSON.parse(p.demoCredentials) : [],
      stargazersCount: 0,
    };

    // Fetch actual stargazers count
    if (projectData.githubUrl) {
      const parts = projectData.githubUrl.split("/").slice(-2);
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
            projectData.stargazersCount = ghData.stargazers_count ?? 0;
          }
        } catch {
          // fallback to 0
        }
      }
    }
  } catch (error) {
    console.error("Failed to load project:", error);
    notFound();
  }

  return (
    <ProjectDetailView
      project={projectData}
      stargazersCount={projectData.stargazersCount}
    />
  );
}
