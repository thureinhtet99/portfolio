"use client";

import { motion } from "framer-motion";
import { cardReveal } from "@/lib/motion";
import { ProjectShowcaseCard } from "./project-showcase-card";
import { FolderGit2 } from "lucide-react";

type Project = {
  id: string;
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

type Props = {
  projects: Project[];
};

export default function ProjectsView({ projects }: Props) {
  return (
    <div className="page-shell">
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <motion.h1
            {...cardReveal(0)}
            className=" text-3xl font-bold tracking-[-0.03em]"
          >
            <FolderGit2 className="inline h-7 w-7 mr-2 text-muted-foreground" />
            Projects
          </motion.h1>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div key={project.id} {...cardReveal(index)}>
                  <ProjectShowcaseCard project={project} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className=" text-sm text-muted-foreground">
              No projects yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
