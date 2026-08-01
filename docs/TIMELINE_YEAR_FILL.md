# Timeline Year Fill

The `/timeline` page renders a horizontal "timescale" ruler (modeled on [chanhdai.com/components/timescale](https://chanhdai.com/components/timescale)). Each `TimelineType` row in the DB becomes a `TimescaleItem` with a tick on the rail, the year label, and a content card. Empty years — years that have no entry in the DB — are simply absent, which makes the ruler look broken whenever the data is sparse.

This document records how the rail is backfilled so that **every calendar year from the earliest real entry through the current calendar year** (or the latest real entry, whichever is greater) gets its own tick. Real entries still render their card; years with no entry render only a tick + the year label.

---

## Why backfill at render time, not in the DB

The admin form (`features/admin/components/timeline-section.tsx`) requires both `year` and `title` and the API route (`app/api/timelines/route.ts`) validates that neither is empty. The DB therefore never holds empty-year rows. Backfilling would be redundant in the DB — the empty years are a *display* concern, not a *data* concern, so the fill happens in the view component.

---

## Approach

A small inline helper in `features/timeline/components/timeline-view.tsx` turns `TimelineType[]` into a unified, ascending-sorted `TimescaleEntry[]` list that interleaves real entries with synthetic empty-year placeholders. The render loop branches on a `kind` discriminant to decide whether to mount a `TimescaleContent` card.

`TimescaleIntroScroll` (the auto-sweep-to-most-recent-on-mount effect) keeps working unchanged — the rightmost item is still the most recent year, so the auto-scroll still lands on the newest entry whether or not that year has content.

---

## Files modified

- `features/timeline/components/timeline-view.tsx` — the only file changed.

No changes to `lib/utils.ts`, `components/timescale.tsx`, the API route, the page wrapper, or the DB schema. The `TimelineType` shape and the `Timescale*` layout primitives are reused as-is.

---

## The helper

A discriminated union and a builder function, both defined at the top of `timeline-view.tsx`:

```ts
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
```

### Why this shape

- **Local to the file** — the helper is ~30 lines and used in exactly one place, so it doesn't graduate to a shared utility.
- **Stable React keys** — real entries use their DB id; empty years use `` `__empty_${year}` ``. The prefix makes them obviously synthetic and prevents collision with any real id format.
- **Grouped by year in a `Map`** — preserves the API's `asc(timeline.order)` ordering within a year, and makes the "real vs empty" decision O(1).
- **Defensive parsing** — `Number.isFinite` plus a 1900–9999 range guards against malformed year strings without rejecting 4-digit numbers.

---

## Component changes

1. Drop the now-unused `sortByYearAsc` helper.
2. Keep the existing `"No timeline data yet."` early-return for `timelines.length === 0` — a rail containing only the current year is unhelpful before any data is seeded.
3. Compute the unified list:
   ```ts
   const entries = buildTimescaleEntries(
     timelines,
     new Date().getFullYear(),
   );
   ```
4. Replace `sortedTimelines.map(...)` with a branched `entries.map(...)`:
   ```tsx
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
           <p className="text-sm font-medium text-foreground mt-4">
             {entry.title}
           </p>
           {entry.description && (
             <Markdown components={{ /* …unchanged… */ }}>
               {entry.description}
             </Markdown>
           )}
         </TimescaleContent>
       </TimescaleItem>
     ),
   )}
   ```
   The `Markdown` `components` map (`p` and `a` overrides) is preserved verbatim from the previous implementation.

The empty branch intentionally omits `TimescaleContent` entirely so the `TimescaleItem` collapses to its default `w-20` width — that's the ruler feel. The tick is rendered the same way for both kinds.

---

## Edge cases

- **Empty data** (`timelines.length === 0`): existing early-return path triggers before the helper runs and renders `"No timeline data yet."`.
- **Single entry** (e.g. one 2024 row, current year 2026): rail shows `2024 card → 2025 tick + label → 2026 tick + label`.
- **Multiple entries on the same year**: all render as real cards in `timeline.order` order; no empty placeholder is emitted for that year.
- **Malformed year strings** (e.g. `"abc"`, `""`): dropped from `min`/`max` computation. If *every* row is malformed, `validYears` is empty, the helper returns `[]`, and the existing empty state renders.
- **Future-dated entries** (e.g. a `"2030"` row): `maxYear = max(currentYear, latestEntryYear)` keeps the ruler continuous — empty ticks fill in between today and 2030 so the rail has no gap and the future card doesn't sit at a lonely right edge.
- **Reduced motion / `prefers-reduced-motion`**: `TimescaleIntroScroll` falls back to instant scroll to the rightmost item, which is the most recent year whether or not that year has content.
- **Sticky left header / `pl-20`**: the first item is always the earliest real entry, so the sticky header still covers the leftmost slot exactly as before.

---

## What was deliberately not changed

- **`lib/utils.ts`** — no shared year helper; the inline helper is small and single-purpose.
- **`components/timescale.tsx`** — primitives are layout-only and reusable; no new prop was needed.
- **DB schema** — the empty-year concept doesn't need to be persisted.
- **API route** — no server-side backfill; the year fill is a render concern.
- **Admin form** — already prevents empty rows; behavior unchanged.

---

## Verification

1. `npx tsc --noEmit` must pass clean.
2. `pnpm dev` and visit `/timeline`. Expected:
   - **One real entry in 2024, current year 2026:** rail renders `[2024 card → 2025 tick + label → 2026 tick + label]`. Each empty year sits at `w-20` with a tick on the rail.
   - **Auto-scroll:** the viewport still sweeps to the rightmost item on mount and respects `prefers-reduced-motion`.
   - **Future-dated entry** (a `"2030"` row): ruler extends to 2030 with empty ticks filling 2027–2029 and a card at 2030.
   - **Two rows on the same year:** both render as cards on that year; no empty placeholder for that year.
   - **No data at all:** existing `"No timeline data yet."` empty state shows.
   - **One malformed year row:** the helper drops it from the range. If the only row is malformed, the empty state shows.
