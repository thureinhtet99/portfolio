import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function createTursoDb() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      "Missing TURSO_DATABASE_URL. Turso credentials are required on Vercel.",
    );
  }

  if (!authToken) {
    throw new Error(
      "Missing TURSO_AUTH_TOKEN. Turso credentials are required on Vercel.",
    );
  }

  const client = createClient({ url, authToken });
  return drizzle(client, { schema });
}

export type TursoDb = ReturnType<typeof createTursoDb>;
