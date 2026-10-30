import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import readline from "node:readline";
import { Writable } from "node:stream";
import { z } from "zod";

// Creates a local admin account through the same better-auth call as
// `/api/admin/create-user`, without putting the password in a URL, a log or
// shell history. Local-only: sign-up is disabled in production.
//
// Interactive by default (the password prompt is hidden). For automation set
// ADMIN_EMAIL, ADMIN_PASSWORD and optionally ADMIN_NAME in the environment.

const adminSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

function assertLocalOnly() {
  if (
    process.env.VERCEL ||
    process.env.TURSO_DATABASE_URL ||
    process.env.NODE_ENV === "production"
  ) {
    throw new Error(
      "Refusing to run: VERCEL, TURSO_DATABASE_URL or NODE_ENV=production is set. This script is local-only.",
    );
  }
}

function ask(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    let muted = false;
    const output = new Writable({
      write(chunk, encoding, callback) {
        if (!muted) process.stdout.write(chunk, encoding);
        callback();
      },
    });
    const rl = readline.createInterface({
      input: process.stdin,
      output,
      terminal: Boolean(process.stdin.isTTY),
    });

    process.stdout.write(question);
    muted = hidden;
    rl.question("", (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function readInput() {
  const interactive = Boolean(process.stdin.isTTY);
  const fromEnv = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  };

  if (!interactive && !(fromEnv.email && fromEnv.password)) {
    throw new Error(
      "No terminal available. Set ADMIN_EMAIL and ADMIN_PASSWORD (and optionally ADMIN_NAME).",
    );
  }

  const name = fromEnv.name || (interactive ? await ask("Name [Admin]: ") : "");
  const email = fromEnv.email || (await ask("Email: "));

  let password = fromEnv.password;
  if (!password) {
    password = await ask("Password (min 8 characters): ", true);
    const confirmation = await ask("Confirm password: ", true);
    if (password !== confirmation) throw new Error("Passwords do not match.");
  }

  return adminSchema.parse({ name: name || "Admin", email, password });
}

async function createAdmin() {
  assertLocalOnly();

  const { name, email, password } = await readInput();

  // Imported after dotenv has run so the DB path and secret are picked up.
  const { auth } = await import("../lib/auth");

  try {
    await auth.api.signUpEmail({ body: { name, email, password } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (/no such table/i.test(message)) {
      throw new Error(
        "The database is not migrated. Run `npm run db:migrate` first.",
      );
    }
    if (/already|exists/i.test(message)) {
      throw new Error(`A user with the email ${email} already exists.`);
    }
    throw error;
  }

  console.log(`Created admin ${email}. Sign in at http://localhost:3000/admin`);
}

createAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    if (error instanceof z.ZodError) {
      console.error(error.issues[0]?.message ?? "Invalid input");
    } else {
      console.error(error instanceof Error ? error.message : error);
    }
    process.exit(1);
  });
