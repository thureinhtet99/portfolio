"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MoveRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { ProjectDetailModal } from "./project-detail-modal";
import { ProjectCredentialsPanel } from "./project-credentials-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProjectType } from "@/types/index.type";

type ProjectShowcaseCardProps = {
  project: ProjectType;
  className?: string;
  techLimit?: number;
  descriptionLines?: 2 | 3;
};

export function ProjectShowcaseCard({
  project,
  className,
  // techLimit,
  descriptionLines = 3,
}: ProjectShowcaseCardProps) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  // const visibleTechnologies = techLimit
  //   ? technologies.slice(0, techLimit)
  //   : technologies;

  return (
    <Card
      className={cn(
        "surface-panel group flex h-full flex-col py-0",
        className,
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover rounded-lg transition duration-500 group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-3 lg:p-4">
        <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-lg font-semibold tracking-[-0.02em] text-foreground sm:text-xl">
              {project.title}
            </h3>
            {project.featured && (
              <Badge
                variant="secondary"
                className="mt-2 rounded-lg bg-accent-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary"
              >
                Featured
              </Badge>
            )}
          </div>
          <ProjectCredentialsPanel
            credentials={project.demoCredentials}
            compact
            className="shrink-0"
          />
        </div>

        <p
          className={cn(
            "mt-2 flex-1 text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7",
            descriptionLines === 2 ? "line-clamp-2" : "line-clamp-3",
          )}
        >
          {project.description}
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              disabled={!project.githubUrl}
              asChild={!!project.githubUrl}
              className={`h-10 rounded-lg sm:h-11 ${project.githubUrl ? "border-border/20" : "border-0"}`}
            >
              {project.githubUrl ? (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 hover:bg-white/5"
                >
                  <FaGithub className="h-4 w-4" />
                  Code
                </Link>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaGithub className="h-4 w-4" />
                  Code
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              disabled={!project.liveUrl}
              asChild={!!project.liveUrl}
              className={`h-10 rounded-lg sm:h-11 ${project.liveUrl ? "border-border/20" : "border-0"}`}
            >
              {project.liveUrl ? (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 hover:bg-white/5"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live
                </Link>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Live
                </span>
              )}
            </Button>
          </div>

          <ProjectDetailModal
            project={{
              image: project.image,
              title: project.title,
              description: project.description || "",
              objectives: project.objectives || [],
              challenges: project.keyChallenges || [],
              techStacks: technologies,
              isGitHub: !!project.githubUrl,
              isLiveDemo: !!project.liveUrl,
              github: project.githubUrl || "",
              liveDemo: project.liveUrl || "",
              demoCredentials: project.demoCredentials || [],
            }}
          >
            <Button
              type="button"
              className="h-10 w-full cursor-pointer rounded-lg sm:h-11"
            >
              <span className="flex items-center justify-center gap-2">
                View Details
                <MoveRight className="h-4 w-4" />
              </span>
            </Button>
          </ProjectDetailModal>
        </div>
      </div>
    </Card>
  );
}
