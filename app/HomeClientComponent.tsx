"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import {
  HardDriveDownload,
  Mail,
  MoveRight,
  MapPin,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { BiWorld } from "react-icons/bi";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { StaticImageData } from "next/image";
import { ProjectType } from "@/types/index.type";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  residence: string;
  available: boolean;
  aboutMe: string;
  intro: string;
  roles: string;
  featuredProjects: ProjectType[];
  profileImage: StaticImageData | string | null;
  resume: string | null;
};

export default function HomeClientComponent({
  residence,
  available,
  aboutMe,
  intro,
  roles,
  featuredProjects,
  profileImage,
  resume,
}: Props) {
  const rolesList = useMemo(() => {
    const parsedRoles = roles
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r);
    return parsedRoles.length > 0 ? parsedRoles : [];
  }, [roles]);

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (rolesList.length === 0) return;
    const role = rolesList[currentRoleIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < role.length) {
          setCurrentText(role.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(role.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % rolesList.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, rolesList]);

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-20">
      {/* Hero Section */}
      <section
        id="hero-section"
        className="min-h-[calc(100vh-8rem)] flex items-center justify-center relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-2xl mx-auto text-center"
        >
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Hey guys!
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              I&apos;m
            </h1>
            <p className="text-xl text-muted-foreground capitalize min-h-[1.75rem]">
              {currentText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          <div className="text-muted-foreground max-w-3xl text-lg mx-auto leading-relaxed">
            {intro && (
              <div className="prose prose-lg dark:prose-invert">
                <ReactMarkdown>{intro}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 me-1" />
              {residence}
            </span>
            <span className="flex items-center gap-1">
              <Circle
                className={`h-2 w-2 me-1 ${
                  available ? "fill-green-500" : "fill-red-500"
                } ${available ? "text-green-500" : "text-red-500"}`}
              />
              {available ? "Available for work" : "Not available for work"}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Get in Touch
              </Link>
            </Button>
            {resume && (
              <Button variant="outline" asChild size="lg">
                <Link
                  href={resume}
                  target="_blank"
                  download={false}
                  className="flex items-center gap-2"
                >
                  <HardDriveDownload className="h-5 w-5" />
                  Download CV
                </Link>
              </Button>
            )}
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => {
                document
                  .getElementById("about-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-sm text-muted-foreground">Scroll Down</span>
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        id="about-section"
        className="min-h-[calc(100vh-8rem)] flex items-center justify-center space-y-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          {/* Profile Picture - Top on Mobile */}
          <div className="flex justify-center mb-6">
            {profileImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative w-32 h-32 md:w-40 md:h-40"
              >
                <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  <Image
                    src={profileImage}
                    alt="Thu Rein Htet"
                    fill
                    className="object-cover"
                    priority
                    sizes="160px"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold">About Me</h2>
          <div className="text-muted-foreground max-w-3xl text-lg mx-auto leading-relaxed">
            {aboutMe && (
              <div
                className={`prose prose-lg dark:prose-invert ${
                  isMobile && !isExpanded ? "line-clamp-5" : ""
                }`}
              >
                <ReactMarkdown>{aboutMe}</ReactMarkdown>
              </div>
            )}
            {isMobile && aboutMe && (
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp />
                    Read Less
                  </>
                ) : (
                  <>
                    <ChevronDown />
                    Read More
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects-section" className="space-y-8">
        <div
          className={`flex ${
            featuredProjects.length > 0 ? "justify-between" : "justify-center"
          } items-center`}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl sm:text-center font-bold"
          >
            Featured Projects
          </motion.h2>
          {featuredProjects.length > 0 && (
            <Button variant="outline" asChild>
              <Link href="/projects" className="flex items-center gap-2">
                View All <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.slice(0, 2).map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
                  <div className="relative aspect-video w-full bg-accent overflow-hidden">
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-xl mb-3">{project.title}</h3>
                    <p className="text-muted-foreground flex-1 text-md line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(project.technologies) &&
                        project.technologies.slice(0, 4).map((tech: string) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-sm"
                          >
                            {tech}
                          </Badge>
                        ))}
                      {Array.isArray(project.technologies) &&
                        project.technologies.length > 4 && (
                          <Badge variant="outline" className="text-sm">
                            +{project.technologies.length - 4} more
                          </Badge>
                        )}
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <Button
                        variant="outline"
                        disabled={!project.githubUrl}
                        asChild={!!project.githubUrl}
                      >
                        {project.githubUrl ? (
                          <Link
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <FaGithub className="h-4 w-4" />
                            Code
                          </Link>
                        ) : (
                          <span className="flex items-center gap-1">
                            <FaGithub className="h-4 w-4" />
                            Code
                          </span>
                        )}
                      </Button>

                      <Button
                        disabled={!project.liveUrl}
                        asChild={!!project.liveUrl}
                        variant="outline"
                      >
                        {project.liveUrl ? (
                          <Link
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <BiWorld className="h-4 w-4" />
                            Visit
                          </Link>
                        ) : (
                          <span className="flex items-center gap-1">
                            <BiWorld className="h-4 w-4" />
                            Visit
                          </span>
                        )}
                      </Button>

                      <ProjectDetailModal
                        project={{
                          image: project.image || undefined,
                          title: project.title,
                          description: project.description || "",
                          objectives: Array.isArray(project.objectives)
                            ? project.objectives
                            : [],
                          challenges: Array.isArray(project.keyChallenges)
                            ? project.keyChallenges
                            : [],
                          techStacks: Array.isArray(project.technologies)
                            ? project.technologies
                            : [],
                          isGitHub: !!project.githubUrl,
                          isLiveDemo: !!project.liveUrl,
                          github: project.githubUrl || "",
                          liveDemo: project.liveUrl || "",
                        }}
                      >
                        <Button variant="outline">
                          <span className="flex items-center gap-1">
                            View details <MoveRight className="h-4 w-4" />
                          </span>
                        </Button>
                      </ProjectDetailModal>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No featured projects</h3>
          </div>
        )}
      </section>
    </div>
  );
}
