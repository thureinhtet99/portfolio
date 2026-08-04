import { db } from "@/db/client";
import { workExperience } from "@/db/schema";
import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

function safeParseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export const getWorkExperiences = unstable_cache(
  async () => {
    const rawExps = await db
      .select()
      .from(workExperience)
      .orderBy(asc(workExperience.order))
      .all();

    return rawExps.map((exp) => ({
      id: exp.id,
      companyName: exp.companyName,
      companyLogo: exp.companyLogo ?? undefined,
      companyWebsite: exp.companyWebsite ?? undefined,
      positions: safeParseJson(exp.positions, []),
      order: exp.order,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt,
    }));
  },
  ["work-experiences"],
  { revalidate: 600 },
);
