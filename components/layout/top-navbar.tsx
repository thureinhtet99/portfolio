"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Construction,
  Menu,
  MessageSquare,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { MdOutlineTimeline } from "react-icons/md";
import { imageCards, navLinks, routeLabels } from "./data/nav-links";

const moreLinks = [
  {
    href: "/timeline",
    label: "Timeline",
    description: "A collection of milestones",
    icon: MdOutlineTimeline,
  },
  {
    href: "/leave-a-note",
    label: "Leave a Note",
    description: "Leave me a message",
    icon: MessageSquare,
  },
];

export function TopNavbar({
  viewCount = "0",
  githubUrl = "",
  linkedinUrl = "",
  emailUrl = "",
}: {
  footer?: ReactNode;
  viewCount?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  emailUrl?: string;
}) {
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
    <nav
      className="sticky top-0 z-50 bg-transparent backdrop-blur-md my-3"
      style={{ viewTransitionName: "site-header" }}
    >
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
          <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
            <DropdownMenuTrigger
              className={cn(
                "text-sm transition-colors hover:text-background hover:bg-primary flex items-center gap-1 border-none outline-none cursor-pointer",
                isMoreActive ? "text-white" : "text-muted-foreground",
              )}
            >
              More
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  moreOpen && "rotate-180",
                )}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={14}
              className="flex w-auto h-50 gap-2 rounded-md border border-background p-2 shadow-lg shadow-black/30"
            >
              {/* Left: Image cards */}
              <div className="flex gap-2">
                {imageCards.map((card) => (
                  <DropdownMenuItem key={card.href} asChild>
                    <Link
                      href={card.href}
                      className="relative flex h-auto w-50 flex-col justify-end overflow-hidden rounded-md cursor-pointer group"
                    >
                      {/* <Image
                        src={card.image}
                        alt={card.label}
                        priority
                        fill
                        sizes="200px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      /> */}
                      <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-150">
                        <Construction />
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                      <div
                        className={`relative z-10 p-2 ${
                          pathname === "/labs"
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div className="text-sm font-medium">{card.label}</div>
                        <div className="text-xs">{card.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>

              {/* Right: Icon list */}
              <div className="flex flex-col justify-start gap-3">
                {moreLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.href}
                    asChild
                    className="group data-highlighted:bg-transparent"
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center px-2 text-sm cursor-pointer",
                        isActive(link.href)
                          ? "text-white"
                          : "text-muted-foreground",
                      )}
                    >
                      <link.icon
                        className={cn(
                          "h-6 w-6",
                          isActive(link.href)
                            ? "text-white"
                            : "text-muted-foreground",
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="w-fit transition-colors group-data-highlighted:bg-primary group-data-highlighted:text-background">
                          {link.label}
                        </span>
                        <span className="text-xs">{link.description}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden shadow-lg shadow-black/10 sm:hidden"
          >
            <div className="flex flex-col gap-6 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "transition-colors hover:bg-primary hover:text-background",
                    isActive(link.href)
                      ? "text-white"
                      : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col justify-start gap-4">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors cursor-pointer",
                      isActive(link.href)
                        ? "text-white"
                        : "text-muted-foreground",
                    )}
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      <link.icon className="h-4 w-4" />
                    </span>
                    <span className="font-medium text-base text-foreground hover:bg-primary hover:text-background">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-xs">{viewCount} views</span>
                <div className="flex items-center gap-4">
                  {githubUrl && (
                    <Link
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      <FaGithub className="h-5 w-5" />
                    </Link>
                  )}
                  {linkedinUrl && (
                    <Link
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      <FaLinkedin className="h-5 w-5" />
                    </Link>
                  )}
                  {emailUrl && (
                    <Link
                      href={emailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      <FaEnvelope className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
