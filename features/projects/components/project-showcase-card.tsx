"use client";

import { Badge } from "@/components/ui/badge";
import { GitHubStars } from "@/components/ui/github-stars";
import { cn } from "@/lib/utils";
import demoImage from "@/public/screenshots/home-page-2.png";
import { ProjectType } from "@/types/index.type";
import { Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  project: ProjectType;
  className?: string;
  techLimit?: number;
};

const GITHUB_USERNAME = "thureinhtet99";

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

  const githubParts = project.githubUrl?.split("/").slice(-2) || [];
  const org = githubParts[0] || "owner";
  const repo =
    githubParts[1] || project.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div
        className={cn(
          "rounded-xl border border-border/20 bg-background overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary",
          className,
        )}
      >
        <div className="bg-muted-foreground p-4">
          {/* Terminal preview area */}
          <div className="relative rounded-lg overflow-hidden p-3 bg-background">
            {/* Terminal header */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <GitHubStars repo={GITHUB_USERNAME} stargazersCount={2050} />
              </div>
            </div>

            {/* Terminal content */}
            <div className="py-4">
              <p className="text-sm text-muted-foreground line-clamp-1">
                {org} / {repo}
              </p>
            </div>

            {/* Image or summary */}
            <div className="pb-4">
              {project.image ? (
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                  <Image
                    src={demoImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    {project.title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4 space-y-3">
          <h3 className=" text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          {project.description && (
            <p className=" text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Tags */}
          {visibleTechnologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
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
