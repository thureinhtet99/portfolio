"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "./ui/skeleton";
import { FooterType } from "@/types/index.type";

export function FooterClientComponent({
  githubURL,
  facebookURL,
  linkedInURL,
}: FooterType) {
  const currentYear = new Date().getFullYear();
  const { data: session, isPending } = useSession();
  const socialLinks = [
    { href: githubURL, icon: FaGithub, label: "GitHub" },
    { href: facebookURL, icon: FaFacebook, label: "Facebook" },
    { href: linkedInURL, icon: FaLinkedin, label: "LinkedIn" },
  ].filter((item) => item.href);

  return (
    <footer className="mt-12 border-t border-border/70 bg-background/70">
      <div className="app-shell px-4 py-6 sm:px-6 lg:px-8">
        <div className="surface-panel flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Portfolio
            </p>
            <h4 className="mt-1 text-sm text-muted-foreground">
              © {currentYear}{" "}
              {isPending ? (
                <Skeleton className="inline-flex h-3 w-[100px]" />
              ) : !session ? (
                "username"
              ) : (
                session.user?.name
              )}
              . All rights reserved.
            </h4>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {socialLinks.map((socialLink) => {
                const Icon = socialLink.icon;

                return (
                  <Link
                    key={socialLink.label}
                    href={socialLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={socialLink.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
