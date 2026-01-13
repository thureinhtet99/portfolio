import { APP_CONFIG } from "@/config/app-config";
import HomeClientComponent from "./HomeClientComponent";
import { ProjectType } from "@/types/index.type";

async function getSettings() {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.SETTINGS}`,
      {
        cache: "no-store",
      }
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
      }
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

export default async function Home() {
  const settings = await getSettings();
  const featuredProjects = await getProjects();

  const residence = settings.residence || "Myanmar";
  const available =
    settings.available === "true" || settings.available === true;
  const aboutMe = settings.aboutMe || "";
  const intro = settings.intro || "";
  const roles = settings.roles || "";
  const profileImage = settings.profileImage || null;
  const resume = settings.resume || null;

  return (
    <HomeClientComponent
      residence={residence}
      available={available}
      aboutMe={aboutMe}
      intro={intro}
      roles={roles}
      featuredProjects={featuredProjects}
      profileImage={profileImage}
      resume={resume}
    />
  );
}
