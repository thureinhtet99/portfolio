"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routeLabels: Record<string, string> = {
  "": "~",
  about: "about",
  projects: "projects",
  certificates: "certificates",
  timeline: "timeline",
  posts: "posts",
  contact: "contact",
  admin: "admin",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "admin") return null;

  const isLast = true;

  return (
    <nav aria-label="Breadcrumb" className="mb-8 px-6 pt-4">
      <ol className="font-mono text-base text-muted-foreground flex items-center gap-0">
        <li>
          <Link
            href="/"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:rounded-sm"
          >
            ~
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const label = routeLabels[segment] || segment;

          return (
            <li key={href} className="flex items-center">
              <span aria-hidden="true" className="text-muted-foreground/50">/</span>
              {index === segments.length - 1 ? (
                <span aria-current="page" className="text-foreground">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:rounded-sm"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
        {isLast && (
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[var(--accent-signal)]" />
        )}
      </ol>
    </nav>
  );
}
