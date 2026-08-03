import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSettings } from "@/lib/services/settings";
import Link from "next/link";
import { FaCode, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export async function Footer() {
  let viewCount = "0";
  let githubUrl = "";
  let linkedinUrl = "";
  let emailUrl = "";

  try {
    const settings = await getSettings();
    viewCount = Number(settings.siteViews || "0").toLocaleString();
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

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://github.com/thureinhtet99/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <FaCode className="h-5 w-5" />
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
