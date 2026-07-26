"use client";

import { PostType } from "@/types/index.type";
import { format } from "date-fns";
import Link from "next/link";
import { FaRegFileAlt } from "react-icons/fa";

type Props = {
  posts: PostType[];
};

export function LatestPostsWidget({ posts }: Props) {
  const visible = posts.slice(0, 4);

  return (
    <div className="surface-panel p-5 border border-muted-foreground/20 rounded-md">
      <div className="flex items-center gap-2 mb-4">
        <FaRegFileAlt className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Latest Posts</h3>
      </div>

      {visible.length > 0 ? (
        <ul className="space-y-2">
          {visible.map((post) => (
            <li
              key={post.id}
              className="group flex items-baseline justify-between text-sm"
            >
              <Link href={`/posts/${post.slug}`}>
                <span className="truncate text-muted-foreground hover:text-primary">
                  {post.title}
                </span>
              </Link>
              <span className="shrink-0 flex items-center gap-x-4">
                <span className="text-muted-foreground/40">-</span>
                {format(new Date(post.createdAt), "dd MMM yyyy")}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className=" text-xs text-muted-foreground">No posts yet.</p>
      )}
    </div>
  );
}
