"use client";

import { useCallback, useRef, useState } from "react";
import type { FitCheckResult } from "../types";

type FitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; result: FitCheckResult }
  | { status: "error"; message: string };

const GENERIC_ERROR =
  "Something went wrong. Please try again, or use the contact form.";

/** Lives in the launcher so results survive switching tabs or closing the sheet. */
export function useFitCheck() {
  const [state, setState] = useState<FitState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (jobDescription: string) => {
    if (abortRef.current) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "loading" });

    try {
      const response = await fetch("/api/chat/fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
        signal: controller.signal,
      });
      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const body = data as { message?: string; error?: string } | null;
        setState({
          status: "error",
          message: body?.message ?? body?.error ?? GENERIC_ERROR,
        });
        return;
      }

      const result = data as FitCheckResult | null;
      if (!result || !Array.isArray(result.requirements)) {
        setState({ status: "error", message: GENERIC_ERROR });
        return;
      }
      setState({ status: "done", result });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setState({ status: "idle" });
      } else {
        setState({ status: "error", message: GENERIC_ERROR });
      }
    } finally {
      abortRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => abortRef.current?.abort(), []);
  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ status: "idle" });
  }, []);

  return { state, run, cancel, reset };
}
