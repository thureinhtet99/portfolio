"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
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
    <div>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-4xl">
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {currentProjects.map((project) => (
                <ProjectShowcaseCard key={project.id} project={project} />
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
        </CardContent>
      </Card>
    </div>
  );
}
