import { APP_CONFIG } from "@/config/app-config";
import HomeClientComponent from "./HomeClientComponent";
import { ProjectType } from "@/types/index.type";
import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

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

async function getProjects(): Promise<ProjectType[]> {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.PROJECTS}`,
      {
        cache: "no-store",
      },
    );
    const data = await response.json();
    if (data.success && data.data) {
      return data.data.filter((p: ProjectType) => p.featured).slice(0, 2);
    }
    return [];
  } catch (error) {
    console.error("Failed to load projects:", error);
    return [];
  }
}

async function getGithubEvents(githubUrl?: string) {
  if (!githubUrl) return [];
  const username = githubUrl.split("/").pop();
  if (!username) return [];

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public`,
      {
        next: { revalidate: 60 * 30 }, // Revalidate every 30 minutes
      },
    );
    if (!response.ok) {
      console.error("Failed to fetch GitHub events:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch GitHub events:", error);
    return [];
  }
}

export default async function Home() {
  const settings = await getSettings();
  const featuredProjects = await getProjects();
  const githubEvents = await getGithubEvents(settings.githubUrl);

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

  return (
    <HomeClientComponent
      residence={residence}
      available={available}
      aboutMe={aboutMe}
      intro={intro}
      featuredProjects={featuredProjects}
      profileImage={profileImage}
      resume={resume}
      githubEvents={githubEvents}
      bookingUrl={bookingUrl}
    />
  );
}
