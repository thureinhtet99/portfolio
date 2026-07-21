"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { sectionReveal } from "@/lib/motion";
import { formatDate } from "@/lib/utils";
import { PostType } from "@/types/index.type";
import ReactMarkdown from "react-markdown";

type Props = {
  post: PostType;
};

export function PostDetailView({ post }: Props) {
  return (
    <div className="page-shell">
      <motion.div {...sectionReveal} className="space-y-8">
        <Button variant="ghost" asChild className="self-start -ml-2">
          <Link href="/posts" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            All Posts
          </Link>
        </Button>

        <article className="mx-auto max-w-3xl space-y-6">
          <header className="space-y-3">
            <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDate(post.createdAt.toISOString())}</span>
              </div>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-accent-foreground/10"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {post.excerpt && (
            <p className="text-lg leading-relaxed text-muted-foreground border-l-2 border-[var(--accent-signal)] pl-4">
              {post.excerpt}
            </p>
          )}

          <div className="prose prose-base prose-invert max-w-none sm:prose-lg">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
        </article>
      </motion.div>
    </div>
  );
}
