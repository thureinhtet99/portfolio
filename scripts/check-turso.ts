import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
import { createClient } from "@libsql/client";

async function check() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const projects = await client.execute("SELECT * FROM project");
  console.log("Projects (full):", JSON.stringify(projects.rows, null, 2));
}
check().catch(console.error);
