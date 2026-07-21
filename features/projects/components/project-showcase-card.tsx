"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProjectType } from "@/types/index.type";
import { ExternalLink, Github } from "lucide-react";

type Props = {
  project: ProjectType;
  className?: string;
  techLimit?: number;
};

export function ProjectShowcaseCard({
  project,
  className,
  techLimit = 4,
}: Props) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  const visibleTechnologies = technologies.slice(0, techLimit);
  const remainingCount = technologies.length - techLimit;

  // Parse org/repo from githubUrl
  const githubParts = project.githubUrl?.split("/").slice(-2) || [];
  const org = githubParts[0] || "owner";
  const repo = githubParts[1] || project.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block group"
    >
      <Card
        className={cn(
          "surface-panel overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[var(--accent-signal)]/30",
          className
        )}
      >
        {/* GitHub-style header */}
        <div className="bg-muted/50 px-4 py-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-sm">
              <div className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-muted-foreground">{org}</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-semibold text-foreground group-hover:text-[var(--accent-signal)] transition-colors">
                {repo}
              </span>
            </div>
          </div>
          <p className="mt-2 font-mono text-xs text-muted-foreground line-clamp-2">
            {project.description || "No description"}
          </p>
        </div>

        {/* Card body */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-mono text-base font-semibold text-foreground group-hover:text-[var(--accent-signal)] transition-colors">
              {project.title}
            </h3>
          </div>

          {project.description && (
            <p className="font-mono text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Tags */}
          {visibleTechnologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleTechnologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="font-mono text-[10px] bg-muted/50 text-muted-foreground rounded-md px-2 py-0.5"
                >
                  {tech}
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] bg-muted/50 text-muted-foreground rounded-md px-2 py-0.5"
                >
                  +{remainingCount}
                </Badge>
              )}
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-3 pt-1">
            {project.githubUrl && (
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                Code
              </span>
            )}
            {project.liveUrl && (
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                Live
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
