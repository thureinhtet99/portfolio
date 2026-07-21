# AGENTS.md

Root instruction file for AI coding agents. Load deeper docs from `docs/` when needed.

## Project

Personal portfolio for Thu Rein Htet — Next.js 15 App Router.

- Showcase projects, blog posts, and professional profile
- Stay maintainable, fast, and easy to extend

**Design reference:** `docs/References.md` — UX/frontend audit of [jasoncameron.dev](https://jasoncameron.dev/), plus §12 "Locked Decisions" for current styling/theme rules (single fixed dark theme, accent color, resolved widget decisions).

## Stack

| Concern               | Technology                                                   |
| --------------------- | ------------------------------------------------------------ |
| Framework             | Next.js 15 (App Router), React 19                            |
| Language              | TypeScript                                                   |
| Styling               | Tailwind CSS v4, `tailwindcss-animate`, `tailwind-variants`  |
| UI components         | Radix UI primitives + shadcn/ui wrappers in `components/ui/` |
| Forms                 | `react-hook-form` + `@hookform/resolvers` + `zod`            |
| Data fetching / cache | `@tanstack/react-query`                                      |
| Database              | Drizzle ORM, `@libsql/client` (LibSQL/SQLite)                |
| Auth                  | `better-auth`                                                |
| Email                 | `nodemailer`                                                 |
| Media storage         | `cloudinary`                                                 |
| Animation             | `framer-motion`, `react-type-animation`                      |
| Icons                 | `lucide-react`, `react-icons`                                |
| Markdown              | `react-markdown`                                             |
| Toasts                | `sonner`                                                     |

## Instructions

Always:

- use TypeScript
- prefer Server Components
- use Server Actions when appropriate
- reuse existing components
- follow project architecture
- keep components small
- use async/await
- validate with Zod

Never:

- use `any`
- duplicate business logic
- create duplicate components
- bypass authentication
- fetch directly inside UI components
- install new dependencies without justification

## Workflow

Before writing code:

1. Read `docs/PROJECT_MAP.md` (structure) and `docs/References.md` (feature spec + §12 Locked Decisions — check this before changing anything visual/theme-related)
2. Search existing implementation — reuse components and utilities
3. Write code
4. Run lint (`next lint`) and typecheck (`tsc --noEmit`)
5. Update docs if architecture changed
