import { APP_CONFIG } from "@/config/app-config";
import TimelineView from "@/features/timeline/components/timeline-view";
import { MilestoneType } from "@/types/index.type";

async function getMilestones(): Promise<MilestoneType[]> {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.MILESTONES}`,
      { cache: "no-store" },
    );
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to load milestones:", error);
    return [];
  }
}

export default async function Timelines() {
  const milestones = await getMilestones();

  return <TimelineView milestones={milestones} />;
}
