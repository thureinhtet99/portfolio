"use client";

import { Check, ChevronDown, Copy, KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { DemoCredentialType } from "@/types/index.type";

type ProjectCredentialsPanelProps = {
  credentials?: DemoCredentialType[];
  compact?: boolean;
  className?: string;
};

type CredentialRowProps = {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
};

function CredentialRow({ label, value, copied, onCopy }: CredentialRowProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg">
      <p className="w-12 shrink-0 text-[10px] text-muted-foreground sm:w-16 sm:text-[11px]">
        {label}
      </p>
      <p className="min-w-0 flex-1 truncate  text-[11px] text-foreground sm:text-xs">
        {value}
      </p>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCopy}
        className="h-6 w-6 shrink-0 p-0 text-muted-foreground hover:text-foreground sm:h-7 sm:w-7 cursor-pointer"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export function ProjectCredentialsPanel({
  credentials = [],
  compact = false,
  className,
}: ProjectCredentialsPanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(!compact);

  if (!credentials.length) {
    return null;
  }

  const copyValue = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast.success("Copied to clipboard");

      window.setTimeout(() => {
        setCopiedKey((currentKey) => (currentKey === key ? null : currentKey));
      }, 1400);
    } catch {
      toast.error("Unable to copy right now");
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "relative rounded-md bg-accent-foreground/10 data-[state=open]:z-20 data-[state=open]:border sm:ps-3",
        compact ? "w-auto min-w-0 shrink-0" : "w-full",
        className,
      )}
    >
      <CollapsibleTrigger
        asChild
        className="flex cursor-pointer items-center rounded-lg"
      >
        <div className="flex w-full items-center justify-between">
          <div className="min-w-0">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 shrink-0 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground",
              compact ? "px-1.5" : "px-2",
            )}
            aria-label={isOpen ? "Hide credentials" : "Show credentials"}
          >
            <ChevronDown
              className={cn(
                "h-4 w--4transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </Button>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent
        className={cn(
          compact &&
            "absolute right-0 top-[calc(100%+0.35rem)] z-30 w-[min(92vw,22rem)] max-w-[calc(100vw-1rem)] origin-top-right rounded-xl bg-card/95 shadow-[0_22px_48px_-30px_rgba(34,34,34,0.55)] backdrop-blur-sm",
        )}
      >
        <div
          className={cn(
            compact
              ? "grid max-h-[min(62vh,25rem)] gap-2 overflow-y-auto pr-0.5"
              : "mt-2.5 grid gap-2",
            !compact && "md:grid-cols-2",
          )}
        >
          {credentials.map((credential) => {
            const credentialKey = `${credential.role}-${credential.email}`;

            return (
              <div key={credentialKey} className="rounded-lg p-2 sm:p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {credential.role}
                  </p>
                </div>

                <div className="mt-1.5 sm:mt-2">
                  <CredentialRow
                    label="Email"
                    value={credential.email}
                    copied={copiedKey === `${credentialKey}-email`}
                    onCopy={() =>
                      copyValue(credential.email, `${credentialKey}-email`)
                    }
                  />
                  <CredentialRow
                    label="Password"
                    value={credential.password}
                    copied={copiedKey === `${credentialKey}-password`}
                    onCopy={() =>
                      copyValue(
                        credential.password,
                        `${credentialKey}-password`,
                      )
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
