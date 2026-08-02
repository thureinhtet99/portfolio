# FINALIZATION.md

Audit performed directly against `thureinhtet99/portfolio` (`development` branch, live repo — not just the doc set) on 2026-08-02. Each item below is scoped enough to hand to an agent independently. "Done when" is the acceptance check — verify with `npm run typecheck` and `npm run lint` after every item, per `AGENTS.md` workflow.

Two items are explicitly **excluded from this pass** per decision:

- **Footer status-strip mismatch** — kept as-is, not fixed. See "Intentionally Kept" below.
- **Undocumented routes (`/labs`, `/leave-a-note`)** — documentation-only, no code change. See "Documentation-Only" below.

---

## 1. 🔴 Security — unauthenticated write API routes

**Files:**
`app/api/projects/route.ts`, `app/api/certificates/route.ts`, `app/api/timelines/route.ts`, `app/api/work-experiences/route.ts`, `app/api/posts/route.ts`, `app/api/settings/route.ts` (POST), `app/api/upload/route.ts`

**Problem:** No route calls `auth.api.getSession`, and there's no `middleware.ts` covering `/api/*`. The admin login (`app/admin/page.tsx`) is a client-side `useSession()` gate on the UI only — every mutating endpoint above is reachable by anyone, unauthenticated, right now.

**Fix:**

- Add a shared server helper, e.g. `lib/require-admin.ts`:
  ```ts
  export async function requireAdminSession(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) throw new UnauthorizedError();
    return session;
  }
  ```
- Call it at the top of every `POST` / `PUT` / `PATCH` / `DELETE` handler in the files above (not `GET` — those stay public since public pages read from them).
- Return `401` on failure, in the same `{ success: false, error }` shape the rest of the API already uses.
- `app/api/upload/route.ts` POST needs the same guard — it's currently open to anonymous file uploads to your Cloudinary account.

**Done when:** every non-GET handler in the listed files 401s without a valid session, and the admin dashboard still works end-to-end while logged in.

---

## 2. 🔴 Security — Cloudinary secret under a `NEXT_PUBLIC_` name

**Files:** `.env.example`, `app/api/upload/route.ts`, `app/api/projects/route.ts`, `app/api/settings/route.ts`

**Problem:** `NEXT_PUBLIC_CLOUDINARY_API_SECRET` and `NEXT_PUBLIC_CLOUDINARY_API_KEY` are server-only today, but the `NEXT_PUBLIC_` prefix means any future import into a client component silently ships the secret to every visitor's browser.

**Fix:**

- Rename to `CLOUDINARY_API_SECRET`, `CLOUDINARY_API_KEY` (drop `NEXT_PUBLIC_`). Keep `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` public — it's non-sensitive and fine to expose.
- Update all three route files and `.env.example`.

**Done when:** `grep -rn "NEXT_PUBLIC_CLOUDINARY_API" .` returns nothing outside `.env.example`'s old value being removed.

---

## 3. 🟡 Scope — revert live embedded map to the locked spec

**Files:** `features/home/components/location-map.tsx`, `location-map-client.tsx`, `app/(public)/page.tsx` (`geocodeCity`), `package.json`

**Problem:** `location-map.tsx` renders a real `react-leaflet` map with a live tile layer, fed by a Nominatim geocode call in `page.tsx`. This directly contradicts `docs/REFERENCES.md` §12: _"Location widget: static 'Currently Based In' text + pin icon. Not a live/embedded map."_

**Fix:**

- Remove `location-map.tsx` and `location-map-client.tsx`.
- Remove the `geocodeCity` function and its call site in `app/(public)/page.tsx`; replace with the static "Currently Based In {residence}" text + pin icon pattern (per §12).
- Remove `leaflet`, `react-leaflet`, `@types/leaflet` from `package.json`.
- No doc change needed here — §12 already describes the correct target state; the code just needs to match it.

**Done when:** homepage shows static location text + pin icon, no map tiles load, no Nominatim network call happens on render, and the three `leaflet*` packages are gone from `package.json`/lockfile.

---

## 4. ⚪ Intentionally kept — footer status-strip mismatch

**File:** `components/layout/footer.tsx`

**Status:** `docs/REFERENCES.md` §12 specifies `● All systems nominal · {commitHash} · {siteViews} views`. Current footer only shows `{siteViews} views` — no status dot, no commit hash. **No code change requested.** Documenting the deviation so it's not re-flagged as a bug in a future audit: this is a deliberate, kept-as-is simplification of the original spec.

---

## 5. 🟡 Scope — delete stale duplicate doc

**File:** `docs/DESIGN_SYSTEM.md`

**Problem:** This file (240 lines) is still present even though it's supposed to have been deleted and consolidated into `docs/REFERENCES.md` §12 "Locked Decisions." Having both live risks them drifting out of sync.

**Fix:** `git rm docs/DESIGN_SYSTEM.md`. Confirm nothing in `AGENTS.md` or `PROJECT_MAP.md` still references it as a live doc (currently only `REFERENCES.md` §12 should be the source of truth for design tokens/theme rules).

**Done when:** the four-doc set (`AGENTS.md`, `CODING_GUIDELINES.md`, `PROJECT_MAP.md`, `REFERENCES.md`) is back to being the complete, non-duplicated doc set.

---

## 6. ⚪ Documentation-only — undocumented routes

**Files:** `docs/REFERENCES.md` (§1 Site Map), `docs/PROJECT_MAP.md` (§5 Routing)

**Status:** `/labs` (`app/(public)/labs/page.tsx` → `features/lab/components/labs-view.tsx`) and `/leave-a-note` (`app/(public)/leave-a-note/page.tsx` → `features/leave-a-note/components/leave-a-note-view.tsx`) both exist and work but aren't listed in either doc. **No code change** — just add these rows so the docs match reality:

`REFERENCES.md` §1 Site Map — add:

| Route           | Purpose                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| `/labs`         | Secondary showcase, linked via the "Beyond coding" image card on the homepage |
| `/leave-a-note` | Guestbook-style note form for visitors                                        |

`PROJECT_MAP.md` §5 Routing — add:

| Route           | File                                 | Notes                                                      |
| --------------- | ------------------------------------ | ---------------------------------------------------------- |
| `/labs`         | `app/(public)/labs/page.tsx`         | Renders `<LabsView />` from `features/lab/`                |
| `/leave-a-note` | `app/(public)/leave-a-note/page.tsx` | Renders `<LeaveANoteView />` from `features/leave-a-note/` |

**Done when:** both tables include these rows.

---

## 7. 🟠 Architecture — direct DB access in `app/(public)/page.tsx`

**File:** `app/(public)/page.tsx`

**Problem:** The home page calls `db.select().from(project)` and `db.update/insert(setting)` directly, bypassing the API layer — this breaks `PROJECT_MAP.md` rule #5 ("API routes are the only place that touches `db/client.ts` directly"). The view-count write is also a blocking DB round-trip on every homepage request.

**Fix:**

- Move the featured-projects query behind `GET /api/projects?featured=true` (or a dedicated endpoint) and call it via `fetch`, matching how `getExperiences()` already calls `/api/work-experiences`.
- Move the view-count increment into its own route (e.g. `POST /api/settings/increment-view`) and call it without blocking the page render — either `fetch(..., { cache: "no-store" })` fired without `await`-ing before returning JSX, or via Next's `after()` API so it runs post-response.

**Done when:** `app/(public)/page.tsx` contains no `db.*` calls, and homepage TTFB isn't gated on the view-count write.

---

## 8. 🟠 Finish the TanStack Query migration

**Files:** `features/admin/components/settings-section.tsx`, `project-section.tsx`, `work-exp-section.tsx`

**Status:** `certificate-section.tsx`, `posts-section.tsx`, `timeline-section.tsx` are fully migrated to `useCrudResource`. `settings-section.tsx` hasn't been touched (12 raw `fetch` calls). `project-section.tsx` and `work-exp-section.tsx` are mostly migrated but each still has 1 leftover raw `fetch`.

**Fix:** Port `settings-section.tsx` onto `useCrudResource/useImageUpload` following the pattern already established in the three migrated sections. Clean up the one remaining `fetch` each in `project-section.tsx` and `work-exp-section.tsx`.

**Done when:** `grep -c "fetch(" features/admin/components/*.tsx` returns `0` for all six section files.

---

## 9. 🟢 Fix `--foreground` / `--muted-foreground` contrast

**File:** `app/globals.css`

**Problem:** Both tokens resolve to the same `var(--gray)` (`#ababae`), flattening heading vs. body/secondary-text contrast.

**Fix:** Introduce a distinct `--muted-foreground` value (dimmer than `--gray` but still ≥4.5:1 against `--dark-gray` background for body text use). Re-run a WCAG AA contrast check on the new pairing before committing, per your existing oklch-verification workflow.

**Done when:** `--foreground` and `--muted-foreground` are visually distinguishable and both pass AA against `--background`.

---

## 10. 🟢 Add a Suspense fallback for the homepage widgets

**File:** `app/(public)/page.tsx`

**Problem:** `<Suspense><WidgetSection /></Suspense>` has no `fallback` — GitHub activity + latest posts render nothing until data resolves.

**Fix:** Add a skeleton fallback matching the pattern already used in `contributions-section.tsx` (`<Suspense fallback={<GitHubContributionsFallback />}>`) — build an equivalent lightweight skeleton for `WidgetSection` and pass it as `fallback`.

**Done when:** homepage shows a skeleton for the GitHub/posts widgets instead of a blank gap while `WidgetSection` resolves.

---

## 11. 🟢 Resolve timeline `type` filtering

**File:** `app/api/timelines/route.ts`

**Problem:** No server-side `type` filtering exists yet — the combined endpoint always returns both `work` and `education` items.

**Fix:** Add `?type=work|education` query-param support to `GET`, matching the pattern already used in `app/api/posts/route.ts` and `app/api/work-experiences/route.ts` (`GET(req: NextRequest)`), and update any client callers to use it instead of filtering client-side.

**Done when:** `GET /api/timelines?type=work` returns only work items, and the timeline view either uses this param or the client-filter approach is documented as the deliberate final choice.

---

## 12. 🟢 Confirm the Katib API domain

**File:** `features/home/components/widget-section.tsx`

**Problem:** `KATIB_BASE = "https://katib.jasoncameron.dev"` — this points at the reference site owner's own instance, not a domain you control. The homepage's GitHub activity widget currently depends on a third party's uptime and rate limits.

**Fix:** Confirm intent. If it should be your own instance, update `KATIB_BASE` to `https://katib.jsn.cam` (or wherever your instance lives) and re-verify the response shape matches what `github-activity-widget.tsx` expects.

**Done when:** `KATIB_BASE` points at a domain you control, or the third-party dependency is a confirmed, deliberate choice.

---

## 13. ⚪ Production readiness — SEO files

**Files (new):** `app/robots.ts`, `app/sitemap.ts`

**Fix:** Add both using Next 15's file-convention APIs. `sitemap.ts` should enumerate static routes plus dynamic `posts/[slug]` and `projects/[slug]` entries from the DB.

**Done when:** `/robots.txt` and `/sitemap.xml` resolve correctly in a production build.

---

## 14. ⚪ Final gate

Run before considering any of the above merged:

```bash
npm run typecheck
npm run lint
```

Confirm any pre-existing errors are unrelated via `git stash` per your standard verification step in `AGENTS.md`.
