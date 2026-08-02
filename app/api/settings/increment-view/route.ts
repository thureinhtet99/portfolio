import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const existing = await db
      .select()
      .from(setting)
      .where(eq(setting.key, "siteViews"))
      .limit(1)
      .all();

    if (existing.length > 0) {
      const current = Number(existing[0].value) || 0;
      await db
        .update(setting)
        .set({ value: String(current + 1), updatedAt: new Date() })
        .where(eq(setting.key, "siteViews"));
    } else {
      await db.insert(setting).values({
        id: crypto.randomUUID(),
        key: "siteViews",
        value: "1",
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to increment view count:", error);
    return NextResponse.json(
      { success: false, error: "Failed to increment view count" },
      { status: 500 },
    );
  }
}
