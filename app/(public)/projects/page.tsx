import ProjectsView from "@/features/projects/components/projects-view";
import { getProjects } from "@/lib/services/projects";

export default async function ProjectsPage() {
  const projectsData = await getProjects();

  return <ProjectsView projects={projectsData} />;
}
