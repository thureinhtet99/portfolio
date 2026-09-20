"use client";

import { Badge } from "@/components/ui/badge";
import { PostType } from "@/types/index.type";
import { format } from "date-fns";
import { Tag } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";

export function PostsView({ posts }: { posts: PostType[] }) {
  return (
    <div className="page-shell">
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold tracking-[-0.02em]">Posts</h1>

          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id}>
                  <Link
                    href={`/posts/${post.slug}`}
                    transitionTypes={["nav-forward"]}
                    className="group block space-y-4"
                  >
                    <ViewTransition
                      name={`post-title-${post.slug}`}
                      share="text-morph"
                    >
                      <h2 className="inline-block text-xl font-semibold group-hover:bg-primary group-hover:text-background transition-colors">
                        {post.title}
                      </h2>
                    </ViewTransition>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(post.createdAt), "dd MMM yyyy")}
                    </p>
                    {post.excerpt && (
                      <p className="text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Tag className="h-4 w-4" />

                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className=" text-sm">No posts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
