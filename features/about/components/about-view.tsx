"use client";

import profileImg from "@/public/profile.jpg";
import Image, { StaticImageData } from "next/image";
import ReactMarkdown from "react-markdown";

type Props = {
  aboutMe: string;
  profileImage: StaticImageData | string | null;
  // email: string | null;
  // socialLinks: {
  //   github: string | null;
  //   linkedin: string | null;
  //   facebook: string | null;
  // };
};

export function AboutView({
  aboutMe,
  profileImage,
  // email,
  // socialLinks,
}: Props) {
  return (
    <div className="page-shell">
      {/* About */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-4xl font-bold tracking-[-0.03em]">About me</h1>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* Portrait */}
            {profileImage && (
              <div className="relative h-64 w-full overflow-hidden rounded-sm md:h-100 md:w-80 shrink-0 self-center">
                <Image
                  src={profileImg}
                  alt="Thu Rein Htet"
                  fill
                  sizes="(max-width: 768px) 336px, 320px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Bio */}
            <div className="flex-1 text-base leading-relaxed sm:text-md">
              {aboutMe && (
                <div className="prose prose-base prose-invert sm:prose-md text-muted-foreground">
                  <ReactMarkdown>{aboutMe}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Techs */}
      {/* <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className=" text-4xl font-bold text-foreground tracking-[-0.02em]">
            Techs
          </h2>

          <div className="flex">tech stacks</div>
        </div>
      </section> */}
    </div>
  );
}
