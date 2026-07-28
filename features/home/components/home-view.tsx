import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { WorkExperienceWithRail } from "@/features/timeline/components/work-experience-with-rail";
import { ProjectType, WorkType } from "@/types/index.type";
import { Info, Mail, MapPin, MoveRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { FaFile, FaGithub, FaLinkedin } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import { LocationMapClient } from "./location-map-client";

type Props = {
  experiences: WorkType[];
  residence: string;
  lat: number;
  lng: number;
  available: boolean;
  aboutMe: string;
  intro: string;
  featuredProjects: ProjectType[];
  profileImage: string | null;
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
  experiences,
  residence,
  lat,
  lng,
  available,
  intro,
  featuredProjects,
  resume,
  socialLinks,
  children,
  contributionsSection,
}: Props) {
  return (
    <div className="page-shell">
      {/* Hero Section */}
      <section id="hero-section" className="px-6 py-20 sm:py-40">
        <div className="mx-auto max-w-5xl space-y-6">
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
              <span
                className={`flex items-center gap-1.5 ${available ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`relative h-2 w-2 rounded-full ${
                    available ? "bg-primary" : "bg-muted-foreground/50"
                  }`}
                >
                  {available && (
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
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects-section" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="flex items-center justify-between">
            <h2 className=" text-4xl font-bold text-muted-foreground tracking-[-0.02em]">
              Featured Projects
            </h2>
            {featuredProjects.length > 0 && (
              <div className="flex items-center gap-1 hover:bg-primary hover:text-background transition-colors">
                <Link href="/projects" className="text-sm">
                  View all
                </Link>
                <MoveRight className="h-4 w-4" />
              </div>
            )}
          </div>

          {featuredProjects.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {featuredProjects.map((project) => (
                <ProjectShowcaseCard
                  key={project.id}
                  project={project}
                  techLimit={4}
                  className="w-full max-w-120"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm">No featured projects yet.</p>
          )}
        </div>
      </section>

      {/* Experiences */}
      <section id="experience-section" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <h2 className=" text-4xl font-bold text-foreground tracking-[-0.02em]">
            Experiences
          </h2>
          {experiences.length > 0 ? (
            <WorkExperienceWithRail experiences={experiences} />
          ) : (
            <p className="text-sm">No experiences yet.</p>
          )}
        </div>
      </section>

      {/* Contribution */}
      <section id="contributions" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <h2 className=" text-4xl font-bold text-foreground tracking-[-0.02em]">
            Contributions
          </h2>
          {contributionsSection}
        </div>
      </section>

      {/* Widgets */}
      <section id="widgets" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {/* Currently Based In */}
            <div className="surface-panel p-5 border border-muted-foreground/20 rounded-md col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Currently Based In</h3>
              </div>

              <LocationMapClient
                fallbackLat={lat}
                fallbackLng={lng}
                label={residence}
              />
            </div>

            {/* Leave message */}
            <div className="surface-panel flex flex-col justify-between p-5 border border-muted-foreground/20 rounded-md">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <LuMessageCircleMore className="h-4 w-4 text-primary" />
                  Leave a message
                </h3>
                <p className=" text-sm text-muted-foreground mb-4">
                  Always open to great projects and good conversations.
                </p>
              </div>
              <Button asChild size="sm" className="w-1/2">
                <Link href="/contact" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send me
                </Link>
              </Button>
            </div>

            {/* Click me*/}
            <div className="surface-panel p-5 border border-muted-foreground/20 rounded-md flex flex-col">
              <div className="self-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Info className="h-4 w-4 hover:text-primary cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        of course, it won&apos;t take long
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm animate-bounce">cooking smth...</p>
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
