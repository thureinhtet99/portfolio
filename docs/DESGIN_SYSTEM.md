# Design System.md

**Status:** Active — Phase 1 complete, Phases 2–4 partially in progress
**Stack:** Next.js 15 · Tailwind v4 · shadcn/ui (new-york) · Framer Motion
**Scope:** Visual/aesthetic overhaul only. No accent-color picker, no theme-family switcher (Catppuccin-style), **no light/dark toggle either** — the site is locked to a single fixed dark theme. `next-themes`, `components/providers/theme-provider.tsx`, and `components/layout/theme-toggle.tsx` are removed.

This document is the single source of truth for spacing, type, color, motion, and component rules across the site. Every new component or page should be checkable against this file.

---

## 1. Design Principles

1. **One voice, not a theme picker — and not a toggle either.** `References.md` (our jasoncameron.dev-inspired feature spec) proposes a runtime theme/accent picker; an earlier version of this document countered with "keep light/dark, nothing more." We've since gone one step further: the site locks to a **single fixed dark theme**, no visitor-facing toggle at all. See §9 below.
2. **Content is the hero, chrome is quiet.** Cards, borders, and shadows exist to organize, not decorate. Prefer whitespace over borders where possible.
3. **Motion signals hierarchy, not decoration.** Every animation should communicate "this is new," "this is now in focus," or "this responds to you" — never motion for its own sake.
4. **Everything degrades to plain text.** Live widgets (GitHub activity, view counter, map) must have a calm skeleton/fallback state. Nothing should block first paint.
5. **Terminal-adjacent, not terminal-cosplay.** We can borrow structural ideas (breadcrumb trail, status footer, monospace accents for metadata) without adopting the full hacker aesthetic — this is a professional/backend-leaning portfolio, not a novelty site.

---

## 2. Color System

Keep the existing two-token architecture in `app/globals.css` (`--white` / `--dark-gray` driving all semantic tokens via oklch), but collapse it to a **single fixed dark theme** — remove the `.dark` class split; the values that used to live under `.dark` become the only values, applied directly on `:root`. Do **not** add a third brand hue as a global switchable variable. Instead, keep the single **fixed accent** used sparingly for interactive/emphasis moments (links-as-buttons, active nav state, status dot, chart bar). This gives visual life without becoming a "pick your vibe" feature.

**Migration note:** delete the `.dark { ... }` block in `app/globals.css` entirely and move its values into `:root`. Delete `components/providers/theme-provider.tsx` (the `next-themes` wrapper), `components/layout/theme-toggle.tsx`, and the `next-themes` dependency from `package.json`. Remove `<ThemeProvider>` from `app/layout.tsx` and the `ModeToggle` control from the nav.

### 2.1 Accent (implemented)

Accent token, fixed on `:root` in `app/globals.css` (dark-mode value only — the light-mode value is dropped):

```css
:root {
  --accent-signal: oklch(
    0.72 0.17 250
  ); /* muted blue-violet, tuned for dark bg */
  --accent-signal-foreground: oklch(0.15 0 0);
}
```

Mapped in `@theme inline` as `--color-accent-signal` and `--color-accent-signal-foreground`.

**Usage rules for `accent-signal`:**

- Active nav link underline/indicator
- "Available for work" status dot (replacing the current green/red ping)
- GitHub language-bar segments (one hue per language via opacity steps, not separate hues)
- Primary link hover state inside prose (`aboutMe` / `intro` markdown)
- Focus rings can stay on `--ring` (already white on the fixed dark background) — don't overload the accent

**Do not** use the accent for: buttons (keep `bg-primary`), card backgrounds, or borders. It's a pointer, not a fill.

**Status:** Token is wired in. **Needs eyeball check** against the fixed dark background before locking (single-mode check now — no light variant to verify against).

### 2.2 Semantic token table (existing, documented for reference)

| Token                            | Fixed value         | Use                     |
| -------------------------------- | ------------------- | ----------------------- |
| `background` / `foreground`      | dark-gray / white   | Page base               |
| `card` / `card-foreground`       | dark-gray / white   | Card surfaces           |
| `primary` / `primary-foreground` | white / dark-gray   | Buttons, active states  |
| `muted-foreground`               | white (translucent) | Secondary text          |
| `border` / `input` / `ring`      | white               | Structural lines, focus |

Opacity is the primary tool for hierarchy here (e.g. `text-muted-foreground/70`, `border-border/70`, `bg-card/92`) — this is already the pattern in `card.tsx` and `button.tsx`. **Standardize** on these opacity steps sitewide: `/10`, `/20`, `/60`, `/70`, `/80`, `/92`. Don't introduce arbitrary values like `/13` or `/55`.

---

## 3. Typography

**Font:** Inter (already loaded as `--font-inter` via `next/font/google`), monospace fallback `Geist_Mono` reserved for _metadata only_ (timestamps, commit hashes, status footer, tag chips) — this is the one deliberate nod to the dev-terminal aesthetic, used surgically rather than site-wide.

### 3.1 Type scale

| Role                                 | Class stack                                                         | Notes                                    |
| ------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------- |
| Hero name/title                      | `text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em]` | One per page, homepage only              |
| Section heading (`.section-heading`) | `text-3xl sm:text-4xl font-bold tracking-[-0.03em]`                 | Defined as reusable utility class        |
| Card title                           | `text-lg sm:text-xl font-semibold tracking-[-0.02em]`               |                                          |
| Body / prose                         | `text-base sm:text-lg leading-relaxed text-muted-foreground`        | Markdown-rendered about/intro            |
| Small / meta                         | `text-xs sm:text-sm text-muted-foreground`                          | Dates, tags, captions                    |
| Monospace meta                       | `font-mono text-xs text-muted-foreground`                           | Commit hashes, status footer, timestamps |

**Tracking rule:** anything ≥ `text-2xl` gets `tracking-[-0.02em]` to `tracking-[-0.03em]` (already used in `admin/page.tsx`, `ProjectDetailModal`, `CertificateSection`, `HomeClientComponent`).

### 3.2 Line-length

Prose blocks (`aboutMe`, `intro`) should stay `max-w-3xl` (already correct in `HomeClientComponent`) — don't let markdown content stretch full-width on large screens.

---

## 4. Spacing & Layout

### 4.1 Grid rhythm

- Page-level vertical rhythm: `space-y-20` between major homepage sections (hero → about → projects) — applied via `.page-shell` class.
- Section internal padding: `px-6 py-14 sm:px-10` for full-bleed panels.
- Card internal padding: keep shadcn defaults (`py-6`, `px-6` via `CardHeader`/`CardContent`) — don't override per-component.

### 4.2 Container widths

| Context                   | Max width                                         |
| ------------------------- | ------------------------------------------------- |
| App shell (nav, footer)   | `max-w-7xl` — via `.app-shell` class              |
| Page shell                | `max-w-7xl` with `space-y-20` — via `.page-shell` |
| Prose / contact form      | `max-w-2xl`                                       |
| Reading content (about)   | `max-w-3xl`                                       |
| Project/certificate grids | `max-w-7xl`, 2-col on `lg:`                       |

### 4.3 Radius

Current `--radius: 0.625rem` (10px) is good — keep it as the single radius token. Card override to `rounded-[1.5rem]` (24px) creates a nice soft, editorial feel for primary content cards; **use this only for top-level Cards** (project cards, certificate cards, the hero card). Nested/inner elements (badges, buttons, inputs) stay on the smaller shadcn defaults (`rounded-md`/`rounded-xl`). Don't let radius escalate — max two radius sizes visible in any single component.

---

## 5. Elevation & Surface

Two elevation levels only:

1. **Flat** — text sections, no card, no shadow (about, contact intro copy)
2. **Panel** — `bg-card/92 border border-border/70 shadow-[0_18px_50px_-38px_rgba(34,34,34,0.38)] backdrop-blur-sm rounded-[1.5rem]` (already the `Card` default) — used for every discrete content block: project cards, certificate cards, the GitHub activity widget, the status footer strip.

Don't invent a third shadow value. If something needs to feel "more important," use size/spacing/position (e.g. full-bleed hero panel) rather than a heavier shadow.

**Utility classes** (defined in `app/globals.css` `@layer components`):

```css
.app-shell {
  @apply mx-auto w-full max-w-7xl;
}
.page-shell {
  @apply mx-auto w-full max-w-7xl space-y-20;
}
.section-heading {
  @apply text-3xl font-bold tracking-[-0.03em] sm:text-4xl;
}
.surface-panel {
  @apply rounded-[1.5rem] border border-border/70 bg-card/92 text-card-foreground shadow-[...] backdrop-blur-sm;
}
.surface-panel-muted {
  @apply rounded-[1.25rem] border border-border/40 bg-background/80;
}
```

All five classes are defined and actively used across `HomeClientComponent`, `admin/page.tsx`, `SettingsSection`, etc.

---

## 6. Motion

Framer Motion is already a dependency — standardize usage instead of ad-hoc `initial`/`animate` props per component.

### 6.1 Motion tokens

| Token           | Value                                                                | Use                                       |
| --------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| `duration-fast` | `0.2s`                                                               | Hover states, toggles                     |
| `duration-base` | `0.4–0.5s`                                                           | Section reveal on scroll                  |
| `duration-slow` | `1.5s`                                                               | Ambient/looping (scroll indicator bounce) |
| `ease`          | Framer default spring for interactive; `easeInOut` for ambient loops |                                           |
| `stagger`       | `0.08–0.1s` per item                                                 | Lists (achievements, tech badges)         |

### 6.2 Standard patterns (implemented in `lib/motion.ts`)

```tsx
// Section reveal — used for every major section
const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// Card grid stagger
const cardReveal = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: index * 0.08 },
});
```

**Status:** Helpers extracted and consumed by `HomeClientComponent` and `projects-view.tsx`.

**Reduced motion:** `shouldReduceMotion` is computed in `HomeClientComponent` but **not yet wired** into the scroll-down bounce or the status-dot ping — that's a Phase 5 follow-up.

---

## 7. Component-Specific Rules

### 7.1 Hero (homepage)

- One `h1` for name, one supporting line for role (typing animation currently commented out — `Software developer` is static text).
- Availability indicator: `available && !shouldReduceMotion` guard is in place for the ping animation. **Color status disputed** — this section says still `bg-green-500`/`bg-red-500`, but `PROGRESS.md`'s Open Decisions table says already migrated to `accent-signal`. Read `HomeClientComponent.tsx:93-99` directly to settle it, then fix whichever doc is wrong. Should end up on `accent-signal` per §2.1 either way.
- CTA row: 2 buttons — "Get in Touch" (primary) and "View Resume" (outline, conditional on resume data). Matches the 2-CTA rule.

### 7.2 Project / Certificate Cards

- Image aspect ratio locked to `aspect-video` (already correct in `project-showcase-card.tsx`).
- Tag chips: `Badge` variant `secondary`, max 4 visible + "+N more" (implemented — `techLimit={4}` prop).
- Hover: `hover:shadow-[...]` + `hover:scale-[1.05]` on image only, never the whole card.

### 7.3 GitHub Activity Widget (implemented)

- Lives on homepage between hero and "Featured Projects".
- Server-side fetch in `app/page.tsx` with `next: { revalidate: 60 * 30 }` (30 min).
- Empty state: renders "Activity unavailable" text (no Skeleton shimmer yet).
- Failure state: collapses to empty array, widget shows "Activity unavailable" ✅.
- Language bar: **not yet implemented** — only top-5 events shown.
- **TODO:** Add `Skeleton` shimmer state while loading.

### 7.4 Status Footer (implemented)

- `components/Footer.tsx` — server component.
- Format: `● All systems nominal · {commitHash} · 4,213 views` — monospace, single line.
- Status dot uses `bg-[var(--accent-signal)]` ✅.
- Deploy hash from `VERCEL_GIT_COMMIT_SHA` ✅.
- View counter: **status disputed** — this section says hardcoded to "4,213 views", but `PROGRESS.md`'s Open Decisions table says already wired to the `setting` table `siteViews` key. Read `Footer.tsx` and `app/api/settings/route.ts` directly to settle it, then fix whichever doc is wrong.

### 7.5 Resume CTA

- Placed as secondary button in hero row, icon (`HardDriveDownload`) + label, same treatment as "Get in Touch". Conditional on `resume` data being present.

---

## 8. Accessibility Checklist (applies to every new component)

- [ ] Contrast checked against the fixed dark theme (no light variant to check anymore)
- [ ] All ambient motion gated behind `useReducedMotion()` — **partially done** (scroll bounce yes, status-dot ping no)
- [ ] Live/async widgets (GitHub, view counter) have skeleton **and** failure states — **failure done, skeleton missing**
- [ ] Interactive elements (nav, buttons, form fields) keyboard-reachable with visible focus ring
- [ ] Images have meaningful `alt`; decorative images `alt=""`
- [ ] Status footer text isn't the _only_ signal of state — pair the dot with the text label, not color alone

---

## 9. What We're Explicitly Not Building

Per scope: no Catppuccin-style theme family switcher, no per-accent-color picker UI, no user-facing "background effect" toggle, and **no light/dark toggle** — this overrides `References.md` §2, which proposes theme/accent picking as inspiration from jasoncameron.dev. The site locks to a single fixed dark theme; there is no user-controlled visual variable at all. `next-themes`, `theme-provider.tsx`, and `theme-toggle.tsx` are removed from the codebase (see §2 migration note). If personality/novelty is wanted later (click counter, webring — also described in `References.md` §3/§10), treat it as a separate, deliberately small addition — not part of the core design system.

---

## 10. Open Decisions

1. **Accent hue** — `oklch(0.72 0.17 250)` is wired in as the sole (dark-only) value. **Needs eyeball check** against the fixed dark background before locking. The former light-mode value (`oklch(0.64 0.19 250)`) is dropped along with light mode itself.
2. **Location widget** — still a decision. Recommendation: static illustrated pin. No code yet.
3. **View counter storage** — **resolved for v1: use `setting` table with `siteViews` key.** Implementation pending.
4. **Availability dot color** — status disputed with `PROGRESS.md` (see §7.1 above); verify against source before assuming either doc. End state should be `accent-signal` to stay inside the two-tone system.
5. **View counter wiring** — status disputed with `PROGRESS.md` (see §7.4 above); verify against source before assuming either doc.
