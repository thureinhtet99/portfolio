// "use client";

import { Button } from "@/components/ui/button";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { WorkExperienceWithRail } from "@/features/timeline/components/work-experience-with-rail";
import { ProjectType, WorkType } from "@/types/index.type";
import { Mail, MapPin, MoveRight, Quote } from "lucide-react";
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
  // const audioRef = useRef<HTMLAudioElement>(null);
  // const [isPlaying, setIsPlaying] = useState(false);

  // const toggleAudio = () => {
  //   if (!audioRef.current) return;
  //   if (isPlaying) {
  //     audioRef.current.pause();
  //   } else {
  //     audioRef.current.play();
  //   }
  //   setIsPlaying(!isPlaying);
  // };

  return (
    <div className="page-shell">
      {/* <audio
        ref={audioRef}
        src="/pronounce.mp3"
        onEnded={() => setIsPlaying(false)}
      /> */}
      {/* Hero Section */}
      <section id="hero-section" className="px-6 py-20 sm:py-40">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="space-y-4">
            <span className="text-muted-foreground text-md sm:text-base ">
              Good to see you!
            </span>
            <h1 className="group flex items-center gap-4 text-4xl font-bold text-muted-foreground sm:text-5xl">
              <span>
                I&apos;m <span className="text-primary">Thu Rein Htet</span>
              </span>

              {/* <button
                type="button"
                onClick={toggleAudio}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Play name pronunciation"
              >
                <Volume2 className="h-5 w-5 hover:text-primary cursor-pointer" />
              </button> */}
            </h1>

            <div className="leading-relaxed">
              {intro && (
                <div className="prose prose-base prose-invert sm:prose-lg text-muted-foreground text-xl sm:text-lg">
                  <ReactMarkdown
                    components={{
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:bg-primary hover:text-background text-white"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {intro}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {socialLinks.github && (
              <Link
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5"
              >
                <FaGithub className="h-4 w-4 group-hover:text-primary" />
                <span className="transition-colors group-hover:bg-primary group-hover:text-background">
                  GitHub
                </span>
              </Link>
            )}
            {socialLinks.linkedin && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5"
                >
                  <FaLinkedin className="h-4 w-4 group-hover:text-primary" />

                  <span className="transition-colors group-hover:bg-primary group-hover:text-background">
                    LinkedIn
                  </span>
                </Link>
              </>
            )}
            {resume && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <Link
                  href="/api/resume"
                  target="_blank"
                  className="group flex items-center gap-1.5"
                >
                  <FaFile className="h-4 w-4 group-hover:text-primary" />
                  <span className="transition-colors group-hover:bg-primary group-hover:text-background">
                    Resume
                  </span>
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
                    available ? "bg-primary" : "bg-muted-foreground/40"
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold text-muted-foreground tracking-[-0.02em] sm:text-4xl">
              Featured Projects
            </h2>
            {featuredProjects.length > 0 && (
              <div className="flex items-center gap-1">
                <Link
                  href="/projects"
                  transitionTypes={["nav-forward"]}
                  className="group flex items-center gap-1.5"
                >
                  <span className="transition-colors group-hover:bg-primary group-hover:text-background">
                    View all
                  </span>
                  <MoveRight className="h-4 w-4 group-hover:text-primary" />
                </Link>
              </div>
            )}
          </div>

          {featuredProjects.length > 0 ? (
            <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:justify-center">
              {featuredProjects.map((project) => (
                <ProjectShowcaseCard
                  key={project.id}
                  project={project}
                  techLimit={4}
                  className="w-full sm:max-w-120"
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
          <h2 className="text-4xl font-bold tracking-[-0.02em]">Experiences</h2>
          {experiences.length > 0 ? (
            <WorkExperienceWithRail experiences={experiences} />
          ) : (
            <p className="text-sm">No experiences yet.</p>
          )}
        </div>
      </section>

      {/* Contribution */}
      <section id="contributions-section" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <h2 className=" text-4xl font-bold tracking-[-0.02em]">
            Contributions
          </h2>
          {contributionsSection}
        </div>
      </section>

      {/* Widgets */}
      <section id="widgets-section" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {/* Currently Based In */}
            <div className="p-5 border border-muted-foreground/20 rounded-md lg:col-span-2 md:col-span-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Currently Based In</h3>
                </div>
                <p className="capitalize text-sm">{residence}</p>
              </div>

              <LocationMapClient
                fallbackLat={lat}
                fallbackLng={lng}
                label={residence}
              />
            </div>

            {/* Leave message */}
            <div className="p-5 border border-muted-foreground/20 rounded-md lg:col-span-1 md:col-span-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <LuMessageCircleMore className="h-4 w-4 text-primary" />
                  Leave a message
                </h3>
                <p className="text-sm mb-4">
                  Always open to great projects and good conversations.
                </p>
              </div>
              <Button asChild size="sm" className="w-full sm:w-1/2">
                <Link href="/contact" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send me
                </Link>
              </Button>
            </div>

            {/* Quote */}
            <blockquote className="relative p-5 border border-muted-foreground/20 rounded-md lg:col-span-1 md:col-span-2">
              <Quote className="absolute -top-3 -left-2 size-6 text-muted-foreground/60 fill-muted-foreground/20" />
              <p className="text-sm leading-relaxed italic">
                All that we are is the result of what we have thought.
              </p>
              <cite className="self-end text-sm not-italic">— Buddha</cite>
            </blockquote>
          </div>

          {/* GitHub Activity + Latest Posts */}
          {children}
        </div>
      </section>
    </div>
  );
}
