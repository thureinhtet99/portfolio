import { Badge } from "@/components/ui/badge";
import { PostType } from "@/types/index.type";
import { format } from "date-fns";
import { ViewTransition } from "react";
import ReactMarkdown from "react-markdown";

export function PostDetailView({ post }: { post: PostType }) {
  const titleWords = post.title.split(" ");

  return (
    <div className="page-shell">
      <section className="px-6 py-12">
        <article className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-[-0.02em] sm:text-5xl lg:text-6xl leading-tight">
              {titleWords.map((word, i) => (
                <ViewTransition
                  key={i}
                  name={`_post-${post.slug}__${word.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                >
                  <span
                    className={
                      i % 3 === 0
                        ? "text-muted-foreground"
                        : i % 3 === 1
                          ? "text-primary italic"
                          : "text-foreground"
                    }
                  >
                    {word}{" "}
                  </span>
                </ViewTransition>
              ))}
            </h1>

            <span className="flex items-center justify-center sm:justify-start text-xs gap-1">
              {format(new Date(post.createdAt), "dd MMM yyyy")}
            </span>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-muted-foreground/20 my-10" />

          {/* Markdown Body */}
          <div className="prose prose-base prose-invert max-w-none sm:prose-lg">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
        </article>
      </section>
    </div>
  );
}
