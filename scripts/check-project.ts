import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
import { createClient } from "@libsql/client";

async function check() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const result = await client.execute("SELECT * FROM project");
  for (const row of result.rows) {
    console.log("--- Project ---");
    for (const [k, v] of Object.entries(row)) {
      console.log(`  ${k}: ${JSON.stringify(v)}`);
    }
  }
}
check().catch(console.error);
