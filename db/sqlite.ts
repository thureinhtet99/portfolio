import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import path from "path";
import * as schema from "./schema";

export function createSqliteDb() {
  const rawPath = process.env.SQLITE_DB_PATH || "./local.db";

  const dbPath = path.isAbsolute(rawPath)
    ? rawPath
    : path.join(process.cwd(), rawPath);

  // Ensure directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(dbPath);
  return drizzle(sqlite, { schema });
}

export type SqliteDb = ReturnType<typeof createSqliteDb>;
