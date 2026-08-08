import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getSettings,
  getSiteViews,
} from "@/features/admin/services/settings.service";
import Link from "next/link";
import { FaCode, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export async function Footer() {
  let viewCount = "0";
  let githubUrl = "";
  let linkedinUrl = "";
  let emailUrl = "";

  try {
    const [settings, siteViews] = await Promise.all([
      getSettings(),
      // Live (uncached) read so the footer reflects the latest count
      // immediately after the homepage has incremented it.
      getSiteViews(),
    ]);
    viewCount = siteViews.toLocaleString();
    githubUrl = settings.githubUrl || "";
    linkedinUrl = settings.linkedinUrl || "";
    emailUrl = settings.emailUrl || "";
  } catch {
    // ignore
  }

  return (
    <footer
      className="border-t border-border/20 px-6 py-4"
      style={{ viewTransitionName: "site-footer" }}
    >
      <div className="app-shell flex flex-col items-center justify-between gap-3 sm:flex-row">
        {/* Left */}
        <div className="flex items-center text-sm">
          <span>&copy; 2026 Thu Rein Htet</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 text-sm">
          <span>{viewCount} views</span>
          <span className="text-muted-foreground">·</span>
          <div className="flex items-center gap-4">
            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="hover:text-primary transition-colors"
              >
                <FaGithub className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}
            {linkedinUrl && (
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="hover:text-primary transition-colors"
              >
                <FaLinkedin className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}
            {emailUrl && (
              <Link
                href={emailUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Send email"
                className="hover:text-primary transition-colors"
              >
                <FaEnvelope className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://github.com/thureinhtet99/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source code on GitHub"
                  className="hover:text-primary transition-colors"
                >
                  <FaCode className="h-5 w-5" aria-hidden="true" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Source code</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </footer>
  );
}
