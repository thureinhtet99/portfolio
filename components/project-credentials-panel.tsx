"use client";

import { useState } from "react";
import { Check, Copy, KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  icon: React.ReactNode;
};

function CredentialRow({
  label,
  value,
  copied,
  onCopy,
  icon,
}: CredentialRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/35 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
          <span className="text-muted-foreground">{icon}</span>
          <span className="truncate font-mono text-[13px]">{value}</span>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCopy}
        className="h-8 shrink-0 px-2.5 text-xs text-muted-foreground hover:text-foreground"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
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
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-secondary/45 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Demo Access
          </p>
          {!compact && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Use these accounts to explore protected parts of the project.
            </p>
          )}
        </div>
        <KeyRound className="h-4 w-4 text-primary" />
      </div>

      <div className={cn("mt-4 grid gap-3", !compact && "md:grid-cols-2")}>
        {credentials.map((credential) => {
          const credentialKey = `${credential.role}-${credential.email}`;

          return (
            <div
              key={credentialKey}
              className="rounded-2xl border border-border/70 bg-background/90 p-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                >
                  {credential.role}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyValue(
                      `Email: ${credential.email}\nPassword: ${credential.password}`,
                      `${credentialKey}-all`,
                    )
                  }
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copiedKey === `${credentialKey}-all` ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Copy Login
                </Button>
              </div>

              <div className="mt-3 space-y-2">
                <CredentialRow
                  label="Email"
                  value={credential.email}
                  copied={copiedKey === `${credentialKey}-email`}
                  onCopy={() =>
                    copyValue(credential.email, `${credentialKey}-email`)
                  }
                  icon={<Mail className="h-3.5 w-3.5" />}
                />
                <CredentialRow
                  label="Password"
                  value={credential.password}
                  copied={copiedKey === `${credentialKey}-password`}
                  onCopy={() =>
                    copyValue(credential.password, `${credentialKey}-password`)
                  }
                  icon={<KeyRound className="h-3.5 w-3.5" />}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
