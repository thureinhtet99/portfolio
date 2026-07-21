# Design System

This document is the single source of truth for spacing, type, color, motion, and component rules across the site. Every new component or page should be checkable against this file.

---

## 1. Design Principles

1. **One voice, not a theme picker.** The site locks to a **single fixed dark theme** (Catppuccin-Mocha-adjacent).
2. **Content is the hero, chrome is quiet.** Cards, borders, and shadows exist to organize, not decorate. Prefer whitespace over borders where possible.
3. **Motion signals hierarchy, not decoration.** Every animation should communicate "this is new," "this is now in focus," or "this responds to you" — never motion for its own sake.
4. **Everything degrades to plain text.** Live widgets (GitHub activity, view counter, map) must have a calm skeleton/fallback state. Nothing should block first paint.
5. **Terminal-adjacent, not terminal-cosplay.** We can borrow structural ideas (breadcrumb trail, status footer, monospace accents for metadata) without adopting the full hacker aesthetic — this is a professional/backend-leaning portfolio, not a novelty site.

---

## 2. Color System

The existing two-token architecture in `app/globals.css` (`--white` / `--dark-gray` driving all semantic tokens via oklch) is collapsed to a **single fixed dark theme** — the `.dark` class split is removed; the values that used to live under `.dark` are now the only values, applied directly on `:root`. A single **fixed accent** is used sparingly for interactive/emphasis moments (active nav state, status dot, language-bar segments, prose link hover). This gives visual life without becoming a "pick your vibe" feature.

### 2.1 Accent (implemented)

Accent token, fixed on `:root` in `app/globals.css`:

```css
:root {
  --accent-signal: oklch(
    0.72 0.17 250
  ); /* muted blue-violet, tuned for dark bg */
  --accent-signal-foreground: oklch(0.15 0 0);
}
```

Mapped in `@theme inline` as `--color-accent-signal` and `--color-accent-signal-foreground`.

**WCAG contrast:** `--accent-signal` on `--dark-gray` = **4.221:1** — passes AA 3:1 (UI components / large text), fails AA 4.5:1 (body text). Accent must not be used for body copy.

**Usage rules for `accent-signal`:**

- Active nav link underline/indicator
- "Available for work" status dot
- GitHub language-bar segments (one hue per language via opacity steps, not separate hues)
- Primary link hover state inside prose (`aboutMe` / `intro` markdown)
- Focus rings can stay on `--ring` (already white on the fixed dark background) — don't overload the accent

**Do not** use the accent for: buttons (keep `bg-primary`), card backgrounds, or borders. It's a pointer, not a fill.

### 2.2 Semantic token table

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

**Font:** Inter (loaded as `--font-inter` via `next/font/google`), monospace fallback `Geist_Mono` reserved for _metadata only_ (timestamps, commit hashes, status footer, tag chips) — this is the one deliberate nod to the dev-terminal aesthetic, used surgically rather than site-wide.

### 3.1 Type scale

| Role                                 | Class stack                                                         | Notes                                    |
| ------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------- |
| Hero name/title                      | `text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em]` | One per page, homepage only              |
| Section heading (`.section-heading`) | `text-3xl sm:text-4xl font-bold tracking-[-0.03em]`                 | Defined as reusable utility class        |
| Card title                           | `text-lg sm:text-xl font-semibold tracking-[-0.02em]`               |                                          |
| Body / prose                         | `text-base sm:text-lg leading-relaxed text-muted-foreground`        | Markdown-rendered about/intro            |
| Small / meta                         | `text-xs sm:text-sm text-muted-foreground`                          | Dates, tags, captions                    |
| Monospace meta                       | `font-mono text-xs text-muted-foreground`                           | Commit hashes, status footer, timestamps |

**Tracking rule:** anything ≥ `text-2xl` gets `tracking-[-0.02em]` to `tracking-[-0.03em]`.

### 3.2 Line-length

Prose blocks (`aboutMe`, `intro`) should stay `max-w-3xl` — don't let markdown content stretch full-width on large screens.

---

## 4. Spacing & Layout

### 4.1 Grid rhythm

- Page-level vertical rhythm: `space-y-20` between major homepage sections — applied via `.page-shell` class.
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

Current `--radius: 0.625rem` (10px) is good — keep it as the single radius token. Card override to `rounded-[1.5rem]` (24px) creates a soft, editorial feel for primary content cards; **use this only for top-level Cards** (project cards, certificate cards, the hero card). Nested/inner elements (badges, buttons, inputs) stay on the smaller shadcn defaults (`rounded-md`/`rounded-xl`). Don't let radius escalate — max two radius sizes visible in any single component.

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

**Status:** Helpers extracted and consumed by `HomeView` and `projects-view.tsx`.

**Reduced motion:** `useReducedMotion()` is wired into the scroll-down bounce and the status-dot ping in `HomeView`.

---

## 7. Component-Specific Rules

### 7.1 Hero (homepage)

- One `h1` for name, one supporting line for role.
- Availability indicator: `available && !shouldReduceMotion` guard with `accent-signal` color for available, `muted-foreground/50` for unavailable.
- CTA row: 3 buttons — "Get in Touch" (primary), "Book a Chat" (outline), and "View Resume" (outline, conditional on resume data).

### 7.2 Project / Certificate Cards

- Image aspect ratio locked to `aspect-video`.
- Tag chips: `Badge` variant `secondary`, max 4 visible + "+N more".
- Hover: `hover:shadow-[...]` + `hover:scale-[1.05]` on image only, never the whole card.

### 7.3 GitHub Activity Widget (implemented)

- Lives on homepage between hero and "Featured Projects".
- Server-side fetch in `app/(public)/page.tsx` with `next: { revalidate: 60 * 30 }` (30 min).
- Language bar: horizontal stacked bar with accent-signal opacity steps per language.
- Empty/failure state: collapses to "Activity unavailable" text.
- **TODO:** Add `Skeleton` shimmer state while loading.

### 7.4 Status Footer (implemented)

- `components/layout/footer.tsx` — server component.
- Format: `● All systems nominal · {commitHash} · {viewCount} views` — monospace, single line.
- Status dot uses `bg-[var(--accent-signal)]`.
- Deploy hash from `VERCEL_GIT_COMMIT_SHA`.
- View counter wired to `setting` table `siteViews` key.

### 7.5 Resume CTA

- Placed as secondary button in hero row, icon (`HardDriveDownload`) + label, same treatment as "Get in Touch". Conditional on `resume` data being present.

### 7.6 Latest Posts Widget (implemented)

- `features/home/components/latest-posts-widget.tsx` — renders up to 4 published posts (title + monospace date) with "View all →" link to `/posts`.
- Empty state: "No posts yet" message, mirrors GitHub widget's failure pattern.

---

## 8. Accessibility Checklist (applies to every new component)

- [x] Contrast checked against the fixed dark theme — `--accent-signal` on `--dark-gray` = 4.221:1 (passes 3:1 UI/large-text, fails 4.5:1 body-text — accent is decorative/UI only)
- [x] All ambient motion gated behind `useReducedMotion()` (scroll bounce, status-dot ping)
- [x] Live/async widgets have failure states (GitHub activity, view counter, latest posts)
- [x] Interactive elements (nav, buttons, form fields) keyboard-reachable with visible focus ring
- [x] Images have meaningful `alt`; decorative images `alt=""`
- [x] Status footer text isn't the _only_ signal of state — dot paired with text label
- [ ] Skeleton shimmer states for GitHub activity widget and latest posts widget — **not yet implemented**

---

## 9. What We're Explicitly Not Building

No Catppuccin-style theme family switcher, no per-accent-color picker UI, no user-facing "background effect" toggle, and **no light/dark toggle** — this overrides `References.md` §2, which proposes theme/accent picking as inspiration from jasoncameron.dev. The site locks to a single fixed dark theme; there is no user-controlled visual variable at all. `next-themes`, `theme-provider.tsx`, and `theme-toggle.tsx` are removed from the codebase. If personality/novelty is wanted later (click counter, webring — also described in `References.md` §3/§10), treat it as a separate, deliberately small addition — not part of the core design system.

---

## 10. Open Decisions

All decisions are resolved. See `PROGRESS.md` for the full resolution history.

| Decision               | Status      | Resolution                                                                              |
| ---------------------- | ----------- | --------------------------------------------------------------------------------------- |
| Accent hue             | ✅ resolved | `oklch(0.72 0.17 250)` — single dark-only value. WCAG check = 4.221:1 on `--dark-gray`. |
| Location widget        | ✅ resolved | Static "Currently Based In" display with accent-signal pin.                             |
| View counter storage   | ✅ resolved | `setting` table `siteViews` key.                                                        |
| Availability dot color | ✅ resolved | `accent-signal` for available, `muted-foreground/50` for unavailable.                   |
| View counter wiring    | ✅ resolved | Wired to `setting.siteViews` in the footer.                                             |
