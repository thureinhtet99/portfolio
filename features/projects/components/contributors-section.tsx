"use client";

import { GitHubContributor } from "@/app/api/github/contributors/route";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ContributorsSection({
  org,
  repo,
  manualCollaborators,
}: {
  org: string;
  repo: string;
  manualCollaborators: string[];
}) {
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);

  useEffect(() => {
    fetch(`/api/github/contributors?owner=${org}&repo=${repo}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setContributors(json.data);
        } else {
          setContributors([]);
        }
      })
      .catch(() => setContributors([]));
  }, [org, repo]);

  const hasContributors =
    contributors.length > 0 || manualCollaborators.length > 0;

  if (!hasContributors) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span>Contributor{contributors.length > 0 ? "s" : ""}: </span>

      <AvatarGroup>
        {contributors.map((contributor) => (
          <Link
            key={contributor.login}
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${contributor.login} (${contributor.contributions} contributions)`}
          >
            <Avatar className="hover:border hover:border-primary">
              <AvatarImage src={contributor.avatar_url} />
              <AvatarFallback>
                {contributor.login[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        ))}
        {manualCollaborators.map((collab, i) => {
          const username = collab.replace("https://github.com/", "");
          return (
            <Link
              key={`manual-${i}`}
              href={collab}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Avatar>
                <AvatarImage src={`https://github.com/${username}.png`} />
                <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          );
        })}
      </AvatarGroup>
    </div>
  );
}
