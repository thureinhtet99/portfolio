# Next.js Project Structure

```
├── app/
│   ├── (public)/
│   │   ├── page.tsx                            → renders <HomeView />
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   └── page.tsx                        → renders <ProjectsView />
│   │   ├── certificates/
│   │   │   └── page.tsx                        → renders <CertificatesView />
│   │   └── timeline/
│   │       └── page.tsx                        → renders <TimelineView />
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx                            → renders <AdminView />
│   │
│   ├── api/
│   │   ├── auth/[...all]/route.ts
│   │   ├── admin/create-user/route.ts
│   │   ├── projects/route.ts
│   │   ├── certificates/route.ts
│   │   ├── timelines/route.ts
│   │   ├── settings/route.ts
│   │   ├── resume/route.ts
│   │   ├── send/route.ts
│   │   └── upload/route.ts
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── features/
│   ├── home/
│   │   └── components/
│   │       └── home-view.tsx                   ← app/HomeClientComponent.tsx
│   │
│   ├── projects/
│   │   ├── components/
│   │   │   ├── projects-view.tsx               ← app/projects/ProjectsClientComponent.tsx
│   │   │   ├── project-showcase-card.tsx       ← components/project-showcase-card.tsx
│   │   │   ├── project-credentials-panel.tsx   ← components/project-credentials-panel.tsx
│   │   │   └── project-detail-modal.tsx        ← components/ProjectDetailModal.tsx
│   │   └── data/
│   │       └── projects.ts                     ← data/projects.ts
│   │
│   ├── certificates/
│   │   ├── components/
│   │   │   └── certificates-view.tsx           ← app/certificates/CertificatesClientComponent.tsx
│   │   └── data/
│   │       └── certificates.ts                 ← data/certificates.ts
│   │
│   ├── timeline/
│   │   ├── components/
│   │   │   └── timeline-view.tsx               ← app/timeline/TimelineClientComponent.tsx
│   │   └── data/
│   │       └── experiences.ts                  ← data/experiences.ts
│   │
│   └── admin/
│       ├── components/
│       │   ├── admin-view.tsx                  ← (new: extracted from app/admin/page.tsx)
│       │   ├── project-section.tsx             ← app/admin/components/ProjectSection.tsx
│       │   ├── certificate-section.tsx         ← app/admin/components/CertificateSection.tsx
│       │   ├── timeline-section.tsx            ← app/admin/components/TimelineSection.tsx
│       │   └── settings-section.tsx            ← app/admin/components/SettingsSection.tsx
│       └── data/
│           └── menu-items.tsx                  ← data/admin/menu-items.tsx
│
├── components/                                  # shared/global only
│   ├── ui/                                      # unchanged (shadcn primitives)
│   │   ├── button.tsx, card.tsx, input.tsx, dialog.tsx, ...
│   ├── layout/
│   │   ├── top-navbar.tsx                      ← components/top-navbar.tsx
│   │   ├── top-navbar-wrapper.tsx              ← components/TopNavbarWrapper.tsx
│   │   ├── footer.tsx                          ← components/Footer.tsx
│   │   ├── theme-toggle.tsx                    ← components/theme-toggle.tsx
│   │   └── theme-provider.tsx                  ← components/theme-provider.tsx
│   └── shared/
│       ├── delete-confirm-box.tsx              ← components/DeleteConfirmBox.tsx
│       └── query-provider.tsx                  ← components/QueryProvider.tsx
│
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── base-url.ts
│   └── utils.ts                                ← merged with utils/formate-date.ts
│
├── db/
│   ├── schema.ts
│   └── client.ts
│
├── drizzle/                                     # unchanged
│
├── data/                                        # only cross-feature/global static data
│   ├── skills.tsx
│   ├── education.ts
│   └── countries.json
│
├── types/
│   └── index.type.ts
│
├── hooks/
│   └── use-mobile.ts
│
├── config/
│   └── app-config.ts
│
├── public/
│   ├── profile.svg
│   └── TRH.svg
│
├── drizzle.config.ts
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
├── components.json
├── package.json
└── .env.development.local
```

---

# Documentation Structure

```
docs/
│
├── architecture.md
├── project-map.md
├── api.md
├── database.md
├── authentication.md
├── frontend.md
├── backend.md
├── deployment.md
├── coding-guidelines.md
├── design-system.md
├── environment.md
├── roadmap.md
├── changelog.md
├── contributing.md
├── troubleshooting.md
└── decisions.md
```

---

# README.md

The README should answer:

- What is this project?
- Features
- Tech stack
- Installation
- Environment variables
- Running locally
- Folder structure
- Deployment
- License

---

# AGENTS.md

This is the main instruction file for AI coding agents.

Example:

```md
# AI Agent Instructions

This repository uses:

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

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

1. Read docs/project-map.md
2. Read docs/coding-guidelines.md
3. Search existing implementation
4. Reuse existing utilities
```

---

# project-map.md

Purpose:

Explain the entire project.

Contents:

- Architecture
- Folder responsibilities
- Data flow
- Feature flow
- Routing
- Authentication
- State management
- Important files
- Coding rules

---

# architecture.md

Example:

```
Browser
     │
     ▼
Next.js App Router
     │
     ▼
Server Actions
     │
     ▼
Prisma
     │
     ▼
PostgreSQL
```

Also describe:

- authentication
- caching
- rendering strategy
- API flow

---

# api.md

Document every endpoint.

Example:

```
POST /api/login

Body

{
    email
    password
}

Response

{
    user
    session
}
```

---

# database.md

Explain every model.

Example:

```
User

Fields

- id
- email
- password
- role

Relations

User
 ├── Posts
 ├── Comments
 └── Sessions
```

---

# authentication.md

Explain

- Better Auth
- session lifecycle
- middleware
- protected routes
- login flow
- logout flow

---

# frontend.md

Describe

- routing
- layouts
- loading UI
- error handling
- component architecture
- styling
- forms
- React Query
- Server Components

---

# backend.md

Describe

- API structure
- Server Actions
- validation
- database access
- repositories
- services

---

# deployment.md

Include

- Docker
- Docker Compose
- Vercel
- Railway
- VPS
- Nginx

Commands

```
docker compose up

pnpm build

pnpm start
```

---

# coding-guidelines.md

Example

# Coding Standards

Components

- Functional only
- PascalCase

Hooks

- Prefix with use

Utilities

- camelCase

Types

- PascalCase

Prefer

- composition
- reusable hooks
- reusable components

Avoid

- prop drilling
- deeply nested JSX
- duplicate logic

Always

- use TypeScript
- validate input
- use async/await
- return early

---

# design-system.md

Document

Typography

Spacing

Colors

Buttons

Forms

Cards

Icons

Animations

Dark mode

Responsive breakpoints

---

# environment.md

Document every environment variable.

Example

```
DATABASE_URL

AUTH_SECRET

NEXT_PUBLIC_APP_URL

UPLOADTHING_SECRET

RESEND_API_KEY
```

---

# roadmap.md

Current

- Authentication
- Dashboard
- Blog

Upcoming

- Notifications
- Payments
- Analytics
- AI Search

---

# changelog.md

Keep track of releases.

Example

```
v1.2.0

Added

- Dashboard

Improved

- Authentication

Fixed

- Mobile Navbar
```

---

# troubleshooting.md

Common problems.

Example

```
Prisma Client not generated

Run

pnpm prisma generate
```

---

# decisions.md

Document important architectural decisions.

Example

```
Decision

Use Server Actions instead of REST.

Reason

Less boilerplate.

Tradeoffs

Cannot be consumed externally.
```

---

# CONTRIBUTING.md

Explain

- Branch naming
- Commit style
- Pull requests
- Code review
- Testing
- Linting

---

# Recommended Root Files

```
README.md
AGENTS.md
CLAUDE.md
GEMINI.md
CURSOR.md
WINDSURF.md
```

Most AI assistants will read `AGENTS.md` automatically if present. The additional files can contain tool-specific guidance if you need it, but many teams simply keep everything in `AGENTS.md` and link to the documentation in `docs/`.

---

# Recommended AI Agent Workflow

```text
Start
 │
 ▼
Read AGENTS.md
 │
 ▼
Read project-map.md
 │
 ▼
Read coding-guidelines.md
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

This layout is close to what you'll find in well-maintained production repositories: a clear separation of application code, documentation, testing, configuration, and AI guidance. It scales well as your project grows and makes it easier for both human contributors and AI agents to navigate the codebase.

## Common Commands

```bash
# Development
npm run dev               # Start dev server (next dev)
npm run build             # Production build
npm run start             # Start production server
npm run lint              # ESLint

# Database (Drizzle)
npm run db:generate       # Generate migration files from schema changes
npm run db:migrate        # Apply migrations
npm run db:push           # Push schema directly (no migration files)
npm run db:drop           # Drop a migration
npm run db:studio         # Open Drizzle Studio

# Auth
npm run auth:generate     # Regenerate better-auth schema/types
```

Whenever `db/schema.ts` changes, run `npm run db:generate` (and `db:migrate` or `db:push`) so the `drizzle/` migration files and snapshots stay in sync. Do not hand-edit files under `drizzle/meta/`.

If `lib/auth.ts` (better-auth config) changes in a way that affects the schema, run `npm run auth:generate` and re-run the Drizzle generate/migrate steps.

## Conventions
