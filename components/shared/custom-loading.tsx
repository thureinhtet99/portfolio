"use client";

import { useEffect, useState } from "react";

const TARGET = "loading...";
const CHARS = "abcdefghijklmnopqrstuvwxyz.";
const PAUSE_MS = 600; // how long to hold the fully-revealed text before restarting

export default function CustomLoading() {
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

  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-base text-primary hover:text-muted-foreground transition-colors shrink-0">
        ~
      </span>
      <span className="flex items-center">
        <span className="mr-1">/</span>
        <span className="text-base text-primary hover:text-muted-foreground transition-colors">
          {display}
        </span>
      </span>
      <span className="inline-block h-4 w-2 animate-pulse-slow bg-primary" />
    </div>
  );
}
