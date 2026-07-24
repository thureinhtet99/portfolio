import { APP_CONFIG } from "@/config/app-config";
import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { ContributionsSection } from "@/features/home/components/contributions-section";
import { HomeView } from "@/features/home/components/home-view";
import { WidgetSection } from "@/features/home/components/widget-section";
import { WidgetSectionSkeleton } from "@/features/home/components/widget-section-skeleton";
import { ProjectType } from "@/types/index.type";
import { eq } from "drizzle-orm";
import { Suspense } from "react";

// export const dynamic = "force-dynamic";

async function getSettings() {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.SETTINGS}`,
      {
        cache: "no-store",
      },
    );
    const { success, data } = await response.json();
    if (success && data) return data;

    return {};
  } catch (error) {
    console.error("Failed to load settings:", error);
    return {};
  }
}

async function getFeaturedProjects(): Promise<ProjectType[]> {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.PROJECTS}?featured=true`,
    );
    const { success, data } = await response.json();
    if (success && data) return data;

    return [];
  } catch (error) {
    console.error("Failed to load featured projects:", error);
    return [];
  }
}

async function getExperiences() {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.TIMELINES}?type=work`,
    );
    const { success, data } = await response.json();
    if (success && data) return data;

    return [];
  } catch (error) {
    console.error("Failed to load published posts:", error);
    return [];
  }
}

export default async function Home() {
  const settings = await getSettings();
  const featuredProjects = await getFeaturedProjects();
  const experiences = await getExperiences();

  // Increment view count
  try {
    const existing = await db
      .select()
      .from(setting)
      .where(eq(setting.key, "siteViews"))
      .limit(1)
      .all();
    if (existing.length > 0) {
      const current = Number(existing[0].value) || 0;
      await db
        .update(setting)
        .set({ value: String(current + 1), updatedAt: new Date() })
        .where(eq(setting.key, "siteViews"));
    } else {
      await db.insert(setting).values({
        id: crypto.randomUUID(),
        key: "siteViews",
        value: "1",
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }

  const residence = settings.residence || "Myanmar";
  const available =
    settings.available === "true" || settings.available === true;
  const aboutMe = settings.aboutMe || "";
  const intro = settings.intro || "";
  const profileImage = settings.profileImage || null;
  const resume = settings.resume || null;
  const bookingUrl = settings.bookingUrl || null;
  const githubUrl = settings.githubUrl || null;
  const linkedinUrl = settings.linkedinUrl || null;
  const facebookUrl = settings.facebookUrl || null;

  return (
    <HomeView
      experiences={experiences}
      residence={residence}
      available={available}
      aboutMe={aboutMe}
      intro={intro}
      featuredProjects={featuredProjects}
      profileImage={profileImage}
      resume={resume}
      bookingUrl={bookingUrl}
      socialLinks={{
        github: githubUrl,
        linkedin: linkedinUrl,
        facebook: facebookUrl,
      }}
      contributionsSection={<ContributionsSection />}
    >
      <Suspense fallback={<WidgetSectionSkeleton />}>
        <WidgetSection />
      </Suspense>
    </HomeView>
  );
}
