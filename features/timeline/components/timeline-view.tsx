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
import { TimelineType } from "@/types/index.type";
import Markdown from "react-markdown";

function sortByYearAsc<T>(items: T[], getYear: (item: T) => string): T[] {
  return [...items].sort((a, b) => getYear(a).localeCompare(getYear(b)));
}

export default function TimelineView({
  timelines,
}: {
  timelines: TimelineType[];
}) {
  const sortedTimelines = sortByYearAsc(timelines, (m) => m.year);
  const hasTimelines = sortedTimelines.length > 0;

  if (!hasTimelines) {
    return (
      <div className="page-shell px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-muted-foreground">No timeline data yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* timelines */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-3xl font-bold text-foreground tracking-[-0.02em] sm:text-4xl">
            Timeline
          </h2>
          {hasTimelines && (
            <TimescaleIntroScroll>
              <TimescaleRoot>
                <TimescaleHeader>
                  <TimescaleAge />
                  <TimescaleYear />
                </TimescaleHeader>
                <TimescaleViewport>
                  <TimescaleTrack>
                    <TimescaleRail />
                    {sortedTimelines.map((m) => (
                      <TimescaleItem key={m.id}>
                        <TimescaleTick />
                        <TimescaleAge>{m.year}</TimescaleAge>
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
