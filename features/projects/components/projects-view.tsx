"use client";

import { ProjectShowcaseCard } from "./project-showcase-card";

type Project = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  technologies?: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  objectives?: string[];
  keyChallenges?: string[];
  featured?: boolean;
};

export default function ProjectsView({ projects }: { projects: Project[] }) {
  return (
    <div className="page-shell">
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-6">
          <h1 className="text-4xl font-bold tracking-[-0.03em]">Projects</h1>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div key={project.id}>
                  <ProjectShowcaseCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <p className=" text-sm text-muted-foreground">No projects yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
