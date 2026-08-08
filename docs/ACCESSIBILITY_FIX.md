# Accessibility Fix Pass — Agent Prompt

## Context

Ran Lighthouse's Accessibility audit against `localhost:3000` (portfolio, `thureinhtet99/portfolio`, `development` branch). Currently 24/28 checks passing, with 4 flagged and 10 more requiring manual review. Fix the 4 flagged issues below, then work through the manual-check list.

Read `AGENTS.md`, `docs/CODING_GUIDELINES.md`, and `docs/DESIGN_SYSTEM.md` before touching anything — same locked decisions apply here as always (single dark theme, `#40a9ff` as the only accent, no new dependencies without flagging it first).

## Issue 1 — Buttons do not have an accessible name

Icon-only `<Button>`s with no visible text, `aria-label`, or `title` are the culprit. Confirmed in the code:

- `features/admin/components/project-section.tsx` — the `ProjectCard` action row: move-up, move-down, edit, delete buttons (`ArrowUp`/`ArrowDown`/`Edit`/`Trash2` icons only).
- `features/admin/components/work-exp-section.tsx` — same pattern in `WorkCard`'s action row, plus the per-position "remove position" `Trash2` button inside `WorkForm`.
- `features/admin/components/timeline-section.tsx` — same pattern in `TimelineCard`'s action row.
- `features/admin/components/posts-section.tsx` — the edit/delete buttons have no name (the move-up/down/publish-toggle buttons already have a `title` attribute, which is enough for an accessible name — leave those, just add names to the ones that don't have one).
- `app/admin/page.tsx` — the show/hide password toggle button (`Eye`/`EyeOff` icon, no `aria-label`).

Fix by adding `aria-label` to each (e.g. `aria-label="Move project up"`, `aria-label="Edit project"`, `aria-label="Delete project"`, `aria-label={showPassword ? "Hide password" : "Show password"}`). Since these labels should describe the specific item where practical (e.g. "Edit {item.title}" not just "Edit"), use your judgment per component — screen reader users navigating a list of buttons all called "Edit" can't tell them apart.

## Issue 2 — Links do not have a discernible name

Same root cause, on `<Link>`/`<a>` instead of `<Button>`. Confirmed in the code:

- `components/layout/footer.tsx` — the GitHub, LinkedIn, email, and "source code" icon links are icon-only with no `aria-label`. (The source-code link has a Radix `Tooltip`, but tooltip content isn't a substitute for an accessible name.)
- `components/layout/top-navbar.tsx` — the same GitHub/LinkedIn/email icon links repeated in the mobile menu.
- `features/projects/components/project-detail-view.tsx` — the GitHub-repo link and the external-live-site link (`FaGithub` / `ExternalLink` icons only, no text).

Fix by adding `aria-label` to each link (e.g. `aria-label="GitHub profile"`, `aria-label="View source on GitHub"`, `aria-label="Live demo"`). Where a link already carries a Radix `Tooltip`, keep the tooltip for sighted mouse users and add the `aria-label` alongside it — they're not mutually exclusive.

## Issue 3 — Insufficient color contrast

`docs/DESIGN_SYSTEM.md` §7 already flags this as an open item: _"`--primary` (`#40a9ff`) on `--dark-gray` should be re-measured before reuse in a new context; don't assume it clears body-text contrast."_ That's likely where Lighthouse is catching real failures now.

- Expand the "Background and foreground colors..." row in the Lighthouse report (screenshot only shows it collapsed) — it lists the exact failing elements with their computed foreground/background colors. Work from that list, don't guess.
- Prime suspects to check first, based on the token system in `app/globals.css`: any `text-muted-foreground/40`, `/50`, `/60` opacity-reduced text (used for de-emphasized captions/dates across `timeline-year-rail.tsx`, badges, footer view count, etc.) — reducing opacity on `--muted-foreground` over the `--dark-gray` background can drop below the 4.5:1 minimum for normal-size text even though full-opacity `--muted-foreground` clears it comfortably.
- If a given `/opacity` step is failing, don't just bump that one instance — check every other place using the same opacity step on body-size text and fix them together, since `DESIGN_SYSTEM.md` §2.2 documents these as a shared set of steps (`/20`, `/30`, `/50`, `/60`, `/70`, `/85`, `/90`, `/92`) used throughout. If a whole step turns out to be unsafe for text (as opposed to borders/backgrounds, which have a different bar), note that in `DESIGN_SYSTEM.md` §2.2 so it doesn't get reused for text again.

## Issue 4 — `<dl>` contains disallowed direct children

This traces to `components/ui/work-experience.tsx`, `ExperiencePositionItem`'s `<dl>`:

```tsx
<dl className="relative z-1 flex items-center gap-2 pl-9 text-sm text-muted-foreground">
  {position.employmentType && (
    <>
      <div>
        <dt className="sr-only">Employment Type</dt>
        <dd>{position.employmentType}</dd>
      </div>
      <span className="text-muted-foreground/30">|</span>
    </>
  )}
  <div>
    <dt className="sr-only">Employment Period</dt>
    <dd>...</dd>
  </div>
  {duration && (
    <>
      <span className="text-muted-foreground/30">|</span>
      <div>
        <dt className="sr-only">Duration</dt>
        <dd>...</dd>
      </div>
    </>
  )}
</dl>
```

The `<span>` pipe dividers are direct children of `<dl>` alongside the `<div>` groups — `<dl>` only permits `<dt>`/`<dd>` (optionally grouped in `<div>`), plus `<script>`/`<template>`. A bare `<span>` divider breaks that.

Fix without changing the visual layout: drop the literal `|` spans and render the divider with CSS instead — e.g. `divide-x divide-muted-foreground/30` on the `<dl>` (or a `border-l` on each `<div>` after the first) so the pipe is purely decorative and outside the DOM structure Lighthouse is checking.

**Heads up:** `components/ui/work-experience.tsx` is a vendored/registry component (`@ncdai`/chanhdai.com) per `docs/CODING_GUIDELINES.md`. Flag this edit explicitly in your summary rather than treating it as routine — it's a deliberate deviation from the upstream vendored version, done for accessibility compliance.

## Manual-check items (10, collapsed in the screenshot)

Expand "Additional items to manually check" in the Lighthouse panel and work through the actual list — I can't tell you what's in it from the screenshot. While you're in there, these are worth checking proactively since the current code doesn't obviously handle them:

- **Skip link** — `components/layout/top-navbar.tsx` has no "skip to main content" link; keyboard users currently have to tab through the whole nav (including the "More" dropdown) on every page.
- **Heading order** — spot-check that each page has exactly one `<h1>` and headings step down sequentially (e.g. `home-view.tsx` mixes `<h1>`/`<h2>` across sections; the `experience-year-timeline.tsx` dead-code file uses `<h3>` with no `<h2>` ancestor, but that file should be getting removed separately anyway).
- **`lang` attribute** — already present on `<html lang="en">` in `app/layout.tsx`, should pass; just confirm.

## Workflow

Same as always: don't apply fixes silently if they'd change visible layout or vendored-component internals — flag those in your summary. Otherwise, straightforward `aria-label` additions and the `<dl>` restructure don't need pre-approval, just fix them. Run `npm run lint` and `npm run typecheck` when done, then re-run Lighthouse's Accessibility audit and report the new score plus anything still failing.
