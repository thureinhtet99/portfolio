# Build Spec — Portfolio in the style of jasoncameron.dev

**Reference:** https://jasoncameron.dev/

**Purpose:** This is an implementation-ready spec, not a copy of the source content. Swap in your own name, projects, links, and copy — keep the structure, UX patterns, and mechanics.

**Screenshots:** Screenshots are placed in `/public/screenshots` to reference.

---

## 1. Site Map

| Route                          | Purpose                                                                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `/`                            | Hero intro, current role, employer logos, featured projects, live "Dashboard" (GitHub activity + click counter + map), latest posts |
| `/about`                       | Fuller bio, notable projects, personal interests, personal photos                                                                   |
| `/posts`                       | Blog/writeup index                                                                                                                  |
| `/posts/[slug]`                | Individual post                                                                                                                     |
| `/projects`                    | Full project list                                                                                                                   |
| `/projects/[slug]`             | Individual project detail page (with anchors, e.g. `#valve` to jump to a specific credibility mention)                              |
| `/pics`                        | Photography gallery                                                                                                                 |
| `/resume.pdf`                  | Static resume file, linked directly (not a page)                                                                                    |
| `/tutorials`                   | Optional tutorials section                                                                                                          |
| External subdomains (optional) | `notes.yourdomain.com`, `terminal.yourdomain.com` — only if you want a notes app / web-terminal easter egg                          |

Top nav: `About · Posts · Projects · Pics · More ▾` — the `More` dropdown holds lower-priority links (Resume, Tutorials, Notes, Terminal). A `~ / about /` breadcrumb sits above the nav on every page for the terminal-path aesthetic.

---

## 2. Visual System

**Aesthetic:** developer/terminal-coded, not corporate. Breadcrumb styled like a shell path, monospace accents, punny personal-brand mark (his is "JSON" from Jason + initials).

> **Superseded by `DESGIN_SYSTEM.md`:** the reference site's runtime theme/accent picker (4 palettes × ~14 accent colors + background-effect toggle) is **not** part of this build. `DESGIN_SYSTEM.md` §1–§2 deliberately rejects a visitor-configurable theme — including a light/dark toggle — in favor of a single fixed dark theme, plus a single fixed `--accent-signal` token used sparingly (active nav state, status dot, language-bar segments, prose link hover). Treat this section as inspiration for _structure_ only (breadcrumb-as-path, monospace metadata) — for anything color/theme-related, `DESGIN_SYSTEM.md` governs.

---

## 3. Homepage — Section by Section

1. **Hero**
   - Short greeting headline with your name and a nickname/handle if you have one.
   - 2–3 sentence intro: current role + employer, one credibility line (notable orgs/companies that use or are affected by your work), one line about what you're building _now_.
   - Social row: GitHub, LinkedIn, X/Twitter, "More about me →" link to `/about`.
   - Row of past/current employer or org logos (small, grayscale-friendly SVGs), each labeled "(Past)" where relevant.

2. **Featured Projects**
   - 2 hand-picked project cards (not the full list) — title, one-sentence description, tag chips (e.g. `golang`, `security`, `ai`), links to project detail page and repo.
   - "View all projects →" link to `/projects`.

3. **Dashboard / Highlights** — the standout section of the whole site. Build these as independent widgets, each with its own loading/skeleton and graceful failure state:
   - **Let's Connect** card: short "open to interesting projects" line + a **"Book a Chat"** button linking straight to a scheduling tool (Cal.com, Calendly, etc.). This is the primary recruiter/collaborator conversion point — don't bury it.
   - **Location widget**: "Currently Based In 📍" + a live/embedded map pinned to your city. Show a `Loading map…` placeholder while it fetches.
   - **Novelty click counter**: a global counter, incremented on click, persisted server-side (his is backed by a small Go/Redis service he also open-sourced). Framed self-referentially as "pointless but satisfying" — optional but on-brand if you like this kind of touch.
   - **Recent Commits feed**: pulls your N most recent GitHub commits live (via GitHub API or a small proxy service you control), shows repo, commit message, +/- line diff stats, and a link to view on GitHub.
   - **Language usage bar**: horizontal stacked bar showing % breakdown of languages across your repos (GitHub API `languages` endpoint aggregated, or a service like GitHub's own stats).
   - **Latest Posts**: last 3–4 blog posts, title + date, link to `/posts`.

4. **Footer** (present on every page, not just home)
   - Webring links, if you're part of one (optional/niche).
   - Copyright line.
   - **Status strip**: "All Services Nominal" (or similar), a live uptime clock, total site view count (link to analytics), and the current deploy's short git commit hash (link to that commit on GitHub) — an ops/SRE-flavored credibility touch.
   - Repeat social links.

---

## 4. About Page

- Portrait photo.
- Fuller bio paragraph: current role, a couple of specific notable projects with brief context (why they matter, who uses them), and 2–3 services/tools you maintain, each linked.
- Personal-interest paragraph: hobbies, community involvement (e.g. mentoring, hackathons), one distinctly personal detail (pet, hobby, etc.) with a small photo gallery for it.
- Contact line ("Feel free to email if you'd like to chat") with an obfuscated or mailto email.

---

## 5. Projects System

- **List page (`/projects`)**: card grid, each card = title, one-line description, tag chips, repo link.
- **Detail page (`/projects/[slug]`)**: longer writeup, tech stack, notable adopters/usage with linkable anchors (`#orgname`) so you can deep-link to a specific credibility claim from the homepage.
- Tag chips should be visually consistent with the homepage's featured-project chips — reuse the same component.

---

## 6. Content Model (data you need)

- `profile`: name, title, employer, location, bio (short + long), avatar, social links.
- `employers`: name, logo, current/past flag, link.
- `projects`: slug, title, description, long description, tags[], repo URL, live URL, adopters/credibility links[].
- `posts`: slug, title, date, excerpt/body, tags[].
- `pics`: image URL, caption, alt text.
- `stats` (fetched live, not stored): recent commits, language breakdown, click counter value, total site views, current deploy commit hash.

---

## 7. UX Patterns to Replicate

- **Descriptive link text** everywhere ("View all projects" instead of "click here") — accessibility and scan-ability win.
- **Async widgets degrade gracefully**: every live-fetched widget (map, commits, counters) needs a loading state and a silent failure state — one flaky dependency shouldn't block the whole homepage render.
- **Low-friction conversion path**: the "Book a Chat" CTA should be one click from the homepage, not nested in a menu.
- **Social proof via named, linkable adopters** rather than vague claims — link out to the actual org/repo/policy doc that proves the claim.
- **Self-referential product demos**: if you've built any small open-source tool, consider having it power a small live feature on the site itself (e.g. your own analytics/counter service) — doubles as a working demo.

---

## 8. Accessibility Checklist

- Verify contrast ratios for `--accent-signal` against the fixed dark background before locking it (flagged as outstanding in `PROGRESS.md` Phase 1).
- Respect `prefers-reduced-motion` for any ambient/decorative animation (Framer Motion presets in `lib/motion.ts`).
- Alt text on all meaningful images (portraits, project screenshots); empty/decorative alt on purely decorative ones.
- There is no theme toggle to worry about — the site is a single fixed dark theme (`DESGIN_SYSTEM.md` Phase 8). Focus keyboard/focus-state effort on nav, buttons, and form fields instead.
- Confirm breadcrumb and nav are in a real `<nav>`/landmark structure, not just styled divs.

---

## 9. Performance Checklist

- Treat GitHub commit feed, language bar, click counter, view counter, and map as independent async fetches — parallelize, don't waterfall them.
- Skeleton/placeholder for each while loading (the map's "Loading map…" text is the minimum bar — match that for every live widget).
- Cache GitHub API responses (rate limits are tight); revalidate on an interval (e.g. every few minutes) rather than on every page load.
- Keep the homepage's first paint focused on the hero + featured projects; let the Dashboard widgets stream in after.

---

## 10. Things to Deliberately Reconsider (don't copy blindly)

- **Cognitive load**: the reference homepage stacks commit feed, language chart, click counter, map, and status footer all above the fold-ish. If your primary goal is recruiter conversion rather than community/dev-culture signaling, consider trimming or reordering — put the hero + featured work + "Book a Chat" first, push novelty widgets (click counter, webring) lower.
- **"More" dropdown burying Resume**: Resume is high-intent content for recruiters. Consider surfacing it as a top-level nav item instead of nesting it.
- **Novelty vs. signal tradeoff**: click counters and webrings are fun personal-brand touches but are optional — decide intentionally whether they serve your goals (community signaling) or just add noise (recruiter conversion), rather than including them by default.

---

## 11. Suggested Build Order

1. Layout shell: nav, breadcrumb, footer — using the single fixed dark theme and `--accent-signal` token, per `DESGIN_SYSTEM.md`. No theme toggle to build.
2. Static pages: home hero, about, projects list/detail, pics — using your real content, no live widgets yet.
3. Posts system (list + detail, MDX or CMS-backed).
4. Live Dashboard widgets, one at a time, each with loading/failure states: GitHub commits → language bar → map → click counter → status footer (deploy hash + view count).
5. Accessibility + performance pass using the checklists above.
6. Polish: micro-interactions, `prefers-reduced-motion` handling.
