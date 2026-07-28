import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export async function Footer() {
  const commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

  let viewCount = "0";
  let githubUrl = "";
  let linkedinUrl = "";
  let emailUrl = "";

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
      settings.map((s) => [s.key, s.value]),
    );
    githubUrl = settingsMap.githubUrl || "";
    linkedinUrl = settingsMap.linkedinUrl || "";
    emailUrl = settingsMap.emailUrl || "";
  } catch {
    // ignore
  }

  return (
    <footer className="border-t border-border/20 px-6 py-4">
      <div className="app-shell flex flex-col items-center justify-between gap-3 sm:flex-row">
        {/* Left */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>&copy; 2026 Thu Rein Htet</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {commitHash && (
            <>
              <span>⚡ {commitHash}</span>
              <span className="text-muted-foreground">·</span>
            </>
          )}
          <span>{viewCount} views</span>
          <span className="text-muted-foreground">·</span>
          <div className="flex items-center gap-4">
            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaGithub className="h-5 w-5" />
              </Link>
            )}
            {linkedinUrl && (
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaLinkedin className="h-5 w-5" />
              </Link>
            )}
            {emailUrl && (
              <Link
                href={emailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaEnvelope className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
