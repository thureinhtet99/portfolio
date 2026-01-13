import { APP_CONFIG } from "@/config/app-config";
import { FooterClientComponent } from "./FooterClientComponent";

async function getSettings() {
  try {
    const baseUrl = APP_CONFIG.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.SETTINGS}`,
      {
        cache: "no-store",
      }
    );
    const { success, data } = await response.json();
    if (success && data) return data;

    return {};
  } catch (error) {
    console.error("Failed to load settings:", error);
    return {};
  }
}

export async function Footer() {
  const settings = await getSettings();

  const facebookURL = settings.facebookUrl || "";
  const githubURL = settings.githubUrl || "";
  const linkedInURL = settings.linkedInUrl || "";

  return (
    <FooterClientComponent
      facebookURL={facebookURL}
      githubURL={githubURL}
      linkedInURL={linkedInURL}
    />
  );
}
