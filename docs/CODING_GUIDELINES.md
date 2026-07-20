# CODING_GUIDELINES.md

- Maintainability: feature-local code is easier to remove/refactor without orphans.
- Discoverability: contributors find behavior where routes/features live.
- Ease of change: less context-switching between distant folders.

## Actual Project Structure

```
├── app/                                        -> next.js routing, layout, metadata, route handlers
│   ├── page.tsx                                -> Home page (fetches data, renders HomeClientComponent)
│   ├── layout.tsx                              -> Main layout (providers + navbar + footer)
│   ├── globals.css                             -> Global styles (Tailwind v4, oklch tokens, utility classes)
│   ├── loading.tsx                             -> Global loading spinner
│   ├── not-found.tsx                           -> 404 page
│   ├── HomeClientComponent.tsx                 -> Client component for home page (hero, about, projects, GitHub widget)
│   │
│   ├── projects/
│   │   └── page.tsx                            -> renders <ProjectsView />
│   │
│   ├── certificates/
│   │   ├── page.tsx                            -> renders <CertificatesClientComponent />
│   │   └── CertificatesClientComponent.tsx     -> Client component for certificates page
│   │
│   ├── timeline/
│   │   ├── page.tsx                            -> renders <TimelineClientComponent />
│   │   └── TimelineClientComponent.tsx         -> Client component for timeline page
│   │
│   ├── contact/
│   │   └── page.tsx                            -> Contact form (inline client component)
│   │
│   ├── admin/                                  -> admin route
│   │   ├── layout.tsx                          -> Admin layout (minimal wrapper)
│   │   ├── page.tsx                            -> Admin dashboard (login + tabs)
│   │   └── components/
│   │       ├── SettingsSection.tsx
│   │       ├── ProjectSection.tsx
│   │       ├── CertificateSection.tsx
│   │       └── TimelineSection.tsx
│   │
│   └── api/                                    -> api endpoints
│       ├── auth/[...all]/route.ts
│       ├── admin/create-user/route.ts
│       ├── projects/route.ts
│       ├── certificates/route.ts
│       ├── timelines/route.ts
│       ├── settings/route.ts
│       ├── resume/route.ts
│       ├── send/route.ts
│       └── upload/route.ts
│
├── features/
│   ├── home/
│   │   └── components/
│   │       └── github-activity-widget.tsx      -> GitHub activity display widget
│   │
│   └── projects/
│       ├── components/
│       │   ├── projects-view.tsx               -> Projects listing view
│       │   ├── project-showcase-card.tsx       -> Project card component
│       │   ├── project-detail-modal.tsx        -> Detail modal
│       │   └── project-credentials-panel.tsx   -> Demo credentials panel
│       └── data/
│           └── projects.ts                     -> Static project data
│
├── components/                                  # shared/global only
│   ├── ui/                                      # shadcn primitives
│   │   ├── button.tsx, card.tsx, input.tsx, dialog.tsx, skeleton.tsx, ...
│   ├── top-navbar.tsx
│   ├── TopNavbarWrapper.tsx
│   ├── Footer.tsx
│   ├── theme-toggle.tsx
│   ├── theme-provider.tsx
│   ├── QueryProvider.tsx
│   └── DeleteConfirmBox.tsx
│
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── base-url.ts
│   ├── motion.ts                               -> Framer Motion presets (sectionReveal, cardReveal)
│   └── utils.ts                                -> cn() utility
│
├── db/
│   ├── schema.ts
│   └── client.ts
│
├── drizzle/                                     # auto-generated migrations
│
├── data/                                        # cross-feature/global static data
│   ├── skills.tsx
│   ├── experiences.ts
│   ├── education.ts
│   ├── certificates.ts
│   ├── countries.json
│   └── admin/
│       └── menu-items.tsx
│
├── utils/
│   └── formate-date.ts                          -> formatDate() utility
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
├── docs/
│   ├── CODING_GUIDELINES.md
│   ├── PROJECT_MAP.md
│   ├── DESIGN_SYSTEM.md
│   ├── PROGRESS.md
│   └── References.md
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
