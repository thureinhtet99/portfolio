"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const TARGET = "loading...";
const CHARS = "abcdefghijklmnopqrstuvwxyz.";
const PAUSE_MS = 600; // how long to hold the fully-revealed text before restarting

type ScrambleLoadingProps = {
  /**
   * "full"  → text-primary (global loading screen, full accent colour)
   * "muted" → text-primary/60 (inline section loaders, dimmed)
   */
  variant?: "full" | "muted";
  className?: string;
};

export function ScrambleLoading({
  variant = "full",
  className,
}: ScrambleLoadingProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let revealed = 0;
    let typeInterval: ReturnType<typeof setInterval>;
    let pauseTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const scramble = () => {
      revealed = 0;
      typeInterval = setInterval(() => {
        let out = TARGET.slice(0, revealed);
        for (let i = revealed; i < TARGET.length; i++) {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(out);

        if (Math.random() > 0.55) revealed++;

        if (revealed >= TARGET.length) {
          setDisplay(TARGET);
          clearInterval(typeInterval);

          // hold on the fully revealed text, then restart the scramble loop
          pauseTimeout = setTimeout(() => {
            if (!cancelled) scramble();
          }, PAUSE_MS);
        }
      }, 55);
    };

    scramble();
    return () => {
      cancelled = true;
      clearInterval(typeInterval);
      clearTimeout(pauseTimeout);
    };
  }, []);

  const textColor = variant === "full" ? "text-primary" : "text-primary/60";

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <span
        className={cn(
          "text-base hover:text-muted-foreground transition-colors shrink-0",
          textColor,
        )}
      >
        ~
      </span>
      <span className="flex items-center">
        <span className="mr-1">/</span>
        <span
          className={cn(
            "text-base hover:text-muted-foreground transition-colors",
            textColor,
          )}
        >
          {display}
        </span>
      </span>
      <span className="inline-block h-4 w-2 animate-pulse-slow bg-primary" />
    </div>
  );
}
