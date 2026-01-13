import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Ensure the database path is absolute and relative to the project root
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

export const db = drizzle(sqlite, { schema });
