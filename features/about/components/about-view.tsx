"use client";

import profileImg from "@/public/profile.svg";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import ReactMarkdown from "react-markdown";

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

export function AboutView({
  aboutMe,
  profileImage,
  email,
  socialLinks,
}: Props) {
  return (
    <div className="page-shell">
      {/* About */}
      <section className="px-6 py-16 sm:py-20">
        <motion.div className="mx-auto max-w-4xl">
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
              <div className=" text-base leading-relaxed sm:text-md">
                {aboutMe && (
                  <div className="prose prose-base prose-invert sm:prose-md">
                    <ReactMarkdown>{aboutMe}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Techs */}
      <section className="px-6 py-16 sm:py-20">
        <motion.div className="mx-auto max-w-4xl">
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
              <div className=" text-base leading-relaxed sm:text-md">
                {aboutMe && (
                  <div className="prose prose-base prose-invert sm:prose-md">
                    <ReactMarkdown>{aboutMe}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
