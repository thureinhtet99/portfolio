import { db } from "@/db/client";
import { project } from "@/db/schema";
import { asc } from "drizzle-orm";

function formatProject(p: (typeof project.$inferSelect)[]) {
  return p.map((proj) => ({
    id: proj.id,
    slug: proj.slug,
    title: proj.title,
    summary: proj.summary ?? undefined,
    startDate: proj.startDate ?? undefined,
    description: proj.description ?? undefined,
    image: proj.image ?? undefined,
    technologies: proj.technologies ? JSON.parse(proj.technologies) : undefined,
    githubUrl: proj.githubUrl ?? undefined,
    liveUrl: proj.liveUrl ?? undefined,
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
