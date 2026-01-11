"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Github,
  AlertTriangle,
  Dot,
  TargetIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProjectDetailModalType } from "@/types";

export function ProjectDetailModal({
  project,
  children,
}: ProjectDetailModalType) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-10">
          {/* Project Image */}
          {project.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
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
            <h3 className="text-lg font-semibold">Overview</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {project.description}
            </p>
          </div>

          {/* Technical Contributions */}
          {project.objectives && project.objectives.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TargetIcon className="h-5 w-5 text-primary" />
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
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
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
            <h3 className="text-lg font-semibold">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStacks.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            {project.isGitHub && (
              <Button asChild variant="outline" className="flex-1">
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  View Code
                </Link>
              </Button>
            )}
            {project.isLiveDemo && (
              <Button asChild className="flex-1">
                <Link
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Live Site
                </Link>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
