import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

type CreateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
};

const getPayloadFromQuery = (req: NextRequest): CreateUserPayload => {
  const { searchParams } = new URL(req.url);
  return {
    name: searchParams.get("name") || undefined,
    email: searchParams.get("email") || undefined,
    password: searchParams.get("password") || undefined,
  };
};

const sanitizeValue = (value?: string) => value?.trim();

const validatePayload = ({ name, email, password }: CreateUserPayload) => {
  if (!name || !email || !password) {
    return "name, email, and password are required";
  }

  if (password.length < 8) {
    return "password must be at least 8 characters";
  }

  return null;
};

export async function POST(req: NextRequest) {
  return handleCreateUser(req);
}

export async function GET(req: NextRequest) {
  return handleCreateUser(req);
}

async function handleCreateUser(req: NextRequest) {
  // Keep this endpoint unavailable in production by default.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        success: false,
        error: "Admin creation is disabled in production",
      },
      { status: 403 },
    );
  }

  try {
    let payload: CreateUserPayload = {};

    try {
      payload = (await req.json()) as CreateUserPayload;
    } catch {
      payload = getPayloadFromQuery(req);
    }

    const name = sanitizeValue(payload.name);
    const email = sanitizeValue(payload.email);
    const password = sanitizeValue(payload.password);

    const validationError = validatePayload({ name, email, password });
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError,
        },
        { status: 400 },
      );
    }

    const safeName = name as string;
    const safeEmail = email as string;
    const safePassword = password as string;

    await auth.api.signUpEmail({
      body: {
        name: safeName,
        email: safeEmail,
        password: safePassword,
      },
      headers: req.headers,
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      data: {
        email: safeEmail,
        name: safeName,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create admin user";

    const status =
      errorMessage.toLowerCase().includes("already") ||
      errorMessage.toLowerCase().includes("exists")
        ? 409
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status },
    );
  }
}
