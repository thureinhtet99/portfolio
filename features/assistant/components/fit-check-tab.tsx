"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { INPUT_LIMITS, OWNER_NAME } from "../constants";
import type { useFitCheck } from "../hooks/use-fit-check";
import type { FitMatch } from "../types";

type FitCheck = ReturnType<typeof useFitCheck>;

const MIN_LENGTH = 40;

const matchLabel: Record<FitMatch, string> = {
  strong: "strong match",
  partial: "partial match",
  gap: "gap",
};

const matchVariant: Record<FitMatch, "default" | "secondary" | "outline"> = {
  strong: "default",
  partial: "secondary",
  gap: "outline",
};

export function FitCheckTab({
  fit,
  onNavigate,
}: {
  fit: FitCheck;
  onNavigate: () => void;
}) {
  const { state, run, cancel, reset } = fit;
  const [draft, setDraft] = useState("");
  const isLoading = state.status === "loading";
  const canRun = draft.trim().length >= MIN_LENGTH && !isLoading;

  return (
    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm">
      <p className="text-muted-foreground">
        Paste a job description to see how it lines up with {OWNER_NAME}&apos;s
        work. The result is based only on what is on this site, and gaps are
        shown honestly.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (canRun) void run(draft);
        }}
        className="space-y-2"
      >
        <label htmlFor="fit-input" className="sr-only">
          Job description
        </label>
        <Textarea
          id="fit-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={INPUT_LIMITS.maxJobDescriptionChars}
          rows={8}
          placeholder="Paste the job description here..."
          className="resize-y"
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs tabular-nums text-muted-foreground">
            {draft.length} / {INPUT_LIMITS.maxJobDescriptionChars}
          </span>
          {isLoading ? (
            <Button type="button" variant="outline" onClick={cancel}>
              Cancel
            </Button>
          ) : (
            <Button type="submit" disabled={!canRun}>
              Analyze fit
            </Button>
          )}
        </div>
      </form>

      <div aria-live="polite" aria-busy={isLoading}>
        {isLoading && (
          <p role="status" className="text-muted-foreground">
            analyzing...
          </p>
        )}

        {state.status === "error" && (
          <p role="alert" className="text-destructive">
            {state.message}
          </p>
        )}

        {state.status === "done" && (
          <section aria-label="Fit check result" className="space-y-4">
            <p>{state.result.summary}</p>

            <ul className="space-y-3">
              {state.result.requirements.map((item, index) => (
                <li
                  key={`${item.requirement}-${index}`}
                  className="space-y-1.5 border border-muted-foreground/20 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={matchVariant[item.match]}>
                      {matchLabel[item.match]}
                    </Badge>
                    <span className="font-medium">{item.requirement}</span>
                  </div>
                  <p className="text-muted-foreground">{item.evidence}</p>
                  {item.source && (
                    <Link
                      href={item.source.url}
                      onClick={onNavigate}
                      className="inline-block border border-muted-foreground/20 px-2 py-0.5 text-xs transition-colors hover:bg-primary hover:text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {item.source.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Clear result
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
