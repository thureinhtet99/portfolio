# Project Map

A personal portfolio site with an authenticated admin panel, built on Next.js App Router, Drizzle ORM, and Better Auth.

## 1. Architecture

**Stack**

- **Framework:** Next.js 16 (App Router), React 19
- **Database:** Drizzle ORM (`db/schema.ts`). `db/client.ts` picks the driver at runtime — `db/turso.ts` (`@libsql/client`, Turso) when `process.env.VERCEL === "1"`, otherwise `db/sqlite.ts` (`better-sqlite3`, local file at `SQLITE_DB_PATH`). Migrations live in `drizzle/`.
- **Auth:** Better Auth (`lib/auth.ts` server config — email/password, Drizzle adapter, 7‑day sessions; `lib/auth-client.ts` client hooks), mounted at `app/api/auth/[...all]/route.ts`.
- **Data fetching (client):** TanStack Query, provided via `components/providers/query-provider.tsx`. Generic CRUD is centralized in `hooks/use-crud.ts` (`useCrudResource`).
- **UI:** shadcn/ui (`new-york` style) primitives in `components/ui/*`, Tailwind CSS v4 (`app/globals.css`, `postcss.config.mjs`, no `tailwind.config.*` — v4 is CSS-driven).
- **Email:** `nodemailer` via `app/api/send/route.ts` (contact form).
- **File storage:** Cloudinary, via `app/api/upload/route.ts` — used by admin forms and cleaned up on delete (project images).
- **Maps:** `leaflet`/`react-leaflet`, dynamically imported (`ssr: false`) for the homepage "Currently Based In" widget; residence city is geocoded server-side via the Nominatim API.
- **Comments:** `@giscus/react` powers `/leave-a-note` (backed by GitHub Discussions).
- **Config:** `config/app-config.ts` for app-wide route constants and base URL, `types/index.type.ts` for shared types.
- **Other libraries:** forms via `react-hook-form` + `@hookform/resolvers` + `zod`; animation via `framer-motion` (imported as `motion/react`); icons via `lucide-react` and `react-icons`; Markdown via `react-markdown`; toasts via `sonner`; analytics via `@vercel/analytics`; Tailwind plugins `tailwindcss-animate` and `@tailwindcss/typography`.

**High-level shape**

```
Request → app/ (routing, layout, API routes)
              │
              ▼
        features/*/components  (feature-specific UI)
        app/(public)/page.tsx  (thin server wrappers)
              │
              ▼
        data/                  (global static content)
        lib/, db/              (auth, db client, utils)                 ─┐
        components/ui          (shared shadcn primitives)                ├─→ app/api/* routes → db/schema.ts → SQLite/Turso (via Drizzle)
        components/layout      (navbar, footer — shared chrome)         ─┘
```

Public-facing features are extracted into `features/`. Pages in `app/(public)/` are thin server wrappers that fetch data and render the corresponding feature view.

## 2. Folder Responsibilities

| Folder                          | Responsibility                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                          | Routing, layouts, metadata, API route handlers.                                                                                                                                                                                                                                                                                                                                    |
| `app/(public)/`                 | Route group for public-facing pages. `layout.tsx` is a passthrough wrapper. Pages are thin server wrappers that fetch data and render a feature view.                                                                                                                                                                                                                              |
| `app/(public)/page.tsx`         | Home page. Server-fetches settings, featured projects (+ GitHub star counts), work experiences; increments the `siteViews` counter; geocodes the residence city; renders `<HomeView />`.                                                                                                                                                                                           |
| `app/(public)/about/`           | Renders `<AboutView />` — portrait + Markdown bio. "Techs" section is a placeholder pending the About page rework (see §10).                                                                                                                                                                                                                                                       |
| `app/(public)/projects/`        | Renders `<ProjectsView />` — full project grid, DB-backed.                                                                                                                                                                                                                                                                                                                         |
| `app/(public)/projects/[slug]/` | Renders `<ProjectDetailView />` — single project page (not a modal): description, tech badges, GitHub stars, demo credentials, contributors.                                                                                                                                                                                                                                       |
| `app/(public)/timeline/`        | Renders `<TimelineView />` — horizontal single-axis timescale (`components/timescale.tsx`) built from `app/api/timelines`.                                                                                                                                                                                                                                                         |
| `app/(public)/posts/`           | Renders `<PostsView />` — published posts list, DB-backed.                                                                                                                                                                                                                                                                                                                         |
| `app/(public)/posts/[slug]/`    | Renders `<PostDetailView />` — single post with Markdown rendering.                                                                                                                                                                                                                                                                                                                |
| `app/(public)/contact/`         | Client component contact form → `app/api/send`.                                                                                                                                                                                                                                                                                                                                    |
| `app/(public)/leave-a-note/`    | Renders `<LeaveANoteView />` — giscus (GitHub Discussions) embed.                                                                                                                                                                                                                                                                                                                  |
| `app/(public)/labs/`            | Renders `<LabsView />` — "coming soon" placeholder page, no content yet.                                                                                                                                                                                                                                                                                                           |
| `app/admin/`                    | Authenticated admin route. `page.tsx` is a client component that is both the login form (unauthenticated) and the `<AdminView />` dashboard (authenticated), gated on `useSession()`. `layout.tsx` is a minimal wrapper.                                                                                                                                                           |
| `app/api/`                      | Server route handlers, one folder per resource: `projects`, `timelines`, `work-experiences`, `posts`, `settings`, `resume`, `send`, `upload`, `auth`, `admin/create-user`, `github/contributors`. No UI logic here.                                                                                                                                                                |
| `features/home/`                | `home-view.tsx` (hero, featured projects, experiences, contributions, widgets grid), `widget-section.tsx` (server component: fetches Katib commits/streak + latest posts), `github-activity-widget.tsx`, `latest-posts-widget.tsx`, `contributions-section.tsx` (GitHub contribution heatmap), `location-map.tsx` / `location-map-client.tsx` (Leaflet map, dynamically imported). |
| `features/about/`               | `about-view.tsx`.                                                                                                                                                                                                                                                                                                                                                                  |
| `features/projects/`            | `projects-view.tsx`, `project-showcase-card.tsx`, `project-detail-view.tsx`, `project-credentials-panel.tsx`, `contributors-section.tsx`. No `data/` folder — all project data is DB-backed via `app/api/projects`.                                                                                                                                                                |
| `features/timeline/`            | `timeline-view.tsx` (renders the `/timeline` page via `components/timescale.tsx`)                                                                                                                                                                                                                                                                                                  |
| `features/posts/`               | `posts-view.tsx`, `post-detail-view.tsx`. No `data/` — posts come from the DB.                                                                                                                                                                                                                                                                                                     |
| `features/leave-a-note/`        | `leave-a-note-view.tsx` — giscus embed.                                                                                                                                                                                                                                                                                                                                            |
| `features/lab/`                 | `labs-view.tsx` — placeholder view for `/labs`.                                                                                                                                                                                                                                                                                                                                    |
| `features/admin/`               | `admin-view.tsx` (dashboard shell + tab switcher), section components (`settings-section.tsx`, `timeline-section.tsx`, `work-exp-section.tsx`, `project-section.tsx`, `posts-section.tsx`), `data/menu-items.tsx` (sidebar items).                                                                                                                                                 |
| `components/ui/`                | shadcn/ui primitives (`button.tsx`, `card.tsx`, `dialog.tsx`, etc.) plus two vendored/registry components: `work-experience.tsx` and `contribution-graph.tsx`. Never feature-specific logic here.                                                                                                                                                                                  |
| `components/layout/`            | App chrome shared across routes: `top-navbar.tsx` (hidden on `/admin`), `footer.tsx` (server component, fetches settings + view count), `breadcrumbs.tsx`, `data/nav-links.ts`.                                                                                                                                                                                                    |
| `components/providers/`         | App-level providers: `query-provider.tsx`.                                                                                                                                                                                                                                                                                                                                         |
| `components/shared/`            | Reusable non-UI components: `delete-confirm-box.tsx`, `empty-state.tsx`, `admin-section-header.tsx`, `custom-loading.tsx`.                                                                                                                                                                                                                                                         |
| `lib/`                          | Core singletons and utilities: `auth.ts`/`auth-client.ts`, `base-url.ts` (resolves base URL for Vercel/production/local), `get-cached-contributions.ts` (cached GitHub contribution fetch), `utils.ts` (`cn()`).                                                                                                                                                                   |
| `db/`                           | `schema.ts` (single source of truth for every table), `client.ts` (driver selector), `sqlite.ts`, `turso.ts`. The only place raw table definitions live.                                                                                                                                                                                                                           |
| `drizzle/`                      | Auto-generated migration SQL and snapshots. Never hand-edited.                                                                                                                                                                                                                                                                                                                     |
| `data/`                         | Global/cross-feature static data: `countries.json`.                                                                                                                                                                                                                                                                                                                                |
| `types/`                        | Shared TypeScript types used across more than one feature (`ProjectType`, `WorkType`, `PostType`, `TimelineType`, plus Better Auth entity types).                                                                                                                                                                                                                                  |
| `hooks/`                        | Global reusable hooks: `use-crud.ts` (`useCrudResource` — generic TanStack Query CRUD wrapper for admin list resources), `use-image-upload.ts` (wraps `/api/upload`), `use-mobile.ts`.                                                                                                                                                                                             |
| `config/`                       | `app-config.ts` — route-name constants and base URL.                                                                                                                                                                                                                                                                                                                               |
| `public/`                       | Static assets served as-is (profile image/svg, brand mark, favicon).                                                                                                                                                                                                                                                                                                               |
| `docs/`                         | `AGENTS.md` is at repo root; this folder holds `PROJECT_MAP.md`, `CODING_GUIDELINES.md`, `DESIGN_SYSTEM.md`.                                                                                                                                                                                                                                                                       |

---

## 3. Data Flow

1. **Read path (public pages):** a `page.tsx` fetches data server-side (direct Drizzle query, or a `fetch` to its own `app/api/<resource>` route) and passes it to a feature view. Timelines, and work experiences are fetched this way for their standalone pages; the homepage combines a direct DB query (featured projects, view count) with internal API fetches (settings, experiences).
2. **Client-side admin reads/writes:** every admin list section (`timelines`, `work-experiences`, `projects`, `posts`) uses `useCrudResource<T>({ resource, labels })` from `hooks/use-crud.ts`, which wraps TanStack Query `useQuery`/`useMutation` around `GET/POST/PUT/PATCH/DELETE /api/<resource>`. `settings-section.tsx` is the one exception — it edits a single settings object with plain `useState` + manual `fetch`, since it isn't a list resource.
3. **API convention:** `GET` (list), `POST` (create), `PUT` (update — `id` in body), `PATCH` (bulk reorder — `{ [plural]: [{ id, order }] }` in body), `DELETE` (`?id=` query param). All admin routes follow this; there is no `PATCH` for anything except reordering.
4. **File uploads:** admin forms with images use `useImageUpload()` (`hooks/use-image-upload.ts`), which posts a `FormData` to `app/api/upload`, gets back a Cloudinary URL, and includes that URL in the create/update payload. Deleting a record with an image also deletes the Cloudinary asset (see `app/api/projects/route.ts` `DELETE`).
5. **Contact form:** `app/(public)/contact/page.tsx` → `POST app/api/send` → outbound email via `nodemailer`.
6. **Homepage widgets:** `WidgetSection` (server component) fetches recent commits/streak/languages from the Katib API (`https://katib.jasoncameron.dev`, keyed off the GitHub URL in settings) and the 4 latest published posts directly from the DB, then renders `<GitHubActivityWidget>` and `<LatestPostsWidget>`. `ContributionsSection` separately fetches a full contribution-calendar (`github-contributions-api.jogruber.de`, cached 24h via `unstable_cache`) and renders it with `<GitHubContributions>` / `<ContributionGraph>`.
7. **Location widget:** the homepage geocodes `settings.residence` via the Nominatim API (cached 7 days) and renders a live Leaflet map (`LocationMapClient` → dynamically-imported `LocationMap`) pinned to that city, falling back to a hardcoded lat/lng if geocoding fails.
8. **View counter:** incremented directly against the DB (`setting` table, `siteViews` key) on every homepage render; `footer.tsx` and `layout.tsx` read the same key to display it.

## 4. Feature Flow

```
features/home/
├── components/
│   ├── home-view.tsx                  # entry point, imported by app/(public)/page.tsx
│   ├── widget-section.tsx             # server component: Katib commits/streak + latest posts
│   ├── github-activity-widget.tsx     # recent commits + language bar (client)
│   ├── latest-posts-widget.tsx        # latest 4 published posts
│   ├── contributions-section.tsx      # GitHub contribution heatmap (server, Suspense)
│   ├── location-map.tsx               # Leaflet map (client, "use client")
│   └── location-map-client.tsx        # dynamic(() => location-map, { ssr: false })

features/about/
└── components/about-view.tsx          # entry point, imported by app/(public)/about/page.tsx

features/projects/
├── components/
│   ├── projects-view.tsx              # entry point, imported by app/(public)/projects/page.tsx
│   ├── project-showcase-card.tsx
│   ├── project-detail-view.tsx        # entry point, imported by app/(public)/projects/[slug]/page.tsx
│   ├── project-credentials-panel.tsx
│   └── contributors-section.tsx
└── (no data/ — DB-backed)

features/timeline/
└── components/
    ├── timeline-view.tsx              # entry point, imported by app/(public)/timeline/page.tsx
    ├── work-experience-with-rail.tsx  # homepage "Experiences" section, imported by home-view.tsx
    ├── timeline-year-rail.tsx         # year rail synced to work-experience-with-rail scroll position

features/posts/
└── components/
    ├── posts-view.tsx                 # entry point, imported by app/(public)/posts/page.tsx
    └── post-detail-view.tsx           # entry point, imported by app/(public)/posts/[slug]/page.tsx
    (no data/ — DB-backed)

features/leave-a-note/
└── components/leave-a-note-view.tsx   # entry point, imported by app/(public)/leave-a-note/page.tsx

features/lab/
└── components/labs-view.tsx           # entry point, imported by app/(public)/labs/page.tsx — placeholder

features/admin/
├── components/
│   ├── admin-view.tsx                 # dashboard shell + tab state, imported by app/admin/page.tsx
│   ├── settings-section.tsx           # single-object form, manual fetch (not useCrudResource)
│   ├── timeline-section.tsx           # useCrudResource<TimelineType>
│   ├── work-exp-section.tsx           # useCrudResource<WorkExperienceType>
│   ├── project-section.tsx            # useCrudResource<ProjectType>
│   └── posts-section.tsx              # useCrudResource<PostType>
└── data/menu-items.tsx                # admin sidebar menu items
```

## 5. Routing

App Router, file-based. Route groups don't affect URLs.

| Route              | File                                    | Notes                                                                     |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------- |
| `/`                | `app/(public)/page.tsx`                 | Server-fetches everything, renders `<HomeView />`, increments view count  |
| `/about`           | `app/(public)/about/page.tsx`           | Renders `<AboutView />`                                                   |
| `/projects`        | `app/(public)/projects/page.tsx`        | Renders `<ProjectsView />`                                                |
| `/projects/[slug]` | `app/(public)/projects/[slug]/page.tsx` | Renders `<ProjectDetailView />`, 404s via `notFound()` if slug is missing |
| `/timeline`        | `app/(public)/timeline/page.tsx`        | Renders `<TimelineView />`                                                |
| `/posts`           | `app/(public)/posts/page.tsx`           | Renders `<PostsView />`                                                   |
| `/posts/[slug]`    | `app/(public)/posts/[slug]/page.tsx`    | Renders `<PostDetailView />`, 404s via `notFound()` if slug is missing    |
| `/contact`         | `app/(public)/contact/page.tsx`         | Client contact form                                                       |
| `/leave-a-note`    | `app/(public)/leave-a-note/page.tsx`    | giscus embed                                                              |
| `/labs`            | `app/(public)/labs/page.tsx`            | "Coming soon" placeholder                                                 |
| `/admin`           | `app/admin/page.tsx` (+ `layout.tsx`)   | Protected; inline login form or `<AdminView />` depending on session      |
| `/api/*`           | `app/api/**/route.ts`                   | REST-style handlers, no pages                                             |

## 6. Authentication

- Powered by **Better Auth**, email/password only.
- `lib/auth.ts` — server-side auth instance: Drizzle adapter (`sqlite` provider — works against both local SQLite and Turso), 7‑day sessions with 1‑day update age, secret from `BETTER_AUTH_SECRET`.
- `lib/auth-client.ts` — client-side hooks (`useSession`, `signIn`, `signOut`).
- `app/api/auth/[...all]/route.ts` — catch-all handler for Better Auth's internal endpoints.
- `app/admin/page.tsx` — the entire auth gate: shows a login form when `useSession()` has no session, `<AdminView />` once authenticated. No middleware-based route protection.
- `app/api/admin/create-user/route.ts` — privileged endpoint for provisioning admin accounts; must itself verify the caller is an authenticated admin.

## 7. State Management

- **Server state** (data from the DB/API): TanStack Query, initialized once via `components/providers/query-provider.tsx` wrapping the app in `app/layout.tsx`. Admin list sections share one hook shape via `useCrudResource`; there is no global store for server data.
- **Local/UI state:** plain React state (`useState`) inside view and section components — tab switching (`AdminView`), dialog open/close, form fields, delete confirmation.
- **Session state:** derived from `lib/auth-client.ts`'s `useSession()`, not duplicated into another store.
- No global client state library (Redux/Zustand) — state stays as local as possible, scoped to the feature that needs it.

## 8. Important Files

| File                                      | Why it matters                                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/layout.tsx`                          | Root layout — loads fonts (JetBrains Mono + Geist Mono), wraps the app in `QueryProvider`, mounts navbar/footer/toaster/analytics.         |
| `app/(public)/page.tsx`                   | Home page — heaviest server component: settings, projects, experiences, geocoding, view-count increment.                                   |
| `features/home/components/home-view.tsx`  | Client component composing hero, featured projects, experiences, contributions, and the widgets grid.                                      |
| `db/schema.ts`                            | Single source of truth for every table; drives migrations and all query typing.                                                            |
| `db/client.ts`                            | Chooses Turso vs local SQLite based on `VERCEL` env — check here before debugging "works locally, not on Vercel" issues.                   |
| `lib/auth.ts` / `lib/auth-client.ts`      | Auth boundary — every protected route/action depends on these.                                                                             |
| `lib/base-url.ts`                         | Resolves the base URL used for internal `fetch()` calls across Vercel/production/local — check here first if server-side fetches 404/fail. |
| `lib/utils.ts`                            | Houses `cn()`.                                                                                                                             |
| `hooks/use-crud.ts`                       | Generic admin CRUD hook — reuse this before writing new fetch/mutation logic for any list resource.                                        |
| `config/app-config.ts`                    | Route-name constants and base URL — check here before hardcoding a route string elsewhere.                                                 |
| `components/providers/query-provider.tsx` | TanStack Query client setup; if admin data isn't refreshing, check the config here first.                                                  |
| `drizzle.config.ts`                       | Points Drizzle Kit at `db/schema.ts` and the migrations output folder — needed for any `db:generate`/`db:push` command.                    |

## 9. Coding Rules

1. **`app/` owns routing and layouts only.** Pages are thin server wrappers that import feature views from `features/`. `app/admin/page.tsx` is the one exception (inline auth gate).
2. **Every public-facing feature is extracted into `features/`.** Standard shape: `components/` (required), optional `data/`, optional `hooks/`/`types/`.
3. **kebab-case filenames** everywhere outside Next's reserved files (`page.tsx`, `layout.tsx`, `route.ts`).
4. **Don't reach across features.** Shared UI belongs in `components/ui/`, `components/layout/`, or `components/shared/`; shared logic belongs in `lib/` or `hooks/`.
5. **API routes are the only place that touches `db/client.ts` directly** (aside from a few direct-DB reads inside server components on the home page, which is an established exception, not a pattern to extend). Client components call the API, never Drizzle, directly.
6. **New admin list resources use `useCrudResource`.** Only reach for manual `useState`/`fetch` when the resource is a single object, like settings.
7. **New global static data goes in `data/`.** Feature-specific data goes in `features/<name>/data/`. If in doubt: "does anything outside this feature use it?" — if no, it's feature-local.
8. **Auth checks live in `app/admin/page.tsx`** (inline), not in `layout.tsx`. The `(public)` layout is a passthrough.
9. **No new global state library** without discussion — TanStack Query for server state, local `useState` for UI state.

## 10. Local Development

Prerequisites: Node 24.22.0 (the only pin, in `Dockerfile`), npm. No Docker or Turso needed: locally the app uses a SQLite file via `better-sqlite3`; Turso (`@libsql/client`) is used only when `VERCEL=1`, so never set `VERCEL` or `TURSO_*` locally.

```bash
npm ci                      # honours .npmrc legacy-peer-deps
cp .env.example .env.local  # then fill in (see table); generate the auth secret: openssl rand -base64 32
npm run db:migrate          # creates ./local.db from drizzle/
npm run db:seed             # optional: realistic fictional demo content (local-only; replaces only `seed_*` rows)
npm run dev                 # http://localhost:3000 (must be port 3000: auth baseURL is pinned there in dev)
```

Every route reads the DB (the root layout reads `setting`), so migrate before first run. `drizzle.config.ts` reads `.env.local` only.

| Variable                                                                                                    | Needed for                             | Local value / source                                                                                    |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`                                                                                        | session signing                        | random; required in production (the server throws without it), dev falls back to a public placeholder   |
| `BETTER_AUTH_URL`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SITE_URL`                                           | URLs                                   | `http://localhost:3000`                                                                                 |
| `SQLITE_DB_PATH`                                                                                            | local DB file                          | `./local.db`                                                                                            |
| `GMAIL_EMAIL`, `GMAIL_APP_PASSWORD`                                                                         | contact form                           | Google app password                                                                                     |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY/_SECRET`, `CLOUDINARY_API_KEY/_SECRET` | admin uploads and asset cleanup        | Cloudinary dashboard (same key/secret in both pairs; the `NEXT_PUBLIC_` secret is a known naming smell) |
| `NEXT_PUBLIC_GISCUS_REPO/_REPO_ID/_CATEGORY/_CATEGORY_ID`                                                   | `/leave-a-note`                        | https://giscus.app                                                                                      |
| `GITHUB_TOKEN`, `GITHUB_CONTRIBUTIONS_API_URL`                                                              | optional GitHub rate limits / override | optional                                                                                                |

Everything except the DB and auth secret is optional for the app to boot; features that lack their keys degrade (contact form 500s, uploads fail, Giscus shows nothing). Katib, GitHub, Nominatim and map tiles need network but fall back gracefully; `next/font/google` needs network at build and dev start.

**DB commands:** `db:generate` (new migration from `db/schema.ts`), `db:migrate`, `db:push`, `db:studio`, `db:seed`, and `db:reset` (deletes `local.db`, re-migrates, re-seeds). `scripts/check-turso.ts` and `scripts/test-apis.ts` hit Turso when credentials exist: do not run them locally.

**Admin access:** there is no OAuth. With `npm run dev` running, create the first user in your own terminal (the endpoint is disabled when `NODE_ENV=production`, i.e. under `next build`/`next start`):

```bash
read -s "pw?Admin password (min 8): " && curl -s -X POST http://localhost:3000/api/admin/create-user \
  -H 'content-type: application/json' \
  -d "{\"name\":\"Admin\",\"email\":\"you@example.com\",\"password\":\"$pw\"}"; unset pw
```

Then sign in at `/admin`. Any signed-in user passes `requireAdminSession`, so public sign-up is disabled when `NODE_ENV=production` (`lib/auth.ts`) and stays open in dev only so `create-user` works. Add production admins by inserting them into the production DB yourself.

**Checks:** `npm run typecheck`, `npm run lint` (`next lint` no longer exists in Next 16). A local `next build` needs a non-localhost URL because `lib/base-url.ts` rejects localhost in production mode, e.g. `NEXT_PUBLIC_BASE_URL=https://portfolio.example npm run build` (do not persist that value).

---

_This document reflects the codebase as of the current `development` branch. Update it whenever a new feature, route, or top-level folder is added or removed._
