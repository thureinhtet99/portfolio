# Refactor Plan — Implement docs/refactor-plan.md

## Context

`docs/refactor-plan.md` audits the portfolio codebase for duplication and inconsistencies. The plan identifies nine areas to address: TanStack Query adoption, a buggy hardcoded string in `DeleteConfirmBox`, duplicated image-upload logic, uncoordinated loading UIs, hardcoded colors, inline admin form state, reusable hooks, reusable shared components, and style nits. The user wants the plan executed with two exclusions: §5 (hardcoded colors — investigation found only `data/skills.tsx` has `text-white`, on brand icons, and `hover:bg-white/5` does not exist anywhere; this is effectively a no-op) and §6 (move forms to `Sheet` — user explicitly skipped). The user also wants the `settings-section.tsx` migration limited to image upload only — its `{ key, value }` save flow stays as-is.

Two reusable hooks are already on disk and match the API conventions used by every section:

- `hooks/use-crud.ts` — TanStack Query wrapper for `GET` / `POST` / `PUT` / `DELETE?id=` (PATCH reorder and `?type=` DELETE overrides are hand-rolled at the call site).
- `hooks/use-image-upload.ts` — wraps `POST /api/upload`, returns `URL.createObjectURL` previews.

The goal is to migrate all four CRUD admin sections to these hooks, extract two shared components, fix the `DeleteConfirmBox` copy bug, and standardize on `Skeleton` for content placeholders. One section per commit, ordered low-risk → high-risk so each step is reviewable and revertable.

## Excluded work

- **§5 (hardcoded colors):** No-op. `text-white` only exists on brand icons in `data/skills.tsx`; `hover:bg-white/5` is not in the codebase.
- **§6 (Sheet for forms):** Skipped per user. Keep the inline form pattern in all admin sections.

## Critical files to touch

- `components/shared/delete-confirm-box.tsx` — add `title`/`description` props
- `types/index.type.ts` — extend `DeleteConfirmBoxType` with `title`/`description`
- `components/shared/admin-section-header.tsx` — **new**
- `components/shared/empty-state.tsx` — **new**
- `components/shared/custom-loading.tsx` — **delete** (only consumer is `posts-section.tsx`; `app/loading.tsx` has its own copy)
- `features/admin/components/certificate-section.tsx` — migrate to hooks + shared components
- `features/admin/components/project-section.tsx` — migrate to hooks + shared components
- `features/admin/components/posts-section.tsx` — migrate to hooks + shared components
- `features/admin/components/timeline-section.tsx` — migrate to hooks + shared components
- `features/admin/components/settings-section.tsx` — image upload only

The hooks `hooks/use-crud.ts` and `hooks/use-image-upload.ts` are not modified — they already match the plan.

---

## Phase 1 — Quick wins (no behavior risk)

### 1.1 — Extend `DeleteConfirmBox` (§2)

- `types/index.type.ts`: add `title?: string` and `description?: string` to `DeleteConfirmBoxType`. Defaults in the component, not the type.
- `components/shared/delete-confirm-box.tsx`: destructure `title` (default `"Confirm Deletion"`) and `description` (default `"Are you sure you want to delete this item? This action cannot be undone."` — generic, fixes the bug). Use them in `DialogTitle` / `DialogDescription`.
- No call-site changes required; defaults preserve current behavior except for fixing the wrong "timeline entry" copy on certificate/project/posts.

### 1.2 — Create `admin-section-header.tsx` (§8)

New file at `components/shared/admin-section-header.tsx`:

```tsx
type AdminSectionHeaderProps = {
  title: string;
  count?: number;
  onAdd?: () => void;
  addLabel?: string;
};
```

Renders the `CardHeader` + title + optional count badge + optional Add button block currently duplicated in `certificate-section.tsx` and `project-section.tsx`.

### 1.3 — Create `empty-state.tsx` (§8)

New file at `components/shared/empty-state.tsx`:

```tsx
type EmptyStateProps = {
  message: string;
  icon?: React.ReactNode;
};
```

Renders the centered "No X added yet" block duplicated in four sections.

---

## Phase 2 — Hook migrations (one section per commit)

For each section, the migration replaces:

- `useState<T[]>([])` + `load*` + `useEffect(() => { load*() }, [])` + loading flag → `useCrudResource` list query
- `handleAdd` → `create(payload)` after `await upload()` for image sections
- `handleUpdate` → `update({ id, ...payload })` after `await upload()` for image sections
- `handleDelete` → `remove(id)` (or hand-rolled for timeline, see below)

**Stays hand-rolled per call site (not in `useCrudResource`):**

- PATCH reorder (`moveUp` / `moveDown`) — hook does not support PATCH
- `?id=…&type=work|education` DELETE for timelines
- Settings save flow (not CRUD)

### 2.1 — `certificate-section.tsx` (pilot)

- Adopt `useCrudResource<CertificateType>({ resource: APP_CONFIG.ROUTE.CERTIFICATES, labels: { singular: "certificate", plural: "certificates" } })`.
- Adopt `useImageUpload` in `CertificateForm` — replace `imageFile`/`imagePreview`/`isUploading` state, the `FileReader` block, and `setIsUploading` calls.
- New combined `handleSave`: `await upload()` then `create` or `update`. Validation (required fields) before the await.
- PATCH reorder (`moveUp`/`moveDown`) stays hand-rolled — keep the existing toast UX.
- `DeleteConfirmBox` gets `description="Are you sure you want to delete this certificate? This action cannot be undone."`.
- Use `<AdminSectionHeader title="Manage Certificates" onAdd={…} addLabel="Add Certificate" />`.
- Use `<EmptyState message="No certificates added yet." />`.
- Replace the hand-rolled `Array.from({ length: 2 }).map(...)` skeleton with two `Skeleton` rows from `components/ui/skeleton.tsx`.
- Delete `useEffect(() => { loadCertificates() }, [])`, `loadCertificates`, `setCertificatesLoading`, `setIsLoading`.

### 2.2 — `project-section.tsx` (same pattern, more fields)

Same shape as 2.1, plus:

- Keep `ProjectForm`, `ProjectCard`, `ProjectCredentialsPanel`.
- Keep `getDemoCredentialsFromForm` and `getAdoptersFromForm` as module-level helpers; call them inside the new `handleSave`.
- `DeleteConfirmBox` description: `"...this project?..."`.
- `<AdminSectionHeader title="Manage Projects" addLabel="Add Project" />`.
- `<EmptyState message="No projects added yet." />`.

### 2.3 — `posts-section.tsx` (CRUD only, no image)

- `useCrudResource<PostType>({ resource: APP_CONFIG.ROUTE.POSTS, labels: { singular: "post", plural: "posts" } })` — **uses `APP_CONFIG.ROUTE.POSTS` instead of the hardcoded `/api/posts`** (small consistency fix).
- `togglePublished`: replace with `update({ id: post.id, slug, title, excerpt, body, tags, published: !post.published })`.
- PATCH reorder stays hand-rolled.
- Keep the inlined form and `generateSlug` helper untouched.
- `DeleteConfirmBox` description: `"...this post?..."`.
- **Remove `import CustomLoading from "@/components/shared/custom-loading"`** and replace `CustomLoading` with three `Skeleton` rows.
- Posts has no `CardTitle` (header is just the Add button) — leave the raw `CardHeader` block; do not force-fit `AdminSectionHeader`.
- `<EmptyState message="No posts added yet." />`.

### 2.4 — `timeline-section.tsx` (highest risk)

- `useCrudResource<TimelineType>({ resource: APP_CONFIG.ROUTE.TIMELINES, labels: { singular: "timeline entry", plural: "timelines" } })`.
- `create` for `handleAdd`, `update` for `handleUpdate`.
- **Bypass `useCrudResource.remove`** because DELETE needs `?id=…&type=work|education`. Keep `handleDelete` as a one-off `fetch DELETE` that builds the full URL.
- Keep `moveUp(idx, type)` and `moveDown(idx, type)` hand-rolled (PATCH takes `{ timelines: [...] }` with all ids).
- Keep the `useEffect` on `activeTimelineTab` that resets the form on tab switch — it is local form state, not data fetching.
- `DeleteConfirmBox` description: `"...this timeline entry?..."` (this is the only section where the old hardcoded copy was correct).
- `<EmptyState message="No work experience added yet." />` and `<EmptyState message="No education added yet." />`.
- Replace the two hand-rolled skeletons with `Skeleton` lists.
- The section header has no Add button (Add is per-tab) — leave the raw `CardHeader`; do not force-fit `AdminSectionHeader`.

### 2.5 — `settings-section.tsx` (image upload only)

- `handleSaveProfileImage` (lines 75–126): replace the inline `FormData`/`fetch("/api/upload")` block with `useImageUpload`. New flow:
  ```tsx
  const { preview, isUploading, onSelectFile, upload } = useImageUpload(
    imagePreview ?? undefined,
  );
  // on file picked: onSelectFile(file)  → preview updates
  // on Save: const url = await upload(); if (!url) { toast.error("Please select an image first"); return; }
  //         then existing POST /api/settings { key: "profileImage", value: url }
  ```
  Remove `imagePreview`/`isUploading` state for profile (sourced from hook). Disabled state: `disabled={!preview || isUploading}`. `imageLoading` and the `animate-pulse` placeholder div stay.
- **Do not refactor `handleSaveResume`** — it uploads a PDF, but the hook hardcodes `type: "image"` in FormData. Keep the inline 2-step pattern.
- Leave `loadSettings`, `handleSaveField`, the parallel `Promise.all` save batches, and the `Spinner` for inline button progress untouched.

---

## Phase 3 — Loading UI cleanup

### 3.1 — Delete `components/shared/custom-loading.tsx`

After Phase 2.3, no consumer remains. Verify with:

```
grep -r "shared/custom-loading" .
```

then delete the file. `app/loading.tsx` has its own internal copy and is unaffected.

### 3.2 — Standardize on `Skeleton` for content placeholders

Already applied in 2.1–2.4. The remaining loading primitives:

- `app/loading.tsx` — full-page route loader, keep as-is.
- `Spinner` from `components/ui/spinner.tsx` — used as an inline button-progress indicator in `settings-section.tsx`; keep, that is appropriate.
- `Skeleton` from `components/ui/skeleton.tsx` — content placeholders in admin sections and home widgets.

---

## Phase 4 — Home widget loading states (likely no-op)

`latest-posts-widget.tsx` and `github-activity-widget.tsx` are server components that receive data as props — they have no internal loading state. The right place to add a `Skeleton` fallback is at the parent (`features/home/components/home-view.tsx` or `app/page.tsx`) via `<Suspense fallback={<WidgetSectionSkeleton />}>` if the parent does async data fetching. `contributions-section.tsx` already uses a custom `GitHubContributionsFallback` inside a `Suspense` boundary — leave it.

**Action:** Verify whether `home-view.tsx` already shows a loading fallback. If yes, no change. If not and the page can flicker, add `<Suspense fallback={<WidgetSectionSkeleton />}>` around the widget grid.

---

## Phase 5 — Style cleanups

### 5.1 — Remove dead `useEffect(() => { loadX() }, [])` calls

Already done as part of Phase 2. After all migrations, the only `useEffect` calls left in `features/admin/components/` should be in `timeline-section.tsx` (tab-switch form reset) and `settings-section.tsx` (settings load — kept by design).

### 5.2 — Filename / naming audit

All new files follow kebab-case: `use-crud.ts`, `use-image-upload.ts`, `admin-section-header.tsx`, `empty-state.tsx`. No action needed.

---

## Verification (end-to-end)

After all commits, run from `/home/thurein-htet/Projects/portfolio`:

1. **Type check:** `pnpm tsc --noEmit` (or `npm run build`) — confirms hook signatures line up and there are no dead imports.
2. **Lint:** `pnpm lint` — surfaces unused variables after deleting `load*` functions.
3. **Dev server:** `pnpm dev`. Exercise each admin section:
   - **Certificates:** add (no image), add (with image), edit (change image), edit (no image change), delete, move up, move down. Verify the delete dialog says "delete this certificate."
   - **Projects:** same as certificates plus verify demo credentials and adopters round-trip.
   - **Posts:** add, edit, toggle published, delete, reorder. Verify slug auto-gen still fires on title change. Loading state shows `Skeleton`, not `CustomLoading`.
   - **Timeline:** add work (with multiple positions), add education, switch tabs (form resets), edit work, delete work, delete education (verify `?id=…&type=education` works), reorder both tabs.
   - **Settings:** upload profile picture, upload resume (PDF still works), toggle availability, save social links, save about/intro. The profile picture preview should update on file pick and the URL should persist.
4. **Home page:** load `/` and confirm no layout shift; widgets render with real data. If the page can flicker, add the `Suspense` boundary.
5. **Empty states:** Empty each list in the admin UI; confirm `<EmptyState>` renders with the right message.
6. **API smoke test:** `curl` `app/api/certificates`, `/api/projects`, `/api/posts`, `/api/timelines` to confirm routes still respond (we did not touch them, but smoke-test).

---

## Risks summary

| Area                  | Risk                                                           | Mitigation                                                                                                                                                                            |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Certificate / Project | PATCH reorder not covered by `useCrudResource`                 | Keep `moveUp`/`moveDown` function bodies; only the load-on-mount useEffect goes.                                                                                                      |
| Project               | Demo credentials + adopters parsing outside the hook           | Keep helpers at module level; call inside new `handleSave`.                                                                                                                           |
| Posts                 | `togglePublished` is a full-record PUT                         | Replace with `update(...)`; let its onSuccess toast run.                                                                                                                              |
| Posts                 | Slug auto-gen on title change                                  | Unchanged.                                                                                                                                                                            |
| Timeline              | DELETE needs `?type=` extra param                              | Bypass `useCrudResource.remove`; keep `handleDelete` as a one-off fetch.                                                                                                              |
| Timeline              | Tab-switch form reset                                          | Keep the `useEffect`; it's a local form concern.                                                                                                                                      |
| Settings (image)      | Hook uses `URL.createObjectURL` instead of `FileReader`        | Visually identical for `next/image`; no code change needed.                                                                                                                           |
| Settings (PDF)        | Hook hardcodes `type: "image"`                                 | Do not refactor resume upload.                                                                                                                                                        |
| All                   | Toast wording changes (the hook capitalizes `labels.singular`) | Pass lowercase labels (`"certificate"`, `"post"`, `"project"`, `"timeline entry"`) — the hook's `capitalize` helper produces "Certificate added successfully!" matching today's copy. |
| All                   | Cache invalidation briefly refetches after each mutation       | Acceptable; list may show skeleton for one frame.                                                                                                                                     |
| Home widgets          | No internal loading state (server-resolved)                    | No-op unless parent lacks a `Suspense` boundary.                                                                                                                                      |

---

## Commit order (one commit per item)

1. Extend `DeleteConfirmBox` + extend `DeleteConfirmBoxType`.
2. Add `admin-section-header.tsx`.
3. Add `empty-state.tsx`.
4. Migrate `certificate-section.tsx` (pilot — adopts both hooks + shared components).
5. Migrate `project-section.tsx`.
6. Migrate `posts-section.tsx` (also removes `CustomLoading` import).
7. Migrate `timeline-section.tsx` (highest risk; bypasses `remove`).
8. Refactor `settings-section.tsx` image upload only.
9. Delete `components/shared/custom-loading.tsx`.
10. (Conditional) Add `<Suspense fallback={<WidgetSectionSkeleton />}>` in `home-view.tsx` if the home page can flicker.

Each step is independent and can be reviewed or reverted on its own.
