"use client";

import { Badge } from "@/components/ui/badge";
import { sectionReveal } from "@/lib/motion";
import { formatDate } from "@/lib/utils";
import { PostType } from "@/types/index.type";
import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  posts: PostType[];
};

export function PostsView({ posts }: Props) {
  return (
    <div className="page-shell">
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <motion.h1
            {...sectionReveal}
            className=" text-3xl font-bold tracking-[-0.03em]"
          >
            Posts
          </motion.h1>

          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group block space-y-2"
                  >
                    <h2 className=" text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className=" text-xs text-muted-foreground">
                      {formatDate(post.createdAt.toISOString())}
                    </p>
                    {post.excerpt && (
                      <p className=" text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
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
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <p className=" text-sm text-muted-foreground">No posts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
