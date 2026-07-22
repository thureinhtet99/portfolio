"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { sectionReveal } from "@/lib/motion";
import ReactMarkdown from "react-markdown";
import { Github, Linkedin, Facebook, Mail } from "lucide-react";
import { StaticImageData } from "next/image";
import profileImg from "@/public/profile.svg";

type Props = {
  aboutMe: string;
  profileImage: StaticImageData | string | null;
  email: string | null;
  socialLinks: {
    github: string | null;
    linkedin: string | null;
    facebook: string | null;
  };
};

export function AboutView({ aboutMe, profileImage, email, socialLinks }: Props) {
  return (
    <div className="page-shell">
      <section className="px-6 py-12">
        <motion.div {...sectionReveal} className="mx-auto max-w-4xl">
          <h1 className=" text-3xl font-bold tracking-[-0.03em] mb-8">
            About Me
          </h1>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* Portrait */}
            {profileImage && (
              <div className="shrink-0">
                <div className="relative h-64 w-64 overflow-hidden rounded-lg md:h-80 md:w-80">
                  <Image
                    src={profileImg}
                    alt="Thu Rein Htet"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="flex-1 space-y-6">
              <div className=" text-base leading-relaxed text-muted-foreground sm:text-lg">
                {aboutMe && (
                  <div className="prose prose-base prose-invert sm:prose-lg">
                    <ReactMarkdown>{aboutMe}</ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap items-center gap-3  text-sm text-muted-foreground">
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
                    <span className="text-muted-foreground/30">*</span>
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
                {email && (
                  <>
                    <span className="text-muted-foreground/30">*</span>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      contact[at][thisdomain]
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
