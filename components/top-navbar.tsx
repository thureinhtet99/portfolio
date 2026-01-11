"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CircleUserRound, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { title: "Home", url: "/" },
  { title: "Timeline", url: "/timeline" },
  { title: "Projects", url: "/projects" },
  { title: "Certificates", url: "/certificates" },
  { title: "Contact", url: "/contact" },
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
      {/* Top Navbar */}
      <header className="sticky top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <CircleUserRound size={40} className="text-primary" />
            <div className="hidden sm:block">
              <h3 className="font-semibold text-2xl">Thu Rein Htet</h3>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === link.url
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/50 hover:text-foreground"
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
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
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
              className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm top-16"
              onClick={toggleMenu}
            />
            <motion.nav
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-16 left-0 right-0 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto bg-background border-b shadow-lg"
            >
              <div className="p-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      pathname === link.url
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
