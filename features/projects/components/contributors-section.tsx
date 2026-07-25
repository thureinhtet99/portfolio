import { GitHubContributor } from "@/app/api/github/contributors/route";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import Link from "next/link";

async function fetchContributors(
  owner: string,
  repo: string,
): Promise<GitHubContributor[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 86400 },
      },
    );

    if (!res.ok) return [];

    const data: (GitHubContributor & { type?: string })[] = await res.json();

    return data
      .filter((c) => c.type !== "Bot")
      .map((c) => ({
        id: c.id,
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        contributions: c.contributions,
        type: c.type ?? "User",
      }));
  } catch {
    return [];
  }
}

export async function ContributorsSection({
  org,
  repo,
  manualCollaborators,
}: {
  org: string;
  repo: string;
  manualCollaborators: string[];
}) {
  const githubContributors = await fetchContributors(org, repo);
  const hasContributors =
    githubContributors.length > 0 || manualCollaborators.length > 0;

  if (!hasContributors) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span>Contributor{githubContributors.length > 0 ? "s" : ""}: </span>

      <AvatarGroup>
        {githubContributors.map((contributor) => (
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
