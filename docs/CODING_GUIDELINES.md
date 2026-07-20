# CODING_GUIDELINES.md

- Maintainability: feature-local code is easier to remove/refactor without orphans.
- Discoverability: contributors find behavior where routes/features live.
- Ease of change: less context-switching between distant folders.

## v3 Project Structure

> **This is the current structure.** The v3 migration was completed in S5 (2026-07-20).
> For a high-level overview, see `PROJECT_MAP.md`.

```
├── app/                                        -> next.js routing, layout, metadata, route handlers
│   ├── (public)/                               -> public routes
│   │   ├── page.tsx                            -> renders <HomeView />
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   └── page.tsx                        -> renders <ProjectsView />
│   │   ├── certificates/
│   │   │   └── page.tsx                        -> renders <CertificatesView />
│   │   └── timeline/
│   │       └── page.tsx                        -> renders <TimelineView />
│   │
│   ├── admin/                                  -> admin route
│   │   ├── layout.tsx
│   │   └── page.tsx                            -> renders <AdminView />
│   │
│   ├── api/                                    -> api endpoints
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
│   ├── layout.tsx                              -> main layout
│   └── globals.css                             -> global style
│
├── features/
│   ├── home/
│   │   └── components/
│   │       └── home-view.tsx
│   │
│   ├── projects/
│   │   ├── components/
│   │   │   ├── projects-view.tsx
│   │   │   ├── project-showcase-card.tsx
│   │   │   ├── project-credentials-panel.tsx
│   │   │   └── project-detail-modal.tsx
│   │   └── data/
│   │       └── projects.ts
│   │
│   ├── certificates/
│   │   ├── components/
│   │   │   └── certificates-view.tsx
│   │   └── data/
│   │       └── certificates.ts
│   │
│   ├── timeline/
│   │   ├── components/
│   │   │   └── timeline-view.tsx
│   │   └── data/
│   │       └── experiences.ts
│   │
│   └── admin/
│       ├── components/
│       │   ├── admin-view.tsx
│       │   ├── project-section.tsx
│       │   ├── certificate-section.tsx
│       │   ├── timeline-section.tsx
│       │   └── settings-section.tsx
│       └── data/
│           └── menu-items.tsx
│
├── components/                                  # shared/global only
│   ├── ui/                                      # unchanged (shadcn primitives)
│   │   ├── button.tsx, card.tsx, input.tsx, dialog.tsx, ...
│   ├── layout/
│   │   ├── top-navbar.tsx
│   │   ├── top-navbar-wrapper.tsx
│   │   ├── footer.tsx
│   │   ├── theme-toggle.tsx
│   │   └── breadcrumbs.tsx
│   ├── providers/
│   │   ├── theme-provider.tsx
│   │   └── query-provider.tsx
│   └── shared/
│       └── delete-confirm-box.tsx
│
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── base-url.ts
│   └── utils.ts
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

├── docs/
│   ├── CODING_GUIDELINES.md
│   └── PROJECT_MAP.md
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

## Coding Standards

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

## Naming conventions used in this repo

- Folders/files: `kebab-case`
- React components: `PascalCase`
- Hooks: `useScreenSize` in files like `use-screen-size.ts`
- Utilities/constants: descriptive camelCase or UPPER_SNAKE_CASE constants
