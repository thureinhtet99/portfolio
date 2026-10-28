# AGENTS.md

Root instruction file for AI coding agents. Load deeper docs from `docs/` when needed.

## Project

Personal portfolio for Thu Rein Htet — Next.js App Router, with a public site and an authenticated admin dashboard.

- Showcase projects, work experience, blog posts, timeline and a professional profile
- Stay maintainable, fast, and easy to extend

**Docs map:**

- `docs/PROJECT_MAP.md` — architecture, data flow, routing, auth, state management
- `docs/CODING_GUIDELINES.md` — folder structure, coding standards, naming conventions
- `docs/DESIGN_SYSTEM.md` — colors, typography, spacing, motion, component and accessibility rules (current source of truth for anything visual)

## Stack

| Concern               | Technology                                                                      |
| --------------------- | ------------------------------------------------------------------------------- |
| Framework             | Next.js 16 (App Router), React 19                                               |
| Language              | TypeScript                                                                      |
| Styling               | Tailwind CSS v4, `tailwindcss-animate`, `@tailwindcss/typography`               |
| UI components         | Radix UI primitives + shadcn/ui wrappers (`new-york` style) in `components/ui/` |
| Forms                 | `react-hook-form` + `@hookform/resolvers` + `zod`                               |
| Data fetching / cache | `@tanstack/react-query`                                                         |
| Database              | Drizzle ORM — `better-sqlite3` locally, `@libsql/client` (Turso) on Vercel      |
| Auth                  | `better-auth`                                                                   |
| Email                 | `nodemailer`                                                                    |
| Media storage         | `cloudinary`                                                                    |
| Comments/notes        | `@giscus/react` (GitHub Discussions, `/leave-a-note`)                           |
| Animation             | `framer-motion` (imported as `motion/react`)                                    |
| Icons                 | `lucide-react`, `react-icons`                                                   |
| Markdown              | `react-markdown`                                                                |
| Toasts                | `sonner`                                                                        |
| Analytics             | `@vercel/analytics`                                                             |

## Instructions

Always:

- use TypeScript, no `any`
- prefer Server Components; mark client components with `"use client"` only when needed (state, effects, browser APIs)
- reuse existing components and hooks — check `hooks/use-crud.ts` before hand-rolling admin CRUD state
- follow the feature-based architecture in `docs/PROJECT_MAP.md`
- keep components small and composable
- use async/await
- validate input with Zod

Never:

- duplicate business logic across features
- create a second component that does what an existing one already does
- bypass `better-auth` session checks on admin routes/actions
- fetch directly inside a UI component when a hook or server fetch already exists
- reach across features (`features/x` importing from `features/y`)
- install new dependencies without justification

## Workflow

Before writing code:

1. Read `docs/PROJECT_MAP.md` (structure/data flow) and, for anything visual, `docs/DESIGN_SYSTEM.md`
2. Search the existing implementation — reuse components, hooks, and utilities
3. Write code
4. Run `npm run lint` (eslint) and `npm run typecheck` (`tsc --noEmit`)
5. Flag any deviation from these docs explicitly — never apply it silently
6. Update the relevant doc if architecture, routes, or design tokens changed

## Local setup

Prerequisites: Node 24.22.0 (the only pin, in `Dockerfile`), npm. No Docker, no Turso: locally the app uses a SQLite file via `better-sqlite3`; Turso (`@libsql/client`) is used only when `VERCEL=1`, so never set `VERCEL` or `TURSO_*` locally.

```bash
npm ci                      # honours .npmrc legacy-peer-deps
cp .env.example .env.local  # then fill in (see table); generate the auth secret: openssl rand -base64 32
npm run db:migrate          # creates ./local.db from drizzle/
npm run db:seed             # optional: fake "[SAMPLE]" content (local-only, idempotent)
npm run dev                 # http://localhost:3000 (must be port 3000: auth baseURL is pinned there in dev)
```

Every route reads the DB (root layout reads `setting`), so migrate before first run.

| Variable                                                                                    | Needed for                         | Local value / source                    |
| ------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------- |
| `BETTER_AUTH_SECRET`                                                                        | session signing                    | random; falls back to a public string if unset, so always set it |
| `BETTER_AUTH_URL`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SITE_URL`                           | URLs                               | `http://localhost:3000`                 |
| `SQLITE_DB_PATH`                                                                            | local DB file                      | `./local.db`                            |
| `GMAIL_EMAIL`, `GMAIL_APP_PASSWORD`                                                         | contact form                       | Google app password                     |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY/_SECRET`, `CLOUDINARY_API_KEY/_SECRET` | admin uploads and asset cleanup | Cloudinary dashboard (same key/secret in both pairs; the `NEXT_PUBLIC_` secret is a known naming smell) |
| `NEXT_PUBLIC_GISCUS_REPO/_REPO_ID/_CATEGORY/_CATEGORY_ID`                                   | `/leave-a-note`                    | https://giscus.app                      |
| `GITHUB_TOKEN`, `GITHUB_CONTRIBUTIONS_API_URL`                                              | optional GitHub rate limits / override | optional                            |

Everything except the DB and auth secret is optional for the app to boot; features that lack their keys degrade (contact form 500s, uploads fail, Giscus shows nothing). Katib, GitHub, Nominatim and map tiles need network but fall back gracefully; `next/font/google` needs network at build and dev start.

DB commands: `db:generate` (new migration from `db/schema.ts`), `db:migrate`, `db:push`, `db:studio`, `db:seed`, and `db:reset` (deletes `local.db`, re-migrates, re-seeds). `scripts/check-turso.ts` and `scripts/test-apis.ts` hit Turso when credentials exist: do not run them locally.

Admin access: there is no OAuth. With `npm run dev` running, create the first user in your own terminal (the endpoint is disabled when `NODE_ENV=production`, i.e. under `next build`/`next start`):

```bash
read -s "pw?Admin password (min 8): " && curl -s -X POST http://localhost:3000/api/admin/create-user \
  -H 'content-type: application/json' \
  -d "{\"name\":\"Admin\",\"email\":\"you@example.com\",\"password\":\"$pw\"}"; unset pw
```

Then sign in at `/admin`. Note: any signed-in user passes `requireAdminSession` and sign-up is not disabled, so treat this as a known risk before exposing a deployment.

Checks: `npm run typecheck`, `npm run lint` (`next lint` no longer exists in Next 16). A local `next build` needs a non-localhost URL because `lib/base-url.ts` rejects localhost in production mode, e.g. `NEXT_PUBLIC_BASE_URL=https://portfolio.example npm run build` (do not persist that value).
