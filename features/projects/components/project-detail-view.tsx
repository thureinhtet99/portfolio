"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GitHubStars } from "@/components/ui/github-stars";
import { ProjectType } from "@/types/index.type";
import { format } from "date-fns";
import { CalendarIcon, ExternalLink, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const GITHUB_USERNAME = "thureinhtet99";

export function ProjectDetailView({ project }: { project: ProjectType }) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  // const objectives = Array.isArray(project.objectives)
  //   ? project.objectives
  //   : [];
  // const keyChallenges = Array.isArray(project.keyChallenges)
  //   ? project.keyChallenges
  //   : [];
  const collaborators = Array.isArray(project.collaborators)
    ? project.collaborators
    : [];

  // Parse org/repo from githubUrl
  const githubParts = project.githubUrl?.split("/").slice(-2) || [];
  const org = githubParts[0] || "owner";
  const repo =
    githubParts[1] || project.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="page-shell">
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="bg-muted-foreground p-6 rounded-lg">
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
                      src={project.image}
                      alt={project.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      {project.summary}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <h1 className=" text-3xl font-bold tracking-[-0.03em]">
              {project.title}
            </h1>

            {/* Links */}
            <div className="flex items-center gap-6">
              {project.startDate && (
                <span className="flex items-center text-xs gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {format(new Date(project.startDate), "MMM yyyy")}
                </span>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <FaGithub className="h-4 w-4" />
                </Link>
              )}
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* Tags */}
            {technologies.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag className="h-4 w-4" />
                {technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            <hr className="border-muted-foreground/20 my-10" />

            {/* Description */}
            {project.description && (
              <div className="prose prose-base prose-invert sm:prose-lg">
                <ReactMarkdown>{project.description}</ReactMarkdown>
              </div>
            )}

            {/* collaborators */}
            {collaborators.length > 0 && (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Collaborators: </h2>
                <AvatarGroup>
                  <Avatar size="lg">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </AvatarGroup>

                {/* <div className="space-y-2">
                  {collaborators.map((collab, i) => (
                    <div
                      key={i}
                      id={collab.toLowerCase().replace(/\s+/g, "")}
                      className="scroll-mt-24  ext-sm text-muted-foreground"
                    >
                      {collab ? (
                        <Link
                          href={collab}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          #{collab}
                        </Link>
                      ) : (
                        <span>#{collab}</span>
                      )}
                      {collab && <span className="ml-2">— {collab}</span>}
                    </div>
                  ))}
                </div> */}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
