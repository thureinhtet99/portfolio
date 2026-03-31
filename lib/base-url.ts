const LOCAL_BASE_URL = "http://localhost:3000";

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "");
}

export function getBaseUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BETTER_AUTH_URL;

  if (envUrl) {
    return normalizeUrl(envUrl);
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`);
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
