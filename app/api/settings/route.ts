import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { setting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// GET - Fetch a setting by key
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      // Return all settings
      const allSettings = await db.select().from(setting).all();
      const settingsObj = allSettings.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({ success: true, data: settingsObj });
    }

    const result = await db
      .select()
      .from(setting)
      .where(eq(setting.key, key))
      .limit(1)
      .all();
    if (result.length === 0) {
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({ success: true, data: result[0].value });
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch setting" },
      { status: 500 }
    );
  }
}

// POST - Create or update a setting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value } = body;
    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    // Check if setting exists
    const existing = await db
      .select()
      .from(setting)
      .where(eq(setting.key, key))
      .limit(1)
      .all();

    // Delete old file from Cloudinary if updating profileImage or resume
    if (existing.length > 0 && (key === "profileImage" || key === "resume")) {
      const oldValue = existing[0].value;
      if (oldValue && value && oldValue !== value) {
        try {
          // Extract public_id from Cloudinary URL
          const urlParts = oldValue.split("/");
          const uploadIndex = urlParts.indexOf("upload");
          if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
            const publicIdWithExtension = urlParts
              .slice(uploadIndex + 2)
              .join("/");
            const publicId = publicIdWithExtension.split(".")[0];

            // For PDFs, need to specify resource_type
            const resourceType = key === "resume" ? "raw" : "image";
            await cloudinary.uploader.destroy(publicId, {
              resource_type: resourceType,
            });
          }
        } catch (cloudinaryError) {
          console.error(
            "Failed to delete old file from Cloudinary:",
            cloudinaryError
          );
          // Continue with update even if Cloudinary deletion fails
        }
      }
    }

    if (existing.length > 0) {
      // Update existing
      await db
        .update(setting)
        .set({ value, updatedAt: new Date() })
        .where(eq(setting.key, key));
    } else {
      // Create new
      await db.insert(setting).values({
        id: crypto.randomUUID(),
        key,
        value,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, message: "Setting saved" });
  } catch (error) {
    console.error("Error saving setting:", error);
    return NextResponse.json(
      { error: "Failed to save setting" },
      { status: 500 }
    );
  }
}
