import { getSettings } from "@/features/admin/services/settings.service";
import { getPublishedPosts } from "@/features/posts/services/post.service";
import {
  GitHubActivityWidget,
  KatibCommitItem,
  KatibLanguage,
  KatibStreak,
} from "./github-activity-widget";
import { LatestPostsWidget } from "./latest-posts-widget";

const KATIB_BASE = "https://katib.jasoncameron.dev";

function getKatibHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function getKatibCommits(
  username: string,
  limit = 5,
): Promise<{ commits: KatibCommitItem[]; languages: KatibLanguage[] }> {
  try {
    const res = await fetch(
      `${KATIB_BASE}/v2/commits/latest?username=${username}&limit=${limit}`,
      {
        headers: getKatibHeaders(),
        next: { revalidate: 60 * 15 },
      },
    );
    if (!res.ok) return { commits: [], languages: [] };
    const data = await res.json();
    return {
      commits: data.commits ?? [],
      languages: data.languages ?? [],
    };
  } catch {
    return { commits: [], languages: [] };
  }
}

async function getKatibStreak(username: string): Promise<KatibStreak | null> {
  try {
    const res = await fetch(`${KATIB_BASE}/streak?username=${username}`, {
      headers: getKatibHeaders(),
      next: { revalidate: 60 * 15 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function WidgetSection() {
  const [settings, allPosts] = await Promise.all([
    getSettings(),
    getPublishedPosts(),
  ]);

  const githubUrl = settings.githubUrl || null;
  const username = githubUrl?.split("/").pop() || "";

  const latestPosts = allPosts.slice(0, 4).map((p) => ({
    ...p,
    tags: p.tags
      ? (() => {
          try {
            return JSON.parse(p.tags);
          } catch {
            return p.tags.split(",").map((s: string) => s.trim());
          }
        })()
      : [],
  }));

  const [katibCommits, katibStreak] = await Promise.all([
    username ? getKatibCommits(username, 5) : { commits: [], languages: [] },
    username ? getKatibStreak(username) : null,
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <LatestPostsWidget posts={latestPosts} />
      <GitHubActivityWidget
        commits={katibCommits.commits}
        languages={katibCommits.languages}
        streak={katibStreak}
      />
    </div>
  );
}
