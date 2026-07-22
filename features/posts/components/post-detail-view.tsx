"use client";

import { Badge } from "@/components/ui/badge";
import { sectionReveal } from "@/lib/motion";
import { formatDate } from "@/lib/utils";
import { PostType } from "@/types/index.type";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Props = {
  post: PostType;
};

export function PostDetailView({ post }: Props) {
  // Decorative title: split into words and alternate styles
  const titleWords = post.title.split(" ");

  return (
    <div className="page-shell">
      <section className="px-6 py-12">
        <article className="mx-auto max-w-3xl space-y-8">
          {/* Decorative Title */}
          <motion.header {...sectionReveal} className="space-y-6 text-center">
            <h1 className=" text-4xl font-bold tracking-[-0.02em] sm:text-5xl lg:text-6xl leading-tight">
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

            <div className="flex items-center justify-center gap-3  text-sm text-muted-foreground">
              <span>{formatDate(post.createdAt.toISOString())}</span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className=" text-[10px] bg-muted/50 text-muted-foreground rounded-md px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.header>

          {/* Divider */}
          <div className="border-t border-border/40" />

          {/* Markdown Body */}
          <div className="prose prose-base prose-invert max-w-none sm:prose-lg">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
        </article>
      </section>
    </div>
  );
}
