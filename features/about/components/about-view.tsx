import profileImg from "@/public/profile.jpg";
import Image, { StaticImageData } from "next/image";
import ReactMarkdown from "react-markdown";

export function AboutView({
  aboutMe,
  profileImage,
}: {
  aboutMe: string;
  profileImage: StaticImageData | string | null;
}) {
  const imgSrc = profileImage || profileImg;

  return (
    <div className="page-shell">
      {/* About */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            About me
          </h1>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* Portrait */}
            <div className="relative h-64 w-full overflow-hidden rounded-sm md:h-100 md:w-80 shrink-0 self-start">
              <Image
                src={imgSrc}
                alt="Thu Rein Htet"
                fill
                sizes="(max-width: 768px) 336px, 320px"
                className="object-cover"
                priority
              />
            </div>

            {/* Bio */}
            <div className="flex-1 text-base leading-relaxed">
              {aboutMe && (
                <div className="prose prose-base prose-invert text-muted-foreground">
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
