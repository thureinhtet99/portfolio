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
          <h1 className="text-4xl font-bold tracking-[-0.03em]">Posts</h1>

          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id}>
                  <Link
                    href={`/posts/${post.slug}`}
                    transitionTypes={["nav-forward"]}
                    className="group block space-y-2"
                  >
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title.split(" ").map((word, i) => (
                        <ViewTransition
                          key={i}
                          name={`_post-${post.slug}__${word.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                        >
                          <span className="inline-block">{word} </span>
                        </ViewTransition>
                      ))}
                    </h2>
                    <p className=" text-xs text-muted-foreground">
                      {format(new Date(post.createdAt), "dd MMM yyyy")}
                    </p>
                    {post.excerpt && (
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
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
            <p className=" text-sm text-muted-foreground">No posts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
