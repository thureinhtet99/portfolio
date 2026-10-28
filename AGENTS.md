# AGENTS.md

Root instruction file for AI coding agents. Everything else lives in `docs/`; load what you need.

## Project

Personal portfolio for Thu Rein Htet: Next.js App Router with a public site and an authenticated admin dashboard.

**Docs:**

- `docs/PROJECT_MAP.md`: stack, architecture, routing, data flow, auth, state, local setup
- `docs/CODING_GUIDELINES.md`: folder structure, coding standards, naming conventions
- `docs/DESIGN_SYSTEM.md`: colors, typography, spacing, motion, components, accessibility (source of truth for anything visual)

## Rules

Always:

- use TypeScript, no `any`
- prefer Server Components; add `"use client"` only for state, effects, or browser APIs
- reuse existing components and hooks (check `hooks/use-crud.ts` before hand-rolling admin CRUD)
- keep components small and composable; use async/await
- validate input with Zod

Never:

- duplicate business logic or create a second component that does what one already does
- bypass `better-auth` session checks on admin routes/actions
- fetch inside a UI component when a hook or server fetch already exists
- import across features (`features/x` from `features/y`)
- install new dependencies without justification

## Workflow

1. Read `docs/PROJECT_MAP.md` (and `docs/DESIGN_SYSTEM.md` for anything visual); search for existing code to reuse
2. Write code
3. Run `npm run lint` and `npm run typecheck`
4. Flag any deviation from the docs explicitly; never apply it silently
5. Update the relevant doc if architecture, routes, or design tokens changed
