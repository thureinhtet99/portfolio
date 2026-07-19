# UX / Frontend Audit — jasoncameron.dev

**Date of review:** July 19, 2026
**URL:** https://jasoncameron.dev/

---

## 1. Overview

Personal portfolio/blog site for Jason Cameron, a Senior Software Engineer at Stan, based in Toronto. The site positions him as a backend/systems engineer with open-source credibility (contributions used by the UN, Linux Foundation, Arch Linux, GNOME, Valve, FFmpeg). Primary audiences appear to be: recruiters/hiring managers, fellow developers, and open-source community members.

## 2. Site Structure

Simple, flat IA — everything reachable from a top nav:

- **Home (`/`)** — intro, featured projects, GitHub activity dashboard, latest posts
- **About (`/about`)** — bio, notable projects, personal interests, dog photos
- **Posts (`/posts`)** — blog/technical writeups
- **Projects (`/projects`)** — full project list
- **Pics (`/pics`)** — photography
- **More** dropdown → Resume (PDF), Tutorials, Notes (subdomain), Terminal (subdomain)

Breadcrumb trail (`~ / about /`) reinforces a terminal/dev aesthetic throughout.

## 3. Visual Design

- **Theme system**: Catppuccin-based (Latte, Frappé, Macchiato, Mocha) with granular accent-color pickers (rosewater, flamingo, pink, mauve, red, maroon, peach, yellow, green, teal, sky, sapphire, blue, lavender) — a strong signal this targets a developer audience familiar with that palette convention.
- **Background effect toggle** — optional animated/decorative background, user-controlled.
- Overall tone leans "hacker/terminal" (breadcrumb style, "Terminal" subdomain link, monospace-coded branding "JSON" as a pun on his initials).

## 4. UX Patterns

- **Live GitHub dashboard on homepage**: recent commits pulled live via a custom service ("Katib"), plus a language-usage bar (Go 37%, HTML 32%, TypeScript 13%, Svelte 7%, etc.) — shows real-time engineering activity without a page reload.
- **Novelty click counter**: a self-described "completely pointless, yet oddly satisfying" global click counter powered by his own open-source project (Abacus) — doubles as an informal product demo.
- **Booking CTA**: "Book a Chat" button links directly to Cal.com — low-friction path to a real conversation, aimed at recruiters/collaborators.
- **Location widget**: live "Currently Based In" map (Toronto).
- **Status footer**: "All Services Nominal" + live deploy commit hash + total site view count — an ops/SRE-flavored touch that reinforces credibility.
- **Featured projects** use card-style summaries with tag chips (e.g., `golang`, `security`, `ai`, `anti-bot`) — scannable and filterable-feeling even if not literally filterable.
- **Webring** link at the footer — an intentional retro/community touch (CTP webring), somewhat niche but on-brand.

## 5. Content Highlights

- **Projects**: Anubis (proof-of-work anti-scraping tool, notably adopted by major infra like the Linux Foundation and Valve) and Abacus (Go/Gin/Docker/Redis page-counter service) are the two featured projects.
- **Posts**: Recent technical writeups include debugging AWS Lambda handlers, AWS CDK SSO issues, and an iCloud/Obsidian sync performance post — practical, real-world engineering content rather than tutorials-for-beginners.
- **External credibility links**: direct links out to UNESCO's policy toolbox, kernel.org, Arch wiki, GNOME GitLab as proof-points for where his software is used — a strong trust-building device.

## 6. Responsiveness

Not directly testable via static fetch, but structural signals (single-column-friendly card layout, minimal fixed-width elements, mobile-style breadcrumb nav) suggest a responsive build. Recommend a manual check at 375px and 768px breakpoints to confirm the GitHub activity graph and theme picker degrade gracefully on small screens.

## 7. Accessibility Notes (preliminary — based on static content only)

- Good: semantic breadcrumb structure, descriptive link text (e.g., "View all projects" rather than bare "click here").
- Watch-list items to verify manually:
  - Contrast ratios across all 4 theme × 14 accent-color combinations (a lot of surface area to regress on).
  - Whether the "Background effect" toggle respects `prefers-reduced-motion`.
  - Alt text coverage on decorative vs. meaningful images (dog photos have alt text; verify logos/icons do too).
  - Keyboard reachability of the theme/accent picker, which looks like a custom widget rather than native `<select>` elements.

## 8. Performance Notes

- Live-fetched data (GitHub commits, click counter, view counter, map) adds several async dependencies to the homepage — worth confirming these fail gracefully (skeleton/loading states) rather than blocking render if any one service is slow or down. The homepage HTML does include a "Loading map..." placeholder, which is a good sign this is already handled for at least one widget.

## 9. Strengths

- Distinct personal brand (dev-culture visual language, self-aware novelty features) that stands out from generic portfolio templates.
- Strong social proof via named, verifiable adopters of his open-source work.
- Low-friction conversion path (direct calendar booking).
- Real, current content (posts dated into 2026) — not a stale portfolio.
- Self-referential product demos (his own Abacus/Katib tools power the site's own live features) — clever, credible show-don't-tell.

## 10. Areas for Improvement

- **Cognitive load on first load**: homepage packs in a theme picker, background toggle, live commit feed, language chart, click counter, map, and status footer — a lot of simultaneous live widgets competing for attention before the visitor has even read who he is.
- **Discoverability of "More" items**: Resume, Tutorials, Notes, and Terminal are tucked behind a "More" dropdown — Resume in particular is high-intent content for recruiters and might deserve top-level placement.
- **Accessibility of the custom theme picker** should be explicitly verified (see Section 7) since it's a core, repeated UI element across pages.
- **Novelty widgets vs. signal**: the click counter and webring are charming but could be moved lower/de-emphasized if the primary goal is recruiter conversion rather than community signaling — worth an intentional decision either way based on the site's actual goal.
