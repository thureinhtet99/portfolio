import { cn } from "@/lib/utils";

type TerminalDotsProps = {
  className?: string;
};

/**
 * The three-coloured traffic-light dots used in terminal-window UI chrome
 * (project cards, project detail, 404 page).
 *
 * Matches DESIGN_SYSTEM §6.2 — bg-red-500/80 / bg-yellow-500/80 / bg-green-500/80.
 */
export function TerminalDots({ className }: TerminalDotsProps) {
  return (
    <div className={cn("flex gap-1.5", className)}>
      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
    </div>
  );
}
