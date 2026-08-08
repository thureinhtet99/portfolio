import { ScrambleLoading } from "@/components/shared/scramble-loading";

export default function Loading() {
  return (
    <div className="flex min-h-150 items-center justify-center">
      <ScrambleLoading variant="full" />
    </div>
  );
}
