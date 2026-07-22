import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Github, Linkedin, Facebook } from "lucide-react";
import Link from "next/link";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

  let viewCount = "0";
  let githubUrl = "";
  let linkedinUrl = "";
  let facebookUrl = "";

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

  try {
    const settings = await db.select().from(setting).all();
    const settingsMap = Object.fromEntries(
      settings.map((s) => [s.key, s.value])
    );
    githubUrl = settingsMap.githubUrl || "";
    linkedinUrl = settingsMap.linkedinUrl || "";
    facebookUrl = settingsMap.facebookUrl || "";
  } catch {
    // ignore
  }

  return (
    <footer className="border-t border-border/40 px-6 py-4">
      <div className="app-shell flex flex-col items-center justify-between gap-3 sm:flex-row">
        {/* Left */}
        <div className="flex items-center gap-3  text-xs text-muted-foreground">
          <span>&copy; {currentYear} Thu Rein Htet</span>
          <span className="text-muted-foreground/30">·</span>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[var(--primary)]" />
            <span>All Services Nominal</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3  text-xs text-muted-foreground">
          {commitHash && (
            <>
              <span>⚡ {commitHash}</span>
              <span className="text-muted-foreground/30">·</span>
            </>
          )}
          <span>{viewCount} views</span>
          <span className="text-muted-foreground/30">·</span>
          <div className="flex items-center gap-2">
            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
              </Link>
            )}
            {linkedinUrl && (
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </Link>
            )}
            {facebookUrl && (
              <Link
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
