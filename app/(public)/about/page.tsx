import { AboutView } from "@/features/about/components/about-view";
import { getSettings } from "@/features/admin/services/settings.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Thu Rein Htet — software developer building modern web and mobile applications.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  const aboutMe = settings.aboutMe || "";
  const profileImage = settings.profileImage || null;

  return <AboutView aboutMe={aboutMe} profileImage={profileImage} />;
}
