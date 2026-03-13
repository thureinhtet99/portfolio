"use client";

import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ProjectShowcaseCard } from "@/components/project-showcase-card";

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

export default function ProjectsClientComponent({ projects }: Props) {
  // For now, all projects from DB are current (not upcoming)
  const currentProjects = projects;

  return (
    <>
      <motion.div
        className="page-shell"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div>
          <div className="surface-panel mb-10 px-6 py-6 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Portfolio Work
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-heading">Projects</h2>
                <p className="section-copy mt-2">
                  Selected products, experiments, and client work with the key
                  context needed to evaluate each build quickly.
                </p>
              </div>
            </div>
          </div>

          {currentProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {currentProjects.map((project) => (
                <ProjectShowcaseCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No current projects
              </h3>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
