import TimelineView from "@/features/timeline/components/timeline-view";
import { getTimelines } from "@/lib/services/timelines";

export default async function Timelines() {
  const timelines = await getTimelines();

  return <TimelineView timelines={timelines} />;
}
