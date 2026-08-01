"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const REDIRECT_SECONDS = 120;
const TYPE_SPEED = 35;

const ROUTES = [
  "/",
  "/about",
  "/projects",
  "/timeline",
  "/certificates",
  "/posts",
  "/contact",
  "/leave-a-note",
];

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname() ?? "/unknown";

  const [typedPath, setTypedPath] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(REDIRECT_SECONDS);
  const [isRedirectCancelled, setIsRedirectCancelled] = useState(false);

  const navigateBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  // Typewriter animation
  useEffect(() => {
    setTypedPath("");
    setIsTypingComplete(false);

    let index = 0;

    const start = window.setTimeout(() => {
      const interval = window.setInterval(() => {
        index++;

        if (index > pathname.length) {
          clearInterval(interval);
          setIsTypingComplete(true);
          return;
        }

        setTypedPath(pathname.slice(0, index));
      }, TYPE_SPEED);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(start);
  }, [pathname]);

  // Redirect countdown
  useEffect(() => {
    if (!isTypingComplete || isRedirectCancelled) return;

    if (remainingSeconds <= 0) {
      navigateBack();
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTypingComplete, isRedirectCancelled, remainingSeconds]);

  return (
    <div className="page-shell flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl overflow-hidden rounded-md border border-muted-foreground/20">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />

          <span className="ml-2 truncate text-xs">
            guest@thureinhtet:~{pathname}
          </span>
        </div>

        {/* Body */}
        <div className="space-y-3 px-5 py-6 text-sm leading-relaxed">
          <p className="flex flex-wrap gap-2">
            <span className="shrink-0 text-accent">guest@thureinhtet:~$</span>
            <span>cd {typedPath}</span>
          </p>

          {isTypingComplete && (
            <>
              <p>bash: cd: {pathname}: No such file or directory</p>

              <p>
                404 — this page doesn&apos;t exist, was moved, or never did.
              </p>

              <p className="flex flex-wrap gap-2 pt-2">
                <span className="shrink-0 text-accent">
                  guest@thureinhtet:~$
                </span>
                <span>ls ./routes</span>
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
                {ROUTES.map((route) => (
                  <Link
                    key={route}
                    href={route}
                    className="inline-block hover:bg-primary hover:text-background"
                  >
                    {route === "/" ? "~" : route}
                  </Link>
                ))}
              </div>

              <p className="flex flex-wrap items-center gap-2 pt-2">
                <span className="shrink-0 text-accent">
                  guest@thureinhtet:~$
                </span>

                <button
                  type="button"
                  onClick={navigateBack}
                  className="hover:bg-primary hover:text-background"
                >
                  cd -
                </button>

                <span># go back</span>
              </p>

              <p className="pt-4 text-xs">
                {isRedirectCancelled ? (
                  "redirect cancelled."
                ) : (
                  <>
                    auto-redirecting in{" "}
                    <span className="tabular-nums text-white text-base">
                      {remainingSeconds}s
                    </span>{" "}
                    —{" "}
                    <button
                      type="button"
                      onClick={() => setIsRedirectCancelled(true)}
                      className="hover:bg-primary hover:text-background cursor-pointer"
                    >
                      kill --redirect
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
