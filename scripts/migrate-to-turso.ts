/**
 * Migrate local SQLite content to Turso.
 * Skips auth tables (user, session, account, verification) since
 * the user already registered on Vercel.
 *
 * Run with: VERCEL=1 npx tsx scripts/migrate-to-turso.ts
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

const LOCAL_DB_PATH = "./local.db";
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_AUTH) {
  console.error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local");
  process.exit(1);
}

const sqlite = new Database(LOCAL_DB_PATH);
const local = drizzleSqlite(sqlite, { schema });

const tursoClient = createClient({ url: TURSO_URL, authToken: TURSO_AUTH });
const turso = drizzleLibsql(tursoClient, { schema });

async function migrate() {
  console.log("Migrating local data to Turso (skipping auth tables)...\n");

  // Projects
  const projects = local.select().from(schema.project).all();
  console.log(`Projects: ${projects.length}`);
  for (const p of projects) {
    await turso
      .insert(schema.project)
      .values(p)
      .onConflictDoUpdate({
        target: schema.project.id,
        set: {
          title: p.title,
          slug: p.slug,
          summary: p.summary,
          description: p.description,
          image: p.image,
          technologies: p.technologies,
          githubUrl: p.githubUrl,
          liveUrl: p.liveUrl,
          objectives: p.objectives,
          collaborators: p.collaborators,
          demoCredentials: p.demoCredentials,
          featured: p.featured,
          order: p.order,
          startDate: p.startDate,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        },
      });
  }
  console.log("  ✓ Projects migrated\n");

  // Posts
  const posts = local.select().from(schema.post).all();
  console.log(`Posts: ${posts.length}`);
  for (const p of posts) {
    await turso
      .insert(schema.post)
      .values(p)
      .onConflictDoUpdate({
        target: schema.post.id,
        set: {
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          body: p.body,
          tags: p.tags,
          published: p.published,
          order: p.order,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        },
      });
  }
  console.log("  ✓ Posts migrated\n");

  // Timelines
  const timelines = local.select().from(schema.timeline).all();
  console.log(`Timelines: ${timelines.length}`);
  for (const t of timelines) {
    await turso
      .insert(schema.timeline)
      .values(t)
      .onConflictDoUpdate({
        target: schema.timeline.id,
        set: {
          title: t.title,
          year: t.year,
          description: t.description,
          order: t.order,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        },
      });
  }
  console.log("  ✓ Timelines migrated\n");

  // Work experiences
  const workExps = local.select().from(schema.workExperience).all();
  console.log(`Work experiences: ${workExps.length}`);
  for (const w of workExps) {
    await turso
      .insert(schema.workExperience)
      .values(w)
      .onConflictDoUpdate({
        target: schema.workExperience.id,
        set: {
          companyName: w.companyName,
          companyLogo: w.companyLogo,
          companyWebsite: w.companyWebsite,
          positions: w.positions,
          order: w.order,
          createdAt: w.createdAt,
          updatedAt: w.updatedAt,
        },
      });
  }
  console.log("  ✓ Work experiences migrated\n");

  // Settings
  const settings = local.select().from(schema.setting).all();
  console.log(`Settings: ${settings.length}`);
  for (const s of settings) {
    await turso
      .insert(schema.setting)
      .values(s)
      .onConflictDoUpdate({
        target: schema.setting.key,
        set: { value: s.value, updatedAt: s.updatedAt },
      });
  }
  console.log("  ✓ Settings migrated\n");

  sqlite.close();
  console.log("Done! All content migrated to Turso.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
