import { APP_CONFIG } from "@/config/app-config";
import TimelineClientComponent from "./TimelineClientComponent";
import {
  EducationResponseType,
  TimelineType,
  WorkType,
  WorkDisplayType,
  EducationDisplayType,
} from "@/types/index.type";

async function getTimelines(): Promise<TimelineType[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.TIMELINES}`,
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
    console.error("Failed to load timelines:", error);
    return [];
  }
}

export default async function Timelines() {
  const timelines = await getTimelines();

  // Separate work experiences and education
  const work: WorkDisplayType[] = timelines
    .filter((t): t is WorkType => t.type === "work")
    .map((exp) => ({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      location: exp.location,
      period: exp.period,
      type: exp.role || "Remote",
      description: exp.description,
      achievements: exp.achievements || [],
      technologies: exp.technologies || [],
    }));

  const education: EducationDisplayType[] = timelines
    .filter((t): t is EducationResponseType => t.type === "education")
    .map((edu) => ({
      id: edu.id,
      degree: edu.degree || "Degree",
      institution: edu.institution,
      location: edu.location,
      period: edu.period,
      description: edu.description,
      achievements: [],
    }));

  return <TimelineClientComponent work={work} education={education} />;
}
