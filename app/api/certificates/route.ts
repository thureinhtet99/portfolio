import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { certificate } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

// GET - Fetch all certificates
export async function GET() {
  try {
    const certificates = await db
      .select()
      .from(certificate)
      .orderBy(asc(certificate.order))
      .all();

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

// PATCH - Update certificate order
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { certificates: updatedCertificates } = body;

    if (!updatedCertificates || !Array.isArray(updatedCertificates)) {
      return NextResponse.json(
        { success: false, error: "Invalid certificates data" },
        { status: 400 }
      );
    }

    // Update order for each certificate
    await Promise.all(
      updatedCertificates.map((cert: { id: string; order: number }) =>
        db
          .update(certificate)
          .set({ order: cert.order, updatedAt: new Date() })
          .where(eq(certificate.id, cert.id))
      )
    );

    return NextResponse.json({
      success: true,
      message: "Certificate order updated successfully",
    });
  } catch (error) {
    console.error("Failed to update certificate order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update certificate order" },
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

    // Get the certificate to retrieve image URL before deleting
    const certificateData = await db
      .select()
      .from(certificate)
      .where(eq(certificate.id, id))
      .all();

    if (certificateData.length === 0) {
      return NextResponse.json(
        { success: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    const imageUrl = certificateData[0].image;

    // Delete image from Cloudinary if it exists
    if (imageUrl) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split("/");
        const uploadIndex = urlParts.indexOf("upload");
        if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
          // Get everything after 'upload/v{version}/'
          const publicIdWithExtension = urlParts
            .slice(uploadIndex + 2)
            .join("/");
          const publicId = publicIdWithExtension.split(".")[0];

          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete image from Cloudinary:",
          cloudinaryError
        );
        // Continue with project deletion even if Cloudinary deletion fails
      }
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
