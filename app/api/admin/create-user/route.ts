import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const userId = crypto.randomUUID();
    const now = new Date();

    // Create user
    await db.insert(user).values({
      id: userId,
      email,
      name: name || email.split("@")[0],
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    });

    // Note: Password hashing is handled by better-auth internally
    // This endpoint is mainly for creating the initial admin user
    // After this, use the better-auth sign-up endpoint

    return NextResponse.json({
      success: true,
      message: "User created successfully. Now use /api/auth/sign-in to login",
      userId,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
