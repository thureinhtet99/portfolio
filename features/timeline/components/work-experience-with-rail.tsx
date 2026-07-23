"use client";

import type { ExperienceItemType } from "@/components/ui/work-experience";
import { ExperienceItem } from "@/components/ui/work-experience";
import { useCallback, useEffect, useRef, useState } from "react";
import { TimelineYearRail } from "./timeline-year-rail";

type Props = {
  experiences: ExperienceItemType[];
};

export function WorkExperienceWithRail({ experiences }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [entryHeights, setEntryHeights] = useState<number[]>([]);

  const measureHeights = useCallback(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll(
      "[data-experience-entry]",
    );
    const heights = Array.from(items).map(
      (el) => (el as HTMLElement).offsetHeight,
    );
    setEntryHeights(heights);
  }, []);

  useEffect(() => {
    measureHeights();
  }, [measureHeights]);

  // Observe size changes for expand/collapse sync
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      measureHeights();
    });

    observer.observe(containerRef.current);

    const items = containerRef.current.querySelectorAll(
      "[data-experience-entry]",
    );
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [measureHeights, experiences]);

  const handleYearClick = useCallback((idx: number) => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll(
      "[data-experience-entry]",
    );
    const target = items[idx] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <div ref={containerRef} className="flex gap-2">
      <TimelineYearRail
        experiences={experiences}
        entryHeights={entryHeights}
        onYearClick={handleYearClick}
      />
      <div className="flex-1">
        <div className="bg-background px-4 text-foreground">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              data-experience-entry
              className="space-y-4 py-4"
            >
              <ExperienceItem experience={experience} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
