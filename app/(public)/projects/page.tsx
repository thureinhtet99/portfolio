import ProjectsView from "@/features/projects/components/projects-view";
import { getProjects } from "@/features/projects/services/project.service";

export default async function ProjectsPage() {
  const projectsData = await getProjects();

  return <ProjectsView projects={projectsData} />;
}
