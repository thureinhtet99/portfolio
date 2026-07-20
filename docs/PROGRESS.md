# Implementation Progress — Design System Rollout

> **Read this first if you're resuming cold.** This file is the source of truth for
> what's actually done vs. planned. Update it _as you go_, not at the end — if a
> session/agent run gets cut off mid-task, the next session should be able to read
> this + the git log and know exactly where to pick up, with zero re-derivation.

**Reference doc:** `DESIGN_SYSTEM.md`
**Last updated:** 2026-07-20
**Current state:** 🟡 Phase 1 done; Phases 2–4 partially in; Phase 5 not started

---

## How to use this file

1. Before starting any step, move it to `In Progress` and note the date/session.
2. When a step is verified working (not just "code written" — actually checked in
   browser / build passes), check it off and commit with a message referencing the
   section number below.
3. If you stop mid-step, leave a one-line note under it: what's done, what's not,
   what you were about to do next. Don't rely on memory across sessions.
4. If a decision from `DESIGN_SYSTEM.md` §10 gets resolved, record the resolution
   here, not just in your head.

---

## What we just implemented (session 2026-07-20)

Landed in commit `496f52f refactor: restructure project components and data organization`.

**Phase 1 — CSS tokens & utility classes ✅ complete**

- `--accent-signal` / `--accent-signal-foreground` added to `:root` and `.dark` in
  `app/globals.css` (proposed hue `oklch(0.64 0.19 250)` is in — see Open Decisions
  for the eyeball check).
- Mapped `--color-accent-signal` / `--color-accent-signal-foreground` in
  `@theme inline` block.
- Added `.app-shell`, `.page-shell`, `.section-heading`, `.surface-panel`,
  `.surface-panel-muted` under `@layer components` — these were already being
  referenced from `SettingsSection.tsx`, `admin/page.tsx`, `HomeClientComponent.tsx`,
  etc. and were silently no-oping; that gap is now closed.
- Visual sanity check still owed (light + dark) — see Phase 5.

**Phase 3 — Motion standardization (partially complete)**

- Extracted `sectionReveal` and `cardReveal(index)` into `lib/motion.ts` (§6.2).
- `HomeClientComponent.tsx` and `features/projects/components/projects-view.tsx`
  now consume the helpers instead of inline `initial`/`animate` props.
- `useReducedMotion()` is imported in `HomeClientComponent.tsx` and
  `shouldReduceMotion` is computed, but the guard is **not yet wired into the
  scroll-down bounce or the status-dot ping** — that's a Phase 5 follow-up.

**Phase 4 — Component-specific rules (partially complete)**

- **GitHub Activity Widget** built (`features/home/components/github-activity-widget.tsx`)
  and mounted in the homepage (between hero and "Featured Projects").
  - Server-side fetch happens in `app/page.tsx`'s `getGithubEvents()` against
    `https://api.github.com/users/{username}/events/public` with
    `next: { revalidate: 60 * 30 }` (30 min revalidate).
  - Skeleton state: **not yet implemented** — the widget just renders a one-line
    "Activity unavailable" placeholder for empty arrays. The `Skeleton` component
    is imported but unused.
  - Failure state: present (quietly collapses to the "Activity unavailable"
    card) ✅.
  - Language bar: **not implemented** (only top-5 events shown, no language
    aggregation yet).
- **Status Footer** partially in place (`components/Footer.tsx`):
  - Monospace + `text-xs text-muted-foreground` ✅
  - `accent-signal` status dot ✅
  - Deploy hash from `VERCEL_GIT_COMMIT_SHA` ✅
  - View counter: hardcoded to `"4,213 views"` — **not yet wired to a real
    counter** (blocked on Open Decision #3 below).

**Project restructure ✅**

- `ProjectCredentialsPanel` + `ProjectShowcaseCard` moved under
  `features/projects/components/`.
- New `ProjectDetailModal` and `ProjectsView` composed in `features/projects/`.
- Project data moved to `features/projects/data/projects.ts`.
- Old `app/ProjectsClientComponent.tsx` + `app/certificates/...` and
  `data/projects.ts` removed.
- `app/projects/page.tsx` now a thin wrapper rendering `ProjectsView`.

---

## Docs fixed (session 2026-07-20)

- **AGENTS.md** — updated workflow and instructions to reflect actual project state.
- **CODING_GUIDELINES.md** — project structure tree rewritten to match actual filesystem.
- **PROJECT_MAP.md** — architecture, folder responsibilities, routing, and coding rules updated to reflect reality (no `(public)` route group, no `components/layout/` or `components/shared/` subdirectories, features only for `home` and `projects`, admin auth inline in page not layout).
- **DESIGN_SYSTEM.md** — updated implementation status, utility class definitions confirmed present in `globals.css`, component rules aligned with actual code.
- **PROGRESS.md** — this file, rewritten to reflect actual done vs not-done.
- **Broken import fixed** — `app/admin/components/ProjectSection.tsx` line 28: `@/components/project-credentials-panel` → `@/features/projects/components/project-credentials-panel`.

---

## Open Decisions (resolve before/while implementing — see DESIGN_SYSTEM.md §10)

- [ ] **Accent hue** — `oklch(0.64 0.19 250)` is wired in. **Needs eyeball check**
      against the pure black/white palette in light + dark before locking.
      If the hue reads "too blue" or "too violet" on cards, swap to a more
      neutral muted indigo. Record the resolution here when decided.
- [ ] **Location widget** — still a decision. Recommendation per design system:
      static illustrated pin. No code yet.
- [ ] **View counter storage** — **resolved for v1: use `setting` table with
      `siteViews` key.** Add a tiny increment on homepage render in `app/page.tsx`,
      read the value into `<Footer />` (which is currently a server component
      already). Defer per-page counts to a later phase.
- [ ] **Availability dot color** — currently `bg-green-500`/`bg-red-500`; should
      migrate to `accent-signal` to stay inside the two-tone system.

---

## Phase 1 — Foundation (CSS tokens & utility classes)

- [x] Add `--accent-signal` / `--accent-signal-foreground` to `:root` and `.dark` in `app/globals.css` (§2.1)
- [x] Map `--color-accent-signal` / `--color-accent-signal-foreground` in `@theme inline` block
- [x] Add `.app-shell`, `.page-shell`, `.section-heading`, `.surface-panel`, `.surface-panel-muted` under `@layer components` (§5)
- [x] Verify: grep the codebase for existing usages of these classes (`SettingsSection.tsx`, `admin/page.tsx`, `HomeClientComponent.tsx`) — confirm they now resolve instead of silently no-op-ing
- [ ] Visual sanity check in both light and dark mode

**Status notes:** Code is in. Open a browser, toggle theme, eyeball accent-signal
on the status footer dot, GitHub widget border, and admin "Admin Dashboard" panel.

---

## Phase 2 — Typography & spacing pass

- [x] Apply `tracking-[-0.02em]` to `-0.03em` standard to all headings ≥ `text-2xl` (§3.1) — partial coverage; audit: `admin/page.tsx` ✅, `ProjectDetailModal.tsx` ✅, `CertificateSection.tsx` ✅, `HomeClientComponent.tsx` ✅, `TimelineClientComponent.tsx` ✅
- [ ] Standardize `space-y-20` between homepage major sections — `HomeClientComponent.tsx` uses inline `mt-*`/`space-y-*` in some sections; sweep and replace
- [ ] Confirm `max-w-3xl` / `max-w-2xl` / `max-w-7xl` container rules applied consistently (§4.2) — currently `app/admin/page.tsx` uses `mx-auto w-full max-w-7xl` inline; swap to `app-shell`/`page-shell`
- [ ] Reserve `font-mono` usage to metadata only (dates, tags, future status footer) — `Footer.tsx` is the only intentional use; audit for accidental monospace elsewhere

**Status notes:** Tracking and `app-shell` swap are the highest-leverage items.

---

## Phase 3 — Motion standardization

- [x] Extract `sectionReveal` and `cardReveal` helpers (§6.2) into `lib/motion.ts` instead of inline per-component
- [x] Replace ad-hoc `initial`/`animate` props in `HomeClientComponent.tsx`, `ProjectsView.tsx` with the shared helpers
- [ ] Add `useReducedMotion()` guard around: scroll-down bounce indicator, availability status-dot ping (in `HomeClientComponent.tsx`, `shouldReduceMotion` is computed but not used)
- [ ] Manual check: toggle OS "reduce motion" setting, confirm ambient animations stop but content still renders

**Status notes:** The helpers exist; the `shouldReduceMotion` flag is declared
in `HomeClientComponent.tsx:49` but never read. Wire it into the two ambient
spots and we're done with Phase 3.

---

## Phase 4 — Component-specific rules (§7)

- [ ] **Hero**: availability dot only pings when `available === true` AND motion not reduced — currently the `animate-ping` is unconditional; needs `available && !shouldReduceMotion` guard
- [ ] **Hero**: cap CTA row at 2 primary buttons; add Resume CTA if not already present (promote out of any "More" pattern — see design-system §7.5)
- [x] **Project/Certificate cards**: confirm `aspect-video`, tag-chip cap at 4 + "+N more", hover scales image only (not whole card) — code looks right; visual confirmation owed
- [/] **New: GitHub Activity Widget**
  - [x] Server-side fetch (`/users/:username/events`) with revalidate caching
  - [ ] Skeleton state (3 shimmering rows, reuse existing `Skeleton` component) — `Skeleton` is imported but unused
  - [x] Failure state: collapses quietly, never renders a broken shell
  - [ ] Language bar using `accent-signal` at opacity steps, not per-language hues — not built; current widget shows top-5 events only
- [/] **New: Status footer**
  - [x] Monospace, single line, wraps to two on mobile
  - [x] Deploy hash from env var
  - [ ] View counter — depends on Open Decision above being resolved; **decision made, needs implementation** (read from `setting` table key `siteViews`, increment on homepage render)

**Status notes:** Widget and footer are functionally in place; polish items
(skeleton, language bar, real view counter, conditional ping) are what's left.

---

## Phase 5 — Accessibility pass (§8 checklist, run against everything touched above)

- [ ] Contrast checked light + dark for every new/changed component
- [ ] All ambient motion gated behind `useReducedMotion()`
- [ ] Live/async widgets have both skeleton and failure states
- [ ] Keyboard reachability + visible focus ring on all new interactive elements
- [ ] Alt text audit (meaningful vs. decorative) on any new images
- [ ] Status footer: dot + text label together, not color alone

**Status notes:**

---

## Explicitly Out of Scope (don't accidentally build these)

- Theme-family / accent-color picker UI
- User-facing background-effect toggle
- Click counter / webring novelty widgets

---

## Session Log

_One line per work session — timestamp, what got done, what's next. This is the
cheapest possible insurance against losing context._

- `2026-07-20` — Phase 1 (CSS tokens + utility classes) shipped. `lib/motion.ts` extracted and consumed by home + projects views. GitHub Activity Widget built and mounted server-side. Status footer landed with hardcoded view counter. All 5 docs (AGENTS.md, CODING_GUIDELINES.md, PROJECT_MAP.md, DESIGN_SYSTEM.md, PROGRESS.md) rewritten to match actual codebase state. Broken import in `ProjectSection.tsx` fixed. **Next:** eyeball accent-signal in light + dark, wire `useReducedMotion()` into the hero ping and scroll bounce, add Skeleton state to the GitHub widget, replace the hardcoded view counter with a real `setting` table read/write, migrate availability dot from green/red to accent-signal. Then Phase 2 container swaps (`app-shell`/`page-shell`) and Phase 5 a11y pass.
- `YYYY-MM-DD` — _(example)_ Started Phase 1, added CSS tokens, not yet visually verified in dark mode. Next: verify + commit.
