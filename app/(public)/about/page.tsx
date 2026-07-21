import { AboutView } from "@/features/about/components/about-view";
import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Thu Rein Htet — software developer building modern web and mobile applications.",
};

export default async function AboutPage() {
  let aboutMe = "";
  let profileImage: string | null = null;
  let email: string | null = null;
  let githubUrl: string | null = null;
  let linkedinUrl: string | null = null;
  let facebookUrl: string | null = null;

  try {
    const settings = await db.select().from(setting).all();
    const settingsMap = Object.fromEntries(
      settings.map((s) => [s.key, s.value])
    );
    aboutMe = settingsMap.aboutMe || "";
    profileImage = settingsMap.profileImage || null;
    email = settingsMap.email || null;
    githubUrl = settingsMap.githubUrl || null;
    linkedinUrl = settingsMap.linkedinUrl || null;
    facebookUrl = settingsMap.facebookUrl || null;
  } catch (error) {
    console.error("Failed to load about settings:", error);
  }

  return (
    <AboutView
      aboutMe={aboutMe}
      profileImage={profileImage}
      email={email}
      socialLinks={{
        github: githubUrl,
        linkedin: linkedinUrl,
        facebook: facebookUrl,
      }}
    />
  );
}
