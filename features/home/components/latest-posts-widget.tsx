"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, MoveRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sectionReveal } from "@/lib/motion";
import { formatDate } from "@/lib/utils";
import { PostType } from "@/types/index.type";

type Props = {
  posts: PostType[];
};

export function LatestPostsWidget({ posts }: Props) {
  const visible = posts.slice(0, 4);

  return (
    <section
      id="latest-posts-section"
      className="surface-panel space-y-6 px-5 py-10 sm:space-y-8 sm:px-8 sm:py-12 lg:px-10"
    >
      <motion.div
        {...sectionReveal}
        className={`flex flex-col items-start gap-3 sm:flex-row sm:items-center ${
          visible.length > 0 ? "sm:justify-between" : "sm:justify-center"
        }`}
      >
        <h2 className="section-heading">Latest Posts</h2>
        {visible.length > 0 && (
          <Button variant="outline" asChild className="rounded-lg">
            <Link href="/posts" className="flex items-center gap-2">
              View all <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </motion.div>

      {visible.length > 0 ? (
        <ul className="divide-border/40 divide-y">
          {visible.map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-[var(--accent-signal)] focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:rounded-sm"
              >
                <span className="text-base font-medium tracking-[-0.01em] text-foreground group-hover:text-[var(--accent-signal)] sm:text-lg">
                  {post.title}
                </span>
                <span className="font-mono text-xs text-muted-foreground shrink-0">
                  {formatDate(post.createdAt.toISOString())}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-muted rounded-full p-4 mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            New writeups will appear here once they&apos;re published. Check
            back soon.
          </p>
        </Card>
      )}
    </section>
  );
}
