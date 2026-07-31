"use client";

import {
  TimescaleAge,
  TimescaleContent,
  TimescaleHeader,
  TimescaleIntroScroll,
  TimescaleItem,
  TimescaleRail,
  TimescaleRoot,
  TimescaleTick,
  TimescaleTrack,
  TimescaleViewport,
  TimescaleYear,
} from "@/components/timescale";
import {
  EducationDisplayType,
  MilestoneType,
  WorkDisplayType,
} from "@/types/index.type";
import Markdown from "react-markdown";

type Props = {
  work: WorkDisplayType[];
  education: EducationDisplayType[];
};

function extractYear(dateStr: string): string {
  const match = dateStr.match(/(\d{4})/);
  return match ? match[1] : "";
}

function buildWorkContent(exp: WorkDisplayType): string {
  const lines: string[] = [];
  if (exp.positions.length > 0) {
    const posTitles = exp.positions.map((p) => p.title).join(" → ");
    lines.push(`**${posTitles}**`);
  }
  const period = exp.positions[0]
    ? `${exp.positions[0].employmentPeriod.start} — ${exp.positions[0].employmentPeriod.end || "Present"}`
    : "";
  if (period) lines.push(period);
  for (const pos of exp.positions) {
    if (pos.description) lines.push(pos.description);
    if (pos.skills && pos.skills.length > 0)
      lines.push(`\`${pos.skills.join("` `")}\``);
  }
  return lines.join("\n\n");
}

function buildEduContent(edu: EducationDisplayType): string {
  const lines: string[] = [];
  if (edu.location) lines.push(`📍 ${edu.location}`);
  if (edu.period) lines.push(edu.period);
  return lines.join("\n");
}

function sortByYearAsc<T>(items: T[], getYear: (item: T) => string): T[] {
  return [...items].sort((a, b) => getYear(a).localeCompare(getYear(b)));
}

export default function TimelineView({
  milestones,
}: {
  milestones: MilestoneType[];
}) {
  const sortedMilestones = sortByYearAsc(milestones, (m) => m.date);

  const hasMilestones = sortedMilestones.length > 0;

  // if (!hasMilestones) {
  //   return (
  //     <div className="page-shell px-4 py-16 sm:px-6 sm:py-20">
  //       <div className="mx-auto max-w-5xl">
  //         <p className="text-sm text-muted-foreground">No timeline data yet.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="page-shell px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Milestones */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-3xl font-bold text-foreground tracking-[-0.02em] sm:text-4xl">
            Tineline
          </h2>
          {hasMilestones && (
            <TimescaleIntroScroll>
              <TimescaleRoot>
                <TimescaleHeader>
                  <TimescaleAge />
                  <TimescaleYear />
                </TimescaleHeader>
                <TimescaleViewport>
                  <TimescaleTrack>
                    <TimescaleRail />
                    {sortedMilestones.map((m) => (
                      <TimescaleItem key={m.id}>
                        <TimescaleTick />
                        <TimescaleAge>{m.date}</TimescaleAge>
                        <TimescaleYear>{m.title}</TimescaleYear>
                        {m.description && (
                          <TimescaleContent className="typeset">
                            <Markdown>{m.description}</Markdown>
                          </TimescaleContent>
                        )}
                      </TimescaleItem>
                    ))}
                  </TimescaleTrack>
                </TimescaleViewport>
              </TimescaleRoot>
            </TimescaleIntroScroll>
          )}
        </section>
      </div>
    </div>
  );
}
