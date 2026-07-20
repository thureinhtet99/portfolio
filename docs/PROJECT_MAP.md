# Project Map

A personal portfolio site with an authenticated admin panel, built on Next.js App Router, Drizzle ORM, and Better Auth.

> **This document describes the post-v3-migration structure.** The target structure
> was defined in `CODING_GUIDELINES.md` and migration was completed in Phase 6.
> See `PROGRESS.md` for the full migration history.

---

## 1. Architecture

**Stack**

- **Framework:** Next.js (App Router)
- **Database:** Drizzle ORM (`db/schema.ts`, `db/client.ts`), migrations in `drizzle/`
- **Auth:** Better Auth (`lib/auth.ts` server config, `lib/auth-client.ts` client hooks), mounted at `app/api/auth/[...all]/route.ts`
- **Data fetching (client):** TanStack Query, provided via `components/providers/query-provider.tsx`
- **UI:** shadcn/ui primitives in `components/ui/*`, Tailwind CSS (`app/globals.css`, `postcss.config.mjs`)
- **Email:** Resend (or similar) via `app/api/send/route.ts`
- **File storage:** `app/api/upload/route.ts` for asset uploads (e.g. certificate/project images)
- **Config:** `config/app-config.ts` for app-wide constants, `types/index.type.ts` for shared types

**High-level shape**

```
Request → app/ (routing, layout, API routes)
              │
              ▼
        features/*/components  (feature-specific UI)
        app/(public)/page.tsx  (thin server wrappers)
              │
              ▼
        features/*/data        (static/seed content) ─┐
        lib/, db/               (auth, db client, utils) ├─→ app/api/* routes → db/schema.ts → SQLite (via Drizzle)
        components/ui           (shared presentational)  ─┘
```

All five public-facing features are extracted into `features/`. Pages in `app/(public)/` are thin server wrappers that import the corresponding feature view.

---

## 2. Folder Responsibilities

| Folder                       | Responsibility                                                                                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                       | Routing, layouts, metadata, API route handlers.                                                                                                                                   |
| `app/(public)/`              | Route group for public-facing pages. `layout.tsx` wraps children in the root shell. Pages are thin server wrappers.                                                               |
| `app/(public)/page.tsx`      | Home page — fetches data server-side, renders `<HomeView />` from `features/home/`.                                                                                               |
| `app/(public)/projects/`     | Renders `<ProjectsView />` from `features/projects/`.                                                                                                                             |
| `app/(public)/certificates/` | Renders `<CertificatesView />` from `features/certificates/`.                                                                                                                     |
| `app/(public)/timeline/`     | Renders `<TimelineView />` from `features/timeline/`.                                                                                                                             |
| `app/(public)/contact/`      | Inline contact form client component.                                                                                                                                             |
| `app/admin/`                 | Authenticated admin routes. `page.tsx` is an auth-gate (login form when unauthenticated, `<AdminView />` when authenticated). `layout.tsx` is a minimal wrapper.                 |
| `app/api/`                   | Server route handlers — one folder per resource (`projects`, `certificates`, `timelines`, `settings`, `resume`, `send`, `upload`, `auth`, `admin/create-user`). No UI logic here. |
| `features/home/components/`  | `home-view.tsx` (hero, about, GitHub widget, featured projects sections) + `github-activity-widget.tsx`.                                                                          |
| `features/projects/`         | Full project feature: `projects-view.tsx`, `project-showcase-card.tsx`, `project-detail-modal.tsx`, `project-credentials-panel.tsx`, plus static data in `data/projects.ts`.      |
| `features/certificates/`     | `certificates-view.tsx` + `data/certificates.ts`.                                                                                                                                 |
| `features/timeline/`         | `timeline-view.tsx` + `data/experiences.ts`.                                                                                                                                      |
| `features/admin/`            | `admin-view.tsx` (dashboard shell), section components (`settings-section.tsx`, `project-section.tsx`, `certificate-section.tsx`, `timeline-section.tsx`), plus `data/menu-items.tsx`. |
| `components/ui/`             | Unmodified shadcn/ui primitives (`button.tsx`, `card.tsx`, `dialog.tsx`, etc.). Never feature-specific logic here.                                                                |
| `components/layout/`         | App chrome shared across routes: `top-navbar.tsx`, `top-navbar-wrapper.tsx`, `footer.tsx`, `breadcrumbs.tsx`, `theme-toggle.tsx`.                                                 |
| `components/providers/`      | App-level providers: `theme-provider.tsx`, `query-provider.tsx`.                                                                                                                  |
| `components/shared/`         | Reusable non-UI components: `delete-confirm-box.tsx`.                                                                                                                             |
| `lib/`                       | Core singletons and utilities: auth config, auth client, base URL helper, `cn()`/`formatDate()` utils, motion presets.                                                           |
| `db/`                        | Drizzle schema and DB client instance. The only place raw table definitions live.                                                                                                 |
| `drizzle/`                   | Auto-generated migration SQL and snapshots. Never hand-edited.                                                                                                                    |
| `data/`                      | Global/cross-feature static data (skills list, education history, country list). Feature-specific data lives in `features/<name>/data/`.                                         |
| `types/`                     | Shared TypeScript types used across more than one feature.                                                                                                                        |
| `hooks/`                     | Global reusable hooks (e.g. `use-mobile.ts`). Feature-local hooks live inside that feature folder.                                                                                |
| `config/`                    | App-wide configuration/constants.                                                                                                                                                 |
| `public/`                    | Static assets served as-is.                                                                                                                                                       |

---

## 3. Data Flow

1. **Read path (public pages):** `page.tsx` fetches data server-side and passes it to a feature view component (home, projects), or the feature view calls `app/api/<resource>/route.ts` via TanStack Query (certificates, timeline). API routes query `db/schema.ts` through `db/client.ts` and return JSON.
2. **Read path (static content):** Some sections (skills, education) read directly from `data/*.ts` or `features/*/data/*.ts` at build/render time — no DB round trip needed.
3. **Write path (admin):** Admin section component (e.g. `project-section.tsx`) submits a form → `POST/PATCH/DELETE app/api/projects/route.ts` → Drizzle mutation → TanStack Query cache invalidation → UI reflects the change.
4. **File uploads:** Admin forms that include images call `app/api/upload/route.ts` first to get a stored URL, then include that URL in the create/update payload sent to the resource route.
5. **Contact form:** `app/(public)/contact/page.tsx` → `app/api/send/route.ts` → outbound email via the email provider.

---

## 4. Feature Flow

All five public-facing features are extracted into `features/`:

```
features/home/
├── components/
│   ├── home-view.tsx                      # entry point, imported by app/(public)/page.tsx
│   └── github-activity-widget.tsx         # GitHub activity display widget
└── (no data/ — home data comes from DB settings)

features/projects/
├── components/
│   ├── projects-view.tsx                  # entry point, imported by app/(public)/projects/page.tsx
│   ├── project-showcase-card.tsx
│   ├── project-detail-modal.tsx
│   └── project-credentials-panel.tsx
└── data/
    └── projects.ts                        # static project data

features/certificates/
├── components/
│   └── certificates-view.tsx              # entry point, imported by app/(public)/certificates/page.tsx
└── data/
    └── certificates.ts                    # static certificate data

features/timeline/
├── components/
│   └── timeline-view.tsx                  # entry point, imported by app/(public)/timeline/page.tsx
└── data/
    └── experiences.ts                     # static experience data

features/admin/
├── components/
│   ├── admin-view.tsx                     # dashboard shell, imported by app/admin/page.tsx
│   ├── settings-section.tsx
│   ├── project-section.tsx
│   ├── certificate-section.tsx
│   └── timeline-section.tsx
└── data/
    └── menu-items.tsx                     # admin sidebar menu items
```

---

## 5. Routing

App Router, file-based. Route groups don't affect URLs.

| Route           | File                                          | Notes                                                          |
| --------------- | --------------------------------------------- | -------------------------------------------------------------- |
| `/`             | `app/(public)/page.tsx`                       | Fetches data server-side, renders `<HomeView />`               |
| `/projects`     | `app/(public)/projects/page.tsx`              | Renders `<ProjectsView />` from features                       |
| `/certificates` | `app/(public)/certificates/page.tsx`          | Renders `<CertificatesView />` from features                   |
| `/timeline`     | `app/(public)/timeline/page.tsx`              | Renders `<TimelineView />` from features                       |
| `/contact`      | `app/(public)/contact/page.tsx`               | Inline contact form client component                           |
| `/admin`        | `app/admin/page.tsx` (+ `layout.tsx`)         | Protected; login form + dashboard tabs                         |
| `/api/*`        | `app/api/**/route.ts`                         | REST-style handlers, no pages                                  |

---

## 6. Authentication

- Powered by **Better Auth**.
- `lib/auth.ts` — server-side auth instance (providers, session config, DB adapter pointing at `db/schema.ts`).
- `lib/auth-client.ts` — client-side hooks (`useSession`, `signIn`, `signOut`) for use inside client components.
- `app/api/auth/[...all]/route.ts` — catch-all handler that Better Auth uses for its internal endpoints (sign-in, callback, session, etc.).
- `app/admin/page.tsx` — handles auth check inline (login form shown when unauthenticated, dashboard when authenticated).
- `app/api/admin/create-user/route.ts` — privileged endpoint for provisioning admin accounts; must itself check the caller is already an authenticated admin.

---

## 7. State Management

- **Server state** (data from the DB/API): TanStack Query, initialized once via `components/providers/query-provider.tsx` wrapping the app in `app/layout.tsx`. Each feature view owns its own queries/mutations — there is no global store for server data.
- **Local/UI state**: plain React state (`useState`/`useReducer`) inside view and section components — e.g. modal open/close (`ProjectDetailModal`), delete confirmation (`DeleteConfirmBox`).
- **Theme state**: `components/providers/theme-provider.tsx` (context) + `components/layout/theme-toggle.tsx` (control), independent of TanStack Query.
- **Session state**: derived from `lib/auth-client.ts`'s session hook, not duplicated into another store.
- No global client state library (Redux/Zustand) is used — state stays as local as possible, scoped to the feature that needs it.

---

## 8. Important Files

| File                                          | Why it matters                                                                                                          |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                              | Root layout — wraps the app in providers (theme, query) and mounts global chrome (navbar/footer).                       |
| `app/(public)/page.tsx`                       | Home page — server-side fetches settings, projects, GitHub events, passes to `<HomeView />`.                            |
| `features/home/components/home-view.tsx`      | Client component composing hero, about, GitHub widget, and featured projects sections.                                  |
| `db/schema.ts`                                | Single source of truth for every table; drives migrations and all query typing.                                         |
| `lib/auth.ts` / `lib/auth-client.ts`          | Auth boundary — every protected route/action depends on these.                                                          |
| `lib/utils.ts`                                | Houses `cn()` and `formatDate()` shared utilities.                                                                      |
| `lib/motion.ts`                               | Framer Motion presets (`sectionReveal`, `cardReveal`) used across pages.                                                |
| `config/app-config.ts`                        | Central place for site metadata / feature flags — check here before hardcoding constants elsewhere.                     |
| `components/providers/query-provider.tsx`     | TanStack Query client setup; if data isn't refreshing, check the config here first.                                     |
| `drizzle.config.ts`                           | Points Drizzle Kit at `db/schema.ts` and the migrations output folder — needed for any `db:generate`/`db:push` command. |

---

## 9. Coding Rules

1. **`app/` owns routing and layouts only.** Pages are thin server wrappers that import feature views from `features/`. No screen-level UI in `app/` except for `app/admin/page.tsx` (auth-gate).
2. **Every public-facing feature is extracted into `features/`.** Each feature follows the standard shape: `components/` (required), optional `data/`, optional `hooks/`/`types/`.
3. **kebab-case filenames** everywhere outside of Next's reserved files (`page.tsx`, `layout.tsx`, `route.ts`, etc.), matching the existing `components/ui/*` convention.
4. **Don't reach across features.** A component in `features/projects/` should not import from `features/home/`. Shared UI belongs in `components/ui/`, `components/layout/`, or `components/shared/`; shared logic belongs in `lib/`.
5. **API routes are the only place that touches `db/client.ts` directly.** Feature components call the API, never Drizzle, directly.
6. **New global static data goes in `data/`.** Feature-specific data goes in `features/<name>/data/`. If in doubt, ask "does anything outside this feature use it?" — if no, it's feature-local.
7. **Auth checks live in `app/admin/page.tsx`** (inline), not in `layout.tsx`. The `(public)` layout is a passthrough.
8. **No new global state library** without discussion — prefer TanStack Query for server state and local `useState` for UI state.
9. **shadcn primitives in `components/ui/` are not to be edited for one-off styling.** Compose/wrap them in the feature or `components/` root instead, so upstream updates stay clean.
10. **Every new feature follows the standard shape** (`components/`, optional `data/`, optional `hooks/`/`types/`) — don't invent a new folder pattern per feature.

---

_This document reflects the post-migration structure. Update it whenever a new feature or top-level folder is added._
