# AGENTS.md

This is the root instruction file for AI coding agents. Load deeper docs from `docs/` only when needed.

## What is this project?

Personal portfolio for Thu Rein Htet, built with Next.js 15 App Router. Main goals are:

- Present or showcase projects, blogs, personal assets and profile.
- Stay maintainable, fast, and easy to extend to add further features.

**Design reference:** `docs/References.md` — UX/frontend audit of [jasoncameron.dev](https://jasoncameron.dev/) used as inspiration.

## Project stack

| Concern               | Technology                                                                    |
| --------------------- | ----------------------------------------------------------------------------- |
| Framework             | Next.js 15 (App Router), React 19                                             |
| Language              | TypeScript                                                                    |
| Styling               | Tailwind CSS v4, `tailwindcss-animate`, `tailwind-variants`                   |
| UI components         | Radix UI primitives + shadcn/ui-style wrappers in `components/ui/`            |
| Forms                 | `react-hook-form` + `@hookform/resolvers` + `zod`                             |
| Data fetching / cache | `@tanstack/react-query`                                                       |
| Database              | Drizzle ORM, `@libsql/client` (LibSQL/SQLite), `better-sqlite3` for local dev |
| Auth                  | `better-auth` (with its own CLI for schema generation)                        |
| Email                 | `nodemailer`                                                                  |
| Media storage         | `cloudinary`                                                                  |
| Animation             | `framer-motion`, `react-type-animation`                                       |
| Icons                 | `lucide-react`, `react-icons`                                                 |
| Markdown              | `react-markdown`                                                              |
| Toasts                | `sonner`                                                                      |

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

Before writing code:

1. Read md files from `/docs`
2. Search existing implementation
3. Reuse existing utilities

## Workflow

```text
Start
 │
 ▼
Read AGENTS.md
 │
 ▼
Read PROGRESS.md
 │
 ▼
Read DESIGN_SYSTEM.md
 │
 ▼
Read PROJECT_MAP.md
 │
 ▼
Read CODING_GUIDELINES.md
 │
 ▼
Locate existing implementation
 │
 ▼
Reuse components and utilities
 │
 ▼
Write code
 │
 ▼
Run lint and tests
 │
 ▼
Update documentation if architecture changed
 │
 ▼
Finish
```
