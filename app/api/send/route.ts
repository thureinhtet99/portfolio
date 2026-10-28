import { contactSchema } from "@/features/contact/schema";
import { isRateLimited } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/utils";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(`send:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      {
        message: "Failed to send contact form",
        error: "Too many messages. Please try again later.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Failed to send contact form", error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Failed to send contact form",
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      },
      { status: 400 },
    );
  }

  const { name, email, subject, message } = parsed.data;
  const gmailEmail = process.env.GMAIL_EMAIL;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailEmail || !gmailAppPassword) {
    console.error("Contact form: GMAIL_EMAIL or GMAIL_APP_PASSWORD is not set");
    return NextResponse.json(
      {
        message: "Failed to send contact form",
        error: "Contact form is not configured",
      },
      { status: 500 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailEmail, pass: gmailAppPassword },
    });

    await transporter.sendMail({
      from: { name, address: gmailEmail },
      replyTo: email,
      to: gmailEmail,
      subject,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json(
      { message: "Message is sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form: failed to send email", error);
    return NextResponse.json(
      {
        message: "Failed to send contact form",
        error: "Failed to send message. Please try again later.",
      },
      { status: 500 },
    );
  }
}
