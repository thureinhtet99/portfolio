"use client";

import { GitHubContributor } from "@/app/api/github/contributors/route";
import { useQuery } from "@tanstack/react-query";

export function useGithubContributors(org: string, repo: string) {
  return useQuery<GitHubContributor[]>({
    queryKey: ["github-contributors", org, repo],
    queryFn: async () => {
      const res = await fetch(
        `/api/github/contributors?owner=${org}&repo=${repo}`,
      );
      const json = await res.json();

      if (!json.success || !Array.isArray(json.data))
        throw new Error(json.error || "Failed to fetch contributors");

      return json.data as GitHubContributor[];
    },
    staleTime: 86400_000, // 24 hours
    enabled: !!org && !!repo,
  });
}
