'use client';

import { Card } from "@/components/ui/card";
import { Github, GitPullRequest, Star, GitFork } from 'lucide-react';

type Event = {
  type: string;
  repo: {
    name: string;
  };
  payload: {
    action?: string;
    issue?: {
      title: string;
    };
    pull_request?: {
      title: string;
    };
  };
  created_at: string;
};

type Props = {
  events: Event[];
  languages: Record<string, number>;
};

export function GitHubActivityWidget({ events, languages }: Props) {
  if (!events || events.length === 0) {
    return (
      <Card className="surface-panel p-6">
        <h3 className="text-xl font-semibold tracking-[-0.02em] mb-4">
          GitHub Activity
        </h3>
        <p className="text-muted-foreground">Activity unavailable</p>
      </Card>
    );
  }

  const eventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <Github className="h-4 w-4" />;
      case "PullRequestEvent":
        return <GitPullRequest className="h-4 w-4" />;
      case "WatchEvent":
        return <Star className="h-4 w-4" />;
      case "ForkEvent":
        return <GitFork className="h-4 w-4" />;
      default:
        return <Github className="h-4 w-4" />;
    }
  };

  const eventTitle = (event: Event) => {
    switch (event.type) {
        case "PushEvent":
            return <>Pushed to <span className="font-semibold">{event.repo.name}</span></>;
        case "PullRequestEvent":
            return <>{event.payload.action === 'opened' ? 'Opened' : 'Closed'} a pull request in <span className="font-semibold">{event.repo.name}</span></>;
        case "WatchEvent":
            return <>Starred <span className="font-semibold">{event.repo.name}</span></>;
        case "ForkEvent":
            return <>Forked <span className="font-semibold">{event.repo.name}</span></>;
        case "IssuesEvent":
            return <>{event.payload.action === 'opened' ? 'Opened' : 'Closed'} an issue in <span className="font-semibold">{event.repo.name}</span></>;
        case "IssueCommentEvent":
            return <>Commented on an issue in <span className="font-semibold">{event.repo.name}</span></>;
        default:
            return <>{event.type} on <span className="font-semibold">{event.repo.name}</span></>;
    }
  }

  // Process languages for the bar
  const totalRepos = Object.values(languages).reduce((sum, count) => sum + count, 0);
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const topLanguagePercent = sortedLanguages.length > 0 ? sortedLanguages[0][1] / totalRepos * 100 : 0;

  return (
    <Card className="surface-panel p-6">
      <h3 className="text-xl font-semibold tracking-[-0.02em] mb-4">
        Recent GitHub Activity
      </h3>

      {/* Language Bar */}
      {sortedLanguages.length > 0 && (
        <div className="mb-5">
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted/50">
            {sortedLanguages.map(([lang, count], i) => {
              const percent = (count / totalRepos) * 100;
              // Use accent-signal with descending opacity steps
              const opacity = [1, 0.7, 0.45, 0.25, 0.15][i] || 0.15;
              return (
                <div
                  key={lang}
                  className="h-full transition-all"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: `color-mix(in srgb, var(--accent-signal) ${opacity * 100}%, transparent)`,
                  }}
                  title={`${lang}: ${Math.round(percent)}%`}
                />
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {sortedLanguages.map(([lang, count], i) => {
              const percent = (count / totalRepos) * 100;
              const opacity = [1, 0.7, 0.45, 0.25, 0.15][i] || 0.15;
              return (
                <div key={lang} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--accent-signal) ${opacity * 100}%, transparent)`,
                    }}
                  />
                  <span>{lang}</span>
                  <span className="text-muted-foreground/60">{Math.round(percent)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event List */}
      <div className="space-y-4">
        {events.slice(0, 5).map((event, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-muted-foreground mt-1">{eventIcon(event.type)}</div>
            <div className="flex-1">
              <p className="text-sm">{eventTitle(event)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(event.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
