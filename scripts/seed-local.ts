import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { createSqliteDb } from "../db/sqlite";
import { post, project, setting, timeline, workExperience } from "../db/schema";

// Local-only placeholder content so every page has something to render.
// Idempotent (existing rows are skipped) and replaceable via /admin.
// Writes through the local SQLite client only; refuses to run against Turso.

function assertLocalOnly() {
  if (process.env.VERCEL || process.env.TURSO_DATABASE_URL) {
    throw new Error(
      "Refusing to seed: VERCEL or TURSO_DATABASE_URL is set. This script is local-only.",
    );
  }
}

async function seed() {
  assertLocalOnly();

  const db = createSqliteDb();
  const now = new Date();

  const settings: Record<string, string> = {
    intro: "[SAMPLE] Short intro shown in the hero.",
    aboutMe: "[SAMPLE] Markdown bio.\n\nReplace this from /admin.",
    residence: "Sample City",
    available: "true",
  };

  for (const [key, value] of Object.entries(settings)) {
    await db
      .insert(setting)
      .values({ id: `seed_setting_${key}`, key, value, updatedAt: now })
      .onConflictDoNothing();
  }

  const projects = [
    { n: 1, featured: true },
    { n: 2, featured: false },
  ];

  for (const { n, featured } of projects) {
    await db
      .insert(project)
      .values({
        id: `seed_project_${n}`,
        slug: `sample-project-${n}`,
        title: `[SAMPLE] Project ${n}`,
        summary: `[SAMPLE] One-line summary for project ${n}.`,
        startDate: "2024-01-01",
        description: `[SAMPLE] Description for project ${n}.`,
        technologies: JSON.stringify(["TypeScript", "Next.js"]),
        objectives: JSON.stringify(["[SAMPLE] Objective"]),
        featured,
        order: n,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing();
  }

  await db
    .insert(workExperience)
    .values({
      id: "seed_work_1",
      companyName: "[SAMPLE] Company",
      positions: JSON.stringify([
        {
          id: "seed_work_1_pos_1",
          title: "[SAMPLE] Software Developer",
          employmentPeriod: { start: "01.2023", end: "12.2024" },
          employmentType: "Full-time",
          description: "[SAMPLE] What was done in this role.",
          skills: ["TypeScript", "React"],
        },
      ]),
      order: 1,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();

  const timelines = [
    { n: 1, year: "2023" },
    { n: 2, year: "2024" },
  ];

  for (const { n, year } of timelines) {
    await db
      .insert(timeline)
      .values({
        id: `seed_timeline_${n}`,
        title: `[SAMPLE] Milestone ${n}`,
        year,
        description: `[SAMPLE] Milestone ${n} description.`,
        order: n,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing();
  }

  await db
    .insert(post)
    .values({
      id: "seed_post_1",
      slug: "sample-post",
      title: "[SAMPLE] Post",
      excerpt: "[SAMPLE] Excerpt.",
      body: "[SAMPLE] Post body in **Markdown**.",
      tags: JSON.stringify(["sample"]),
      published: true,
      order: 1,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();

  console.log("Seeded local placeholder content (existing rows skipped).");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
