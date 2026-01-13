import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { certificate } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch all certificates
export async function GET() {
  try {
    const certificates = await db.select().from(certificate).all();

    return NextResponse.json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST - Create new certificate
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, issuer, issueDate, credentialId, credentialUrl, image } =
      body;

    if (!title || !issuer || !issueDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, issuer, and issue date are required",
        },
        { status: 400 }
      );
    }

    const id = `certificate_${Date.now()}`;
    const now = new Date();

    const insertData = {
      id,
      title,
      issuer,
      issueDate,
      credentialId: credentialId || null,
      credentialUrl: credentialUrl || null,
      image: image || null,
      order: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(certificate).values(insertData);

    return NextResponse.json({
      success: true,
      data: {
        id,
        title,
        issuer,
        issueDate,
        credentialId,
        credentialUrl,
        image,
      },
    });
  } catch (error) {
    console.error("Failed to create certificate:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create certificate",
      },
      { status: 500 }
    );
  }
}

// PUT - Update certificate
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, issuer, issueDate, credentialId, credentialUrl, image } =
      body;

    if (!id || !title || !issuer || !issueDate) {
      return NextResponse.json(
        {
          success: false,
          error: "ID, title, issuer, and issue date are required",
        },
        { status: 400 }
      );
    }

    await db
      .update(certificate)
      .set({
        title,
        issuer,
        issueDate,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        image: image || null,
        updatedAt: new Date(),
      })
      .where(eq(certificate.id, id));

    return NextResponse.json({
      success: true,
      data: {
        id,
        title,
        issuer,
        issueDate,
        credentialId,
        credentialUrl,
        image,
      },
    });
  } catch (error) {
    console.error("Failed to update certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update certificate" },
      { status: 500 }
    );
  }
}

// DELETE - Delete certificate
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    await db.delete(certificate).where(eq(certificate.id, id));

    return NextResponse.json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
