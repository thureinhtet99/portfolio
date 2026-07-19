"use client";

import { motion } from "framer-motion";
import { cardReveal } from "@/lib/motion";
import { Clock } from "lucide-react";
import { ProjectShowcaseCard } from "./project-showcase-card";

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
  // For now, all projects from DB are current (not upcoming)
  const currentProjects = projects;

  return (
    <div className="page-shell">
      <div className="space-y-4">
        <h1 className="section-heading">Projects</h1>
        <div>
          {currentProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {currentProjects.map((project, index) => (
                <motion.div key={project.id} {...cardReveal(index)}>
                  <ProjectShowcaseCard project={project} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted rounded-full p-4 mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No current projects
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
