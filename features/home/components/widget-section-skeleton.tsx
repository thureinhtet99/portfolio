export function WidgetSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* GitHub Activity Skeleton */}
      <div className="surface-panel p-5">
        <div className="h-4 w-32 rounded bg-muted/50 mb-3" />
        <div className="space-y-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="h-4 w--4rounded bg-muted/50 mt-0.5 shrink-0" />
              <div className="h-3.5 flex-1 rounded bg-muted/50" />
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/50" />
      </div>

      {/* Latest Posts Skeleton */}
      <div className="surface-panel p-5">
        <div className="h-4 w-28 rounded bg-muted/50 mb-3" />
        <ul className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-baseline justify-between gap-3">
              <div className="h-3.5 flex-1 rounded bg-muted/50" />
              <div className="h-3.5 w-16 rounded bg-muted/50 shrink-0" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
