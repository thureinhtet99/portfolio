import { incrementSiteViews } from "@/features/admin/services/settings.service";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await incrementSiteViews();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to increment view count:", error);
    return NextResponse.json(
      { success: false, error: "Failed to increment view count" },
      { status: 500 },
    );
  }
}
