"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  { href: "/about", label: "About" },
  { href: "/posts", label: "Posts" },
  { href: "/projects", label: "Projects" },
  { href: "/api/resume", label: "Resume", external: true },
];

const moreLinks = [
  { href: "/certificates", label: "Certificates" },
  { href: "/timeline", label: "Timeline" },
  { href: "/contact", label: "Contact" },
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

  // Build terminal-style path: ~/seg1/seg2/
  const terminalPath = segments.length === 0
    ? "~"
    : `~/${segments.map((s) => routeLabels[s] || s).join("/")}`;

  if (isAdmin) return null;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="app-shell flex items-center justify-between px-6 py-4">
        {/* Terminal path */}
        <Link
          href="/"
          className="font-mono text-base text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          {terminalPath}/
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[var(--accent-signal)] align-middle" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={cn(
                "font-mono text-sm transition-colors hover:text-foreground",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground"
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
                "font-mono text-sm transition-colors hover:text-foreground flex items-center gap-1",
                isMoreActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              More
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  moreOpen && "rotate-180"
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
                      "block rounded-md px-3 py-2 font-mono text-sm transition-colors hover:bg-white/5",
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 font-mono text-sm transition-colors hover:bg-white/5",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
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
                  "rounded-md px-3 py-2 font-mono text-sm transition-colors hover:bg-white/5",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
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
