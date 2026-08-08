import {
  TimescaleContent,
  TimescaleIntroScroll,
  TimescaleItem,
  TimescaleRail,
  TimescaleRoot,
  TimescaleTick,
  TimescaleTrack,
  TimescaleViewport,
  TimescaleYear,
} from "@/components/ui/timescale";
import { TimelineType } from "@/types/index.type";
import ReactMarkdown from "react-markdown";

type TimescaleEntry =
  | {
      kind: "entry";
      id: string;
      year: string;
      title: string;
      description: string | null | undefined;
    }
  | { kind: "empty"; id: string; year: string };

function buildTimescaleEntries(
  timelines: TimelineType[],
  currentYear: number,
): TimescaleEntry[] {
  // Parse real year strings; drop anything that isn't a 4-digit-ish number.
  const validYears: number[] = [];
  for (const t of timelines) {
    const n = Number(t.year);
    if (Number.isFinite(n) && n >= 1900 && n <= 9999) validYears.push(n);
  }
  if (validYears.length === 0) return [];

  const minYear = Math.min(...validYears);
  const maxYear = Math.max(...validYears, currentYear);

  const byYear = new Map<string, TimelineType[]>();
  for (const t of timelines) {
    const list = byYear.get(t.year) ?? [];
    list.push(t);
    byYear.set(t.year, list);
  }

  const out: TimescaleEntry[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    const yearStr = String(y);
    const entries = byYear.get(yearStr);
    if (entries && entries.length > 0) {
      // API returns rows sorted by `timeline.order` ascending — preserve that
      // so multiple entries on the same year read oldest-first.
      for (const e of entries) {
        out.push({
          kind: "entry",
          id: e.id,
          year: yearStr,
          title: e.title,
          description: e.description,
        });
      }
    } else {
      out.push({ kind: "empty", id: `__empty_${yearStr}`, year: yearStr });
    }
  }
  return out;
}

export default function TimelineView({
  timelines,
}: {
  timelines: TimelineType[];
}) {
  if (timelines.length === 0) {
    return (
      <div className="page-shell px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-muted-foreground">No timeline data yet.</p>
        </div>
      </div>
    );
  }

  const entries = buildTimescaleEntries(timelines, new Date().getFullYear());

  if (entries.length === 0) {
    return (
      <div className="page-shell px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-muted-foreground">No timeline data yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-20 space-y-20 overflow-x-hidden">
      <div className="mx-auto max-w-5xl space-y-16 px-6">
        <header className="space-y-2">
          <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Timeline
          </h2>
          <p className="text-sm max-w-prose text-muted-foreground/70">
            Notable moments, plotted along a single-axis timescale. Scroll
            horizontally to move through the years.
          </p>
        </header>
      </div>
      <div className="overflow-x-hidden w-full max-w-full">
        <TimescaleIntroScroll>
          <TimescaleRoot
            orientation="horizontal"
            className="w-full max-w-full scroll-fade overflow-x-hidden"
          >
            <TimescaleViewport className="max-w-full">
              <TimescaleTrack>
                <TimescaleRail />
                {entries.map((entry) =>
                  entry.kind === "empty" ? (
                    <TimescaleItem key={entry.id}>
                      <TimescaleTick />
                      <TimescaleYear>{entry.year}</TimescaleYear>
                    </TimescaleItem>
                  ) : (
                    <TimescaleItem key={entry.id}>
                      <TimescaleTick />
                      <TimescaleYear>{entry.year}</TimescaleYear>
                      <TimescaleContent className="space-y-4 typeset">
                        <p className="text-base mt-6">{entry.title}</p>
                        {entry.description && (
                          <div className="prose prose-base prose-invert text-muted-foreground">
                            <ReactMarkdown
                              components={{
                                a: ({ children, href }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:bg-primary hover:text-background text-muted-foreground underline"
                                  >
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {entry.description}
                            </ReactMarkdown>
                          </div>
                        )}
                      </TimescaleContent>
                    </TimescaleItem>
                  ),
                )}
              </TimescaleTrack>
            </TimescaleViewport>
          </TimescaleRoot>
        </TimescaleIntroScroll>
      </div>
    </div>
  );
}
