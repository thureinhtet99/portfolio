import * as z from "zod";

// Shared by the contact form (client) and `app/api/send` (server) so the two
// can't drift apart. Line breaks are rejected in single-line fields to keep
// them out of email headers.
const singleLine = /^[^\r\n]*$/;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .regex(singleLine, "Name must be a single line"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(254, "Email is too long"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(150, "Subject is too long")
    .regex(singleLine, "Subject must be a single line"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;
