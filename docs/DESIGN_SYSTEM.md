# Design System

This document is the single source of truth for spacing, type, color, motion, and component rules across the site. Every new component or page should be checkable against this file. It reflects `app/globals.css` and the components that consume it as they currently exist.

---

## 1. Design Principles

1. **One voice, not a theme picker.** The site locks to a **single fixed dark theme**. No light mode, no accent picker, no background-effect toggle.
2. **Terminal-adjacent, all the way through.** Unlike a typical "monospace for metadata only" pattern, this site sets its primary UI font to a monospace face site-wide (see §3) and leans into developer-tool visual cues: a `~ / route / path` breadcrumb in the navbar, traffic-light dots on project preview cards, monospace status/footer text. It's a professional/backend-leaning portfolio, not a novelty terminal-cosplay site — the motif is consistent but restrained.
3. **Content is the hero, chrome is quiet.** Cards, borders exist to organize, not decorate. Prefer whitespace over heavy borders where possible; borders are always low-opacity (`border-muted-foreground/20`).
4. **Motion signals hierarchy, not decoration.** Entrance animation communicates "this is now in view" — nothing loops or draws attention for its own sake except the intentional loading-screen scramble and the availability-dot ping.
5. **Everything degrades to plain text or a calm fallback.** Live widgets (GitHub activity, contributions heatmap, location map) must not block first paint and must fail quietly (empty state or "Activity unavailable" text), never a broken UI.

---

## 2. Color System

Two raw values drive the entire palette in `app/globals.css`, mapped onto shadcn's semantic token set on `:root` (no `.dark` class split — the dark values are the only values):

```css
:root {
  --gray: #ababae;
  --dark-gray: #1b1b1a;

  --background: var(--dark-gray);
  --foreground: var(--gray);

  --primary: #40a9ff; /* accent — the one saturated color on the site */
  --primary-foreground: var(--gray);

  --secondary: #1b1b1a;
  --secondary-foreground: var(--gray);

  --muted: var(--dark-gray);
  --muted-foreground: var(--gray);

  --accent: var(--dark-gray);
  --accent-foreground: var(--gray);

  --destructive: var(--gray);
  --destructive-foreground: var(--dark-gray);

  --border: var(--gray);
  --input: var(--gray);
  --ring: var(--gray);
  --card: var(--dark-gray);
  --card-foreground: var(--gray);
  --popover: var(--dark-gray);
  --popover-foreground: var(--gray);
}
```

These are re-exposed as Tailwind color utilities via `@theme inline` (`--color-background`, `--color-primary`, etc.) — always reach for the Tailwind utility (`bg-background`, `text-muted-foreground`) rather than a raw hex or `var()` in component code.

### 2.1 `--primary` (`#40a9ff`)

This is the site's single accent — a muted blue. It is **not** the oklch `--accent-signal` token described in older docs; that token does not exist in the current codebase. Current usage:

- Primary buttons (`buttonVariants` `default` variant)
- Active/hover link and nav states (`text-primary`, `hover:text-primary`)
- Availability status dot and its ping animation
- Badge `default` variant background
- The `~` breadcrumb root segment

**Usage rule:** treat `--primary` as the only saturated color allowed outside of the traffic-light dots on project cards (see §6.2) and language-bar colors pulled directly from the GitHub API. Don't introduce a second accent hue.

### 2.2 Opacity as the hierarchy tool

Nearly all secondary/structural styling is done by dimming `--muted-foreground` or `--border` rather than introducing new tokens:

| Pattern                          | Use                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------ |
| `border-muted-foreground/20`     | Default card/panel/input border (also the global `* { border-color }` default) |
| `text-muted-foreground/50`–`/70` | De-emphasized text, unavailable-state color                                    |
| `bg-card/…`, `border-border/…`   | Panel surfaces                                                                 |

Stick to opacity steps already in use in the codebase (`/20`, `/30`, `/50`, `/60`, `/70`, `/85`, `/90`, `/92`) rather than inventing new fractions.

### 2.3 Semantic token table

| Token                            | Value                    | Use                                              |
| -------------------------------- | ------------------------ | ------------------------------------------------ |
| `background` / `foreground`      | `--dark-gray` / `--gray` | Page base                                        |
| `card` / `card-foreground`       | `--dark-gray` / `--gray` | Card surfaces                                    |
| `primary` / `primary-foreground` | `#40a9ff` / `--gray`     | Buttons, links, active states, badges            |
| `muted` / `muted-foreground`     | `--dark-gray` / `--gray` | Secondary text (main body-copy color)            |
| `border` / `input` / `ring`      | `--gray`                 | Structural lines, focus                          |
| `destructive`                    | `--gray` / `--dark-gray` | Destructive actions (inverted contrast, not red) |

Note: `--muted-foreground` is used as the default body text color (`body { @apply text-muted-foreground }`), not a "secondary only" tone — most running text on the site is `muted-foreground`, with `foreground` reserved for a smaller set of headings.

---

## 3. Typography

**Font:** JetBrains Mono, loaded via `next/font/google` as `--font-jetbrains-mono` and mapped to `--font-sans` in `@theme` — this is the site's only typeface, used for everything (headings, body, UI chrome), not reserved for metadata. Geist Mono is also loaded (`--font-geist-mono`) but is **not wired into the Tailwind theme** and is effectively unused — don't build on it; either remove the font load or wire it up deliberately if a second mono face is actually needed.

### 3.1 Type scale (as used today — not yet formalized into reusable classes beyond `.section-heading`)

| Role                                 | Class stack (as seen in components)                                      | Notes                                                                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero name                            | `text-3xl font-bold sm:text-4xl` (`HomeView`)                            | Homepage only                                                                                                                                   |
| Section heading (`.section-heading`) | `text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl text-foreground` | Defined in `globals.css`, use for major page/section titles                                                                                     |
| Section heading (inline variant)     | `text-4xl font-bold text-foreground tracking-[-0.02em]`                  | Used directly in `HomeView` for "Experiences"/"Contributions"/"Techs" — prefer `.section-heading` for new work instead of repeating this inline |
| Card title                           | `text-base font-semibold` / `text-lg font-semibold`                      | Project/certificate card titles                                                                                                                 |
| Body / prose                         | `text-base leading-relaxed` / `prose prose-invert`                       | Markdown-rendered intro/bio                                                                                                                     |
| Small / meta                         | `text-xs` / `text-sm text-muted-foreground`                              | Dates, tags, captions                                                                                                                           |
| Tag chips                            | `text-xs lowercase` (via `Badge`)                                        | Badges render text lowercase by default                                                                                                         |

**Tracking rule:** headings ≥ `text-3xl` get `tracking-[-0.02em]` to `tracking-[-0.03em]`.

### 3.2 Line-length

Prose blocks (bio, intro) stay readable via `prose` + a `max-w-*` wrapper on their containing section — don't let Markdown content stretch full-width on large screens.

---

## 4. Spacing & Layout

### 4.1 Grid rhythm

- Page-level vertical rhythm: `.page-shell` applies `space-y-20` between major sections.
- Section internal padding: `px-6 py-16 sm:py-20` is the standard section wrapper (hero uses a taller `py-20 sm:py-40`).
- Card internal padding: `p-4`/`p-5` for widget-style panels; shadcn `Card` defaults (`py-6`, `px-6` via `CardHeader`/`CardContent`) for dialogs and form cards.

### 4.2 Container widths

Defined once in `globals.css` `@layer components`:

```css
.app-shell {
  @apply mx-auto w-full max-w-[90rem];
}
.page-shell {
  @apply mx-auto w-full max-w-[90rem] space-y-20;
}
```

| Context                 | Max width                                                 |
| ----------------------- | --------------------------------------------------------- |
| App shell (nav, footer) | `max-w-[90rem]` — via `.app-shell`                        |
| Page shell              | `max-w-[90rem]` with `space-y-20` — via `.page-shell`     |
| Section content         | `max-w-5xl` (most sections) or `max-w-4xl` (about, techs) |
| Contact form            | `max-w-2xl` (implicit in form width)                      |

### 4.3 Radius

`--radius: 0.625rem` (10px), exposed as `--radius-sm/md/lg/xl` via `@theme inline`. Components use Tailwind's derived scale directly (`rounded-md`, `rounded-lg`, `rounded-sm`) — there is **no** oversized `rounded-[1.5rem]` card treatment in the current codebase; the card uses `rounded-md`, badges use `rounded-sm`, buttons use `rounded-md`/`rounded-full` (icon size). Keep new components on this same small scale; don't introduce a larger radius.

---

## 5. Elevation & Surface

- **Flat** — text sections, no card, no shadow (about intro, contact copy).
- **Panel** — bordered `div` (`border border-muted-foreground/20 rounded-md p-4`/`p-5`) for widget-style blocks (location, message, quote, GitHub activity).
- **Card component** — `components/ui/card.tsx`: `rounded-lg py-6 shadow-[0_18px_50px_-38px_rgba(34,34,34,0.38)] backdrop-blur-sm`, no border by default. Used for admin panels, the login form (with an added `border`).

**Known inconsistency:** several admin components (`admin-view.tsx`, `app/admin/page.tsx`) apply a `surface-panel` class that is **not defined anywhere** in `globals.css` — it currently does nothing. Either define `.surface-panel` in `globals.css @layer components` or replace those usages with the standard `Card`/panel treatment above.

**Texture:** a fixed, full-viewport SVG noise overlay (`body::before`, `feTurbulence`, `opacity: 0.08`) sits above everything (`z-index: 9999`, `pointer-events: none`) to add grain to the flat dark background. This is a deliberate global effect — don't add competing background textures per-page.

**View transitions:** `next.config.ts` enables `experimental.viewTransition`. `app/globals.css` disables the default root cross-fade and explicitly isolates `site-header`/`site-footer` (named via `viewTransitionName` in `top-navbar.tsx`/`footer.tsx`) so nav/footer never re-animate between pages. Named per-item transitions are also used for project cards (`project-image-{slug}`, `project-title-{slug}`) via React's `<ViewTransition>` and `<Link transitionTypes={[...]}>`. New shared chrome should follow the same isolation pattern; new per-item transitions should use a unique, ID-suffixed `viewTransitionName`/`<ViewTransition name>`.

---

## 6. Component-Specific Rules

### 6.1 Hero (homepage)

- One `h1` for name; greeting line above it, Markdown intro below.
- Social row: GitHub / LinkedIn / Resume links separated by `|`, then the availability indicator — `primary` dot with a ping when available, `muted-foreground/40` solid dot when not.

### 6.2 Project Cards

- "Terminal window" preview: traffic-light dots (`bg-red-500/80`, `bg-yellow-500/80`, `bg-green-500/80`) + `org / repo` label + star count, then the project image (or summary text as fallback) in an `aspect-video` frame.
- Card container: `rounded-md border border-muted-foreground/20`, hover → `border-muted-foreground`.
- Tag chips: `Badge` `secondary` variant, capped by a `techLimit` prop (default 4).
- Named view transitions per card (`project-image-{slug}`, `project-title-{slug}`).

### 6.3 GitHub Activity Widget

- Lives in the homepage widgets grid, fed by `WidgetSection` (server component) hitting the Katib API.
- Empty/failure state collapses to a muted "no activity" panel rather than erroring.
- **Gap:** no `Skeleton` shimmer while loading — it renders once data resolves.

### 6.4 Contributions Heatmap

- `features/home/components/contributions-section.tsx` → `<GitHubContributions>` (client) wrapped in `<Suspense fallback={<GitHubContributionsFallback />}>`; data comes from a cached (`unstable_cache`, 24h) fetch in `lib/get-cached-contributions.ts`. Always keep the `Suspense` boundary when touching this section — it's how the calm-loading-state principle is enforced here.

### 6.5 Location Widget

- Live, not static: `LocationMapClient` dynamically imports a Leaflet `MapContainer` (`ssr: false`) pinned to a geocoded residence city (dark CARTO tile layer, no zoom/attribution controls). Falls back to a hardcoded lat/lng if geocoding fails. Keep the dynamic import — Leaflet is not SSR-safe.

### 6.6 Status Footer

- `components/layout/footer.tsx` — async server component. Left: copyright. Right: `{viewCount} views` + social icon links (GitHub/LinkedIn/email, each conditionally rendered from settings).
- View count is read from and incremented against the `setting` table (`siteViews` key) — see `PROJECT_MAP.md` §3.

### 6.7 Experiences (homepage)

- `WorkExperienceWithRail` renders collapsible per-position entries (`components/ui/work-experience.tsx`) with a synced `TimelineYearRail` that highlights the year matching the currently-expanded/most-visible entry. Don't build a second version of this on top of `experience-year-timeline.tsx` — that file is superseded.

### 6.8 Placeholder pages

- `/labs`: centered `Construction` icon + "coming soon" text — follow this exact minimal pattern for any other stub page rather than leaving a route empty.

---

## 7. Accessibility Checklist (apply to every new component)

- [ ] Contrast checked against `--dark-gray` background for any new color — `--primary` (`#40a9ff`) on `--dark-gray` should be re-measured before reuse in a new context; don't assume it clears body-text contrast.
- [ ] Live/async widgets (GitHub activity, contributions, location map) have a calm failure or loading state, never a blank crash
- [ ] Interactive elements keyboard-reachable with a visible focus ring (`focus-visible:ring-ring/50` is already baked into `button`/`input`/`badge` — don't strip it with a custom `className`)
- [ ] Images have meaningful `alt`; decorative images use `alt=""`
- [ ] Status/footer information isn't conveyed by color alone — pair dots/icons with text
- [ ] New `Skeleton` states added for GitHub Activity Widget and Latest Posts Widget — **not yet implemented, still open**

---

## 8. What We're Explicitly Not Building

No theme/accent picker, no per-accent-color picker UI, no user-facing "background effect" toggle, and **no light/dark toggle** — the site locks to a single fixed dark theme with zero visitor-controlled visual variables. Also out of scope unless explicitly requested: a novelty click counter, a webring and a `/pics` gallery.

---

## 9. Known Gaps / Open Items

| Item                                                          | Status                                                                                                                                   |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Geist Mono font load (`--font-geist-mono`)                    | Loaded in `layout.tsx` but not wired into the Tailwind theme — effectively unused.                                                       |
| `Skeleton` shimmer for GitHub Activity / Latest Posts widgets | Not implemented — widgets show nothing/text until data resolves.                                                                         |
| About page                                                    | "Techs" section is a placeholder (`<div>tech stacks</div>`) — `data/skills.tsx` and `data/countries.json` exist but aren't wired in yet. |
