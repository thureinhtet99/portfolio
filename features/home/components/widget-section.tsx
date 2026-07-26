import { APP_CONFIG } from "@/config/app-config";
import { db } from "@/db/client";
import { post } from "@/db/schema";
import { asc } from "drizzle-orm";
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

async function getLatestPosts() {
  try {
    const allPosts = await db
      .select()
      .from(post)
      .orderBy(asc(post.order), asc(post.createdAt))
      .all();
    return allPosts
      .filter((p) => p.published)
      .slice(0, 4)
      .map((p) => ({
        ...p,
        tags: p.tags ? JSON.parse(p.tags) : [],
      }));
  } catch {
    return [];
  }
}

export async function WidgetSection() {
  const settingsRes = await fetch(
    `${APP_CONFIG.BASE_URL}/api/${APP_CONFIG.ROUTE.SETTINGS}`,
    { cache: "no-store" },
  );
  const { data: settings } = await settingsRes.json();
  const githubUrl = settings?.githubUrl || null;

  const username = githubUrl?.split("/").pop() || "";

  const [katibCommits, katibStreak, latestPosts] = await Promise.all([
    username ? getKatibCommits(username, 5) : { commits: [], languages: [] },
    username ? getKatibStreak(username) : null,
    getLatestPosts(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      <LatestPostsWidget posts={latestPosts} />
      <GitHubActivityWidget
        commits={katibCommits.commits}
        languages={katibCommits.languages}
        streak={katibStreak}
      />
    </div>
  );
}
