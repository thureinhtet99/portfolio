import dotenv from "dotenv";
import fs from "node:fs";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { spawnSync } from "node:child_process";
import readline from "node:readline/promises";
import { resolveSqlitePath } from "../db/sqlite";

// Deletes the local SQLite database, re-applies migrations and re-seeds the
// demo content. Cross-platform replacement for the old `rm -f local.db && ...`
// one-liner: it honours SQLITE_DB_PATH, asks before deleting, and never runs
// against Turso.
//
// Usage: npm run db:reset            (asks for confirmation)
//        npm run db:reset -- --yes   (no prompt, for scripts and CI)

const projectRoot = path.resolve(__dirname, "..");
const SIDECAR_SUFFIXES = ["", "-wal", "-shm", "-journal"];

function assertLocalOnly() {
  if (process.env.VERCEL || process.env.TURSO_DATABASE_URL) {
    throw new Error(
      "Refusing to reset: VERCEL or TURSO_DATABASE_URL is set. This script is local-only.",
    );
  }
}

async function confirm(dbPath: string) {
  if (process.argv.includes("--yes")) return;

  if (!process.stdin.isTTY) {
    throw new Error(
      "Refusing to delete the database without a terminal. Re-run with --yes to confirm.",
    );
  }

  console.log(`This permanently deletes ${dbPath}`);
  console.log(
    "Everything in it is lost: admin users, sessions, settings and content. Stop the dev server first.",
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question('Type "reset" to continue: ');
  rl.close();

  if (answer.trim() !== "reset")
    throw new Error("Cancelled. Nothing was deleted.");
}

function run(label: string, args: string[]) {
  console.log(`\n> ${label}`);
  const result = spawnSync("npx", args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    throw new Error(`"${label}" failed (exit ${result.status ?? "unknown"}).`);
  }
}

async function reset() {
  assertLocalOnly();

  const dbPath = resolveSqlitePath();
  await confirm(dbPath);

  for (const suffix of SIDECAR_SUFFIXES) {
    fs.rmSync(dbPath + suffix, { force: true });
  }
  console.log(`Deleted ${dbPath}`);

  run("drizzle-kit migrate", ["drizzle-kit", "migrate"]);
  run("seed demo content", ["tsx", "scripts/seed-local.ts"]);

  console.log(
    "\nDatabase reset. Create an admin with: npm run db:create-admin",
  );
}

reset().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
