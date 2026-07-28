# Spec: `/leave-a-note` Guestbook Page (Giscus)

**Status**: Ready for implementation
**Owner**: Jason (Thu Rein Htet)
**Repo**: `thureinhtet99/portfolio` (`development` branch)

---

## Context

Read `AGENTS.md`, `CODING_GUIDELINES.md`, `PROJECT_MAP.md`, and `References.md §12 Locked Decisions` before starting. Follow the existing feature-based architecture and conventions strictly (kebab-case files, PascalCase components, Server Components by default, no cross-feature imports, Zod where applicable, no `any`).

## Goal

Add a standalone guestbook/comments page at `/leave-a-note` using [Giscus](https://giscus.app/) (GitHub Discussions-backed comments). This is the **only** page in the app with a comment thread — homepage and content-detail pages (`/posts/[slug]`, `/projects/[slug]`) do NOT get one.

The page's **visual design must match the rest of the public site exactly** — it should look like a natural sibling of `/certificates`, `/timeline`, and `/projects`, not a bolted-on third-party widget.

---

## Design requirements (critical)

This page must reuse existing layout primitives, not introduce new ones:

- **Page shell**: Same container width, max-width, and horizontal padding as other `(public)` route pages (match `app/(public)/certificates/page.tsx` / `app/(public)/timeline/page.tsx` structure).
- **Header pattern**: Reuse whatever heading/title pattern the other public pages use (e.g. same heading size/weight/spacing as Certificates or Timeline page headers). Do not invent a new heading style.
- **Breadcrumbs**: Include `components/layout/breadcrumbs.tsx` if other top-level public pages use it — check `certificates/page.tsx` and `timeline/page.tsx` for the pattern and mirror it exactly.
- **Section spacing**: Match vertical rhythm (spacing between heading, intro copy, and content block) used elsewhere — inspect `contributions-section.tsx` or `widget-section.tsx` for the spacing tokens/classes in use.
- **Color tokens**: Only use existing semantic tokens from `app/globals.css` (`--foreground`, `--muted-foreground`, `--accent`, `--gray`, `--dark-gray`, etc.) — no new hardcoded colors.
- **Fade-in animation**: If other public pages use `components/shared/fade-animation.tsx` for entrance motion, wrap this page's content the same way for consistency.
- **Empty/loading state**: If Giscus hasn't loaded yet, avoid layout shift — reserve space or use a skeleton (`components/ui/skeleton.tsx`) consistent with skeleton patterns used elsewhere in the app (e.g. admin sections).
- **Theme**: Site has a single fixed dark theme (no toggle) — Giscus's own theme prop should be hardcoded to `"dark"` (or a custom Giscus CSS theme URL later, if the default dark theme clashes with your palette — flag this as a possible follow-up, don't solve it now).

**Do not** let Giscus's default iframe styling (fonts, spacing, borders) feel visually disconnected from the rest of the page — wrap it in the same card/container styling (`components/ui/card.tsx`) used elsewhere if that fits the page's content block.

---

## Phase 1 — Plan (produce first, wait for approval before writing code)

1. Confirm package: `@giscus/react`
2. Confirm new files:
   - `app/(public)/leave-a-note/page.tsx` — Server Component, sets metadata, renders feature view
   - `features/guestbook/components/guestbook-view.tsx` — `"use client"`, renders heading/intro + `<Giscus />`, reusing the design primitives listed above
3. Confirm env vars (values filled in later by Jason after giscus.app setup — do not invent IDs):
   ```
   NEXT_PUBLIC_GISCUS_REPO=thureinhtet99/portfolio
   NEXT_PUBLIC_GISCUS_REPO_ID=
   NEXT_PUBLIC_GISCUS_CATEGORY=Guestbook
   NEXT_PUBLIC_GISCUS_CATEGORY_ID=
   ```
4. Confirm nav placement: add "Leave a Note" link to `components/layout/top-navbar.tsx` and `components/layout/footer.tsx`, matching existing nav item markup/order.
5. Explicitly identify which existing public page's layout/header/breadcrumb pattern will be copied (name the file), so there's no ambiguity before coding starts.
6. Flag any gaps (e.g. missing env values, unclear which page's design to mirror) before moving to Phase 2.

## Phase 2 — Execute

1. Install `@giscus/react`.
2. Build `features/guestbook/components/guestbook-view.tsx`:
   - `"use client"` (required — Giscus mounts via iframe/script, incompatible with Server Components)
   - Reuse the exact heading/breadcrumb/spacing/container pattern identified in Phase 1
   - Short intro copy (e.g., "Leave a note — thoughts, feedback, or just say hi")
   - `<Giscus />` props:
     - `repo` / `repoId` / `category` / `categoryId` from `NEXT_PUBLIC_GISCUS_*` env vars
     - `mapping="pathname"`
     - `theme="dark"`
     - `reactionsEnabled="1"`
     - `emitMetadata="0"`
     - `inputPosition="top"`
     - `lang="en"`
3. Build `app/(public)/leave-a-note/page.tsx`:
   - Server Component, exports `metadata` (title/description) following the same pattern as `certificates/page.tsx` / `timeline/page.tsx`
   - Imports and renders `<GuestbookView />`
4. Add nav link in `top-navbar.tsx` and `footer.tsx` → `/leave-a-note`, matching existing link markup/order exactly.
5. Add empty env var placeholders to `.env.development.local` — clearly flag in output that Jason must fill in `NEXT_PUBLIC_GISCUS_REPO_ID` and `NEXT_PUBLIC_GISCUS_CATEGORY_ID` from giscus.app.

---

## Explicitly out of scope

- No comments on `/`, `/posts/[slug]`, `/projects/[slug]`, `/about`, `/certificates`, `/timeline`
- No theme-sync / `preferred_color_scheme` logic — site has no light/dark toggle
- No custom Giscus CSS theme — use built-in `theme="dark"` unless requested later
- No new layout primitives — this page must reuse what already exists

---

## Verification (required before considered done)

- `tsc --noEmit` — no new errors (confirm any pre-existing ones via `git stash` first)
- `next lint` — clean
- Manually verify:
  - `/leave-a-note` visually matches other public pages (spacing, header, breadcrumb, tokens)
  - Giscus iframe loads correctly
  - First comment creates the Discussion thread scoped to `/leave-a-note` pathname
  - No layout shift/flash before Giscus iframe loads

---

## Deviation policy

Per standing preference: any deviation from this spec (different file names, different component structure, additional deps, different design pattern than what's specified) must be explicitly flagged and documented in the agent's output — never silently applied.
