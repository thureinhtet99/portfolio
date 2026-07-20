import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

  let viewCount = "0";
  try {
    const result = await db
      .select()
      .from(setting)
      .where(eq(setting.key, "siteViews"))
      .limit(1)
      .all();
    if (result.length > 0) {
      viewCount = Number(result[0].value).toLocaleString();
    }
  } catch {
    viewCount = "0";
  }

  return (
    <footer className="my-8 px-8">
      <div className="app-shell flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs text-muted-foreground flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--accent-signal)]" />
            <span>All systems nominal</span>
          </div>
          {commitHash && <span>{commitHash}</span>}
          <span>{viewCount} views</span>
        </div>
        <h4 className="text-sm text-muted-foreground text-center sm:text-end">
          &copy; {currentYear} Thu Rein Htet. All rights reserved.
        </h4>
      </div>
    </footer>
  );
}
