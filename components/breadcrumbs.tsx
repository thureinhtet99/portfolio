"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routeLabels: Record<string, string> = {
  "": "~",
  projects: "projects",
  certificates: "certificates",
  timeline: "timeline",
  contact: "contact",
  admin: "admin",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] === "admin") return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
        <li>
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            ~
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const label = routeLabels[segment] || segment;

          return (
            <li key={href} className="flex items-center gap-1.5">
              <span aria-hidden="true">/</span>
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-foreground"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
