import { APP_CONFIG } from "@/config/app-config";
import TimelineView from "@/features/timeline/components/timeline-view";
import { TimelineType } from "@/types/index.type";

async function getTimelines(): Promise<TimelineType[]> {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.TIMELINES}`,
      { cache: "no-store" },
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

  return <TimelineView timelines={timelines} />;
}
