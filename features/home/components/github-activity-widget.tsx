"use client";

import { Card } from "@/components/ui/card";
import { Github, GitPullRequest, Star, GitFork } from "lucide-react";

type Event = {
  type: string;
  repo: { name: string };
  payload: {
    action?: string;
    issue?: { title: string };
    pull_request?: { title: string };
  };
  created_at: string;
};

type Props = {
  events: Event[];
  languages: Record<string, number>;
};

export function GitHubActivityWidget({ events, languages }: Props) {
  const hasEvents = events && events.length > 0;
  const hasLanguages = Object.keys(languages).length > 0;

  if (!hasEvents && !hasLanguages) {
    return (
      <div className="surface-panel p-5">
        <h3 className=" text-sm font-semibold text-foreground mb-3">
          GitHub Activity
        </h3>
        <p className=" text-sm text-muted-foreground">
          Activity unavailable
        </p>
      </div>
    );
  }

  const totalRepos = Object.values(languages).reduce((sum, count) => sum + count, 0);
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const eventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <Github className="h-3.5 w-3.5" />;
      case "PullRequestEvent":
        return <GitPullRequest className="h-3.5 w-3.5" />;
      case "WatchEvent":
        return <Star className="h-3.5 w-3.5" />;
      case "ForkEvent":
        return <GitFork className="h-3.5 w-3.5" />;
      default:
        return <Github className="h-3.5 w-3.5" />;
    }
  };

  const eventTitle = (event: Event) => {
    const repoName = event.repo.name.split("/").pop() || event.repo.name;
    switch (event.type) {
      case "PushEvent":
        return (
          <>
            Pushed to <span className="text-foreground">{repoName}</span>
          </>
        );
      case "PullRequestEvent":
        return (
          <>
            {event.payload.action === "opened" ? "Opened" : "Closed"} PR in{" "}
            <span className="text-foreground">{repoName}</span>
          </>
        );
      case "WatchEvent":
        return (
          <>
            Starred <span className="text-foreground">{repoName}</span>
          </>
        );
      case "ForkEvent":
        return (
          <>
            Forked <span className="text-foreground">{repoName}</span>
          </>
        );
      default:
        return (
          <>
            {event.type} on <span className="text-foreground">{repoName}</span>
          </>
        );
    }
  };

  return (
    <div className="surface-panel p-5">
      <h3 className=" text-sm font-semibold text-foreground mb-3">
        ✦ Recent Commits
      </h3>

      {/* Event List */}
      {hasEvents && (
        <div className="space-y-2 mb-4">
          {events.slice(0, 3).map((event, index) => (
            <div key={index} className="flex items-start gap-2  text-xs text-muted-foreground">
              <span className="mt-0.5 shrink-0">{eventIcon(event.type)}</span>
              <span className="truncate">{eventTitle(event)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Language Bar */}
      {hasLanguages && (
        <div className="mt-auto">
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
            {sortedLanguages.map(([lang, count], i) => {
              const percent = (count / totalRepos) * 100;
              const colors = [
                "bg-[var(--primary)]",
                "bg-blue-500",
                "bg-yellow-500",
                "bg-red-500",
                "bg-purple-500",
              ];
              return (
                <div
                  key={lang}
                  className={`h-full transition-all ${colors[i] || "bg-muted"}`}
                  style={{ width: `${percent}%` }}
                  title={`${lang}: ${Math.round(percent)}%`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
