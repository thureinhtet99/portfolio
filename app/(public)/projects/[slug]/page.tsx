import { db } from "@/db/client";
import { project } from "@/db/schema";
import { ProjectDetailView } from "@/features/projects/components/project-detail-view";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

function safeParseJson(value: string | null): unknown[] | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value.split(",").map((s) => s.trim());
  }
}

async function getProject(slug: string) {
  try {
    const result = await db
      .select()
      .from(project)
      .where(eq(project.slug, slug))
      .limit(1)
      .all();
    if (result.length === 0) return null;
    const p = result[0];
    const projectData = {
      ...p,
      title: p.title ?? undefined,
      summary: p.summary ?? undefined,
      startDate: p.startDate ?? undefined,
      description: p.description ?? undefined,
      image: p.image ?? undefined,
      githubUrl: p.githubUrl ?? undefined,
      liveUrl: p.liveUrl ?? undefined,
      technologies: safeParseJson(p.technologies) as string[] | undefined,
      objectives: safeParseJson(p.objectives) as string[] | undefined,
      collaborators: safeParseJson(p.collaborators) as string[] | undefined,
      demoCredentials: safeParseJson(p.demoCredentials) as
        { role: string; email: string; password: string }[] | undefined,
      stargazersCount: 0,
    };

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

    return projectData;
  } catch (error) {
    console.error("Failed to load project:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projectData = await getProject(slug);
  if (!projectData) return { title: "Project Not Found" };
  return {
    title: projectData.title,
    description: projectData.summary || projectData.title,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectData = await getProject(slug);

  if (!projectData) notFound();

  return (
    <ProjectDetailView
      project={projectData}
      stargazersCount={projectData.stargazersCount}
    />
  );
}
