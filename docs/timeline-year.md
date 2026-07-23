# Feature: year timeline rail for the Experiences section

## Goal

Add a vertical year rail on the left side of the Experiences section in `/home-view`. The rail shows the years covered by the experience entries. As entries expand or collapse, the rail segment next to that entry grows or shrinks to match, so the rail visually tracks the height of the content beside it instead of staying a fixed straight line.

## Where this lives

- Page: `app/(public)/page.tsx`
- View: `features/home/components/home-view.tsx`
- Data: `features/timeline/data/experiences.ts`
- Admin equivalent (for reference on data shape only, do not change admin UI): `features/admin/components/timeline-section.tsx`

Inspect `timeline-view.tsx` before writing code for the current markup/animation setup — this doc describes desired behavior, not the current implementation.

## Actual data shape (`experiences.ts`)

```ts
type ExperienceItemType = {
  id: string;
  companyName: string;
  companyLogo: string;
  companyWebsite: string;
  positions: {
    id: string;
    title: string;
    employmentPeriod: { start: string; end: string }; // e.g. "08.2024" / "2023" — mixed formats: MM.YYYY or YYYY
    employmentType: string; // "Remote" | "Intern" | etc.
    description: string; // markdown-ish: intro paragraph + "\n\n- bullet\n- bullet"
    skills: string[];
    isExpanded: boolean;
  }[];
};
```

Notes for the agent:

- `employmentPeriod.start` / `.end` are strings in mixed formats (`"08.2024"` vs `"2023"`). Year extraction must handle both — take the last 4 digits of the string, don't assume a fixed format or split on `.`.
- A company (`experiences[n]`) can have multiple `positions`, each with its own period — the rail must account for a company block potentially spanning multiple positions/years, not just one row per company.
- `isExpanded` already exists on each position. Confirm in `timeline-view.tsx` whether this is used as the initial state for local component state, or read directly as the source of truth on every render — the rail's height-sync approach depends on which.
- Years for the rail = the set of years covered by `start`–`end` across all positions, deduped, sorted descending (most recent first), matching current entry order.

## Current behavior (see reference screenshot)

- Each experience is a card with a leading bullet/avatar, a company name, role, date range, tags, and an optional expand/collapse chevron on the right for entries with bullet-point details (e.g. the "Test / Web Developer" entry).
- There is currently no left-hand timeline rail — entries just stack vertically with a small dot/avatar next to each title.

## Desired behavior

### 1. Year rail

- Add a vertical rail to the left of the experience list, aligned with each entry's leading dot/avatar.
- The rail is built from the distinct years present in `experiences.ts` (derived from `startDate`/`endDate`, or whatever the actual field names are), rendered top to bottom, most recent year first (matching current entry order).
- Each year label sits at the point on the rail closest to the entries that occurred in that year.
- A continuous line connects the years, visually similar to a changelog/git-history rail.

### 2. Expand / collapse sync

- Each experience entry that has a collapsible detail section (bullet points, as seen in the "Test" entry) already has a chevron toggle.
- When an entry is expanded, the rail segment running alongside that entry's card should extend/grow in height to match the taller card.
- When collapsed, that segment shrinks back down.
- This should be a smooth height animation (project already uses Framer Motion via `lib/motion.ts` — reuse existing motion variants/transition config rather than introducing a new animation library).
- The rail's year labels should not jump or overlap during the transition — only the connecting line segment length changes, not the label position relative to its own entry.

### 3. Interaction

- Clicking a year label on the rail scrolls the matching entry into view (smooth scroll, respecting `prefers-reduced-motion`).
- Hovering a year label can highlight the corresponding rail segment and entry (nice-to-have, not required).

### 4. Layout

- Rail width should be small and fixed (e.g. 48–64px), sitting to the left of the existing entry column, inside the same container that currently holds the "Experiences" heading and list — do not change the page's outer max-width/grid.
- On mobile / narrow viewports, hide the rail (or collapse it to just the connecting line with no year labels) rather than squeezing the layout — follow existing responsive breakpoints used elsewhere in the codebase (check `hooks/use-mobile.ts` for the existing mobile breakpoint hook instead of introducing a new one).

## Implementation notes

- New component suggestion: `features/timeline/components/timeline-year-rail.tsx`, receiving the list of experiences (or pre-grouped by year) and the current expanded/collapsed state per entry as props, so it can compute segment heights.
- Segment height per year = sum of the rendered heights of the position rows for that year (a single company card can contribute to more than one year segment if it has multiple positions or a period spanning years). This will naturally change as a position expands/collapses. Achieve this either by:
  - Measuring entry card heights with `ResizeObserver` / a ref per card and reading `offsetHeight`, or
  - Driving both the card and its adjacent rail segment from the same shared `AnimatePresence`/height animation state in the parent `timeline-view.tsx`, so they animate in lockstep instead of the rail reacting after the fact.
- Keep expand/collapse state where it already lives today (likely local state per entry in `timeline-view.tsx`) — don't introduce global state for this unless the current implementation already uses one.
- Respect the existing dark, monospace-flavored visual style (see `DESIGN_SYSTEM.md`) — thin 1px line, muted color for the line itself, slightly brighter color for the active/current year.

## Acceptance criteria

- [ ] A vertical year rail renders to the left of the Experiences list, showing each distinct year from the data.
- [ ] Expanding a collapsible entry smoothly grows the adjacent rail segment; collapsing shrinks it back, with no layout jump or overlap.
- [ ] Clicking a year label scrolls the corresponding entry into view.
- [ ] Rail is hidden or gracefully simplified on mobile widths.
- [ ] No changes to the admin timeline editor (`features/admin/components/timeline-section.tsx`) unless the data shape itself needs a field added (e.g. explicit year), in which case update both the admin form and the public view consistently.
- [ ] Animation reuses existing Framer Motion setup rather than adding a new dependency.

## Out of scope

- Reordering or editing how experience data is stored beyond what's needed to derive years.
- Redesigning the entry cards themselves (bullet layout, tags, chevron) — only the new rail and its sync with expand/collapse.
