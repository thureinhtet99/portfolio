"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUp, RotateCcw, Square } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { INPUT_LIMITS, OWNER_NAME } from "../constants";
import type { UiMessage, useAssistantChat } from "../hooks/use-assistant-chat";
import { AssistantMarkdown } from "./assistant-markdown";

type Chat = ReturnType<typeof useAssistantChat>;

function getSuggestions(pathname: string): string[] {
  if (pathname.startsWith("/projects/")) {
    return [
      "Summarize this project",
      "Which technologies does it use?",
      "What were the goals of this project?",
    ];
  }
  if (pathname.startsWith("/posts/")) {
    return ["Give me a TL;DR of this post", "What are the key takeaways?"];
  }
  return [
    `What kind of work does ${OWNER_NAME} do?`,
    "Which projects best show their skills?",
    "Are they available for work?",
    "What is their experience with React and Next.js?",
  ];
}

const sourceClass =
  "border border-muted-foreground/20 px-2 py-0.5 text-xs transition-colors hover:bg-primary hover:text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

function MessageView({
  message,
  isPending,
  onNavigate,
}: {
  message: UiMessage;
  isPending: boolean;
  onNavigate: () => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex gap-2">
        <span aria-hidden="true" className="text-primary">
          $
        </span>
        <span className="sr-only">You: </span>
        <p className="min-w-0 flex-1 whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <span aria-hidden="true" className="text-muted-foreground">
        &gt;
      </span>
      <span className="sr-only">Assistant: </span>
      <div className="min-w-0 flex-1 space-y-2">
        {message.content ? (
          <AssistantMarkdown onNavigate={onNavigate}>
            {message.content}
          </AssistantMarkdown>
        ) : isPending && !message.error ? (
          <p className="text-muted-foreground">thinking...</p>
        ) : null}

        {message.error && (
          <p role="alert" className="text-sm text-destructive">
            {message.error.message}
          </p>
        )}

        {message.sources.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Sources:</span>
            {message.sources.map((source) => (
              <Link
                key={source.id}
                href={source.url}
                onClick={onNavigate}
                className={sourceClass}
              >
                {source.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AssistantPanel({
  chat,
  pathname,
  inputRef,
  onNavigate,
}: {
  chat: Chat;
  pathname: string;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onNavigate: () => void;
}) {
  const { messages, isStreaming, send, stop, reset } = chat;
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const nearBottom =
      list.scrollHeight - list.scrollTop - list.clientHeight < 120;
    if (nearBottom) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const submit = () => {
    if (!draft.trim() || isStreaming) return;
    void send(draft);
    setDraft("");
  };

  const lastId = messages.at(-1)?.id;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-busy={isStreaming}
        aria-label="Conversation"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm"
      >
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Ask about {OWNER_NAME}&apos;s projects, experience and writing.
              Answers link back to the page they came from.
            </p>
            <div className="flex flex-wrap gap-2">
              {getSuggestions(pathname).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void send(suggestion)}
                  className="border border-muted-foreground/20 px-2 py-1 text-left text-xs transition-colors hover:bg-primary hover:text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageView
              key={message.id}
              message={message}
              isPending={isStreaming && message.id === lastId}
              onNavigate={onNavigate}
            />
          ))
        )}
      </div>

      <div className="space-y-2 border-t border-muted-foreground/20 p-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex items-end gap-2"
        >
          <label htmlFor="assistant-input" className="sr-only">
            Your question
          </label>
          <Textarea
            id="assistant-input"
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                submit();
              }
            }}
            maxLength={INPUT_LIMITS.maxMessageChars}
            rows={2}
            placeholder="Ask a question..."
            className="max-h-32 min-h-0 resize-none"
          />
          {isStreaming ? (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={stop}
              aria-label="Stop generating"
            >
              <Square className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim()}
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </form>

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            AI assistant, answers can be wrong. Prefer to talk to a person?{" "}
            <Link
              href="/contact"
              onClick={onNavigate}
              className="underline underline-offset-4 hover:text-primary"
            >
              Contact form
            </Link>
          </p>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className={cn(
                "flex shrink-0 items-center gap-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              )}
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              New chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
