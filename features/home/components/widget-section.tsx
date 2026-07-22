import { APP_CONFIG } from "@/config/app-config";
import { db } from "@/db/client";
import { post } from "@/db/schema";
import { GitHubActivityWidget } from "./github-activity-widget";
import { LatestPostsWidget } from "./latest-posts-widget";
import { asc } from "drizzle-orm";

async function getGithubEvents(githubUrl?: string) {
  if (!githubUrl) return [];
  const username = githubUrl.split("/").pop();
  if (!username) return [];

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public`,
      { next: { revalidate: 60 * 30 } },
    );
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

async function getGithubLanguages(githubUrl?: string) {
  if (!githubUrl) return {};
  const username = githubUrl.split("/").pop();
  if (!username) return {};

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=10&sort=updated`,
      { next: { revalidate: 60 * 60 } },
    );
    if (!response.ok) return {};
    const repos = await response.json();
    const languageMap: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      }
    }
    return languageMap;
  } catch {
    return {};
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

  const [githubEvents, githubLanguages, latestPosts] = await Promise.all([
    getGithubEvents(githubUrl),
    getGithubLanguages(githubUrl),
    getLatestPosts(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <GitHubActivityWidget
        events={githubEvents}
        languages={githubLanguages}
      />
      <LatestPostsWidget posts={latestPosts} />
    </div>
  );
}
