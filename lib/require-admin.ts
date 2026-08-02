import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function requireAdminSession(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}
