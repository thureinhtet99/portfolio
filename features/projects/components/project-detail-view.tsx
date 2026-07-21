"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { sectionReveal } from "@/lib/motion";
import { formatDate } from "@/lib/utils";
import { ProjectType } from "@/types/index.type";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Props = {
  project: ProjectType;
};

export function ProjectDetailView({ project }: Props) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  const objectives = Array.isArray(project.objectives)
    ? project.objectives
    : [];
  const keyChallenges = Array.isArray(project.keyChallenges)
    ? project.keyChallenges
    : [];
  const adopters = Array.isArray(project.adopters) ? project.adopters : [];

  // Parse org/repo from githubUrl
  const githubParts = project.githubUrl?.split("/").slice(-2) || [];
  const org = githubParts[0] || "owner";
  const repo = githubParts[1] || project.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="page-shell">
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Back link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Projects
          </Link>

          {/* GitHub-style header card */}
          <motion.div {...sectionReveal}>
            <div className="surface-panel overflow-hidden">
              {/* Image */}
              {project.image && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* GitHub header */}
              <div className="bg-muted/50 px-5 py-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <div className="flex gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-muted-foreground">{org}</span>
                    <span className="text-muted-foreground/40">/</span>
                    <span className="font-semibold text-foreground">
                      {repo}
                    </span>
                  </div>
                </div>
                <p className="mt-2 font-mono text-sm text-muted-foreground">
                  {project.description || "No description"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Project Info */}
          <motion.div {...sectionReveal} className="space-y-6">
            <div>
              <h1 className="font-mono text-3xl font-bold tracking-[-0.03em]">
                {project.title}
              </h1>
            </div>

            {/* Tags */}
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="font-mono text-xs bg-muted/50 text-muted-foreground rounded-md px-2 py-1"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            {/* Links */}
            <div className="flex items-center gap-4">
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                </Link>
              )}
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </Link>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <div className="prose prose-base prose-invert sm:prose-lg">
                <ReactMarkdown>{project.description}</ReactMarkdown>
              </div>
            )}

            {/* Adopters */}
            {adopters.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-mono text-lg font-semibold">Adopters</h2>
                <div className="space-y-2">
                  {adopters.map((adopter, i) => (
                    <div
                      key={i}
                      id={adopter.name.toLowerCase().replace(/\s+/g, "")}
                      className="scroll-mt-24 font-mono text-sm text-muted-foreground"
                    >
                      {adopter.url ? (
                        <Link
                          href={adopter.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent-signal)] hover:underline"
                        >
                          #{adopter.name}
                        </Link>
                      ) : (
                        <span>#{adopter.name}</span>
                      )}
                      {adopter.description && (
                        <span className="ml-2">— {adopter.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
