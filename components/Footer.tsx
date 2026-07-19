export async function Footer() {
  const currentYear = new Date().getFullYear();
  const commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

  return (
    <footer className="mt-10 pb-6 px-8">
      <div className="app-shell flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs text-muted-foreground flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--accent-signal)]" />
            <span>All systems nominal</span>
          </div>
          {commitHash && <span>{commitHash}</span>}
          <span>4,213 views</span>
        </div>
        <h4 className="text-sm text-muted-foreground text-center sm:text-end">
          © {currentYear} Thu Rein Htet. All rights reserved.
        </h4>
      </div>
    </footer>
  );
}
