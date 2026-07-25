"use client";

import type { ExperienceItemType } from "@/components/ui/work-experience";
import { ExperiencePositionItem } from "@/components/ui/work-experience";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

function extractYear(dateStr: string): string {
  const match = dateStr.match(/(\d{4})/);
  return match ? match[1] : "";
}

function getExperienceYearRange(exp: ExperienceItemType): {
  startYear: string;
  endYear: string | null;
} {
  const allStarts = exp.positions
    .map((p) => extractYear(p.employmentPeriod.start))
    .filter(Boolean);
  const allEnds = exp.positions
    .map((p) => (p.employmentPeriod.end ? extractYear(p.employmentPeriod.end) : null))
    .filter((y): y is string => y !== null);

  const hasOngoing = exp.positions.some((p) => !p.employmentPeriod.end);

  const startYear = allStarts.sort().at(-1) ?? ""; // most recent start
  const endYear = hasOngoing ? null : (allEnds.sort().at(-1) ?? null);

  return { startYear, endYear };
}

export function ExperienceYearTimeline({
  experiences,
}: {
  experiences: ExperienceItemType[];
}) {
  // Group experiences by start year, preserving original order
  const grouped = useMemo(() => {
    const seen = new Set<string>();
    return experiences.map((exp) => {
      const { startYear, endYear } = getExperienceYearRange(exp);
      const showYear = !seen.has(startYear);
      if (startYear) seen.add(startYear);
      return { exp, startYear, endYear, showYear };
    });
  }, [experiences]);

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-[5.5rem] top-3 bottom-3 w-px bg-border/40 sm:left-[6.5rem]" />

      <div className="space-y-0">
        {grouped.map(({ exp, startYear, endYear, showYear }, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="relative pb-8 last:pb-0"
          >
            {/* Top row: year + company header — share one flex row so they align perfectly */}
            <div className="flex items-center gap-0">
              {/* Year column */}
              <div className="relative flex items-center justify-end w-24 shrink-0 pr-4 sm:w-28">
                {showYear && startYear ? (
                  <span
                    className={cn(
                      "font-mono text-sm font-semibold tabular-nums leading-snug",
                      "text-[oklch(0.72_0.17_250)]", // accent-signal
                    )}
                  >
                    {startYear}
                  </span>
                ) : null}
                {/* dot — centered on the timeline line, vertically mid of this row */}
                <span
                  className={cn(
                    "absolute right-[-5px] h-[10px] w-[10px] rounded-full border-2",
                    showYear && startYear
                      ? "border-[oklch(0.72_0.17_250)] bg-background"
                      : "border-border/50 bg-background",
                  )}
                />
              </div>

              {/* Company header — same flex row, so baseline matches year text */}
              <div className="not-prose flex flex-1 items-center gap-2.5 pl-6">
                {exp.companyLogo ? (
                  <img
                    src={exp.companyLogo}
                    alt={exp.companyName}
                    className="size-5 rounded-full shrink-0"
                    aria-hidden
                  />
                ) : (
                  <span className="size-5 rounded-full bg-muted shrink-0" />
                )}
                <h3 className="text-base font-semibold text-foreground leading-snug">
                  {exp.companyWebsite ? (
                    <a
                      href={exp.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[oklch(0.72_0.17_250)] transition-colors"
                    >
                      {exp.companyName}
                    </a>
                  ) : (
                    exp.companyName
                  )}
                </h3>
                {/* End year / Present badge */}
                <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground/60 tabular-nums">
                  {endYear ?? "Present"}
                </span>
              </div>
            </div>

            {/* Positions — indented to align under the company name */}
            <div className="flex gap-0">
              {/* Spacer matching year column width */}
              <div className="w-24 shrink-0 sm:w-28" />
              <div className="relative flex-1 space-y-3 pl-6 pt-3 before:absolute before:left-9 before:sm:left-10 before:h-full before:w-px before:bg-border/50">
                {exp.positions.map((position) => (
                  <ExperiencePositionItem key={position.id} position={position} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
