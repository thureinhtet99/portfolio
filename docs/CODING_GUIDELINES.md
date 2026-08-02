# CODING_GUIDELINES.md

This is the current folder structure:

```
├── app/                                        -> next.js routing, layout, metadata, route handlers
│   ├── loading.tsx                              -> scramble/typewriter loading screen (global)
│   ├── not-found.tsx
│   ├── layout.tsx                               -> root layout: fonts, providers, navbar/footer
│   ├── globals.css                              -> global styles, design tokens
│   │
│   ├── (public)/                                -> public route group (doesn't affect URLs)
│   │   ├── page.tsx                             -> renders <HomeView />
│   │   ├── layout.tsx                           -> passthrough wrapper
│   │   ├── about/
│   │   │   └── page.tsx                         -> renders <AboutView />
│   │   ├── contact/
│   │   │   └── page.tsx                         -> client contact form
│   │   ├── leave-a-note/
│   │   │   └── page.tsx                         -> renders <LeaveANoteView /> (giscus)
│   │   ├── labs/
│   │   │   └── page.tsx                         -> renders <LabsView /> (placeholder)
│   │   ├── projects/
│   │   │   ├── page.tsx                         -> renders <ProjectsView />
│   │   │   └── [slug]/
│   │   │       └── page.tsx                     -> renders <ProjectDetailView />
│   │   ├── timeline/
│   │   │   └── page.tsx                         -> renders <TimelineView />
│   │   └── posts/
│   │       ├── page.tsx                         -> renders <PostsView />
│   │       └── [slug]/
│   │           └── page.tsx                     -> renders <PostDetailView />
│   │
│   ├── admin/                                   -> admin route (auth-gated)
│   │   ├── layout.tsx
│   │   └── page.tsx                             -> login form or <AdminView />, based on session
│   │
│   └── api/                                     -> api endpoints, one folder per resource
│       ├── auth/[...all]/route.ts
│       ├── admin/create-user/route.ts
│       ├── projects/route.ts
│       ├── timelines/route.ts
│       ├── work-experiences/route.ts
│       ├── posts/route.ts
│       ├── settings/route.ts
│       ├── resume/route.ts
│       ├── send/route.ts
│       ├── upload/route.ts
│       └── github/contributors/route.ts
│
├── features/
│   ├── home/
│   │   └── components/
│   │       ├── home-view.tsx
│   │       ├── widget-section.tsx
│   │       ├── github-activity-widget.tsx
│   │       ├── latest-posts-widget.tsx
│   │       ├── contributions-section.tsx
│   │       ├── location-map.tsx
│   │       └── location-map-client.tsx
│   │
│   ├── about/
│   │   └── components/
│   │       └── about-view.tsx
│   │
│   ├── projects/
│   │   └── components/
│   │       ├── projects-view.tsx
│   │       ├── project-showcase-card.tsx
│   │       ├── project-detail-view.tsx
│   │       ├── project-credentials-panel.tsx
│   │       └── contributors-section.tsx
│   │       (no data/ — DB-backed via app/api/projects)
│   │
│   ├── timeline/
│   │   └── components/
│   │       ├── timeline-view.tsx
│   │       ├── work-experience-with-rail.tsx
│   │       ├── timeline-year-rail.tsx
│   │       └── experience-year-timeline.tsx     -> unused/superseded, do not extend
│   │
│   ├── posts/
│   │   └── components/
│   │       ├── posts-view.tsx
│   │       └── post-detail-view.tsx
│   │       (no data/ — DB-backed via app/api/posts)
│   │
│   ├── leave-a-note/
│   │   └── components/
│   │       └── leave-a-note-view.tsx
│   │
│   ├── lab/
│   │   └── components/
│   │       └── labs-view.tsx
│   │
│   └── admin/
│       ├── components/
│       │   ├── admin-view.tsx
│       │   ├── settings-section.tsx
│       │   ├── timeline-section.tsx
│       │   ├── work-exp-section.tsx
│       │   ├── project-section.tsx
│       │   └── posts-section.tsx
│       └── data/
│           └── menu-items.tsx
│
├── components/                                  # shared/global only
│   ├── ui/                                       # shadcn primitives (new-york style)
│   │   ├── button.tsx, card.tsx, input.tsx, dialog.tsx, ...
│   │   ├── work-experience.tsx                   -> vendored registry component (ncdai/chanhdai.com)
│   │   └── contribution-graph.tsx                -> vendored registry component
│   ├── layout/
│   │   ├── top-navbar.tsx
│   │   ├── footer.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── data/
│   │       └── nav-links.ts
│   ├── providers/
│   │   └── query-provider.tsx
│   ├── shared/
│   │   ├── delete-confirm-box.tsx
│   │   ├── empty-state.tsx
│   │   ├── admin-section-header.tsx
│   │   ├── custom-loading.tsx
│   │   └── fade-animation.tsx
│   └── timescale.tsx                             # standalone horizontal-timescale primitive (/timeline only)
│
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── base-url.ts
│   ├── get-cached-contributions.ts
│   └── utils.ts
│
├── db/
│   ├── schema.ts
│   ├── client.ts                                 # picks turso.ts vs sqlite.ts based on VERCEL env
│   ├── turso.ts
│   └── sqlite.ts
│
├── drizzle/                                      # auto-generated, never hand-edited
│   ├── 0000_moaning_salo.sql … 0005_sweet_puppet_master.sql
│   └── meta/
│
├── data/                                         # only cross-feature/global static data
│   ├── skills.tsx                                # currently unreferenced, reserved for About rework
│   └── countries.json                            # currently unreferenced, reserved for About rework
│
├── types/
│   └── index.type.ts
│
├── hooks/
│   ├── use-crud.ts                               # useCrudResource — generic admin CRUD via TanStack Query
│   ├── use-image-upload.ts
│   └── use-mobile.ts
│
├── config/
│   └── app-config.ts
│
├── public/
│   ├── profile.jpg, profile.svg
│   └── TRH.png, TRH.svg
│
├── docs/
│   ├── PROJECT_MAP.md
│   ├── CODING_GUIDELINES.md
│   ├── DESIGN_SYSTEM.md
│   └── References.md                             -> structural inspiration + historical decision log (§12 superseded)
│
├── AGENTS.md                                     -> root agent instructions
├── drizzle.config.ts
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
├── components.json
├── package.json
└── .env.example
```

---

## Coding Standards

**Components**

- Functional only
- PascalCase
- Server Components by default; add `"use client"` only for state, effects, or browser APIs

**Hooks**

- Prefix with `use`
- Reusable, resource-agnostic logic (like CRUD or image upload) goes in `hooks/`, not copy-pasted per feature

**Utilities**

- camelCase

**Types**

- PascalCase
- Shared types (used by more than one feature) live in `types/index.type.ts`; feature-local types stay next to the component that uses them

**API routes**

- One `route.ts` per resource in `app/api/<resource>/`
- Method convention: `GET` list, `POST` create, `PUT` update (id in body), `PATCH` bulk reorder only, `DELETE` (`?id=` query param)
- Always return `{ success: boolean, data?, error? }`
- Validate required fields before writing; return `400` on invalid input, `404` when a lookup misses, `500` on unexpected errors

**Prefer**

- Composition
- Reusable hooks (`useCrudResource`, `useImageUpload`) over hand-rolled fetch/state per admin section
- Reusable components

**Avoid**

- Prop drilling
- Deeply nested JSX
- Duplicate logic — especially duplicate fetch/mutation code in admin sections; use `useCrudResource`

**Always**

- Use TypeScript, no `any`
- Validate input with Zod (forms, and any user-supplied API payload that needs shape checks beyond required-field presence)
- Use async/await
- Return early
- Run `npm run lint` and `npm run typecheck` before considering a change done

---

## Naming Conventions

- Folders/files: `kebab-case` (except Next.js reserved files: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `not-found.tsx`)
- React components: `PascalCase`
- Hooks: `useCrudResource` in a file like `use-crud.ts`
- Utilities/constants: descriptive camelCase, or `UPPER_SNAKE_CASE` for true constants
- DB tables/columns: `snake_case` in SQL (via Drizzle's `text("column_name")`), `camelCase` in the TS schema object
- API resource folders match their DB table's plural/kebab form (`work-experiences` → `workExperience` table)
