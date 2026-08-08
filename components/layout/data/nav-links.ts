/**
 * Single source of truth for route → human-readable label mappings.
 *
 * Used by:
 *   - `components/layout/breadcrumbs.tsx`  (breadcrumb trail)
 *   - Any future nav "More" dropdown that needs display labels
 *
 * Keys are the raw URL segment (no leading slash).
 * The empty-string key "" maps to the root breadcrumb "~" and is only
 * relevant to breadcrumbs — nav components don't need it.
 */
export const routeLabels: Record<string, string> = {
  "": "~",
  about: "about",
  projects: "projects",
  timeline: "timeline",
  posts: "posts",
  contact: "contact",
  admin: "admin",
  "leave-a-note": "leave a note",
  labs: "labs",
};

export const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/posts", label: "Posts" },
];

export const imageCards = [
  {
    href: "/labs",
    label: "Labs",
    description: "Beyond coding",
    image: "/profile.jpg",
  },
];
