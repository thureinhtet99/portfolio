# Design System — Portfolio v3

**Status:** Draft for aesthetic redesign
**Stack:** Next.js 15 · Tailwind v4 · shadcn/ui (new-york) · Framer Motion · next-themes
**Scope:** Visual/aesthetic overhaul only. No accent-color picker, no theme-family switcher (Catppuccin-style). Light/dark via `next-themes` stays.

This document is the single source of truth for spacing, type, color, motion, and component rules across the site. Every new component or page should be checkable against this file.

---

## 1. Design Principles

1. **One voice, not a theme picker.** The jasoncameron.dev reference proves a strong personal system can carry a site without letting the _visitor_ configure it. We keep light/dark (system-respecting) but nothing more — no accent hue, no background-effect toggle.
2. **Content is the hero, chrome is quiet.** Cards, borders, and shadows exist to organize, not decorate. Prefer whitespace over borders where possible.
3. **Motion signals hierarchy, not decoration.** Every animation should communicate "this is new," "this is now in focus," or "this responds to you" — never motion for its own sake.
4. **Everything degrades to plain text.** Live widgets (GitHub activity, view counter, map) must have a calm skeleton/fallback state. Nothing should block first paint.
5. **Terminal-adjacent, not terminal-cosplay.** We can borrow structural ideas (breadcrumb trail, status footer, monospace accents for metadata) without adopting the full hacker aesthetic — this is a professional/backend-leaning portfolio, not a novelty site.

---

## 2. Color System

Keep the existing two-token architecture in `app/globals.css` (`--white` / `--dark-gray` driving all semantic tokens via oklch). Do **not** add a third brand hue as a global switchable variable. Instead, introduce a single **fixed accent** used sparingly for interactive/emphasis moments (links-as-buttons, active nav state, status dot, chart bar). This gives visual life without becoming a "pick your vibe" feature.

### 2.1 Recommended accent

Add one accent token pair to `:root` / `.dark`, sitting alongside the existing semantic tokens:

```css
:root {
  /* existing --white / --dark-gray / semantic tokens stay as-is */
  --accent-signal: oklch(
    0.64 0.19 250
  ); /* muted blue-violet, works on both themes */
  --accent-signal-foreground: oklch(0.98 0 0);
}

.dark {
  --accent-signal: oklch(0.72 0.17 250);
  --accent-signal-foreground: oklch(0.15 0 0);
}
```

```css
@theme inline {
  /* add alongside existing --color-* mappings */
  --color-accent-signal: var(--accent-signal);
  --color-accent-signal-foreground: var(--accent-signal-foreground);
}
```

**Usage rules for `accent-signal`:**

- Active nav link underline/indicator
- "Available for work" status dot (replace the current ping animation's implicit foreground color)
- GitHub language-bar segments (one hue per language via opacity steps, not separate hues)
- Primary link hover state inside prose (`aboutMe` / `intro` markdown)
- Focus rings can stay on `--ring` (already dark-gray/white) — don't overload the accent

**Do not** use the accent for: buttons (keep `bg-primary`), card backgrounds, or borders. It's a pointer, not a fill.

### 2.2 Semantic token table (existing, documented for reference)

| Token                            | Light                                         | Dark                | Use                     |
| -------------------------------- | --------------------------------------------- | ------------------- | ----------------------- |
| `background` / `foreground`      | white / dark-gray                             | dark-gray / white   | Page base               |
| `card` / `card-foreground`       | white / dark-gray                             | dark-gray / white   | Card surfaces           |
| `primary` / `primary-foreground` | dark-gray / white                             | white / dark-gray   | Buttons, active states  |
| `muted-foreground`               | dark-gray (translucent via opacity utilities) | white (translucent) | Secondary text          |
| `border` / `input` / `ring`      | dark-gray                                     | white               | Structural lines, focus |

Opacity is the primary tool for hierarchy here (e.g. `text-muted-foreground/70`, `border-border/70`, `bg-card/92`) — this is already the pattern in `card.tsx` and `button.tsx`. **Standardize** on these opacity steps sitewide: `/10`, `/20`, `/60`, `/70`, `/80`, `/92`. Don't introduce arbitrary values like `/13` or `/55`.

---

## 3. Typography

**Font:** Inter (already loaded as `--font-inter` via `next/font/google`), monospace fallback `Geist_Mono` reserved for _metadata only_ (timestamps, commit hashes, status footer, tag chips) — this is the one deliberate nod to the dev-terminal aesthetic, used surgically rather than site-wide.

### 3.1 Type scale

| Role                                 | Class stack                                                         | Notes                                       |
| ------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------- |
| Hero name/title                      | `text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em]` | One per page, homepage only                 |
| Section heading (`.section-heading`) | `text-3xl sm:text-4xl font-bold tracking-[-0.03em]`                 | Define as a reusable utility class (see §7) |
| Card title                           | `text-lg sm:text-xl font-semibold tracking-[-0.02em]`               |                                             |
| Body / prose                         | `text-base sm:text-lg leading-relaxed text-muted-foreground`        | Markdown-rendered about/intro               |
| Small / meta                         | `text-xs sm:text-sm text-muted-foreground`                          | Dates, tags, captions                       |
| Monospace meta                       | `font-mono text-xs text-muted-foreground`                           | Commit hashes, status footer, timestamps    |

**Tracking rule:** anything ≥ `text-2xl` gets `tracking-[-0.02em]` to `tracking-[-0.03em]` (already used inconsistently in the codebase — e.g. `admin/page.tsx` uses `-0.03em` on `h1`, apply this everywhere headings appear, including `ProjectDetailModal`, `CertificateSection`, `HomeClientComponent`).

### 3.2 Line-length

Prose blocks (`aboutMe`, `intro`) should stay `max-w-3xl` (already correct in `HomeClientComponent`) — don't let markdown content stretch full-width on large screens.

---

## 4. Spacing & Layout

### 4.1 Grid rhythm

- Page-level vertical rhythm: `space-y-20` between major homepage sections (hero → about → projects) — currently only applied inconsistently; standardize.
- Section internal padding: `px-6 py-14 sm:px-10` for full-bleed panels (matches existing `#about-section`).
- Card internal padding: keep shadcn defaults (`py-6`, `px-6` via `CardHeader`/`CardContent`) — don't override per-component.

### 4.2 Container widths

| Context                   | Max width                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| App shell (nav, footer)   | `max-w-7xl` (matches `admin/page.tsx`) — promote this to a shared `.app-shell` class used site-wide, not just admin |
| Prose / contact form      | `max-w-2xl`                                                                                                         |
| Reading content (about)   | `max-w-3xl`                                                                                                         |
| Project/certificate grids | `max-w-7xl`, 2-col on `lg:`                                                                                         |

### 4.3 Radius

Current `--radius: 0.625rem` (10px) is good — keep it as the single radius token. Card override to `rounded-[1.5rem]` (24px) creates a nice soft, editorial feel for primary content cards; **use this only for top-level Cards** (project cards, certificate cards, the hero card). Nested/inner elements (badges, buttons, inputs) stay on the smaller shadcn defaults (`rounded-md`/`rounded-xl`). Don't let radius escalate — max two radius sizes visible in any single component.

---

## 5. Elevation & Surface

Two elevation levels only:

1. **Flat** — text sections, no card, no shadow (about, contact intro copy)
2. **Panel** — `bg-card/92 border border-border/70 shadow-[0_18px_50px_-38px_rgba(34,34,34,0.38)] backdrop-blur-sm rounded-[1.5rem]` (already the `Card` default) — used for every discrete content block: project cards, certificate cards, the GitHub activity widget, the status footer strip.

Don't invent a third shadow value. If something needs to feel "more important," use size/spacing/position (e.g. full-bleed hero panel) rather than a heavier shadow.

**New utility classes to define** (referenced throughout existing components but not yet in `globals.css` — add them under `@layer base` or `@layer components`):

```css
@layer components {
  .app-shell {
    @apply mx-auto w-full max-w-7xl;
  }
  .page-shell {
    @apply mx-auto w-full max-w-7xl space-y-20;
  }
  .section-heading {
    @apply text-3xl sm:text-4xl font-bold tracking-[-0.03em];
  }
  .surface-panel {
    @apply bg-card/92 text-card-foreground rounded-[1.5rem] border border-border/70
           shadow-[0_18px_50px_-38px_rgba(34,34,34,0.38)] backdrop-blur-sm;
  }
  .surface-panel-muted {
    @apply bg-background/80 rounded-[1.25rem] border border-border/40;
  }
}
```

(These classes are already referenced across `SettingsSection.tsx`, `admin/page.tsx`, `HomeClientComponent.tsx` etc. — confirm they're actually defined; if not, this closes that gap.)

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

### 6.2 Standard patterns

```tsx
// Section reveal (use for every major section)
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

**Reduced motion:** wrap ambient/looping animations (scroll-down bounce, status-dot ping) in a check against `useReducedMotion()` from Framer Motion. This directly addresses the accessibility gap flagged in the reference audit (§7, "Background effect toggle respects prefers-reduced-motion").

---

## 7. Component-Specific Rules

### 7.1 Hero (homepage)

- One `h1` for name, one supporting line for role (typing animation stays — it's a nice, restrained bit of personality, not a novelty widget).
- Availability indicator: replace the current always-pinging dot with a static dot + `animate-ping` **only when available === true** and only if `!prefersReducedMotion`.
- CTA row: max 2 primary actions. If you add "Book a Chat," it replaces or sits beside "Get in Touch" — don't stack three+ buttons.

### 7.2 Project / Certificate Cards

- Image aspect ratio locked to `aspect-video` (already correct in `project-showcase-card.tsx`).
- Tag chips: `Badge` variant `secondary`, max 4 visible + "+N more" (already implemented — keep this pattern, extend to certificates).
- Hover: `hover:shadow-[0_28px_85px_-44px_...]` + `hover:scale-[1.05]` on image only, never the whole card (avoid layout jitter).

### 7.3 GitHub Activity Widget (new)

- Lives in a `surface-panel` on the homepage, directly under hero or above "Featured Projects."
- Skeleton state: 3 shimmering rows (`Skeleton` component already exists) while fetching.
- Failure state: quietly collapse to nothing or a one-line "Activity unavailable" — never a broken/empty card shell.
- Language bar: horizontal stacked bar, segments colored via `accent-signal` at descending opacity steps (`/100`, `/70`, `/45`, `/25`) rather than a rainbow of hues — keeps it inside the system instead of introducing per-language brand colors.

### 7.4 Status Footer (new)

- Monospace, small, muted: `font-mono text-xs text-muted-foreground`.
- Format: `● All systems nominal · a1b2c3d · 4,213 views` — single line, wraps to two on mobile.
- Status dot uses `accent-signal` (green would clash with the two-tone system — resist adding a semantic green; use the accent or a simple filled/unfilled circle).

### 7.5 Resume CTA

- Promote from the admin-only "More" pattern (none currently, but per the audit, don't bury it) — place as a secondary button in the hero row, icon (`HardDriveDownload`, already used) + label, same treatment as "Get in Touch."

---

## 8. Accessibility Checklist (applies to every new component)

- [ ] Contrast checked in **both** light and dark (no third theme to worry about, which simplifies this significantly vs. the reference site's 4-theme × 14-accent matrix)
- [ ] All ambient motion gated behind `useReducedMotion()`
- [ ] Live/async widgets (GitHub, view counter) have skeleton **and** failure states — never render broken
- [ ] Interactive elements (nav, buttons, form fields) keyboard-reachable with visible focus ring (`focus-visible:ring-ring/50` already standard via shadcn — don't strip it)
- [ ] Images have meaningful `alt`; decorative images `alt=""`
- [ ] Status footer text isn't the _only_ signal of state — pair the dot with the text label, not color alone

---

## 9. What We're Explicitly Not Building

Per scope: no Catppuccin-style theme family switcher, no per-accent-color picker UI, no user-facing "background effect" toggle. Light/dark stays as the only user-controlled visual variable, via the existing `ModeToggle`. If personality/novelty is wanted later (click counter, webring), treat it as a separate, deliberately small addition — not part of the core design system.

---

## 10. Open Decisions

1. Exact `accent-signal` hue — proposed muted blue-violet (`oklch(0.64 0.19 250)`) but should be eyeballed against the current pure black/white palette before locking in.
2. Whether the location widget uses a real map embed (heavier, more "alive") or a static illustrated pin (lighter, more consistent with the flat-color system) — recommend the latter for load performance and visual consistency.
3. View-counter storage: reuse `setting` table with a `siteViews` key (simplest, no migration) vs. a dedicated `analytics` table (cleaner, allows per-page counts later). Recommend `setting` key for v1.
