import { APP_CONFIG } from "@/config/app-config";
import CertificatesClientComponent from "./CertificatesClientComponent";

export const dynamic = 'force-dynamic';

async function getCertificates() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/${APP_CONFIG.ROUTE.CERTIFICATES}`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to load certificates:", error);
    return [];
  }
}

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return <CertificatesClientComponent certificates={certificates} />;
}
