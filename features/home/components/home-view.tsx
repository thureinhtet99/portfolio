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
  ChevronDown,
  ChevronUp,
  Calendar,
  Github,
  Linkedin,
  Facebook,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { sectionReveal, cardReveal } from "@/lib/motion";
import { useState } from "react";
import { StaticImageData } from "next/image";
import { ProjectType, PostType } from "@/types/index.type";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { GitHubActivityWidget } from "@/features/home/components/github-activity-widget";
import { LatestPostsWidget } from "@/features/home/components/latest-posts-widget";
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
  githubLanguages: Record<string, number>;
  latestPosts: PostType[];
  bookingUrl: string | null;
  socialLinks: {
    github: string | null;
    linkedin: string | null;
    facebook: string | null;
  };
};

export function HomeView({
  residence,
  available,
  aboutMe,
  intro,
  featuredProjects,
  profileImage,
  resume,
  githubEvents,
  githubLanguages,
  latestPosts,
  bookingUrl,
  socialLinks,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      {/* Hero Section */}
      <section id="hero-section" className="px-6 py-16 sm:py-20">
        <motion.div
          {...sectionReveal}
          className="mx-auto max-w-3xl space-y-6"
        >
          <div className="space-y-2">
            <h1 className="font-mono text-2xl text-muted-foreground sm:text-3xl">
              Hey! I&apos;m{" "}
              <span className="font-mono text-4xl font-bold text-[var(--accent-signal)] sm:text-5xl lg:text-6xl">
                Thu Rein Htet
              </span>
            </h1>
          </div>

          <div className="font-mono text-base leading-relaxed text-muted-foreground sm:text-lg">
            {intro && (
              <div className="prose prose-base prose-invert sm:prose-lg">
                <ReactMarkdown>{intro}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Social Links Row */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-sm text-muted-foreground">
            {socialLinks.github && (
              <Link
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
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
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Link>
              </>
            )}
            {socialLinks.facebook && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <Link
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Link>
              </>
            )}
            <span className="text-muted-foreground/30">|</span>
            <Link
              href="/about"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              More about me <MoveRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* CTA Row */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Get in Touch
              </Link>
            </Button>
            {bookingUrl && (
              <Button
                variant="outline"
                asChild
                size="lg"
                className="rounded-lg hover:bg-white/5"
              >
                <Link
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  Book a Chat
                </Link>
              </Button>
            )}
            {resume && (
              <Button
                variant="outline"
                asChild
                size="lg"
                className="rounded-lg hover:bg-white/5"
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

          {/* Location + Status */}
          <div className="flex flex-col gap-2 font-mono text-sm text-muted-foreground sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--accent-signal)]" />
              <span>
                Currently based in{" "}
                <span className="text-foreground">{residence}</span>
              </span>
            </div>
            <span className="hidden text-muted-foreground/30 sm:inline">|</span>
            <span className="flex items-center gap-1.5">
              <div
                className={`relative h-2 w-2 rounded-full ${
                  available
                    ? "bg-[var(--accent-signal)]"
                    : "bg-muted-foreground/50"
                }`}
              >
                {available && !shouldReduceMotion && (
                  <div className="absolute inset-0 h-full w-full animate-ping rounded-full bg-[var(--accent-signal)]" />
                )}
              </div>
              {available ? "Available for work" : "Not available"}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section id="projects-section" className="px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <motion.h2 {...sectionReveal} className="font-mono text-2xl font-bold tracking-[-0.02em]">
              Featured Projects
            </motion.h2>
            {featuredProjects.length > 0 && (
              <Link
                href="/projects"
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View all <MoveRight className="inline h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {featuredProjects.slice(0, 2).map((project, index) => (
                <motion.div key={project.id} {...cardReveal(index)}>
                  <ProjectShowcaseCard
                    project={project}
                    techLimit={4}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="font-mono text-sm text-muted-foreground">
              No featured projects yet.
            </p>
          )}
        </div>
      </section>

      {/* Dashboard Widgets */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Widget Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Let's Connect */}
            <div className="surface-panel p-5">
              <h3 className="font-mono text-sm font-semibold text-foreground mb-2">
                Let&apos;s Connect
              </h3>
              <p className="font-mono text-sm text-muted-foreground mb-4">
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
              <h3 className="font-mono text-sm font-semibold text-foreground mb-2">
                Currently Based In{" "}
                <span className="text-[var(--accent-signal)]">📍</span>
              </h3>
              <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-[var(--accent-signal)]" />
                <span>{residence}</span>
              </div>
            </div>
          </div>

          {/* GitHub Activity + Latest Posts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <GitHubActivityWidget events={githubEvents} languages={githubLanguages} />
            <LatestPostsWidget posts={latestPosts} />
          </div>
        </div>
      </section>
    </div>
  );
}
