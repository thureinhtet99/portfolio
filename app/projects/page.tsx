import { APP_CONFIG } from "@/config/app-config";
import ProjectsClientComponent from "./ProjectsClientComponent";

async function getProjects() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.PROJECTS}`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to load projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projectsData = await getProjects();

  return <ProjectsClientComponent projects={projectsData} />;
}
