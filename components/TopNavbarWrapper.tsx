import { APP_CONFIG } from "@/config/app-config";
import { TopNavbar } from "@/components/top-navbar";

async function getSettings() {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.SETTINGS}`,
      {
        cache: "no-store",
      },
    );
    const { success, data } = await response.json();
    if (success && data) return data;

    return {};
  } catch (error) {
    console.error("Failed to load settings:", error);
    return {};
  }
}

export async function TopNavbarWrapper() {
  const settings = await getSettings();

  const socialLinks = [
    { href: settings.githubUrl || "", label: "GitHub" as const },
    { href: settings.facebookUrl || "", label: "Facebook" as const },
    { href: settings.linkedinUrl || "", label: "LinkedIn" as const },
  ].filter((item) => item.href);

  return <TopNavbar socialLinks={socialLinks} />;
}
