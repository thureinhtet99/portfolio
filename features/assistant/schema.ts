import * as z from "zod";
import { INPUT_LIMITS } from "./constants";

// Shared by the chat sheet (client) and the API routes (server).
export const chatMessageSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("user"),
    content: z
      .string()
      .trim()
      .min(1, "Message is empty")
      .max(INPUT_LIMITS.maxMessageChars, "Message is too long"),
  }),
  z.object({
    role: z.literal("assistant"),
    content: z
      .string()
      .trim()
      .min(1, "Message is empty")
      .max(INPUT_LIMITS.maxAssistantMessageChars, "Message is too long"),
  }),
]);

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1)
    .max(INPUT_LIMITS.maxTurns * 2)
    .refine(
      (messages) =>
        messages.reduce(
          (total, message) => total + message.content.length,
          0,
        ) <= INPUT_LIMITS.maxTotalChars,
      { message: "The conversation is too long" },
    )
    .refine((messages) => messages[0]?.role === "user", {
      message: "The conversation must start with a user message",
    })
    .refine((messages) => messages.at(-1)?.role === "user", {
      message: "The last message must come from the user",
    }),
  // Path the visitor is on; the server re-validates it against real content.
  page: z.string().trim().max(200).optional(),
});

export const fitCheckRequestSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(40, "Paste the full job description")
    .max(INPUT_LIMITS.maxJobDescriptionChars, "Job description is too long"),
});

// Input of the single tool the model may call.
export const unansweredToolInputSchema = z.object({
  question: z.string().trim().min(1).max(1000),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
