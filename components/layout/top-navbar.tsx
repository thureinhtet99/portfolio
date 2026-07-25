"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const routeLabels: Record<string, string> = {
  about: "about",
  projects: "projects",
  certificates: "certificates",
  timeline: "timeline",
  posts: "posts",
  contact: "contact",
  admin: "admin",
};

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
  // { href: "/api/resume", label: "Resume", external: true },
];

const moreLinks = [
  { href: "/posts", label: "Posts" },
  // { href: "/timeline", label: "Timeline" },
  // { href: "/contact", label: "Contact" },
];

export function TopNavbar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const segments = pathname.split("/").filter(Boolean);

  const isAdmin = segments[0] === "admin";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isMoreActive = moreLinks.some((link) => isActive(link.href));

  if (isAdmin) return null;

  return (
    <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-sm py-3">
      <div className="app-shell flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-base text-primary hover:text-muted-foreground transition-colors shrink-0"
          >
            ~
          </Link>
          {segments.map((segment, i) => {
            const href = `/${segments.slice(0, i + 1).join("/")}`;
            const label = routeLabels[segment] || segment;
            return (
              <span key={href} className="flex items-center">
                <span>/</span>
                <Link
                  href={href}
                  className="text-base text-primary hover:text-muted-foreground transition-colors"
                >
                  {label}
                </Link>
              </span>
            );
          })}
          <span>/</span>
          <span className="inline-block h-4 w-2 animate-pulse-slow bg-primary" />
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-10 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:bg-primary hover:text-background",
                isActive(link.href) ? "text-white" : "",
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className={cn(
                " text-sm transition-colors hover:text-foreground flex items-center gap-1",
                isMoreActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              More
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  moreOpen && "rotate-180",
                )}
              />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-border/70 bg-card/95 p-1 shadow-lg backdrop-blur-sm">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block rounded-md px-3 py-2  text-sm transition-colors hover:bg-foreground/5",
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/api/resume"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileUser />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="text-sm">Resume</TooltipContent>
          </Tooltip> */}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border/70 bg-background/95 px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2  text-sm transition-colors hover:bg-foreground/5",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-1 border-t border-border/40" />
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2  text-sm transition-colors hover:bg-foreground/5",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
