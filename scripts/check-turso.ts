import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { createClient } from "@libsql/client";

async function check() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const projects = await client.execute(
    "SELECT id, title, slug, featured FROM project",
  );
  console.log("Projects:", JSON.stringify(projects.rows, null, 2));

  const posts = await client.execute("SELECT id, title, slug FROM post");
  console.log("Posts:", JSON.stringify(posts.rows, null, 2));

  const timelines = await client.execute("SELECT id, title FROM timeline");
  console.log("Timelines:", JSON.stringify(timelines.rows, null, 2));

  const workExps = await client.execute(
    "SELECT id, company_name FROM work_experience",
  );
  console.log("Work Experiences:", JSON.stringify(workExps.rows, null, 2));
}

check().catch(console.error);
