const LOCAL_BASE_URL = "http://localhost:3000";
const isProduction = process.env.NODE_ENV === "production";

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalhostLike(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "0.0.0.0" ||
      parsed.hostname === "::1"
    );
  } catch {
    return false;
  }
}

function getPreferredEnvUrl(): string | undefined {
  const candidates = [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.BETTER_AUTH_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const normalized = normalizeUrl(candidate);
    if (isProduction && isLocalhostLike(normalized)) {
      continue;
    }
    return normalized;
  }

  return undefined;
}

export function getBaseUrl(): string {
  const envUrl = getPreferredEnvUrl();

  if (envUrl) {
    return envUrl;
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`);
  }

  if (isProduction) {
    throw new Error(
      "Unable to resolve a valid production base URL. Set NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_SITE_URL, or BETTER_AUTH_URL.",
    );
  }

  return LOCAL_BASE_URL;
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (envUrl) {
    return normalizeUrl(envUrl);
  }

  return getBaseUrl();
}
