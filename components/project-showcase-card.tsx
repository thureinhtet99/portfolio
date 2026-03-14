"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MoveRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { ProjectCredentialsPanel } from "@/components/project-credentials-panel";
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
  techLimit,
  descriptionLines = 3,
}: ProjectShowcaseCardProps) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  const visibleTechnologies = techLimit
    ? technologies.slice(0, techLimit)
    : technologies;

  return (
    <Card
      className={cn(
        "group flex h-full rounded-lg flex-col overflow-hidden border-border/20 bg-card/95 transition duration-300 hover:shadow-[0_28px_85px_-44px_rgba(34,34,34,0.35)]",
        className,
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/70">
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-contain transition duration-500 group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-lg font-semibold tracking-[-0.03em] text-foreground sm:text-xl lg:text-2xl">
              {project.title}
            </h3>
            {project.featured && (
              <Badge
                variant="outline"
                className="mt-3 rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
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
            "mt-3 flex-1 text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7",
            descriptionLines === 2 ? "line-clamp-2" : "line-clamp-3",
          )}
        >
          {project.description}
        </p>

        {visibleTechnologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {visibleTechnologies.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="max-w-full rounded-lg bg-accent-foreground/10 px-3 py-1 text-xs font-medium"
              >
                {tech}
              </Badge>
            ))}
            {techLimit && technologies.length > techLimit && (
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs"
              >
                +{technologies.length - techLimit} more
              </Badge>
            )}
          </div>
        )}

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
                  className="flex items-center justify-center gap-2"
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
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit
                </Link>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit
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
            <Button className="h-10 rounded-lg sm:h-11">
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
