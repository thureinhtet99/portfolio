import type { Activity } from "@/components/ui/contribution-graph";
import { unstable_cache } from "next/cache";

type GitHubContributionsResponse = {
  contributions: Activity[];
};

// Throws on failure so `unstable_cache` never stores an error as a result.
const fetchContributions = unstable_cache(
  async (username: string) => {
    const res = await fetch(
      `${process.env.GITHUB_CONTRIBUTIONS_API_URL || `https://github-contributions-api.jogruber.de`}/v4/${username}?y=last`,
    );
    if (!res.ok) {
      throw new Error(`Contributions API responded with ${res.status}`);
    }
    const data = (await res.json()) as GitHubContributionsResponse;
    return data.contributions ?? [];
  },
  ["github-contributions"],
  { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
);

/**
 * Contributions for a GitHub user, cached for a day. A third-party outage
 * resolves to an empty graph instead of failing the page (or the build).
 */
export async function getCachedContributions(
  username: string,
): Promise<Activity[]> {
  try {
    return await fetchContributions(username);
  } catch (error) {
    console.error("Failed to load GitHub contributions:", error);
    return [];
  }
}
