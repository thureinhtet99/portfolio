import { APP_CONFIG } from "@/config/app-config";
import { AboutView } from "@/features/about/components/about-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Thu Rein Htet — software developer building modern web and mobile applications.",
};

async function getSettings() {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(`${baseUrl}/api/${APP_CONFIG.ROUTE.SETTINGS}`);
    const { success, data } = await response.json();
    if (success && data) return data;
    return {};
  } catch (error) {
    console.error("Failed to load settings:", error);
    return {};
  }
}

export default async function AboutPage() {
  const settings = await getSettings();
  const aboutMe = settings.aboutMe || "";
  const profileImage = settings.profileImage || null;

  return <AboutView aboutMe={aboutMe} profileImage={profileImage} />;
}
