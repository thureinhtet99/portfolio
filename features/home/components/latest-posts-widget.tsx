"use client";

import { formatDate } from "@/lib/utils";
import { PostType } from "@/types/index.type";
import Link from "next/link";

type Props = {
  posts: PostType[];
};

export function LatestPostsWidget({ posts }: Props) {
  const visible = posts.slice(0, 4);

  return (
    <div className="surface-panel p-5">
      <h3 className=" text-sm font-semibold text-foreground mb-3">
        ✦ Latest Posts
      </h3>

      {visible.length > 0 ? (
        <ul className="space-y-2">
          {visible.map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.slug}`}
                className="group flex items-baseline justify-between gap-3  text-xs transition-colors hover:text-primary"
              >
                <span className="truncate text-muted-foreground group-hover:text-primary">
                  {post.title}
                </span>
                <span className="shrink-0 text-muted-foreground/60">
                  {formatDate(new Date(post.createdAt).toISOString())}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className=" text-xs text-muted-foreground">No posts yet.</p>
      )}
    </div>
  );
}
