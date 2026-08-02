import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const isVercel = process.env.VERCEL === "1";

const localDatabaseUrl = (() => {
  const raw = process.env.SQLITE_DB_PATH || "./local.db";
  return raw.startsWith("file:") ? raw.slice(5) : raw;
})();

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: isVercel ? "turso" : "sqlite",
  dbCredentials: isVercel
    ? {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: localDatabaseUrl,
      },
});
