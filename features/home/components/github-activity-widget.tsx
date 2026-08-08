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

type Props = {
  commits: KatibCommitItem[];
  languages: KatibLanguage[];
};

export function GitHubActivityWidget({ commits, languages }: Props) {
  const hasCommits = commits.length > 0;
  const hasLanguages = languages.length > 0;

  if (!hasCommits && !hasLanguages) {
    return (
      <div className="w-full p-4 sm:p-5 border border-muted-foreground/20 rounded-md">
        <div className="flex items-center gap-2 mb-4">
          <BsActivity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Recent commits</h3>
        </div>
        <p className="text-sm text-muted-foreground/80">Activity unavailable</p>
      </div>
    );
  }

  const totalSize = languages.reduce((sum, l) => sum + l.size, 0);

  return (
    <div className="w-full p-4 sm:p-5 border border-muted-foreground/20 rounded-md">
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
              className="flex items-start justify-between gap-2 text-sm"
            >
              <div className="flex items-center gap-1 truncate">
                <Link
                  href={commit.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate block text-white hover:text-primary transition-colors"
                >
                  {commit.repo.split("/").pop()}
                </Link>
                :
                <Link
                  href={commit.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate block hover:text-primary transition-colors"
                >
                  {commit.messageHeadline}
                </Link>
              </div>
              <div className="flex items-center">
                {commit.additions > 0 && (
                  <span className="text-green-400"> +{commit.additions}</span>
                )}
                {commit.deletions > 0 && (
                  <span className="text-red-400"> -{commit.deletions}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Language Bar */}
      {hasLanguages && (
        <div className="flex h-2 w-full overflow-hidden rounded-md border border-muted-foreground/20">
          {languages.map((lang) => {
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
