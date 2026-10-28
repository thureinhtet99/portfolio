import { db } from "@/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getBaseUrl } from "@/lib/base-url";

const isProduction = process.env.NODE_ENV === "production";

function getAuthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (secret) return secret;

  // The placeholder is only tolerated for local dev and while `next build`
  // collects page data. A running production server must never sign sessions
  // with a publicly known string.
  if (isProduction && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error(
      "Missing BETTER_AUTH_SECRET. It is required in production.",
    );
  }

  return "change-this-to-a-random-secret";
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // LibSQL/Turso is sqlite-compatible at adapter level
  }),
  emailAndPassword: {
    enabled: true,
    // Public sign-up would hand admin access to anyone, because every signed-in
    // user passes `requireAdminSession`. Dev stays open so
    // `/api/admin/create-user` can create the first local admin.
    disableSignUp: isProduction,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: getAuthSecret(),
  baseURL: getBaseUrl(),
  trustedOrigins: [
    "https://thureinhtet-portfolio.vercel.app",
    "http://localhost:3000",
  ],
});
