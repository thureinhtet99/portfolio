import { getSettings } from "@/features/admin/services/settings.service";
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/ui/github-contributions";
import { getCachedContributions } from "@/lib/get-cached-contributions";
import { getGithubUsername } from "@/lib/utils";
import { Suspense } from "react";

export async function ContributionsSection() {
  const { githubUrl } = await getSettings();
  const username = getGithubUsername(githubUrl);

  if (!githubUrl || !username) return null;

  const contributions = getCachedContributions(username);

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={githubUrl}
      />
    </Suspense>
  );
}
