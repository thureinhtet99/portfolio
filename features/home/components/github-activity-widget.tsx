'use client';

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
};

export function GitHubActivityWidget({ events }: Props) {
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

  return (
    <Card className="surface-panel p-6">
      <h3 className="text-xl font-semibold tracking-[-0.02em] mb-4">
        Recent GitHub Activity
      </h3>
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
