"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MoveRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { projects } from "@/data/projects";
import { BiWorld } from "react-icons/bi";
import { motion } from "framer-motion";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";

const categories = ["All", "Web", "Mobile", "Free Style"];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Separate current and upcoming projects
  const currentProjects = projects.filter((project) => !project.upcoming);
  const upcomingProjects = projects.filter((project) => project.upcoming);

  // Filter projects by category
  const filteredCurrentProjects = currentProjects.filter((project) => {
    return activeCategory === "All" || project.category === activeCategory;
  });

  return (
    <>
      <motion.div
        className="mx-auto space-y-20 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Current Projects */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h2 className="text-4xl font-bold">Current Projects</h2>
            {/* Categories - Mobile Optimized */}
            <div className="w-full sm:w-auto">
              <div className="flex gap-2 items-center overflow-x-auto scrollbar-hide pb-2 sm:pb-0 px-1 sm:px-0">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      activeCategory === category ? "default" : "outline"
                    }
                    className="cursor-pointer whitespace-nowrap py-1 px-2 text-sm transition-all flex-shrink-0 min-w-fit"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {filteredCurrentProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {filteredCurrentProjects.map((project) => (
                <Card
                  key={project.title}
                  className="group hover:shadow-xl border-0 transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-accent">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg sm:text-xl line-clamp-1 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground flex-1 text-md sm:text-lg line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.techStacks.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-sm px-2 sm:px-3 py-1"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    {/* Mobile: Stack buttons vertically */}
                    <div className="flex flex-col gap-3 mt-5">
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!project.isGitHub}
                          asChild={project.isGitHub}
                          className="flex-1 hover:text-primary hover:bg-transparent h-10"
                        >
                          {project.isGitHub ? (
                            <Link
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1"
                            >
                              <FaGithub className="h-4 w-4" />
                              Code
                            </Link>
                          ) : (
                            <span className="flex items-center justify-center gap-1">
                              <FaGithub className="h-4 w-4" />
                              Code
                            </span>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          disabled={!project.isLiveDemo}
                          asChild={project.isLiveDemo}
                          className="flex-1 hover:text-primary hover:bg-transparent h-10"
                          variant="ghost"
                        >
                          {project.isLiveDemo ? (
                            <Link
                              href={project.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1"
                            >
                              <BiWorld className="h-4 w-4" />
                              Visit
                            </Link>
                          ) : (
                            <span className="flex items-center justify-center gap-1">
                              <BiWorld className="h-4 w-4" />
                              Visit
                            </span>
                          )}
                        </Button>
                      </div>
                      <ProjectDetailModal project={project}>
                        <Button
                          size="sm"
                          className="w-full text-primary hover:text-blue-800 dark:hover:text-blue-200 h-10"
                          variant="ghost"
                        >
                          <span className="flex items-center justify-center gap-2">
                            View Details <MoveRight className="h-4 w-4" />
                          </span>
                        </Button>
                      </ProjectDetailModal>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No current projects
              </h3>
              <p className="text-muted-foreground text-sm">
                There are no current projects available in the &quot;
                {activeCategory}&quot; category.
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Projects */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="h-6 w-6" /> Upcoming Projects
          </h2>
          {upcomingProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {upcomingProjects.map((project) => (
                <Card
                  key={project.title}
                  className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden border-dashed"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-contain opacity-60"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <Clock className="h-16 w-16 text-muted-foreground opacity-50" />
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  </div>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg sm:text-xl line-clamp-1 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground flex-1 text-sm sm:text-base line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.techStacks.slice(0, 2).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs px-2 sm:px-3 py-1"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.techStacks.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 sm:px-3 py-1"
                        >
                          + more
                        </Badge>
                      )}
                    </div>
                    {project.expectedCompletion && (
                      <div className="mt-4 text-muted-foreground text-xs sm:text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          Expected: {project.expectedCompletion}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col gap-3 mt-5">
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="flex-1 hover:text-primary hover:bg-transparent h-10"
                        >
                          <span className="flex items-center justify-center gap-1">
                            <FaGithub className="h-4 w-4" />
                            Code
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          disabled
                          className="flex-1 hover:text-primary hover:bg-transparent h-10"
                          variant="ghost"
                        >
                          <span className="flex items-center justify-center gap-1">
                            <BiWorld className="h-4 w-4" />
                            Visit
                          </span>
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        disabled
                        className="w-full h-10"
                        variant="ghost"
                      >
                        <span className="flex items-center justify-center gap-2">
                          View Details <MoveRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No upcoming projects
              </h3>
              <p className="text-muted-foreground text-sm">
                There are no upcoming projects available in the &quot;
                {activeCategory}&quot; category.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
