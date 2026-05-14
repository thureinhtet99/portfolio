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
    const typingSpeed = isDeleting ? 10 : 20;

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
    <div className="page-shell space-y-5 sm:space-y-7">
      <section
        id="hero-section"
        className="surface-panel relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-5 py-14 sm:px-8 sm:py-16 lg:px-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,34,34,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_55%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mx-auto max-w-3xl space-y-6 text-center"
        >
          <div className="space-y-3">
            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Hi folks...
            </h1>
            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              I&apos;m{" "}
              <span className="text-4xl font-semibold text-muted-foreground sm:text-5xl lg:text-6xl">
                Thu Rein Htet
              </span>
            </h1>
            <p className="min-h-[1.75rem] text-lg capitalize text-muted-foreground sm:text-xl">
              {currentText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          <div className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {intro && (
              <div className="prose prose-base mx-auto dark:prose-invert sm:prose-lg">
                <ReactMarkdown>{intro}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-8">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 me-1" />
              {residence}
            </span>
            <span className="flex items-center gap-1">
              <div
                className={`h-2.5 w-2.5 me-1 rounded-full transition-colors ${
                  available ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {available ? "Available for work" : "Not available for work"}
            </span>
          </div>

          <div className="flex w-full flex-col justify-center gap-3 pt-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full rounded-lg sm:w-auto">
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
                className="w-full rounded-lg sm:w-auto hover:bg-black/5 dark:hover:bg-white/5"
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
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 bg-background/70 px-4 text-sm text-muted-foreground sm:flex"
          onClick={() => {
            document
              .getElementById("about-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Scroll to About section"
        >
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{
              duration: 1.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.button>
      </section>

      <section
        id="about-section"
        className="surface-panel min-h-[calc(100vh-8rem)] px-5 py-12 sm:px-8 sm:py-14 lg:px-10"
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
                className="relative h-32 w-32 md:h-40 md:w-40"
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
          <div className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {aboutMe && (
              <div
                className={`prose prose-base mx-auto dark:prose-invert sm:prose-lg ${
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
      <section
        id="projects-section"
        className="surface-panel space-y-6 px-5 py-10 sm:space-y-8 sm:px-8 sm:py-12 lg:px-10"
      >
        <div
          className={`flex flex-col items-start gap-3 sm:flex-row sm:items-center ${
            featuredProjects.length > 0
              ? "sm:justify-between"
              : "sm:justify-center"
          }`}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-heading"
          >
            Featured Projects
          </motion.h2>
          {featuredProjects.length > 0 && (
            <Button variant="outline" asChild className="rounded-lg">
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
