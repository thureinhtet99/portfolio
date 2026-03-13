"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { APP_CONFIG } from "@/config/app-config";

const navLinks = [
  { title: "Home", url: APP_CONFIG.ROUTE.HOME },
  { title: APP_CONFIG.ROUTE.TIMELINE, url: `/${APP_CONFIG.ROUTE.TIMELINE}` },
  { title: APP_CONFIG.ROUTE.PROJECTS, url: `/${APP_CONFIG.ROUTE.PROJECTS}` },
  {
    title: APP_CONFIG.ROUTE.CERTIFICATES,
    url: `/${APP_CONFIG.ROUTE.CERTIFICATES}`,
  },
  { title: APP_CONFIG.ROUTE.CONTACT, url: `/${APP_CONFIG.ROUTE.CONTACT}` },
];

export function TopNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 shadow-xs bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="app-shell flex h-[4.5rem] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-85"
            >
              <div className="hidden sm:block">
                <h3 className="text-lg font-semibold tracking-[-0.03em]">
                  TRH
                </h3>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-2 p-1">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all ${
                  pathname === link.url
                    ? "bg-primary text-primary-foreground shadow-[0_10px_25px_-18px_rgba(37,99,235,0.9)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="md:hidden"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 top-[4.5rem] z-40 bg-background/70 backdrop-blur-sm md:hidden"
              onClick={toggleMenu}
            />
            <motion.nav
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 right-0 top-[4.5rem] z-40 border-b border-border/70 bg-background/95 shadow-lg md:hidden"
            >
              <div className="app-shell px-4 py-5 sm:px-6">
                <div className="surface-panel-muted p-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.url}
                      href={link.url}
                      className={`block rounded-2xl px-4 py-3 text-sm font-medium capitalize transition-all ${
                        pathname === link.url
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                      }`}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
