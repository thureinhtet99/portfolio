import { drizzle as drizzleLibSQL } from "drizzle-orm/libsql";
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3";
import { createClient } from "@libsql/client";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Use LibSQL (Turso) for production/Vercel, SQLite for local development
const isProduction =
  process.env.NODE_ENV === "production" || process.env.TURSO_DATABASE_URL;

let db: ReturnType<typeof drizzleLibSQL> | ReturnType<typeof drizzleSQLite>;

if (isProduction && process.env.TURSO_DATABASE_URL) {
  // Production: Use LibSQL/Turso (works on Vercel)
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  db = drizzleLibSQL(client, { schema });
} else {
  // Local development: Use SQLite
  const dbPath = process.env.DATABASE_URL
    ? path.isAbsolute(process.env.DATABASE_URL)
      ? process.env.DATABASE_URL
      : path.join(process.cwd(), process.env.DATABASE_URL)
    : path.join(process.cwd(), "local.db");

  // Ensure the directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const sqlite = new Database(dbPath);
  db = drizzleSQLite(sqlite, { schema });
}

export { db };
