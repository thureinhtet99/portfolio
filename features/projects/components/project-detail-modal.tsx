"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectDetailModalType } from "@/types/index.type";
import { Dot, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { ProjectCredentialsPanel } from "./project-credentials-panel";

export function ProjectDetailModal({
  project,
  children,
}: ProjectDetailModalType) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl overflow-hidden bg-background/95 p-0 shadow-[0_28px_80px_-38px_rgba(34,34,34,0.45)] backdrop-blur-xl">
        <DialogHeader className="px-6 py-5 sm:px-8">
          <DialogTitle className="text-2xl font-semibold tracking-[-0.03em]">
            {project.title}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[82vh] space-y-10 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          {/* Project Image */}
          {project.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/60">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          )}

          {/* Project Description */}
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold tracking-[-0.02em]">
              Overview
            </h3>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>

          {/* Technical Contributions */}
          {project.objectives && project.objectives.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                Objectives
              </h3>
              <ul className="space-y-2">
                {project.objectives.map((contribution, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Dot className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-lg">
                      {contribution}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                Key Challenges Solved
              </h3>
              <ul className="space-y-2">
                {project.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Dot className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-lg">
                      {challenge}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold tracking-[-0.02em]">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStacks.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-sm bg-accent-foreground/10"
                >
                  {tech}
                </Badge>
              ))}
              {project.techStacks.length > 4 && (
                <Badge
                  variant="secondary"
                  className="text-sm bg-accent-foreground/10"
                >
                  +{project.techStacks.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Notable Adopters / Credibility */}
          {project.adopters && project.adopters.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-[-0.02em]">
                Notable Users &amp; Adopters
              </h3>
              <div className="space-y-4">
                {project.adopters.map((adopter) => {
                  const anchorId = adopter.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  return (
                    <div
                      key={adopter.name}
                      id={anchorId}
                      className="rounded-xl border border-border/40 bg-background/50 p-4 space-y-2 scroll-mt-24"
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">
                          {adopter.name}
                        </h4>
                        {adopter.url && (
                          <Link
                            href={adopter.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                      {adopter.description && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {adopter.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <ProjectCredentialsPanel credentials={project.demoCredentials} />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            {project.isGitHub && (
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-lg border-border/20 h-10"
              >
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FaGithub className="h-4 w-4" />
                  Code
                </Link>
              </Button>
            )}
            {project.isLiveDemo && (
              <Button asChild className="flex-1 rounded-lg h-10">
                <Link
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live
                </Link>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
