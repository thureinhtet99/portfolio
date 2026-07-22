import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/ui/github-contributions";
import { getCachedContributions } from "@/lib/get-cached-contributions";
import { Suspense } from "react";

const GITHUB_USERNAME = "thureinhtet99";
const GITHUB_PROFILE_URL = "https://github.com/thureinhtet99";

export function ContributionsSection() {
  const contributions = getCachedContributions(GITHUB_USERNAME);

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
      />
    </Suspense>
  );
}
