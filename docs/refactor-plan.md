# Refactor Plan — Consistency, Reusable Hooks & Components

Audit of `thureinhtet99/portfolio` (`development` branch) against the project's own
`AGENTS.md`, `docs/CODING_GUIDELINES.md`, `docs/PROJECT_MAP.md`, and `DESIGN_SYSTEM.md`.
The folder structure documented in those three files is already good — this plan does
**not** propose renaming/moving folders. It targets the actual inconsistencies found
inside files: duplicated logic, unused infrastructure, and components that don't reuse
`components/ui/*`.

Findings are ordered by impact. Each has: what's wrong, where, and the fix.

---

## 1. TanStack Query is installed and provided, but almost never used

`components/providers/query-provider.tsx` wraps the whole app in `app/layout.tsx`, and
`PROJECT_MAP.md` §7 states server state should go through TanStack Query. In practice:

```
grep -rl "useQuery\|useMutation" → only app/(public)/contact/page.tsx
grep -l  "await fetch("          → all 5 admin sections
```

Every admin section re-implements the same read/write/loading/error/toast cycle by hand
with `useState` + `useEffect` + raw `fetch`:

| File                                                | Lines | Pattern                    |
| --------------------------------------------------- | ----: | -------------------------- |
| `features/admin/components/project-section.tsx`     |  1038 | manual CRUD + image upload |
| `features/admin/components/timeline-section.tsx`    |  1059 | manual CRUD                |
| `features/admin/components/certificate-section.tsx` |   748 | manual CRUD + image upload |
| `features/admin/components/posts-section.tsx`       |   543 | manual CRUD                |
| `features/admin/components/settings-section.tsx`    |   720 | manual CRUD                |

That's ~4,100 lines carrying near-identical `load*`, `handleAdd`, `handleUpdate`,
`handleDelete`, `resetForm`, loading-state, and toast-on-error logic five times.

**Fix:** one generic hook, `hooks/use-crud-resource.ts` (scaffolded below), built on
`useQuery`/`useMutation`. Each admin section keeps its form JSX but drops all the
fetch/state plumbing. See `hooks/use-crud-resource.ts` and the certificate-section
before/after in §7.

---

## 2. `DeleteConfirmBox` is "shared" but hardcodes one feature's copy

`components/shared/delete-confirm-box.tsx` is imported by `certificate-section.tsx`,
`posts-section.tsx`, `project-section.tsx`, and `timeline-section.tsx`, but its body is
hardcoded:

```tsx
Are you sure you want to delete this timeline entry? This action cannot be undone.
```

So the certificates/posts/projects admin screens all show a delete dialog that talks
about a "timeline entry." This is a correctness bug, not just a style nit.

**Fix:** add optional `title` / `description` props with the current copy as the
default, so existing call sites keep working with zero changes unless they pass copy in:

```tsx
type DeleteConfirmBoxProps = DeleteConfirmBoxType & {
  title?: string;
  description?: string;
};

export default function DeleteConfirmBox({
  deleteDialogOpen,
  setDeleteDialogOpen,
  isLoading,
  handleDelete,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}: DeleteConfirmBoxProps) {
  // ...DialogTitle -> {title}, DialogDescription -> {description}
}
```

Then each section passes its own noun: `description="...delete this certificate?..."`,
`"...this timeline entry?..."`, `"...this project?..."`, `"...this post?..."`.

---

## 3. Duplicated image-upload logic

`certificate-section.tsx` and `project-section.tsx` both inline the same 15-line
upload-to-`/api/upload`-then-swap-preview flow (`formDataUpload.append("file", ...)`,
`append("type", "image")`, `POST /api/upload`, read `.url`, handle failure).

**Fix:** `hooks/use-image-upload.ts` (scaffolded below) — returns `preview`, `file`,
`isUploading`, `onSelectFile`, `upload()`, `reset()`. Both sections call the same hook
instead of hand-rolling it.

---

## 4. Loading UI has three uncoordinated implementations

- remove: `components/ui/spinner.tsx` — the shadcn-style spinner (`Loader2Icon`, `animate-spin`).
- `components/ui/skeleton.tsx` — only used inside `components/ui/sidebar.tsx`, despite

- `components/shared/custom-loading.tsx` — a bespoke scrambling-text loader, used only
  in `posts-section.tsx`.
  `DESIGN_SYSTEM.md` §1.4 explicitly requiring skeleton states for widgets. The three
  home widgets (`github-activity-widget.tsx`, `latest-posts-widget.tsx`,
  `contributions-section.tsx`) each roll their own placeholder markup instead.

**Fix — pick one rule and apply it everywhere:**

- **Full-page / full-section loading** → use `loading.tsx` for full-page loading and `custom-loading` form section loading
  primitives used everywhere else).
- **Content placeholders that preserve layout** (cards, widgets, lists) →
  `Skeleton`, per `DESIGN_SYSTEM.md` §1.4.
- `CustomLoading` is a nice touch for the initial site boot screen (`app/loading.tsx`)
  specifically — keep it there only, don't let it leak into admin CRUD screens.

---

## 5. Hardcoded colors instead of design tokens

`DESIGN_SYSTEM.md` §2 locks the site to one theme driven entirely by semantic tokens
(`text-foreground`, `text-muted-foreground`, etc.) via `app/globals.css`. A handful of
components bypass that with literal Tailwind color utilities:

| File                                       | Line(s)       | Literal            |
| ------------------------------------------ | ------------- | ------------------ |
| `features/home/components/home-view.tsx`   | 142, 155      | `text-white`       |
| `features/about/components/about-view.tsx` | 30, 69        | `text-white`       |
| `features/admin/components/admin-view.tsx` | 62            | `text-white`       |
| `components/layout/top-navbar.tsx`         | 122, 174, 190 | `hover:bg-white/5` |

**Fix:** replace `text-white` with `text-foreground` (headings on the fixed dark theme
resolve to the same visual result but stay theme-token-driven), and
`hover:bg-white/5` with `hover:bg-accent/10` (or whatever the closest existing token is
in `app/globals.css`) so a future palette tweak in one place propagates everywhere.

`data/skills.tsx` icon colors (`text-white`, `text-gray-300` on brand icons) are fine to
leave as-is — those are literal brand-icon colors, not theme chrome.

---

## 6. Admin sections build their own "add/edit inline panel," not `Dialog`

`components/ui/dialog.tsx` exists and is used correctly by `DeleteConfirmBox`,
`project-detail-modal.tsx`, and `admin-view.tsx`. But the add/edit _forms_ inside every
admin section are conditionally rendered inline blocks driven by
`isAdding`/`editingId`, e.g. `project-section.tsx`:

```tsx
{
  (isAdding || editingId) && (
    <ProjectForm
      onSave={editingId ? handleUpdate : handleAdd}
      isEditing={!!editingId}
    />
  );
}
```

This isn't necessarily wrong (inline forms can be intentional for long forms with many
fields), but it's inconsistent with how the rest of the app treats "confirm/transient
UI" (always `Dialog`/`Sheet`), and it means five separate `isAdding`/`editingId` state
pairs. Two options, pick one and apply everywhere:

- **A — keep inline, but extract the state.** A `useEditableList` hook (see §7) that
  owns `isAdding`/`editingId`/`resetForm` so at least the _state machine_ is shared.
- **B — move add/edit into `Sheet`** (`components/ui/sheet.tsx`, already installed,
  unused outside `sidebar.tsx`). Better for long forms on mobile since it doesn't
  compress the list below it.

Recommendation: **B for certificate/project/timeline forms** (many fields, benefit from
a side panel), **A is enough for settings** (single form, no list).

---

## 7. Reusable hooks to add

Two hooks that directly remove the duplication in §1 and §3. Both are provided as real
files alongside this plan — copy them into `hooks/`.

### `hooks/use-crud-resource.ts`

Generic TanStack Query wrapper for the `{ success, data }` / `{ success, error }` shape
every route in `app/api/*` already returns (confirmed in `certificate-section.tsx`,
`project-section.tsx`, etc.). One call replaces `load*` + `handleAdd` + `handleUpdate`

- `handleDelete` + all the `isLoading`/toast boilerplate:

```tsx
const {
  items: certificates,
  isLoading,
  create,
  update,
  remove,
  isMutating,
} = useCrudResource<CertificateType>({
  resource: APP_CONFIG.ROUTE.CERTIFICATES,
  labels: { singular: "certificate", plural: "certificates" },
});
```

### `hooks/use-image-upload.ts`

Wraps the `/api/upload` round trip used by certificates and projects:

```tsx
const { preview, isUploading, onSelectFile, upload, reset } = useImageUpload(
  formData.image,
);
// on submit:
const imageUrl = await upload(); // returns existing formData.image if no new file picked
```

Both files are included at the end of this deliverable set — see
`hooks/use-crud-resource.ts` and `hooks/use-image-upload.ts`.

### Migration order (low-risk → high-risk)

1. `certificate-section.tsx` — smallest CRUD section with image upload, good pilot.
2. `project-section.tsx` — same pattern, more fields.
3. `posts-section.tsx`, `timeline-section.tsx` — CRUD without image upload.
4. `settings-section.tsx` — single-record form, thinnest win but still removes
   duplicate fetch/toast code.

Do them one at a time, in separate commits, so each is easy to review/revert.

---

## 8. Reusable components to add

| Component                                                                                                                                                  | Replaces                                  | Used by                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------- |
| `components/shared/admin-section-header.tsx` — title + count badge + "Add" button, matching the header markup repeated at the top of every `*-section.tsx` | ~10 duplicated lines × 4 sections         | certificate, project, timeline, posts sections |
| `components/shared/empty-state.tsx` — icon + message, for "No certificates yet" / "No projects yet" style empty lists                                      | duplicated empty-list JSX in each section | certificate, project, timeline, posts sections |
| `DeleteConfirmBox` (extend, don't replace — see §2)                                                                                                        | hardcoded copy                            | same 4 sections                                |

These are smaller and lower-risk than the hooks in §7 — safe to do first if you want
quick wins before tackling the data-fetching migration.

---

## 9. Style/naming nits (quick fixes, no behavior change)

- `docs/CODING_GUIDELINES.md` already mandates kebab-case filenames and `use-` prefixed
  hook files — the two new hooks above follow that (`use-crud-resource.ts`,
  `use-image-upload.ts`), keep any future hooks the same way.
- `app/loading.tsx` is the right home for `CustomLoading` per §4 — leave it there,
  just stop importing it elsewhere.
- Once §1 lands, delete the now-dead manual `useEffect(() => { loadX() }, [])` calls —
  don't leave them commented out.

---

## Summary checklist

- [ ] Extend `DeleteConfirmBox` with `title`/`description` props (§2) — fixes a real bug
- [ ] Add `hooks/use-image-upload.ts`, wire into certificate + project sections (§3, §7)
- [ ] Add `hooks/use-crud-resource.ts`, migrate sections one at a time (§1, §7)
- [ ] Standardize loading UI: `Spinner` for full-section, `Skeleton` for content
      placeholders, `CustomLoading` only in `app/loading.tsx` (§4)
- [ ] Replace `text-white` / `hover:bg-white/5` with semantic tokens (§5)
- [ ] Decide inline-form vs `Sheet` for admin add/edit and apply consistently (§6)
- [ ] Add `admin-section-header.tsx` and `empty-state.tsx` shared components (§8)
