import { ScrambleLoading } from "./scramble-loading";

/**
 * Inline section loader used by admin list views while data is pending.
 * Renders the same scramble animation as the global loading screen but
 * at 60% primary opacity and without page-level centering.
 */
export default function CustomLoading() {
  return <ScrambleLoading variant="muted" />;
}
