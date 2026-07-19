# CODING_GUIDELINES.md

- Maintainability: feature-local code is easier to remove/refactor without orphans.
- Discoverability: contributors find behavior where routes/features live.
- Ease of change: less context-switching between distant folders.

## Actual Project Structure

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
