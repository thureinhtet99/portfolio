"use client";

import type { ExperienceItemType } from "@/components/ui/work-experience";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

// type YearEntry = {
//   year: string;
//   startIdx: number;
//   endIdx: number;
// };

type Props = {
  experiences: ExperienceItemType[];
  entryHeights: number[];
  onYearClick: (idx: number) => void;
};

function extractYear(dateStr: string): string {
  const match = dateStr.match(/(\d{4})/);
  return match ? match[1] : "";
}

export function TimelineYearRail({
  experiences,
  entryHeights,
  onYearClick,
}: Props) {
  const isMobile = useIsMobile();
  const railRef = useRef<HTMLDivElement>(null);
  const [totalHeight, setTotalHeight] = useState(0);

  // Calculate total height from entry heights
  useEffect(() => {
    setTotalHeight(entryHeights.reduce((sum, h) => sum + h, 0));
  }, [entryHeights]);

  // Calculate Y position for each year label (aligned with company name at top of entry)
  const yearPositions = useMemo(() => {
    const positions: { year: string; y: number }[] = [];
    let accHeight = 0;

    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      // Get all years for this experience's positions
      const yearsForEntry = new Set<string>();
      for (const pos of exp.positions) {
        const startYear = extractYear(pos.employmentPeriod.start);

        if (startYear) yearsForEntry.add(startYear);
      }

      // Position year labels at the top of this entry (where company name is)
      for (const year of yearsForEntry) {
        if (!positions.find((p) => p.year === year)) {
          positions.push({ year, y: accHeight });
        }
      }
      accHeight += entryHeights[i] || 0;
    }

    return positions.sort((a, b) => b.year.localeCompare(a.year));
  }, [experiences, entryHeights]);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center gap-2 w-8">
        <div className="relative h-full w-px bg-muted-foreground/20" />
      </div>
    );
  }

  // Line endpoints: centered on first and last circle
  const lineTop = yearPositions.length > 0 ? yearPositions[0].y + 12 : 0;
  const lineBottom =
    yearPositions.length > 0
      ? totalHeight - yearPositions[yearPositions.length - 1].y - 12
      : 0;

  return (
    <div
      ref={railRef}
      className="relative flex flex-col w-16 shrink-0"
      style={{ height: totalHeight || "100%" }}
    >
      {/* Connecting line */}
      <div
        className="absolute right-3 w-px bg-muted-foreground/20"
        style={{ top: lineTop, bottom: lineBottom }}
      />

      {/* Year labels */}
      {yearPositions.map(({ year, y }) => {
        // Find the first experience that has this year
        const entryIdx = experiences.findIndex((exp) =>
          exp.positions.some((pos) => {
            const startYear = extractYear(pos.employmentPeriod.start);
            const endYear = pos.employmentPeriod.end
              ? extractYear(pos.employmentPeriod.end)
              : startYear;
            return year >= startYear && year <= endYear;
          }),
        );
        return (
          <button
            key={year}
            type="button"
            onClick={() => onYearClick(entryIdx)}
            className={cn(
              "absolute right-0 flex items-center gap-2",
              "text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer",
              "group/year",
            )}
            style={{ top: y }}
          >
            <span className="tabular-nums text-3xl leading-none">{year}</span>
            <span className="relative z-10 flex h-6 w-6 items-center justify-center">
              <span className="h-4 w-4 rounded-full bg-muted-foreground group-hover/year:bg-primary transition-colors" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
