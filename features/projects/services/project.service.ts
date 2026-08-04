import { db } from "@/db/client";
import { project } from "@/db/schema";
import { asc } from "drizzle-orm";

function safeParseJson(value: string | null): unknown[] | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value.split(",").map((s) => s.trim());
  }
}

function formatProject(p: (typeof project.$inferSelect)[]) {
  return p.map((proj) => ({
    id: proj.id,
    slug: proj.slug,
    title: proj.title,
    summary: proj.summary ?? undefined,
    startDate: proj.startDate ?? undefined,
    description: proj.description ?? undefined,
    image: proj.image ?? undefined,
    technologies: safeParseJson(proj.technologies) as string[] | undefined,
    githubUrl: proj.githubUrl ?? undefined,
    liveUrl: proj.liveUrl ?? undefined,
    objectives: safeParseJson(proj.objectives) as string[] | undefined,
    collaborators: safeParseJson(proj.collaborators) as string[] | undefined,
    demoCredentials: safeParseJson(proj.demoCredentials) as
      | { role: string; email: string; password: string }[]
      | undefined,
    featured: proj.featured,
    order: proj.order,
    createdAt: proj.createdAt,
    updatedAt: proj.updatedAt,
  }));
}

export async function getProjects(options?: { featured?: boolean }) {
  const allProjects = await db
    .select()
    .from(project)
    .orderBy(asc(project.order))
    .all();

  const filtered = options?.featured
    ? allProjects.filter((p) => p.featured)
    : allProjects;

  return formatProject(filtered);
}
