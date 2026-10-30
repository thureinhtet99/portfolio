"use client";

import { useCallback, useRef, useState } from "react";
import { INPUT_LIMITS } from "../constants";
import type { ChatErrorCode, ChatSource, ChatStreamEvent } from "../types";

export type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: ChatSource[];
  error?: { code: ChatErrorCode; message: string };
};

const GENERIC_ERROR = {
  code: "failed" as const,
  message: "Something went wrong. Please try again, or use the contact form.",
};

/** The last messages that fit the server's limits, starting with a user turn. */
function toRequestHistory(messages: UiMessage[]) {
  const history = messages
    .filter((message) => message.content.trim() && !message.error)
    .map(({ role, content }) => ({ role, content }))
    .slice(-INPUT_LIMITS.maxTurns * 2);

  const size = () =>
    history.reduce((total, message) => total + message.content.length, 0);

  while (
    history.length > 1 &&
    (history[0].role !== "user" || size() > INPUT_LIMITS.maxTotalChars)
  ) {
    history.shift();
  }
  return history;
}

/**
 * Chat state and the NDJSON stream reader. Lives in the launcher (not in the
 * sheet content) so closing the sheet keeps the conversation.
 */
export function useAssistantChat(page: string) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesRef = useRef<UiMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const commit = useCallback((next: UiMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  }, []);

  const patch = useCallback(
    (id: string, update: (message: UiMessage) => UiMessage) => {
      commit(
        messagesRef.current.map((message) =>
          message.id === id ? update(message) : message,
        ),
      );
    },
    [commit],
  );

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || abortRef.current) return;

      const user: UiMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        sources: [],
      };
      const assistant: UiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        sources: [],
      };

      const history = toRequestHistory([...messagesRef.current, user]);
      commit([...messagesRef.current, user, assistant]);

      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);

      const fail = (error: UiMessage["error"]) =>
        patch(assistant.id, (message) => ({ ...message, error }));

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, page }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
            message?: string;
          } | null;
          fail(
            body?.message && body.error
              ? {
                  code: body.error as ChatErrorCode,
                  message: body.message,
                }
              : GENERIC_ERROR,
          );
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const handle = (line: string) => {
          let event: ChatStreamEvent;
          try {
            event = JSON.parse(line) as ChatStreamEvent;
          } catch {
            return;
          }

          if (event.t === "text") {
            patch(assistant.id, (message) => ({
              ...message,
              content: message.content + event.v,
            }));
          } else if (event.t === "cite") {
            patch(assistant.id, (message) => ({
              ...message,
              sources: [
                ...message.sources,
                { id: event.id, title: event.title, url: event.url },
              ],
            }));
          } else if (event.t === "error") {
            fail({ code: event.code, message: event.message });
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          lines.filter(Boolean).forEach(handle);
        }
        if (buffer.trim()) handle(buffer);
      } catch (error) {
        // Stopping on purpose keeps whatever text has arrived.
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          fail(GENERIC_ERROR);
        }
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [commit, page, patch],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    commit([]);
  }, [commit]);

  return { messages, isStreaming, send, stop, reset };
}
