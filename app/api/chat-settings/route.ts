import { getUsageSummary } from "@/features/assistant/services/usage.service";
import { UnauthorizedError, requireAdminSession } from "@/lib/require-admin";
import { NextRequest, NextResponse } from "next/server";
import { getAssistantConfig } from "../chat/config";

export const dynamic = "force-dynamic";

// GET - Live assistant switch, budgets and spend, for the admin dashboard
export async function GET(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const [config, usage] = await Promise.all([
      getAssistantConfig(),
      getUsageSummary(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        apiKeyConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
        config,
        usage,
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Failed to fetch assistant settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assistant settings" },
      { status: 500 },
    );
  }
}
