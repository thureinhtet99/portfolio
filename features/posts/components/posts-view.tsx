"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { sectionReveal, cardReveal } from "@/lib/motion";
import { formatDate } from "@/lib/utils";
import { PostType } from "@/types/index.type";

type Props = {
  posts: PostType[];
};

export function PostsView({ posts }: Props) {
  return (
    <div className="page-shell">
      <motion.div {...sectionReveal} className="space-y-2 text-center">
        <h1 className="section-heading">Posts</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Thoughts on development, projects, and things I&apos;ve learned along the way.
        </p>
      </motion.div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {posts.map((post, index) => (
            <motion.div key={post.id} {...cardReveal(index)}>
              <Link href={`/posts/${post.slug}`} className="block group">
                <Card className="surface-panel h-full transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg font-semibold tracking-[-0.02em] group-hover:text-[var(--accent-signal)] transition-colors sm:text-xl">
                        {post.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(post.createdAt.toISOString())}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {post.excerpt && (
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
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
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-muted rounded-full p-4 mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-sm text-muted-foreground">
            Check back soon for new content.
          </p>
        </div>
      )}
    </div>
  );
}
