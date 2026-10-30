import Link from "next/link";
import ReactMarkdown from "react-markdown";

const linkClass =
  "underline underline-offset-4 transition-colors hover:bg-primary hover:text-background";

/**
 * Renders model output. Raw HTML is never rendered (react-markdown ignores it
 * by default), images are dropped, and only internal paths, http(s) and mailto
 * links become links.
 */
export function AssistantMarkdown({
  children,
  onNavigate,
}: {
  children: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-headings:my-2 prose-pre:my-2">
      <ReactMarkdown
        components={{
          img: () => null,
          a: ({ href, children: label }) => {
            if (href?.startsWith("/") && !href.startsWith("//")) {
              return (
                <Link href={href} onClick={onNavigate} className={linkClass}>
                  {label}
                </Link>
              );
            }
            if (href && /^(https?:|mailto:)/i.test(href)) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {label}
                </a>
              );
            }
            return <span>{label}</span>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
