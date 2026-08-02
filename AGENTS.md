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
- `docs/References.md` — original jasoncameron.dev structural/UX inspiration (§1–11). Its §12 "Locked Decisions" is historical and superseded by `DESIGN_SYSTEM.md`/`PROJECT_MAP.md` wherever they disagree — check the current docs, not §12, before touching styling or theme.

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
| Maps                  | `leaflet` / `react-leaflet` (homepage "Currently Based In" widget)              |
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
- reintroduce descoped features: theme/accent picker, light/dark toggle, `/pics`, `/tutorials`, webring, novelty click counter (see `docs/DESIGN_SYSTEM.md` §9)

## Workflow

Before writing code:

1. Read `docs/PROJECT_MAP.md` (structure/data flow) and, for anything visual, `docs/DESIGN_SYSTEM.md`
2. Search the existing implementation — reuse components, hooks, and utilities
3. Write code
4. Run `npm run lint` (eslint) and `npm run typecheck` (`tsc --noEmit`)
5. Flag any deviation from these docs explicitly — never apply it silently
6. Update the relevant doc if architecture, routes, or design tokens changed
