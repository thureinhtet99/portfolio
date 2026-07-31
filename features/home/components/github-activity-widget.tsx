"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { BsActivity } from "react-icons/bs";

export type KatibCommitItem = {
  repo: string;
  additions: number;
  deletions: number;
  commitUrl: string;
  committedDate: string;
  oid: string;
  messageHeadline: string;
  messageBody: string;
};

export type KatibLanguage = {
  size: number;
  name: string;
  color: string;
};

export type KatibStreak = {
  currentStreak: number;
  highestStreak: number;
  active: boolean;
};

type Props = {
  commits: KatibCommitItem[];
  languages: KatibLanguage[];
  streak: KatibStreak | null;
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function GitHubActivityWidget({ commits, languages, streak }: Props) {
  const hasCommits = commits.length > 0;
  const hasLanguages = languages.length > 0;

  if (!hasCommits && !hasLanguages && !streak) {
    return (
      <div className="w-full p-4 sm:p-5 border border-muted-foreground/20 rounded-md">
        <div className="flex items-center gap-2 mb-4">
          <BsActivity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Recent commits</h3>
        </div>
        <p className="text-sm text-muted-foreground/40">Activity unavailable</p>
      </div>
    );
  }

  const totalSize = languages.reduce((sum, l) => sum + l.size, 0);
  const topLanguages = languages.slice(0, 5);

  return (
    <div className="w-full max-w-sm p-4 sm:p-5 border border-muted-foreground/20 rounded-md sm:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <BsActivity className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Recent commits</h3>
      </div>

      {/* Commit List */}
      {hasCommits && (
        <div className="space-y-2 mb-4">
          {commits.slice(0, 3).map((commit) => (
            <div
              key={commit.oid}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Link
                href={commit.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate block text-white hover:text-primary transition-colors"
              >
                {commit.repo.split("/").pop()}
              </Link>
              :
              <div className="min-w-0">
                <Link
                  href={commit.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate block hover:text-primary transition-colors"
                >
                  {commit.messageHeadline}
                </Link>
                <span className="text-muted-foreground/60">
                  {timeAgo(commit.committedDate)}
                  {commit.additions > 0 && (
                    <span className="text-green-400"> +{commit.additions}</span>
                  )}
                  {commit.deletions > 0 && (
                    <span className="text-red-400"> -{commit.deletions}</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Language Bar */}
      {hasLanguages && (
        <div className="flex h-2 w-full overflow-hidden rounded-md border border-muted-foreground/20">
          {topLanguages.map((lang) => {
            const percent = totalSize > 0 ? (lang.size / totalSize) * 100 : 0;
            return (
              <Tooltip key={lang.name}>
                <TooltipTrigger asChild>
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: lang.color,
                    }}
                    title={`${lang.name}: ${Math.round(percent)}%`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{lang.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
}
