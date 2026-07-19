# Implementation Progress — Design System Rollout

> **Read this first if you're resuming cold.** This file is the source of truth for
> what's actually done vs. planned. Update it _as you go_, not at the end — if a
> session/agent run gets cut off mid-task, the next session should be able to read
> this + the git log and know exactly where to pick up, with zero re-derivation.

**Reference doc:** `DESIGN_SYSTEM.md`
**Last updated:** _(update this line every time you touch this file)_
**Current state:** 🔴 Not started

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

## Open Decisions (resolve before/while implementing — see DESIGN_SYSTEM.md §10)

- [ ] **Accent hue** — proposed `oklch(0.64 0.19 250)`. Confirmed / changed to: **\_\_**
- [ ] **Location widget** — real map embed vs. static pin. Decision: **\_\_**
- [ ] **View counter storage** — `setting` table key vs. dedicated table. Decision: **\_\_**

---

## Phase 1 — Foundation (CSS tokens & utility classes)

_Nothing else should start until this phase is done — everything downstream depends on these classes existing._

- [ ] Add `--accent-signal` / `--accent-signal-foreground` to `:root` and `.dark` in `app/globals.css` (§2.1)
- [ ] Map `--color-accent-signal` / `--color-accent-signal-foreground` in `@theme inline` block
- [ ] Add `.app-shell`, `.page-shell`, `.section-heading`, `.surface-panel`, `.surface-panel-muted` under `@layer components` (§5)
- [ ] Verify: grep the codebase for existing usages of these classes (`SettingsSection.tsx`, `admin/page.tsx`, `HomeClientComponent.tsx`) — confirm they now resolve instead of silently no-op-ing
- [ ] Visual sanity check in both light and dark mode

**Status notes:** _(leave breadcrumbs here if interrupted)_

---

## Phase 2 — Typography & spacing pass

- [ ] Apply `tracking-[-0.02em]` to `-0.03em` standard to all headings ≥ `text-2xl` (§3.1) — audit: `admin/page.tsx`, `ProjectDetailModal.tsx`, `CertificateSection.tsx`, `HomeClientComponent.tsx`, `TimelineClientComponent.tsx`
- [ ] Standardize `space-y-20` between homepage major sections
- [ ] Confirm `max-w-3xl` / `max-w-2xl` / `max-w-7xl` container rules applied consistently (§4.2)
- [ ] Reserve `font-mono` usage to metadata only (dates, tags, future status footer) — audit for accidental monospace elsewhere

**Status notes:**

---

## Phase 3 — Motion standardization

- [ ] Extract `sectionReveal` and `cardReveal` helpers (§6.2) into a shared `lib/motion.ts` (or similar) instead of inline per-component
- [ ] Replace ad-hoc `initial`/`animate` props in `HomeClientComponent.tsx`, `TimelineClientComponent.tsx`, `ProjectsClientComponent.tsx` with the shared helpers
- [ ] Add `useReducedMotion()` guard around: scroll-down bounce indicator, availability status-dot ping
- [ ] Manual check: toggle OS "reduce motion" setting, confirm ambient animations stop but content still renders

**Status notes:**

---

## Phase 4 — Component-specific rules (§7)

- [ ] **Hero**: availability dot only pings when `available === true` AND motion not reduced
- [ ] **Hero**: cap CTA row at 2 primary buttons; add Resume CTA if not already present (promote out of any "More" pattern — see design-system §7.5)
- [ ] **Project/Certificate cards**: confirm `aspect-video`, tag-chip cap at 4 + "+N more", hover scales image only (not whole card)
- [ ] **New: GitHub Activity Widget**
  - [ ] Server-side fetch (`/users/:username/events`, `/users/:username`) with revalidate caching
  - [ ] Skeleton state (3 shimmering rows, reuse existing `Skeleton` component)
  - [ ] Failure state: collapses quietly, never renders a broken shell
  - [ ] Language bar using `accent-signal` at opacity steps, not per-language hues
- [ ] **New: Status footer**
  - [ ] Monospace, single line, wraps to two on mobile
  - [ ] Deploy hash from env var
  - [ ] View counter — depends on Open Decision above being resolved first

**Status notes:**

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

- `YYYY-MM-DD` — _(example)_ Started Phase 1, added CSS tokens, not yet visually verified in dark mode. Next: verify + commit.
