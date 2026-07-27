import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaStar } from "react-icons/fa";

export type GitHubStarsProps = {
  /** GitHub repository in `owner/repo` format. */
  // repo: string;
  /** Number of stars to display. */
  stargazersCount: number;
  /**
   * Optional locales for number formatting.
   * See [MDN - Intl - locales argument](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).
   * @defaultValue "en-US"
   */
  locales?: Intl.LocalesArgument;
};

export function GitHubStars({
  stargazersCount,
  locales = "en-US",
}: GitHubStarsProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="gap-1.5 pointer-events-none" variant="ghost" asChild>
          <span>
            <FaStar />

            <span
              className="text-[0.8125rem]/none text-muted-foreground tabular-nums"
              style={{ textBox: "trim-end cap alphabetic" }}
            >
              {new Intl.NumberFormat(locales, {
                notation: "compact",
                compactDisplay: "short",
              })
                .format(stargazersCount)
                .toLowerCase()}
            </span>
          </span>
        </Button>
      </TooltipTrigger>

      <TooltipContent className="tabular-nums">
        {new Intl.NumberFormat(locales).format(stargazersCount)} stars
      </TooltipContent>
    </Tooltip>
  );
}
