import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "@/lib/base-url";

const baseURL =
  typeof window !== "undefined" ? window.location.origin : getBaseUrl();

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
