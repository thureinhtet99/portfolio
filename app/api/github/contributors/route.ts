import { NextRequest, NextResponse } from "next/server";

export type GitHubContributor = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { success: false, error: "owner and repo are required" },
      { status: 400 },
    );
  }

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

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch contributors" },
        { status: res.status },
      );
    }

    const data: GitHubContributor[] = await res.json();

    const contributors = data
      .filter((c) => c.type === "User")
      .map((c) => ({
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        contributions: c.contributions,
      }));

    return NextResponse.json({ success: true, data: contributors });
  } catch (error) {
    console.error("GitHub contributors fetch failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contributors" },
      { status: 500 },
    );
  }
}
