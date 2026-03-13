import { defineConfig } from "drizzle-kit";

const isProduction = process.env.NODE_ENV === "production";
const shouldUseTurso = isProduction && !!process.env.TURSO_DATABASE_URL;

const localDatabaseUrl = (() => {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return "./local.db";
  return rawUrl.startsWith("file:") ? rawUrl.slice(5) : rawUrl;
})();

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: shouldUseTurso ? "turso" : "sqlite",
  dbCredentials: shouldUseTurso
    ? {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: localDatabaseUrl,
      },
});
