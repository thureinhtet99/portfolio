import TimelineView from "@/features/timeline/components/timeline-view";
import { getTimelines } from "@/features/timeline/services/timeline.service";

export default async function Timelines() {
  const timelines = await getTimelines();

  return <TimelineView timelines={timelines} />;
}
