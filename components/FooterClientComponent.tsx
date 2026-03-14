"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FooterType } from "@/types/index.type";

export function FooterClientComponent({
  githubURL,
  facebookURL,
  linkedInURL,
}: FooterType) {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { href: githubURL, icon: FaGithub, label: "GitHub" },
    { href: facebookURL, icon: FaFacebook, label: "Facebook" },
    { href: linkedInURL, icon: FaLinkedin, label: "LinkedIn" },
  ].filter((item) => item.href);

  return (
    <footer className="mt-12 bg-background/70">
      <div className="app-shell px-4 py-4 sm:px-6 lg:px-8">
        <div className="surface-panel flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h4 className="mt-1 text-sm text-muted-foreground">
            © {currentYear} Thu Rein Htet. All rights reserved.
          </h4>

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
                    className="flex size-10 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:text-foreground hover:bg-card-foreground/10"
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
