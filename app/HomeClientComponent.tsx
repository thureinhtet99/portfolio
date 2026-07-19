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
import { motion, useReducedMotion } from "framer-motion";
import { sectionReveal, cardReveal } from "@/lib/motion";
import { useState } from "react";
import { StaticImageData } from "next/image";
import { ProjectType } from "@/types/index.type";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { GitHubActivityWidget } from "@/features/home/components/github-activity-widget";
import profileImg from "@/public/profile.svg";

type Props = {
  residence: string;
  available: boolean;
  aboutMe: string;
  intro: string;
  featuredProjects: ProjectType[];
  profileImage: StaticImageData | string | null;
  resume: string | null;
  githubEvents: any[];
};

export default function HomeClientComponent({
  residence,
  available,
  aboutMe,
  intro,
  featuredProjects,
  profileImage,
  resume,
  githubEvents,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      <section
        id="hero-section"
        className="surface-panel relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-5 py-14 sm:px-8 sm:py-16 lg:px-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,34,34,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_55%)]" />
        <motion.div
          {...sectionReveal}
          className="relative z-10 mx-auto max-w-3xl space-y-6 text-center"
        >
          <div className="space-y-3">
            <h1 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl lg:text-4xl">
              Hi folks...
            </h1>
            <h1 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl lg:text-4xl">
              I&apos;m{" "}
              <span className="text-4xl font-semibold tracking-[-0.03em] text-muted-foreground sm:text-5xl lg:text-6xl">
                Thu Rein Htet
              </span>
            </h1>
            <p className="min-h-[1.75rem] text-lg capitalize text-muted-foreground sm:text-xl">
              {/* {currentText} */}Software developer
              {/* <span className="animate-pulse">|</span> */}
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
                className={`relative h-2.5 w-2.5 me-1 rounded-full transition-colors ${
                  available ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {available && !shouldReduceMotion && (
                  <div className="absolute inset-0 h-full w-full animate-ping rounded-full bg-green-500" />
                )}
              </div>
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
            animate={shouldReduceMotion ? { y: 0 } : { y: [0, 5, 0] }}
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
          {...sectionReveal}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center mb-6">
            {profileImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative h-50 w-50 md:h-100 md:w-100"
              >
                <div className="absolute inset-0  overflow-hidden ">
                  <Image
                    src={profileImg}
                    alt="Thu Rein Htet"
                    fill
                    className="object-cover"
                    priority
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

      <GitHubActivityWidget events={githubEvents} />

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
            {...sectionReveal}
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
                {...cardReveal(index)}
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
