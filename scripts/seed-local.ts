import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { createSqliteDb } from "../db/sqlite";
import { post, project, setting, timeline, workExperience } from "../db/schema";

// Local-only demo content: a fictional developer persona with realistic data,
// so every page renders as it would with real content. Nothing here describes
// a real person or company; URLs use reserved example domains.
//
// Re-running replaces rows whose id starts with `seed_` and leaves everything
// else (content created in /admin) untouched. A setting key that already
// exists is never overwritten. Writes through the local SQLite client only and
// refuses to run against Turso.

const SEED_PREFIX = "seed_";
const FENCE = "```";

function assertLocalOnly() {
  if (process.env.VERCEL || process.env.TURSO_DATABASE_URL) {
    throw new Error(
      "Refusing to seed: VERCEL or TURSO_DATABASE_URL is set. This script is local-only.",
    );
  }
}

const isSeedRow = (id: AnySQLiteColumn) =>
  sql`substr(${id}, 1, ${SEED_PREFIX.length}) = ${SEED_PREFIX}`;

const lines = (...parts: string[]) => parts.join("\n");

const settings: Record<string, string> = {
  intro:
    "Full-stack developer building fast, accessible web and mobile products with **TypeScript**, **React** and **Node.js**.",
  aboutMe: lines(
    "I'm a full-stack developer with eight years of experience shipping product work for agencies, analytics teams and early-stage startups. I like the part of the stack where design, performance and developer experience meet: component systems, data modelling, and the unglamorous plumbing that makes an app feel instant.",
    "",
    "Right now I'm focused on Next.js and React Server Components, local-first data, and keeping bundle sizes honest. Away from the keyboard I hike, cook, and slowly work through a pile of sci-fi paperbacks.",
    "",
    "If you have a project that needs careful engineering, I'd like to hear about it.",
  ),
  residence: "Thailand",
  available: "true",
  githubUrl: "https://github.com/octocat",
  emailUrl: "mailto:hello@example.com",
  bookingUrl: "https://example.com/book",
};

const projects = [
  {
    slug: "ledgerly",
    title: "Ledgerly",
    summary:
      "A privacy-first personal finance tracker with budgets, recurring bills and clear monthly reports.",
    startDate: "2025-03-01",
    liveUrl: "https://ledgerly.example.com",
    featured: true,
    technologies: [
      "Next.js",
      "TypeScript",
      "Drizzle ORM",
      "Tailwind CSS",
      "Recharts",
    ],
    objectives: [
      "Make budgeting feel as quick as sending a text message",
      "Keep all financial data on the user's own device or database",
      "Reach a Lighthouse performance score of 95+ on mobile",
    ],
    demoCredentials: [
      {
        role: "user",
        email: "demo@ledgerly.example",
        password: "demo-pass-123",
      },
      {
        role: "admin",
        email: "admin@ledgerly.example",
        password: "demo-pass-123",
      },
    ],
    description: lines(
      "Ledgerly started as a spreadsheet I was tired of maintaining. It imports bank CSV exports, categorises transactions with editable rules, and turns them into monthly reports you can read in under a minute.",
      "",
      "### Highlights",
      "",
      "- Rule-based auto-categorisation that learns from manual corrections",
      "- Recurring bill detection with upcoming-due reminders",
      "- Budget envelopes with rollover and overspend warnings",
      "- Charts that stay readable on small screens",
      "",
      "### What I learned",
      "",
      "Server Components made the report pages almost free to render, but the import flow needed careful streaming so a 20,000-row CSV never blocked the UI.",
    ),
  },
  {
    slug: "trailnote",
    title: "Trailnote",
    summary:
      "An offline-first hiking journal for iOS and Android that syncs routes, photos and notes when you're back in range.",
    startDate: "2024-08-15",
    liveUrl: "https://trailnote.example.com",
    featured: true,
    technologies: ["React Native", "Expo", "SQLite", "TypeScript", "Zustand"],
    objectives: [
      "Work fully offline for multi-day trips",
      "Sync conflicts resolved without ever losing a note",
      "Keep battery drain under 5% per hour with tracking on",
    ],
    description: lines(
      "Trailnote records your route, lets you attach photos and short notes to waypoints, and keeps everything on the phone until you are back online.",
      "",
      "### Highlights",
      "",
      "- Background GPS tracking tuned for battery life",
      "- Last-write-wins sync with per-field merge for notes",
      "- Map tiles cached for the region you plan to hike",
      "- Export to GPX for use in other apps",
    ),
  },
  {
    slug: "queuekit",
    title: "QueueKit",
    summary:
      "A small dashboard and CLI for inspecting, retrying and scheduling background jobs on Redis.",
    startDate: "2023-11-10",
    featured: true,
    technologies: ["Node.js", "Express", "Redis", "React", "Vite"],
    objectives: [
      "Give small teams visibility into failing jobs without a heavy platform",
      "Ship as a single package with zero configuration",
    ],
    description: lines(
      "QueueKit sits next to an existing BullMQ setup and gives you a searchable view of queues, failed jobs and their stack traces, with one-click retries.",
      "",
      "### Highlights",
      "",
      "- Live queue metrics over server-sent events",
      "- Bulk retry and cleanup with a dry-run preview",
      "- Cron-style scheduling UI backed by repeatable jobs",
    ),
  },
  {
    slug: "pixelpress",
    title: "Pixelpress",
    summary:
      "A command-line image optimiser that batch-converts folders to modern formats with sensible defaults.",
    startDate: "2022-09-05",
    featured: false,
    technologies: ["Node.js", "TypeScript", "sharp"],
    objectives: [
      "Cut image weight by half on a typical marketing site",
      "Be fast enough to run in a pre-commit hook",
    ],
    description: lines(
      "Pixelpress walks a directory, converts images to AVIF and WebP, generates responsive sizes, and writes a manifest your build can consume.",
      "",
      "It caches by content hash, so unchanged files are skipped and a warm run over 2,000 images finishes in a couple of seconds.",
    ),
  },
];

const workExperiences = [
  {
    id: "seed_work_brightloop",
    companyName: "Brightloop Studio",
    companyWebsite: "https://brightloop.example.com",
    order: 1,
    positions: [
      {
        id: "seed_pos_brightloop_senior",
        title: "Senior Frontend Engineer",
        employmentPeriod: { start: "03.2024" },
        employmentType: "Remote",
        skills: ["Next.js", "TypeScript", "Design Systems", "Accessibility"],
        description: lines(
          "- Led the migration of a 200-page marketing and product site to the Next.js App Router, cutting median LCP from 3.1s to 1.4s",
          "- Built and documented a shared component library used by four product teams",
          "- Mentored three engineers and introduced accessibility checks into code review",
        ),
      },
      {
        id: "seed_pos_brightloop_frontend",
        title: "Frontend Engineer",
        employmentPeriod: { start: "06.2022", end: "02.2024" },
        employmentType: "Remote",
        skills: ["React", "TypeScript", "GraphQL", "Storybook"],
        description: lines(
          "- Shipped a self-serve onboarding flow that lifted trial-to-paid conversion by 18%",
          "- Replaced a legacy form layer with a typed, schema-driven one used across 40+ forms",
        ),
      },
    ],
  },
  {
    id: "seed_work_harbor",
    companyName: "Harbor Analytics",
    companyWebsite: "https://harbor-analytics.example.com",
    order: 2,
    positions: [
      {
        id: "seed_pos_harbor_swe",
        title: "Software Engineer",
        employmentPeriod: { start: "09.2020", end: "05.2022" },
        employmentType: "On-site",
        skills: ["React", "Node.js", "PostgreSQL", "D3"],
        description: lines(
          "- Built interactive dashboards that let analysts explore datasets of up to a million rows",
          "- Moved report generation to background jobs, reducing timeouts by 90%",
        ),
      },
    ],
  },
  {
    id: "seed_work_pixelpine",
    companyName: "Pixel & Pine Agency",
    companyWebsite: "https://pixelandpine.example.com",
    order: 3,
    positions: [
      {
        id: "seed_pos_pixelpine_junior",
        title: "Junior Web Developer",
        employmentPeriod: { start: "01.2019", end: "08.2020" },
        employmentType: "On-site",
        skills: ["JavaScript", "WordPress", "SCSS"],
        description: lines(
          "- Delivered 15+ client websites from design handoff to launch",
          "- Introduced a Git-based deployment flow to replace manual FTP uploads",
        ),
      },
      {
        id: "seed_pos_pixelpine_intern",
        title: "Web Development Intern",
        employmentPeriod: { start: "06.2018", end: "12.2018" },
        employmentType: "Intern",
        skills: ["HTML", "CSS", "JavaScript"],
        description:
          "Built landing pages and fixed cross-browser bugs under a senior developer.",
      },
    ],
  },
];

const timelines = [
  {
    year: "2018",
    title: "Wrote my first production code",
    description:
      "Started as a web development intern, building landing pages and fixing cross-browser bugs.",
  },
  {
    year: "2019",
    title: "First full-time role",
    description:
      "Joined an agency as a junior developer and shipped my first client sites end to end.",
  },
  {
    year: "2020",
    title: "Moved into product engineering",
    description:
      "Switched to a data analytics company to work on dashboards and long-lived products.",
  },
  {
    year: "2022",
    title: "Went remote-first",
    description:
      "Joined a distributed team and learned how much good writing matters in async work.",
  },
  {
    year: "2024",
    title: "Became a senior engineer",
    description:
      "Took on technical leadership for the frontend platform and started mentoring.",
  },
  {
    year: "2025",
    title: "Started writing publicly",
    description:
      "Began publishing notes on performance, local-first data and accessibility.",
  },
];

const posts = [
  {
    slug: "sqlite-for-side-projects",
    title: "Why I run my side projects on SQLite",
    excerpt:
      "A single file, zero ops, and more headroom than most side projects will ever need.",
    tags: ["sqlite", "drizzle", "nextjs"],
    published: true,
    createdAt: new Date("2026-09-18T09:00:00Z"),
    body: lines(
      "Every few months I catch myself provisioning a managed Postgres instance for a side project that has three users. Lately I've stopped doing that.",
      "",
      "## The case for a single file",
      "",
      "SQLite runs in-process, so there is no network hop, no connection pool and no free-tier database that pauses itself overnight. A backup is `cp`. Local development is production, minus the file path.",
      "",
      "## What it looks like with Drizzle",
      "",
      `${FENCE}ts`,
      'import Database from "better-sqlite3";',
      'import { drizzle } from "drizzle-orm/better-sqlite3";',
      "",
      'const db = drizzle(new Database("app.db"));',
      `${FENCE}`,
      "",
      "Migrations are plain SQL files checked into the repo, which makes review easy and rollbacks boring.",
      "",
      "## Where it stops working",
      "",
      "- Multiple writers across machines: reach for a hosted option such as Turso, which keeps the same SQL dialect",
      "- Heavy analytical queries over very large tables",
      "",
      "For everything else, one file goes a surprisingly long way.",
    ),
  },
  {
    slug: "react-server-components-caching-notes",
    title: "Notes on caching in React Server Components",
    excerpt:
      "A practical mental model for what is cached, for how long, and how to invalidate it.",
    tags: ["react", "nextjs", "performance"],
    published: true,
    createdAt: new Date("2026-07-02T09:00:00Z"),
    body: lines(
      "Caching in the App Router confused me for longer than I'd like to admit. This is the model that finally made it click.",
      "",
      "## Three questions to ask",
      "",
      "1. Is this data the same for every visitor?",
      "2. How stale is acceptable?",
      "3. What event should make it fresh again?",
      "",
      "If the answers are *yes*, *an hour* and *an admin edit*, you want a time-based cache that is also tagged for on-demand invalidation.",
      "",
      `${FENCE}ts`,
      'const getSettings = unstable_cache(loadSettings, ["settings"], {',
      "  revalidate: 3600,",
      '  tags: ["settings"],',
      "});",
      "",
      "// after an admin saves a change",
      'revalidateTag("settings");',
      `${FENCE}`,
      "",
      "## A common trap",
      "",
      "Caching an error as if it were data. Make sure failures throw inside the cached function so they are retried instead of being served for the whole revalidation window.",
    ),
  },
  {
    slug: "offline-first-mobile-notes",
    title: "Lessons from building an offline-first mobile app",
    excerpt:
      "What I got wrong about sync, conflicts and battery life while building a hiking journal.",
    tags: ["react-native", "expo", "sqlite"],
    published: true,
    createdAt: new Date("2026-04-10T09:00:00Z"),
    body: lines(
      "Offline-first is easy to say and surprisingly hard to do well. These are the lessons I'd hand to my past self.",
      "",
      "## 1. The local database is the source of truth",
      "",
      "The UI reads from SQLite and nothing else. The network is just a background process that happens to move rows around.",
      "",
      "## 2. Decide your conflict rule early",
      "",
      "I started with last-write-wins for everything, then lost a paragraph of someone's trip notes. Merging per field for text and keeping last-write-wins for simple values fixed it.",
      "",
      "## 3. Measure battery, not just speed",
      "",
      "Location updates every second looked great in demos and drained a phone in four hours. Adaptive sampling based on movement speed cut that dramatically.",
      "",
      "> If the app is only good with a signal, it isn't an offline-first app.",
    ),
  },
  {
    slug: "accessible-command-palette",
    title: "Building an accessible command palette",
    excerpt:
      "Draft: keyboard focus, screen reader announcements and escape hatches.",
    tags: ["accessibility", "react"],
    published: false,
    createdAt: new Date("2026-10-20T09:00:00Z"),
    body: lines(
      "Work in progress.",
      "",
      "## Outline",
      "",
      "- Focus management when the palette opens and closes",
      "- Announcing result counts to screen readers",
      "- Making sure Escape always gets you out",
    ),
  },
];

function seed() {
  assertLocalOnly();

  const db = createSqliteDb();
  const now = new Date();

  db.transaction((tx) => {
    tx.delete(setting).where(isSeedRow(setting.id)).run();
    tx.delete(project).where(isSeedRow(project.id)).run();
    tx.delete(workExperience).where(isSeedRow(workExperience.id)).run();
    tx.delete(timeline).where(isSeedRow(timeline.id)).run();
    tx.delete(post).where(isSeedRow(post.id)).run();

    // `key` is unique: a setting you already saved in /admin wins over the seed.
    for (const [key, value] of Object.entries(settings)) {
      tx.insert(setting)
        .values({
          id: `${SEED_PREFIX}setting_${key}`,
          key,
          value,
          updatedAt: now,
        })
        .onConflictDoNothing()
        .run();
    }

    projects.forEach((p, index) => {
      tx.insert(project)
        .values({
          id: `${SEED_PREFIX}project_${p.slug}`,
          slug: p.slug,
          title: p.title,
          summary: p.summary,
          startDate: p.startDate,
          description: p.description,
          technologies: JSON.stringify(p.technologies),
          objectives: JSON.stringify(p.objectives),
          liveUrl: p.liveUrl ?? null,
          demoCredentials: p.demoCredentials
            ? JSON.stringify(p.demoCredentials)
            : null,
          featured: p.featured,
          order: index + 1,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing()
        .run();
    });

    for (const w of workExperiences) {
      tx.insert(workExperience)
        .values({
          id: w.id,
          companyName: w.companyName,
          companyWebsite: w.companyWebsite,
          positions: JSON.stringify(w.positions),
          order: w.order,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing()
        .run();
    }

    timelines.forEach((t, index) => {
      tx.insert(timeline)
        .values({
          id: `${SEED_PREFIX}timeline_${t.year}`,
          title: t.title,
          year: t.year,
          description: t.description,
          order: index + 1,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing()
        .run();
    });

    // Lists sort by `order` ascending, so the newest post gets the lowest.
    posts.forEach((p, index) => {
      tx.insert(post)
        .values({
          id: `${SEED_PREFIX}post_${p.slug}`,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          body: p.body,
          tags: JSON.stringify(p.tags),
          published: p.published,
          order: index + 1,
          createdAt: p.createdAt,
          updatedAt: p.createdAt,
        })
        .onConflictDoNothing()
        .run();
    });
  });

  console.log(
    `Seeded ${Object.keys(settings).length} settings, ${projects.length} projects, ` +
      `${workExperiences.length} companies, ${timelines.length} timeline entries, ` +
      `${posts.length} posts (rows with ids starting "${SEED_PREFIX}" were replaced).`,
  );
}

try {
  seed();
} catch (error) {
  console.error(error);
  process.exit(1);
}
