"use client";

import { Button } from "@/components/ui/button";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { experiences } from "@/features/timeline/data/experiences";
import { WorkExperienceWithRail } from "@/features/timeline/components/work-experience-with-rail";
import { cardReveal } from "@/lib/motion";
import { ProjectType } from "@/types/index.type";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin, MoveRight } from "lucide-react";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FaFile, FaGithub, FaLinkedin } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

type Props = {
  residence: string;
  available: boolean;
  aboutMe: string;
  intro: string;
  featuredProjects: ProjectType[];
  profileImage: StaticImageData | string | null;
  resume: string | null;
  bookingUrl: string | null;
  socialLinks: {
    github: string | null;
    linkedin: string | null;
    facebook: string | null;
  };
  children: ReactNode;
  contributionsSection: ReactNode;
};

export function HomeView({
  residence,
  available,
  intro,
  featuredProjects,
  resume,
  socialLinks,
  children,
  contributionsSection,
}: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      {/* Hero Section */}
      <section id="hero-section" className="px-6 py-16 sm:py-20 ">
        <motion.div
          // {...sectionReveal}
          className="mx-auto max-w-5xl space-y-6"
        >
          <div className="space-y-2">
            <span className="text-muted-foreground text-md sm:text-base ">
              Good to see you!
            </span>
            <h1 className="font-bold text-3xl text-muted-foreground sm:text-4xl">
              I&apos;m <span className="text-primary">Thu Rein Htet</span>
            </h1>
          </div>

          <div className="text-base leading-relaxed sm:text-lg">
            {intro && (
              <div className="prose prose-base prose-invert sm:prose-lg text-muted-foreground">
                <ReactMarkdown>{intro}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Social Links Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {socialLinks.github && (
              <Link
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <FaGithub className="h-4 w-4" />
                GitHub
              </Link>
            )}
            {socialLinks.linkedin && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <FaLinkedin className="h-4 w-4" />
                  LinkedIn
                </Link>
              </>
            )}
            {resume && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <Link
                  href="/api/resume"
                  target="_blank"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <FaFile className="h-4 w-4" />
                  Resume
                </Link>
              </>
            )}
            <>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1.5 text-primary">
                <div
                  className={`relative h-2 w-2 rounded-full ${
                    available ? "bg-primary" : "bg-muted-foreground/50"
                  }`}
                >
                  {available && !shouldReduceMotion && (
                    <span
                      className="relative flex items-center justify-center"
                      aria-label="Current Employer"
                    >
                      <span className="absolute inline-flex size-3 animate-ping rounded-full bg-sky-500 opacity-50" />
                      <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
                    </span>
                  )}
                </div>
                {available ? "Available for work" : "Not available"}
              </span>
            </>
          </div>
        </motion.div>
      </section>

      {/* Experiences */}
      <section id="experience-section" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <motion.h2 className=" text-4xl font-bold text-foreground tracking-[-0.02em]">
            Experiences
          </motion.h2>
          <WorkExperienceWithRail experiences={experiences} />
        </div>
      </section>

      {/* Contribution */}
      <section id="contributions" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <motion.h2
            // {...sectionReveal}
            className=" text-4xl font-bold text-foreground tracking-[-0.02em]"
          >
            Contributions
          </motion.h2>
          {contributionsSection}
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects-section" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <motion.h2
              // {...sectionReveal}
              className=" text-4xl font-bold text-muted-foreground tracking-[-0.02em]"
            >
              Featured Projects
            </motion.h2>
            {featuredProjects.length > 0 && (
              <div className="flex items-center gap-1 text-primary hover:bg-primary hover:text-background transition-colors">
                <Link href="/projects" className="text-base">
                  View all
                </Link>
                <MoveRight className="inline h-4 w-4" />
              </div>
            )}
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  {...cardReveal(index)}
                  className={
                    featuredProjects.length === 1
                      ? "lg:col-span-2 mx-auto w-full"
                      : ""
                  }
                >
                  <ProjectShowcaseCard project={project} techLimit={4} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className=" text-sm text-muted-foreground">
              No featured projects yet.
            </p>
          )}
        </div>
      </section>

      {/* Widgets */}
      <section id="widgets" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-6 border">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Let's Connect */}
            <div className="surface-panel p-5">
              <h3 className=" text-sm font-semibold text-foreground mb-2">
                Let&apos;s Connect
              </h3>
              <p className=" text-sm text-muted-foreground mb-4">
                Always open to interesting projects and conversations.
              </p>
              <Button asChild size="sm" className="rounded-lg">
                <Link href="/contact" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Book a Chat
                </Link>
              </Button>
            </div>

            {/* Currently Based In */}
            <div className="surface-panel p-5">
              <h3 className=" text-sm font-semibold text-foreground mb-2">
                Currently Based In <span className="text-primary">📍</span>
              </h3>
              <div className="flex items-center gap-2  text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{residence}</span>
              </div>
            </div>
          </div>

          {/* GitHub Activity + Latest Posts */}
          {children}
        </div>
      </section>
    </div>
  );
}
