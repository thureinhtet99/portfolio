# Project Map

A personal portfolio site with an authenticated admin panel, built on Next.js App Router, Drizzle ORM, and Better Auth.

---

## 1. Architecture

**Stack**

- **Framework:** Next.js (App Router)
- **Database:** Drizzle ORM (`db/schema.ts`, `db/client.ts`), migrations in `drizzle/`
- **Auth:** Better Auth (`lib/auth.ts` server config, `lib/auth-client.ts` client hooks), mounted at `app/api/auth/[...all]/route.ts`
- **Data fetching (client):** TanStack Query, provided via `components/shared/query-provider.tsx`
- **UI:** shadcn/ui primitives in `components/ui/*`, Tailwind CSS (`app/globals.css`, `postcss.config.mjs`)
- **Email:** Resend (or similar) via `app/api/send/route.ts`
- **File storage:** `app/api/upload/route.ts` for asset uploads (e.g. certificate/project images)
- **Config:** `config/app-config.ts` for app-wide constants, `types/index.type.ts` for shared types

**High-level shape**

```
Request → app/ (routing, layout, API routes)
              │
              ▼
        features/*/components  (screen-level UI, "-view.tsx")
              │
              ▼
        features/*/data        (static/seed content) ─┐
        lib/, db/               (auth, db client, utils) ├─→ app/api/* routes → db/schema.ts → Postgres/SQLite (via Drizzle)
        components/ui, layout   (shared presentational)  ─┘
```

The `app/` directory is intentionally kept thin — routing, layouts, and API handlers only. Business logic, screen composition, and feature-specific data live in `features/`.

---

## 2. Folder Responsibilities

| Folder                        | Responsibility                                                                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                        | Routing only. Pages import a `*-view.tsx` from `features/` and render it. Also owns `layout.tsx`, `loading.tsx`, `not-found.tsx`, `globals.css`, and all `api/` route handlers.   |
| `app/(public)/`               | Public-facing routes: home, contact, projects, certificates, timeline.                                                                                                            |
| `app/admin/`                  | Authenticated admin routes. `layout.tsx` enforces auth/session checks before rendering.                                                                                           |
| `app/api/`                    | Server route handlers — one folder per resource (`projects`, `certificates`, `timelines`, `settings`, `resume`, `send`, `upload`, `auth`, `admin/create-user`). No UI logic here. |
| `features/<name>/components/` | Feature UI. The entry point is always `<name>-view.tsx`, composed of smaller components in the same folder.                                                                       |
| `features/<name>/data/`       | Static or seed data scoped to that feature (e.g. `features/projects/data/projects.ts`).                                                                                           |
| `features/admin/`             | Admin dashboard sections — one component per manageable resource (projects, certificates, timeline, settings) plus the nav `menu-items.tsx`.                                      |
| `components/ui/`              | Unmodified shadcn/ui primitives (`button.tsx`, `card.tsx`, `dialog.tsx`, etc.). Never feature-specific logic here.                                                                |
| `components/layout/`          | App chrome shared across routes: navbar, footer, theme toggle/provider.                                                                                                           |
| `components/shared/`          | Cross-feature utility components not tied to a single feature (delete confirmation dialog, query provider).                                                                       |
| `lib/`                        | Core singletons and utilities: auth config, auth client, base URL helper, `cn()`/formatting utils.                                                                                |
| `db/`                         | Drizzle schema and DB client instance. The only place raw table definitions live.                                                                                                 |
| `drizzle/`                    | Auto-generated migration SQL and snapshots. Never hand-edited.                                                                                                                    |
| `data/`                       | Only truly global/cross-feature static data (skills list, education history, country list for forms). Feature-specific data has moved into `features/*/data/`.                    |
| `types/`                      | Shared TypeScript types used across more than one feature.                                                                                                                        |
| `hooks/`                      | Global reusable hooks (e.g. `use-mobile.ts`). Feature-local hooks would live inside that feature folder instead.                                                                  |
| `config/`                     | App-wide configuration/constants.                                                                                                                                                 |
| `public/`                     | Static assets served as-is.                                                                                                                                                       |

---

## 3. Data Flow

1. **Read path (public pages):** `page.tsx` renders a feature view → view component calls the corresponding `app/api/<resource>/route.ts` (directly or via a TanStack Query hook) → route handler queries `db/schema.ts` through `db/client.ts` → JSON returned → rendered by the view.
2. **Read path (static content):** Some sections (skills, education) read directly from `data/*.ts` at build/render time — no DB round trip needed.
3. **Write path (admin):** Admin section component (e.g. `project-section.tsx`) submits a form → `POST/PATCH/DELETE app/api/projects/route.ts` → Drizzle mutation → TanStack Query cache invalidation → UI reflects the change.
4. **File uploads:** Admin forms that include images call `app/api/upload/route.ts` first to get a stored URL, then include that URL in the create/update payload sent to the resource route.
5. **Contact form:** `app/(public)/contact/page.tsx` → `app/api/send/route.ts` → outbound email via the email provider.

---

## 4. Feature Flow

Each feature under `features/<name>/` follows the same internal shape:

```
features/<name>/
├── components/
│   ├── <name>-view.tsx      # entry point, imported by app/.../page.tsx
│   └── ...sub-components
└── data/
    └── <name>.ts            # static content, if any
```

- `app/(public)/<name>/page.tsx` stays a one-line wrapper that imports and renders `<Name>View`.
- Interaction, state, and API calls live inside the `-view.tsx` and its sub-components — not in the page file.
- If a feature needs a hook or type used only by itself, add `hooks/` or `types/` folders locally inside that feature rather than polluting the global `hooks/`/`types/` directories.

---

## 5. Routing

App Router, file-based:

| Route           | File                                  | Notes                                            |
| --------------- | ------------------------------------- | ------------------------------------------------ |
| `/`             | `app/(public)/page.tsx`               | Renders `HomeView`                               |
| `/contact`      | `app/(public)/contact/page.tsx`       | Contact form → `api/send`                        |
| `/projects`     | `app/(public)/projects/page.tsx`      | Renders `ProjectsView`                           |
| `/certificates` | `app/(public)/certificates/page.tsx`  | Renders `CertificatesView`                       |
| `/timeline`     | `app/(public)/timeline/page.tsx`      | Renders `TimelineView`                           |
| `/admin`        | `app/admin/page.tsx` (+ `layout.tsx`) | Protected; renders `AdminView` with section tabs |
| `/api/*`        | `app/api/**/route.ts`                 | REST-style handlers, no pages                    |

`(public)` is a route group only — it does not appear in the URL. It exists purely to visually separate public pages from `admin/` in the file tree.

---

## 6. Authentication

- Powered by **Better Auth**.
- `lib/auth.ts` — server-side auth instance (providers, session config, DB adapter pointing at `db/schema.ts`).
- `lib/auth-client.ts` — client-side hooks (`useSession`, `signIn`, `signOut`) for use inside client components.
- `app/api/auth/[...all]/route.ts` — catch-all handler that Better Auth uses for its internal endpoints (sign-in, callback, session, etc.).
- `app/admin/layout.tsx` — guards every admin route; redirects unauthenticated users before any admin UI renders.
- `app/api/admin/create-user/route.ts` — privileged endpoint for provisioning admin accounts; must itself check the caller is already an authenticated admin.

---

## 7. State Management

- **Server state** (data from the DB/API): TanStack Query, initialized once via `components/shared/query-provider.tsx` wrapping the app in `app/layout.tsx`. Each feature view owns its own queries/mutations — there is no global store for server data.
- **Local/UI state**: plain React state (`useState`/`useReducer`) inside view and section components — e.g. modal open/close (`ProjectDetailModal`), delete confirmation (`delete-confirm-box.tsx`).
- **Theme state**: `components/layout/theme-provider.tsx` (context) + `theme-toggle.tsx` (control), independent of TanStack Query.
- **Session state**: derived from `lib/auth-client.ts`'s session hook, not duplicated into another store.
- No global client state library (Redux/Zustand) is used — state stays as local as possible, scoped to the feature that needs it.

---

## 8. Important Files

| File                                       | Why it matters                                                                                                          |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                           | Root layout — wraps the app in providers (theme, query, auth context) and mounts global chrome (navbar/footer).         |
| `db/schema.ts`                             | Single source of truth for every table; drives migrations and all query typing.                                         |
| `lib/auth.ts` / `lib/auth-client.ts`       | Auth boundary — every protected route/action depends on these.                                                          |
| `lib/utils.ts`                             | Houses `cn()` and shared formatters (date formatting merged in here from the old `utils/` folder).                      |
| `config/app-config.ts`                     | Central place for site metadata / feature flags — check here before hardcoding constants elsewhere.                     |
| `features/admin/components/admin-view.tsx` | Composition root for the admin dashboard tabs/sections.                                                                 |
| `components/shared/query-provider.tsx`     | TanStack Query client setup; if data isn't refreshing, check the config here first.                                     |
| `drizzle.config.ts`                        | Points Drizzle Kit at `db/schema.ts` and the migrations output folder — needed for any `db:generate`/`db:push` command. |

---

## 9. Coding Rules

1. **`app/` stays thin.** Pages only import a feature view and render it (plus metadata exports). No fetching, no business logic, no large JSX trees directly in `page.tsx`.
2. **One view per feature.** The public export of `features/<name>/components/<name>-view.tsx` is the only thing a page should import from that feature.
3. **kebab-case filenames** everywhere outside of Next's reserved files (`page.tsx`, `layout.tsx`, `route.ts`, etc.), matching the existing `components/ui/*` convention.
4. **Don't reach across features.** A component in `features/projects/` should not import from `features/certificates/`. Shared UI belongs in `components/ui/` or `components/shared/`; shared logic belongs in `lib/`.
5. **API routes are the only place that touches `db/client.ts` directly.** Feature components call the API, never Drizzle, directly.
6. **New global static data goes in `data/`; feature-specific data goes in `features/<name>/data/`.** If in doubt, ask "does anything outside this feature use it?" — if no, it's feature-local.
7. **Auth checks live in `layout.tsx` or the route handler**, not scattered inside individual components.
8. **No new global state library** without discussion — prefer TanStack Query for server state and local `useState` for UI state.
9. **shadcn primitives in `components/ui/` are not to be edited for one-off styling.** Compose/wrap them in the feature or `components/shared/` instead, so upstream updates stay clean.
10. **Every new feature follows the standard shape** (`components/`, optional `data/`, optional `hooks/`/`types/`) — don't invent a new folder pattern per feature.

---

_This document reflects the target structure agreed on for the migration to `app/` (App Router) + `features/`. Update it whenever a new feature or top-level folder is added._
