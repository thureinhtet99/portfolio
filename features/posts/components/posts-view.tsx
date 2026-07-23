"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PostType } from "@/types/index.type";
import { Tag } from "lucide-react";
import Link from "next/link";

export function PostsView({ posts }: { posts: PostType[] }) {
  return (
    <div className="page-shell">
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-[-0.03em]">Posts</h1>

          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group block space-y-2"
                  >
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className=" text-xs text-muted-foreground">
                      {formatDate(new Date(post.createdAt).toISOString())}
                    </p>
                    {post.excerpt && (
                      <p className=" text-sm leading-relaxed text-muted-foreground line-clamp-2">
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
