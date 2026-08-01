// "use client";

import { Badge } from "@/components/ui/badge";
import { GitHubStars } from "@/components/ui/github-stars";
import { cn } from "@/lib/utils";
import { ProjectType } from "@/types/index.type";
import { Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";

export function ProjectShowcaseCard({
  project,
  className,
  techLimit = 4,
}: {
  project: ProjectType;
  className?: string;
  techLimit?: number;
}) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  const visibleTechnologies = technologies.slice(0, techLimit);
  const remainingCount = technologies.length - techLimit;

  const githubParts = project.githubUrl?.split("/").slice(-2) || [];
  const org = githubParts[0] || "owner";
  const repo =
    githubParts[1] || project.title.toLowerCase().replace(/\s+/g, "-");
  const stargazersCount = project.stargazersCount ?? 0;

  return (
    <Link
      href={`/projects/${project.slug}`}
      transitionTypes={["nav-forward"]}
      className="block group"
    >
      <div
        className={cn(
          "rounded-md border border-muted-foreground/20 overflow-hidden transition-all hover:border-muted-foreground",
          className,
        )}
      >
        <ViewTransition name={`project-image-${project.slug}`}>
          <div className="bg-muted-foreground p-4 sm:p-6">
            {/* Terminal preview area */}
            <div className="relative rounded-lg overflow-hidden bg-background">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>
                <GitHubStars stargazersCount={stargazersCount} />
              </div>

              {/* Terminal content */}
              <p className="text-sm text-muted-foreground line-clamp-1 px-3">
                {org} / {repo}
              </p>

              {/* Image or summary */}
              <div className="pt-4">
                {project.image ? (
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center px-3">
                    {project.summary}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ViewTransition>

        {/* Card body */}
        <div className="p-4 space-y-3">
          <ViewTransition name={`project-title-${project.slug}`}>
            <h3 className="inline-block text-base font-semibold text-muted-foreground">
              {project.title}
            </h3>
          </ViewTransition>

          {project.description && (
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Tags */}
          {visibleTechnologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {visibleTechnologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="inline-flex items-center rounded-sm border border-muted-foreground/20 bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tech}
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge
                  variant="secondary"
                  className="inline-flex items-center rounded-sm border border-muted-foreground/20 bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground"
                >
                  +{remainingCount}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
