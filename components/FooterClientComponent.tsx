"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "./ui/skeleton";
import { FooterType } from "@/types/index.type";

export function FooterClientComponent({
  githubURL,
  facebookURL,
  linkedInURL,
}: FooterType) {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
  const { data: session, isPending } = useSession();

  return (
    <footer className="border-t mt-8 bg-background">
      <div className="mx-auto p-4">
        {isMobile ? (
          <div className="flex flex-col items-center space-y-4">
            {/* Social Links */}
            <div className="flex items-center justify-center space-x-6">
              <Link
                href={githubURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={githubURL}
              >
                <FaGithub className="h-5 w-5" />
              </Link>
              <Link
                href={facebookURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={facebookURL}
              >
                <FaFacebook className="h-5 w-5" />
              </Link>
              <Link
                href={linkedInURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={linkedInURL}
              >
                <FaLinkedin className="h-5 w-5" />
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <h4 className="text-sm text-muted-foreground capitalize">
                © {currentYear}{" "}
                {isPending ? (
                  <Skeleton className="h-3 w-[100px]" />
                ) : !session ? (
                  "username"
                ) : (
                  session.user?.name
                )}
                . All rights reserved.
              </h4>
            </div>
          </div>
        ) : (
          // Desktop layout - horizontal
          <div className="flex justify-between items-center">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <Link
                href={githubURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={githubURL}
              >
                <FaGithub className="h-5 w-5" />
              </Link>
              <Link
                href={facebookURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={facebookURL}
              >
                <FaFacebook className="h-5 w-5" />
              </Link>
              <Link
                href={linkedInURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={linkedInURL}
              >
                <FaLinkedin className="h-5 w-5" />
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-end">
              <h4 className="text-sm text-muted-foreground capitalize flex items-center">
                © {currentYear}{" "}
                {isPending ? (
                  <Skeleton className="h-3 w-[100px]" />
                ) : !session ? (
                  "username"
                ) : (
                  session.user?.name
                )}
                . All rights reserved.
              </h4>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
