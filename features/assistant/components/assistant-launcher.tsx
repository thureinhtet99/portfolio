"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { OWNER_NAME } from "../constants";
import { useAssistantChat } from "../hooks/use-assistant-chat";
import { useFitCheck } from "../hooks/use-fit-check";
import { AssistantPanel } from "./assistant-panel";
import { FitCheckTab } from "./fit-check-tab";

/** Navbar button plus the side sheet. Mounted once, so the chat survives closing the sheet. */
export function AssistantLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chat = useAssistantChat(pathname);
  const fit = useFitCheck();
  const closeSheet = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Ask the AI assistant"
          className="flex items-center gap-1.5 text-sm transition-colors hover:bg-primary hover:text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 sm:max-w-lg"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <SheetHeader className="border-b border-muted-foreground/20 pr-12">
          <SheetTitle className="text-base">Ask about {OWNER_NAME}</SheetTitle>
          <SheetDescription className="text-xs">
            An AI assistant that answers from this portfolio.
          </SheetDescription>
        </SheetHeader>
        {/* Both tabs stay mounted so drafts and scroll position survive switching. */}
        <Tabs defaultValue="ask" className="flex min-h-0 flex-1 flex-col gap-0">
          <TabsList className="mx-4 mt-3 w-fit">
            <TabsTrigger value="ask">Ask</TabsTrigger>
            <TabsTrigger value="fit">Fit check</TabsTrigger>
          </TabsList>
          <TabsContent
            value="ask"
            forceMount
            className="mt-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
          >
            <AssistantPanel
              chat={chat}
              pathname={pathname}
              inputRef={inputRef}
              onNavigate={closeSheet}
            />
          </TabsContent>
          <TabsContent
            value="fit"
            forceMount
            className="mt-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
          >
            <FitCheckTab fit={fit} onNavigate={closeSheet} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
