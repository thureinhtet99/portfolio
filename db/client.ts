import { createSqliteDb, type SqliteDb } from "./sqlite";
import { createTursoDb, type TursoDb } from "./turso";

function isVercel(): boolean {
  return process.env.VERCEL === "1";
}

// function getVercelEnv(): string | undefined {
//   return process.env.VERCEL_ENV;
// }

function createDatabase(): SqliteDb | TursoDb {
  if (isVercel()) return createTursoDb();

  return createSqliteDb();
}

export const db = createDatabase();
