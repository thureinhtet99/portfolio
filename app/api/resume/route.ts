import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { setting } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [resumeSetting] = await db
      .select()
      .from(setting)
      .where(eq(setting.key, "resume"))
      .limit(1)
      .all();

    if (!resumeSetting?.value) {
      return NextResponse.json(
        { success: false, error: "Resume not configured" },
        { status: 404 },
      );
    }

    const upstreamResponse = await fetch(resumeSetting.value, {
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Unable to load resume" },
        { status: 502 },
      );
    }

    const contentType = upstreamResponse.headers.get("content-type");
    const arrayBuffer = await upstreamResponse.arrayBuffer();
    const fileNameFromUrl =
      resumeSetting.value.split("/").pop()?.split("?")[0] || "resume.pdf";
    const filename = fileNameFromUrl.endsWith(".pdf")
      ? fileNameFromUrl
      : `${fileNameFromUrl}.pdf`;

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType?.includes("pdf")
          ? contentType
          : "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Resume proxy error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to open resume" },
      { status: 500 },
    );
  }
}
