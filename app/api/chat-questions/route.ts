import {
  deleteUnanswered,
  listUnanswered,
} from "@/features/assistant/services/usage.service";
import { UnauthorizedError, requireAdminSession } from "@/lib/require-admin";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const unauthorized = () =>
  NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

// GET - Questions the assistant could not answer (last 30 days)
export async function GET(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const questions = await listUnanswered();

    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    if (error instanceof UnauthorizedError) return unauthorized();
    console.error("Failed to fetch unanswered questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}

// DELETE - Remove one question
export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession(req);
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Question ID is required" },
        { status: 400 },
      );
    }

    await deleteUnanswered(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) return unauthorized();
    console.error("Failed to delete question:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete question" },
      { status: 500 },
    );
  }
}
