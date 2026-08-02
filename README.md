# Portfolio

Personal portfolio for **Thu Rein Htet** — a terminal-aesthetic site showcasing projects, work experience, blog posts, and adventures.

**Live:** [thureinhtet-portfolio.vercel.app/](https://thureinhtet-portfolio.vercel.app/)

## Tech Stack

| Concern              | Technology                                    |
| -------------------- | --------------------------------------------- |
| Framework            | Next.js 16 (App Router), React 19             |
| Language             | TypeScript                                    |
| Styling              | Tailwind CSS v4                               |
| UI                   | shadcn/ui (Radix primitives)                  |
| Database             | Drizzle ORM — SQLite locally, Turso on Vercel |
| Auth                 | better-auth                                   |
| Animation            | Framer Motion, React View Transitions         |
| Image/Resume Storage | Cloudinary                                    |
| Email                | Nodemailer                                    |
| Makefile             | Automation tool                               |

## Plans

- [ ] Add `labs` page which show my **skills and adventures beyond coding**
- [ ] AI chat support

## Project Structure

```text
app/          Routes and API handlers
features/     Feature-based modules (home, projects, posts, admin, etc.)
components/   Shared UI components
hooks/        Custom React hooks
lib/          Utilities, auth config, base helpers
db/           Drizzle schema, migrations, client
docs/         Documentation
```

## Agents Docs

This repo includes agent-oriented documentations for context-aware development and implementation.

- [AGENTS.md](/AGENTS.md) - Root instruction file for AI coding agents
- [CODING_GUIDELINES.md](/docs/CODING_GUIDELINES.md) - Coding standards, conventions, and best practices used throughout the project.
- [DESIGN_SYSTEM.md](/docs/DESIGN_SYSTEM.md) - Documentation of project's design principles, UI components, design tokens and styling conventions.
- [PROJECT_MAP.md](/docs/PROJECT_MAP.md) - Overview of project's features, directories, and key points to help developers and AI agents navigate the codebase.

## Getting Started

```bash
git clone https://github.com/thureinhtet99/portfolio.git
cd portfolio
npm install --legacy-peer-deps
```

```bash
cp .env.example .env.local   # fill your values
```

```bash
npm run db:generate && npm run db:migrate
npm run dev
```

## Scripts

| Command            | Description                 |
| ------------------ | --------------------------- |
| `make dev`         | Start dev server            |
| `make build`       | Production build            |
| `make typecheck`   | Type check                  |
| `make db:generate` | Generate Drizzle migrations |
| `make db:migrate`  | Apply migrations            |
| `make db:studio`   | Open Drizzle Studio         |

## Acknowledgements

- [Jason Cameron](https://jasoncameron.dev) — terminal-aesthetic design inspiration
- [theodorusclarence](https://theodorusclarence.com) — features, navbar and pages inspiration
- [Chánh Đại](https://chanhdai.com) — timeline theme and work exps components idea
- [Better Auth](https://better-auth.com) — authentication

## License

Licensed under the MIT License.
