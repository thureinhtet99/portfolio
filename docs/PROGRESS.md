# Implementation Progress

> **For AI agents:** Read this file first when resuming work. It tells you exactly
> what's done, what's not, and what to do next. Cross-reference with git log for
> commit context.

**Reference:** `DESIGN_SYSTEM.md` · **Last updated:** 2026-07-20 · **Repo version:** v3

---

## Status Dashboard

```
Phase 1 — Foundation (CSS tokens)        ████████████ 100%  ✅ Complete
Phase 2 — Typography & Spacing           ████████████ 100%  ✅ Complete
Phase 3 — Motion Standardization         ████████████ 100%  ✅ Complete
Phase 4 — Component Rules                ████████████ 100%  ✅ Complete
Phase 5 — Accessibility                  ██████░░░░░░  50%  🟡 Partial
Phase 6 — v3 Structural Migration        ░░░░░░░░░░░░   0%  ⬜ Not started
```

---

## What Each Phase Did

### Phase 1 — Foundation ✅

Added CSS design tokens and utility classes that all downstream work depends on.

| Item                                                                                          | Status | File                          |
| --------------------------------------------------------------------------------------------- | ------ | ----------------------------- |
| `--accent-signal` / `--accent-signal-foreground` in `:root` + `.dark`                         | ✅     | `app/globals.css:49-50,86-87` |
| Mapped in `@theme inline`                                                                     | ✅     | `app/globals.css:127-128`     |
| `.app-shell` / `.page-shell` / `.section-heading` / `.surface-panel` / `.surface-panel-muted` | ✅     | `app/globals.css:140-155`     |
| Verify existing usages resolve                                                                | ✅     | grep confirmed                |
| Visual sanity check (light + dark)                                                            | ⬜     | **Needs browser**             |

### Phase 2 — Typography & Spacing ✅

Standardized type scale, tracking, and container widths.

| Item                                                             | Status | File                                       |
| ---------------------------------------------------------------- | ------ | ------------------------------------------ |
| `tracking-[-0.02em]` to `[-0.03em]` on all headings ≥ `text-2xl` | ✅     | audited 5 files                            |
| `app-shell` swap in `admin/page.tsx`                             | ✅     | `app/admin/page.tsx:170`                   |
| `space-y-20` between homepage sections                           | ✅     | handled by `page-shell` class              |
| `font-mono` reserved for metadata only                           | ✅     | Footer, credentials panel, admin textareas |

### Phase 3 — Motion ✅

Standardized Framer Motion usage across the site.

| Item                                                 | Status | File                                                               |
| ---------------------------------------------------- | ------ | ------------------------------------------------------------------ |
| `sectionReveal` + `cardReveal` extracted             | ✅     | `lib/motion.ts`                                                    |
| Shared helpers consumed by home + projects + contact | ✅     | `HomeClientComponent.tsx`, `projects-view.tsx`, `contact/page.tsx` |
| `useReducedMotion()` wired into scroll bounce        | ✅     | `HomeClientComponent.tsx:148`                                      |
| `useReducedMotion()` wired into status-dot ping      | ✅     | `HomeClientComponent.tsx:97`                                       |
| Manual check (toggle OS reduce motion)               | ⬜     | **Needs browser**                                                  |

### Phase 4 — Components ✅

Built and polished homepage widgets and card patterns.

| Item                                                                   | Status | File                                                                        |
| ---------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| Hero availability dot → `accent-signal` / `muted-foreground/50`        | ✅     | `HomeClientComponent.tsx:97-103`                                            |
| Hero CTA row: Get in Touch + Book a Chat + View Resume                 | ✅     | `HomeClientComponent.tsx:108-140`                                           |
| Booking URL support (`bookingUrl` setting)                             | ✅     | `app/page.tsx`, `HomeClientComponent.tsx`                                   |
| Location widget — "Currently Based In" with accent-signal pin          | ✅     | `HomeClientComponent.tsx:91-97`                                             |
| Project cards: `aspect-video`, tag cap 4 + "+N more", hover image-only | ✅     | `project-showcase-card.tsx`                                                 |
| GitHub Activity Widget: server-side fetch + revalidate                 | ✅     | `app/page.tsx:49-71`, `features/home/components/github-activity-widget.tsx` |
| GitHub Activity Widget: language bar with accent-signal opacity steps  | ✅     | `features/home/components/github-activity-widget.tsx`                       |
| GitHub Activity Widget: failure state                                  | ✅     | collapses to "Activity unavailable"                                         |
| Status footer: monospace, accent dot, deploy hash, real view counter   | ✅     | `components/Footer.tsx`                                                     |
| Breadcrumbs navigation (terminal aesthetic)                            | ✅     | `components/breadcrumbs.tsx`, `app/layout.tsx`                              |
| External credibility links section ("Find Me On")                      | ✅     | `HomeClientComponent.tsx:312-355`                                           |
| Social links props (github, linkedin, facebook)                        | ✅     | `app/page.tsx`, `HomeClientComponent.tsx`                                   |

### Phase 5 — Accessibility 🟡

Final a11y pass. Some items require browser testing.

| Checklist item                                       | Status |
| ---------------------------------------------------- | ------ |
| Contrast checked light + dark                        | ⬜     |
| All ambient motion gated behind `useReducedMotion()` | ✅     |
| Live/async widgets have failure states               | ✅     |
| Keyboard reachability + visible focus ring           | ⬜     |
| Alt text audit                                       | ⬜     |
| Status footer: dot + text, not color alone           | ✅     |
| Breadcrumbs: semantic `<nav>` + `aria-label`         | ✅     |

---

### Phase 6 — v3 Structural Migration ⬜

Migrates the codebase from the structure documented in `PROJECT_MAP.md` (current/v2) to
the target structure documented in `CODING_GUIDELINES.md` (v3 — features extraction for
certificates/timeline/admin, `components/layout/`, `components/shared/`,
`app/(public)/` route group). `PROJECT_MAP.md`'s tree is **not** yet accurate to
`CODING_GUIDELINES.md`'s — that gap is this phase's job to close.

**Do this feature-by-feature, not all at once.** For each row: move the file(s), fix
every import referencing the old path, run the type check, confirm zero errors, then
move on.

| Item                                                        | Status | Notes                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §1 Pre-flight: resolve the two conflicting-docs items above | ⬜     | Blocks everything else in this phase — do first                                                                                                                                                                                                                                                                           |
| `certificates` feature extraction                           | ⬜     | `app/certificates/CertificatesClientComponent.tsx` → `features/certificates/components/certificates-view.tsx`; `data/certificates.ts` → `features/certificates/data/certificates.ts`; `app/certificates/page.tsx` becomes thin wrapper                                                                                    |
| `timeline` feature extraction                               | ⬜     | `app/timeline/TimelineClientComponent.tsx` → `features/timeline/components/timeline-view.tsx`; `data/experiences.ts` → `features/timeline/data/experiences.ts`; `app/timeline/page.tsx` becomes thin wrapper                                                                                                              |
| `admin` feature extraction                                  | ⬜     | `app/admin/page.tsx` dashboard body → `features/admin/components/admin-view.tsx` (auth-gate stays inline in `app/admin/page.tsx` per `PROJECT_MAP.md` §9 rule 7); 4 admin section components → `features/admin/components/*-section.tsx` (kebab-case); `data/admin/menu-items.tsx` → `features/admin/data/menu-items.tsx` |
| `home` feature rename                                       | ⬜     | `app/HomeClientComponent.tsx` → `features/home/components/home-view.tsx`                                                                                                                                                                                                                                                  |
| Shared component reorg                                      | ⬜     | `top-navbar.tsx`, `TopNavbarWrapper.tsx`, `Footer.tsx`, `theme-toggle.tsx`, `theme-provider.tsx` → `components/layout/`; `DeleteConfirmBox.tsx`, `QueryProvider.tsx` → `components/shared/`. `components/ui/*` does not move.                                                                                             |
| `lib/` consolidation                                        | ⬜     | Merge `utils/formate-date.ts` into `lib/utils.ts`, delete `utils/` folder, repoint every call site (no re-export shim — that's still an orphan per the no-duplicate-logic rule)                                                                                                                                           |
| Route grouping                                              | ⬜     | `app/page.tsx`, `loading.tsx`, `not-found.tsx`, `contact/`, `projects/`, `certificates/`, `timeline/` → move under `app/(public)/`. `app/admin/` and `app/api/` stay outside the group. Route groups don't change URLs — test every public route anyway.                                                                  |
| Verification pass                                           | ⬜     | `tsc --noEmit` clean, lint clean, every route in `PROJECT_MAP.md` §5 loads, `grep` for any import still pointing at an old path                                                                                                                                                                                           |
| Rewrite `PROJECT_MAP.md`                                    | ⬜     | Once migration is done, `PROJECT_MAP.md`'s folder table + "Feature Flow" section should describe the same tree `CODING_GUIDELINES.md` describes — that's what makes this phase "done"                                                                                                                                     |

**docs/ folder note:** `CODING_GUIDELINES.md`'s tree only lists
`docs/CODING_GUIDELINES.md` and `docs/PROJECT_MAP.md` — treat that as an incomplete
snapshot, not an instruction to delete `DESGIN_SYSTEM.md`, `PROGRESS.md`, or
`References.md`. Keep all five.

---

## Open Decisions

| Decision                            | Status     | Resolution                                                                                                                                                                    |
| ----------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accent hue (`oklch(0.64 0.19 250)`) | ⏳ pending | Needs eyeball check in light + dark                                                                                                                                           |
| Location widget                     | ✅ resolved | Static "Currently Based In" display with accent-signal pin (implemented in S4)                                                                                                |
| View counter storage                | ✅ resolved | `setting` table `siteViews` key (implemented in S2)                                                                                                                           |
| Availability dot color              | ✅ resolved | `accent-signal` for available, `muted-foreground/50` for unavailable (verified in source, implemented in S2)                                                                  |

---

## What to Do Next

**In order of priority:**

1. **Visual check** — open browser, toggle light/dark, verify accent-signal looks right on status dot, GitHub widget, admin panel
2. **Phase 5 a11y** — contrast check, keyboard nav, alt text
3. **Phase 6 — v3 structural migration** — see Phase 6 section above; do this after Phases 1–5 are fully closed out, not in parallel

---

## Out of Scope

Don't build these unless explicitly asked:

- Theme-family / accent-color picker
- Background-effect toggle
- Click counter / webring widgets

---

## Session History

| Date       | Session | Changes                                                                                                                                                                      |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-20 | S1      | Phase 1 complete. `lib/motion.ts` extracted. GitHub widget built. Footer with hardcoded view counter. All 5 docs rewritten. Broken import fixed.                             |
| 2026-07-20 | S2      | Phase 2 container swap. Phase 3 motion verified. Phase 4 availability dot + view counter wired.                                                                              |
| 2026-07-20 | S3      | Phase 2 font-mono audit done. Contact page uses shared motion helpers. Added "Book a Chat" CTA with `bookingUrl` setting. Added breadcrumbs navigation (terminal aesthetic). |
| 2026-07-20 | S4      | Added GitHub language bar with accent-signal opacity steps. Enhanced location widget ("Currently Based In"). Added "Find Me On" section with social links. |
