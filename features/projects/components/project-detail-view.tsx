import { Badge } from "@/components/ui/badge";
import { GitHubStars } from "@/components/ui/github-stars";
import { ProjectType } from "@/types/index.type";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { ContributorsSection } from "./contributors-section";

export function ProjectDetailView({
  project,
  stargazersCount = 0,
}: {
  project: ProjectType;
  stargazersCount?: number;
}) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  const manualCollaborators = Array.isArray(project.collaborators)
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
            <div className="relative rounded-lg overflow-hidden bg-background">
              {/* Terminal header */}
              <div className="flex items-center px-3 justify-between">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <GitHubStars stargazersCount={stargazersCount} />
                </div>
              </div>

              {/* Terminal content */}
              <p className="text-sm text-muted-foreground line-clamp-1 px-3">
                {org} / {repo}
              </p>

              {/* Image or summary */}
              <div
                className="pt-4"
                style={{ viewTransitionName: `project-image-${project.slug}` }}
              >
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

          {/* Project Info */}
          <div className="space-y-6">
            <h1
              className=" text-4xl font-bold tracking-[-0.03em]"
              style={{ viewTransitionName: `project-title-${project.slug}` }}
            >
              {project.title}
            </h1>

            {/* Links */}
            <div className="flex items-center gap-6">
              {project.startDate && (
                <span className="flex items-center text-xs gap-1">
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
                {/* <Tag className="h-4 w-4" /> */}
                {technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            {/* Collaborators */}
            <Suspense>
              <ContributorsSection
                org={org}
                repo={repo}
                manualCollaborators={manualCollaborators}
              />
            </Suspense>

            <hr className="border-muted-foreground/20 my-10" />

            {/* Description */}
            {project.description && (
              <div className="prose prose-base prose-invert sm:prose-lg">
                <ReactMarkdown>{project.description}</ReactMarkdown>
              </div>
            )}

            {project.objectives && (
              <>
                <hr className="border-muted-foreground/20 my-10" />
                <h2 className=" text-2xl font-bold tracking-[-0.03em]">
                  Objective{project.objectives.length > 1 ? "s" : ""}:
                </h2>
                <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                  {project.objectives.map((objective, idx) => (
                    <li key={idx} className="wrap-break-word leading-relaxed">
                      {objective}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
