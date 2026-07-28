import { Badge } from "@/components/ui/badge";
import { PostType } from "@/types/index.type";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export function PostDetailView({ post }: { post: PostType }) {
  // Decorative title: split into words and alternate styles
  const titleWords = post.title.split(" ");

  return (
    <div className="page-shell">
      <section className="px-6 py-12">
        <article className="mx-auto max-w-3xl space-y-6">
          {/* Decorative Title */}
          <div className="space-y-6 text-center">
            <h1
              className=" text-4xl font-bold tracking-[-0.02em] sm:text-5xl lg:text-6xl leading-tight"
              style={{ viewTransitionName: `post-title-${post.slug}` }}
            >
              {titleWords.map((word, i) => (
                <span
                  key={i}
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
              ))}
            </h1>

            <span className="flex items-center text-xs gap-1">
              {format(new Date(post.createdAt), "dd MMM yyyy")}
            </span>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {/* <Tag className="h-4 w-4" /> */}
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
