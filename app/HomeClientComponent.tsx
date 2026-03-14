"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { StaticImageData } from "next/image";
import { ProjectType } from "@/types/index.type";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectShowcaseCard } from "@/components/project-showcase-card";

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
    <div className="page-shell">
      <section
        id="hero-section"
        className="surface-panel relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-6 py-16 sm:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl space-y-6 text-center"
        >
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Hey guys!
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              I&apos;m{" "}
              <span className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-muted-foreground">
                Thu Rein Htet
              </span>
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

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 me-1" />
              {residence}
            </span>
            <span className="flex items-center gap-1">
              <Circle
                className={`h-2 w-2 me-1 animate-ping ${
                  available
                    ? "fill-green-500 text-foreground"
                    : "fill-foreground/25 text-foreground/60"
                }`}
              />
              {available ? "Available for work" : "Not available for work"}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 justify-center">
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Get in Touch
              </Link>
            </Button>
            {resume && (
              <Button
                variant="outline"
                asChild
                size="lg"
                className="rounded-lg"
              >
                <Link
                  href="/api/resume"
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <HardDriveDownload className="h-5 w-5" />
                  View Resume
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

      <section
        id="about-section"
        className="surface-panel min-h-[calc(100vh-8rem)] px-6 py-14 sm:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center"
        >
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

          <h2 className="section-heading">About Me</h2>
          <div className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
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
            className="section-heading sm:text-center"
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {featuredProjects.slice(0, 2).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectShowcaseCard
                  project={project}
                  techLimit={4}
                  descriptionLines={2}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted rounded-full p-4 mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No featured projects</h3>
          </div>
        )}
      </section>
    </div>
  );
}
