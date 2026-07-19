"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Award, Home, Mail, Code, FlaskConical, Share2 } from "lucide-react";
import { FaGithub, FaFacebook, FaLinkedin } from "react-icons/fa";
import { ModeToggle } from "@/components/theme-toggle";
import { APP_CONFIG } from "@/config/app-config";

type SocialLink = {
  href: string;
  label: "GitHub" | "Facebook" | "LinkedIn";
};

const navLinks = [
  { title: "Home", url: APP_CONFIG.ROUTE.HOME, icon: Home },
  {
    title: APP_CONFIG.ROUTE.TIMELINE,
    url: `/${APP_CONFIG.ROUTE.TIMELINE}`,
    icon: FlaskConical,
  },
  {
    title: APP_CONFIG.ROUTE.PROJECTS,
    url: `/${APP_CONFIG.ROUTE.PROJECTS}`,
    icon: Code,
  },
  {
    title: APP_CONFIG.ROUTE.CERTIFICATES,
    url: `/${APP_CONFIG.ROUTE.CERTIFICATES}`,
    icon: Award,
  },
  {
    title: APP_CONFIG.ROUTE.CONTACT,
    url: `/${APP_CONFIG.ROUTE.CONTACT}`,
    icon: Mail,
  },
];

export function TopNavbar({
  socialLinks = [],
}: {
  socialLinks?: SocialLink[];
}) {
  const pathname = usePathname();
  const [socialOpen, setSocialOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const iconByLabel = {
    GitHub: FaGithub,
    Facebook: FaFacebook,
    LinkedIn: FaLinkedin,
  } as const;

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSocialOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const socialIcons = socialLinks.map((socialLink) => {
    const Icon = iconByLabel[socialLink.label];
    return (
      <Link
        key={socialLink.label}
        href={socialLink.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={socialLink.label}
        className="flex h-10 w-10 items-center justify-center rounded-full text-background/80 transition-colors hover:bg-background/15 hover:text-background"
      >
        <Icon className="h-5 w-5" />
      </Link>
    );
  });

  return (
    <header className="fixed inset-x-0 bottom-4 z-50 px-4 sm:px-6 lg:px-8">
      <div
        ref={wrapperRef}
        className="relative mx-auto flex w-full max-w-3xl items-center justify-center"
      >
        {/* Main nav pill */}
        <nav className="relative mx-auto flex w-full max-w-md items-center gap-2 rounded-2xl border border-border/40 bg-foreground/90 px-4 py-2 text-background shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          <div className="flex flex-1 items-center justify-center gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.url;
              return (
                <Link
                  key={link.url}
                  href={link.url}
                  aria-label={link.title}
                  className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full text-[0.65rem] font-medium leading-none transition-all ${
                    isActive
                      ? "bg-background text-foreground"
                      : "text-background/80 hover:bg-background/10 hover:text-background"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              );
            })}

            {socialLinks.length > 0 && (
              <>
                <div className="h-8 w-px shrink-0 bg-background/20" />

                {/* Toggle button — wraps a relative container so the popup anchors to it */}
                <ModeToggle className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-background/80 transition-all hover:bg-background/10 hover:text-background" />
                <div className="relative shrink-0">
                  {/* Mobile: vertical popup above the toggle button */}
                  <div
                    className={`
                      absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2
                      flex flex-col items-center gap-1
                      rounded-2xl border border-border/40 bg-foreground/90 px-2 py-2
                      shadow-[0_8px_24px_rgba(0,0,0,0.15)] backdrop-blur-xl
                      transition-all duration-300 origin-bottom
                      lg:hidden
                      ${
                        socialOpen
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-90 translate-y-2 pointer-events-none"
                      }
                    `}
                  >
                    {socialIcons}
                  </div>

                  <button
                    onClick={() => setSocialOpen((prev) => !prev)}
                    aria-label="Toggle social links"
                    aria-expanded={socialOpen}
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                      socialOpen
                        ? "bg-background/15 text-background"
                        : "text-background/70 hover:bg-background/10 hover:text-background"
                    }`}
                  >
                    <Share2
                      className={`h-5 w-5 transition-transform duration-300 ${
                        socialOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Desktop: floating pill to the right */}
        {socialLinks.length > 0 && (
          <div
            className={`
              absolute right-0 hidden items-center gap-2 rounded-2xl
              border border-border/40 bg-foreground/90 p-1 text-background
              shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl
              transition-all duration-300 origin-left
              lg:flex
              ${
                socialOpen
                  ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                  : "opacity-0 -translate-x-2 scale-95 pointer-events-none"
              }
            `}
          >
            {socialIcons}
          </div>
        )}
      </div>
    </header>
  );
}
