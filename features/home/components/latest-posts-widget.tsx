import { PostType } from "@/types/index.type";
import { format } from "date-fns";
import Link from "next/link";
import { FaRegFileAlt } from "react-icons/fa";

export function LatestPostsWidget({ posts }: { posts: PostType[] }) {
  const visible = posts.slice(0, 4);

  return (
    <div className="w-full p-4 sm:p-5 border border-muted-foreground/20 rounded-md">
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
              <Link
                href={`/posts/${post.slug}`}
                transitionTypes={["nav-forward"]}
                className="truncate hover:bg-primary hover:text-background"
              >
                {post.title}
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
