# CODING_GUIDELINES.md

This is the current folder structure:

```
├── app/                                        -> next.js routing, layout, metadata, route handlers
│   ├── (public)/                               -> public routes
│   │   ├── page.tsx                            -> renders <HomeView />
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── about/
│   │   │   └── page.tsx                        -> renders <AboutView />
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   └── page.tsx                        -> renders <ProjectsView />
│   │   ├── certificates/
│   │   │   └── page.tsx                        -> renders <CertificatesView />
│   │   ├── timeline/
│   │   │   └── page.tsx                        -> renders <TimelineView />
│   │   └── posts/
│   │       ├── page.tsx                        -> renders <PostsView />
│   │       └── [slug]/
│   │           └── page.tsx                    -> renders <PostDetailView />
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
│   │   ├── posts/route.ts
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
│   │       ├── home-view.tsx
│   │       ├── github-activity-widget.tsx
│   │       └── latest-posts-widget.tsx
│   │
│   ├── about/
│   │   └── components/
│   │       └── about-view.tsx
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
│   ├── posts/
│   │   └── components/
│   │       ├── posts-view.tsx
│   │       └── post-detail-view.tsx
│   │
│   └── admin/
│       ├── components/
│       │   ├── admin-view.tsx
│       │   ├── project-section.tsx
│       │   ├── certificate-section.tsx
│       │   ├── timeline-section.tsx
│       │   ├── posts-section.tsx
│       │   └── settings-section.tsx
│       └── data/
│           └── menu-items.tsx
│
├── components/                                  # shared/global only
│   ├── ui/                                      # unchanged (shadcn primitives)
│   │   ├── button.tsx, card.tsx, input.tsx, dialog.tsx, ...
│   ├── layout/
│   │   ├── top-navbar.tsx
│   │   ├── footer.tsx
│   │   └── breadcrumbs.tsx
│   ├── providers/
│   │   └── query-provider.tsx
│   └── shared/
│       └── delete-confirm-box.tsx
│
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── base-url.ts
│   ├── motion.ts
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
│
├── docs/
│   ├── CODING_GUIDELINES.md
│   ├── PROJECT_MAP.md
│   └── REFERENCES.md                            -> feature spec + locked styling/theme decisions (§12)
│
├── AGENTS.md                                    -> root agent instructions
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

**Components**

- Functional only
- PascalCase

**Hooks**

- Prefix with `use`

**Utilities**

- camelCase

**Types**

- PascalCase

**Prefer**

- Composition
- Reusable hooks
- Reusable components

**Avoid**

- Prop drilling
- Deeply nested JSX
- Duplicate logic

**Always**

- Use TypeScript
- Validate input (Zod)
- Use async/await
- Return early

---

## Naming Conventions

- Folders/files: `kebab-case`
- React components: `PascalCase`
- Hooks: `useScreenSize` in files like `use-screen-size.ts`
- Utilities/constants: descriptive camelCase or `UPPER_SNAKE_CASE` constants
