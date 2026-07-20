# Project Map

A personal portfolio site with an authenticated admin panel, built on Next.js App Router, Drizzle ORM, and Better Auth.

> **This document describes the current (pre-v3-migration) structure.** The target
> structure — feature extraction for `certificates`/`timeline`/`admin`,
> `components/layout/`, `components/shared/`, `app/(public)/` route group — is defined
> in `CODING_GUIDELINES.md`. Migration task list and status: `PROGRESS.md` Phase 6. Once
> that migration is complete, rewrite this file's folder table and Feature Flow section
> to match `CODING_GUIDELINES.md`'s tree instead of the one below.

---

## 1. Architecture

**Stack**

- **Framework:** Next.js (App Router)
- **Database:** Drizzle ORM (`db/schema.ts`, `db/client.ts`), migrations in `drizzle/`
- **Auth:** Better Auth (`lib/auth.ts` server config, `lib/auth-client.ts` client hooks), mounted at `app/api/auth/[...all]/route.ts`
- **Data fetching (client):** TanStack Query, provided via `components/QueryProvider.tsx`
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
        app/*/page.tsx          (screen-level UI for most pages)
              │
              ▼
        features/*/data        (static/seed content) ─┐
        lib/, db/               (auth, db client, utils) ├─→ app/api/* routes → db/schema.ts → SQLite (via Drizzle)
        components/ui           (shared presentational)  ─┘
```

The `app/` directory owns routing, layouts, API handlers, **and** most screen-level UI. Only `projects` and `home` have their screen composition extracted into `features/`. Other pages (`contact`, `certificates`, `timeline`, `admin`) keep their client components directly in `app/`.

---

## 2. Folder Responsibilities

| Folder                      | Responsibility                                                                                                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                      | Routing, layouts, metadata, API route handlers, **and** most screen-level UI (page components + client components).                                                               |
| `app/projects/page.tsx`     | Thin wrapper rendering `ProjectsView` from `features/projects/`.                                                                                                                  |
| `app/contact/page.tsx`      | Inline contact form client component (not extracted to features).                                                                                                                 |
| `app/certificates/`         | Page + `CertificatesClientComponent.tsx` (client component lives here, not in features).                                                                                          |
| `app/timeline/`             | Page + `TimelineClientComponent.tsx` (client component lives here, not in features).                                                                                              |
| `app/admin/`                | Authenticated admin routes. `page.tsx` handles login + dashboard tabs. `layout.tsx` is a minimal wrapper.                                                                         |
| `app/api/`                  | Server route handlers — one folder per resource (`projects`, `certificates`, `timelines`, `settings`, `resume`, `send`, `upload`, `auth`, `admin/create-user`). No UI logic here. |
| `features/home/components/` | GitHub Activity Widget only — extracted as a feature component.                                                                                                                   |
| `features/projects/`        | Full project feature: `projects-view.tsx`, `project-showcase-card.tsx`, `project-detail-modal.tsx`, `project-credentials-panel.tsx`, plus static data in `data/projects.ts`.      |
| `components/ui/`            | Unmodified shadcn/ui primitives (`button.tsx`, `card.tsx`, `dialog.tsx`, etc.). Never feature-specific logic here.                                                                |
| `components/` (root)        | App chrome shared across routes: `top-navbar.tsx`, `TopNavbarWrapper.tsx`, `Footer.tsx`, `theme-toggle.tsx`, `theme-provider.tsx`, `QueryProvider.tsx`, `DeleteConfirmBox.tsx`.   |
| `lib/`                      | Core singletons and utilities: auth config, auth client, base URL helper, `cn()`/formatting utils, motion presets.                                                                |
| `db/`                       | Drizzle schema and DB client instance. The only place raw table definitions live.                                                                                                 |
| `drizzle/`                  | Auto-generated migration SQL and snapshots. Never hand-edited.                                                                                                                    |
| `data/`                     | Global/cross-feature static data (skills list, education history, work experiences, certificates, country list, admin menu items).                                                |
| `utils/`                    | Additional utilities (e.g. `formate-date.ts` for date formatting).                                                                                                                |
| `types/`                    | Shared TypeScript types used across more than one feature.                                                                                                                        |
| `hooks/`                    | Global reusable hooks (e.g. `use-mobile.ts`). Feature-local hooks would live inside that feature folder instead.                                                                  |
| `config/`                   | App-wide configuration/constants.                                                                                                                                                 |
| `public/`                   | Static assets served as-is.                                                                                                                                                       |

---

## 3. Data Flow

1. **Read path (public pages):** `page.tsx` either fetches data server-side and passes it to a client component (home, projects), or the client component calls `app/api/<resource>/route.ts` via TanStack Query (certificates, timeline). API routes query `db/schema.ts` through `db/client.ts` and return JSON.
2. **Read path (static content):** Some sections (skills, education) read directly from `data/*.ts` at build/render time — no DB round trip needed.
3. **Write path (admin):** Admin section component (e.g. `project-section.tsx`) submits a form → `POST/PATCH/DELETE app/api/projects/route.ts` → Drizzle mutation → TanStack Query cache invalidation → UI reflects the change.
4. **File uploads:** Admin forms that include images call `app/api/upload/route.ts` first to get a stored URL, then include that URL in the create/update payload sent to the resource route.
5. **Contact form:** `app/contact/page.tsx` → `app/api/send/route.ts` → outbound email via the email provider.

---

## 4. Feature Flow

Only two features are extracted into `features/`:

```
features/projects/
├── components/
│   ├── projects-view.tsx          # entry point, imported by app/projects/page.tsx
│   ├── project-showcase-card.tsx
│   ├── project-detail-modal.tsx
│   └── project-credentials-panel.tsx
└── data/
    └── projects.ts                # static project data

features/home/
└── components/
    └── github-activity-widget.tsx  # GitHub activity display widget
```

Other pages (`contact`, `certificates`, `timeline`, `admin`) keep their client components directly in `app/` subdirectories. This is the current state — future extraction into `features/` is possible but not yet done.

---

## 5. Routing

App Router, file-based:

| Route           | File                                  | Notes                                                   |
| --------------- | ------------------------------------- | ------------------------------------------------------- |
| `/`             | `app/page.tsx`                        | Fetches data server-side, renders `HomeClientComponent` |
| `/projects`     | `app/projects/page.tsx`               | Renders `ProjectsView` from features                    |
| `/certificates` | `app/certificates/page.tsx`           | Renders `CertificatesClientComponent`                   |
| `/timeline`     | `app/timeline/page.tsx`               | Renders `TimelineClientComponent`                       |
| `/contact`      | `app/contact/page.tsx`                | Inline contact form client component                    |
| `/admin`        | `app/admin/page.tsx` (+ `layout.tsx`) | Protected; login form + dashboard tabs                  |
| `/api/*`        | `app/api/**/route.ts`                 | REST-style handlers, no pages                           |

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

- **Server state** (data from the DB/API): TanStack Query, initialized once via `components/QueryProvider.tsx` wrapping the app in `app/layout.tsx`. Each feature view owns its own queries/mutations — there is no global store for server data.
- **Local/UI state**: plain React state (`useState`/`useReducer`) inside view and section components — e.g. modal open/close (`ProjectDetailModal`), delete confirmation (`DeleteConfirmBox`).
- **Theme state**: `components/theme-provider.tsx` (context) + `theme-toggle.tsx` (control), independent of TanStack Query.
- **Session state**: derived from `lib/auth-client.ts`'s session hook, not duplicated into another store.
- No global client state library (Redux/Zustand) is used — state stays as local as possible, scoped to the feature that needs it.

---

## 8. Important Files

| File                                 | Why it matters                                                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                     | Root layout — wraps the app in providers (theme, query) and mounts global chrome (navbar/footer).                       |
| `app/page.tsx`                       | Home page — server-side fetches settings, projects, GitHub events, passes to HomeClientComponent.                       |
| `app/HomeClientComponent.tsx`        | Client component composing hero, about, GitHub widget, and featured projects sections.                                  |
| `db/schema.ts`                       | Single source of truth for every table; drives migrations and all query typing.                                         |
| `lib/auth.ts` / `lib/auth-client.ts` | Auth boundary — every protected route/action depends on these.                                                          |
| `lib/utils.ts`                       | Houses `cn()` shared utility.                                                                                           |
| `lib/motion.ts`                      | Framer Motion presets (`sectionReveal`, `cardReveal`) used across pages.                                                |
| `config/app-config.ts`               | Central place for site metadata / feature flags — check here before hardcoding constants elsewhere.                     |
| `components/QueryProvider.tsx`       | TanStack Query client setup; if data isn't refreshing, check the config here first.                                     |
| `drizzle.config.ts`                  | Points Drizzle Kit at `db/schema.ts` and the migrations output folder — needed for any `db:generate`/`db:push` command. |

---

## 9. Coding Rules

1. **`app/` owns routing and most screen UI.** Pages either fetch data server-side and render a client component, or import a thin wrapper from `features/`. Currently only `projects` uses the features pattern.
2. **Feature extraction is encouraged for new complex pages.** If a page grows beyond ~200 lines, consider extracting its client component into `features/<name>/components/`.
3. **kebab-case filenames** everywhere outside of Next's reserved files (`page.tsx`, `layout.tsx`, `route.ts`, etc.), matching the existing `components/ui/*` convention.
4. **Don't reach across features.** A component in `features/projects/` should not import from `features/home/`. Shared UI belongs in `components/ui/` or `components/` root; shared logic belongs in `lib/`.
5. **API routes are the only place that touches `db/client.ts` directly.** Feature components call the API, never Drizzle, directly.
6. **New global static data goes in `data/`.** Feature-specific data goes in `features/<name>/data/`. If in doubt, ask "does anything outside this feature use it?" — if no, it's feature-local.
7. **Auth checks live in `app/admin/page.tsx`** (inline), not in `layout.tsx`. Consider moving to layout for cleaner separation in the future.
8. **No new global state library** without discussion — prefer TanStack Query for server state and local `useState` for UI state.
9. **shadcn primitives in `components/ui/` are not to be edited for one-off styling.** Compose/wrap them in the feature or `components/` root instead, so upstream updates stay clean.
10. **Every new feature follows the standard shape** (`components/`, optional `data/`, optional `hooks/`/`types/`) — don't invent a new folder pattern per feature.

---

_This document reflects the current structure. Update it whenever a new feature or top-level folder is added._
