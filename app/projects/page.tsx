import { APP_CONFIG } from "@/config/app-config";
import ProjectsView from "@/features/projects/components/projects-view";

export const dynamic = "force-dynamic";

async function getProjects() {
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

  return <ProjectsView projects={projectsData} />;
}
