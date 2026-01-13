import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
