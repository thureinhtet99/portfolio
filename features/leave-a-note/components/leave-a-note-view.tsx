"use client";

import Giscus from "@giscus/react";

export default function LeaveANoteView() {
  return (
    <div className="page-shell">
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-[-0.03em]">
              Leave a note
            </h1>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Thoughts, feedback, or just say &apos;
                <span className="underline hover:bg-primary hover:text-background cursor-pointer transition-colors">
                  hi
                </span>
                &apos; to me
              </p>
            </div>
          </div>

          <Giscus
            id="comments"
            repo={
              (process.env.NEXT_PUBLIC_GISCUS_REPO ??
                "") as `${string}/${string}`
            }
            repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ""}
            category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? ""}
            categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ""}
            mapping="pathname"
            theme="transparent_dark"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            lang="en"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
