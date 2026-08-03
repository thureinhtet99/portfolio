import { ContributionsSection } from "@/features/home/components/contributions-section";
import { HomeView } from "@/features/home/components/home-view";
import { WidgetSection } from "@/features/home/components/widget-section";
import { getProjects } from "@/lib/services/projects";
import { getSettings } from "@/lib/services/settings";
import { getWorkExperiences } from "@/lib/services/work-experiences";
import { Suspense } from "react";

const FALLBACK_LAT = 16.8661;
const FALLBACK_LNG = 96.1951;

async function geocodeCity(
  city: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      {
        headers: { "User-Agent": "thureinhtet-portfolio/3.0" },
        next: { revalidate: 86400 * 7 },
      },
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data.length === 0) return null;

    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export default async function Home() {
  const [settings, featuredProjects, experiences] = await Promise.all([
    getSettings(),
    getProjects({ featured: true }),
    getWorkExperiences(),
  ]);

  const residence = settings.residence || "Myanmar";
  const location = await geocodeCity(residence);
  const lat = location?.lat ?? FALLBACK_LAT;
  const lng = location?.lng ?? FALLBACK_LNG;
  const available = settings.available === "true";
  const aboutMe = settings.aboutMe || "";
  const intro = settings.intro || "";
  const profileImage = settings.profileImage || null;
  const resume = settings.resume || null;
  const bookingUrl = settings.bookingUrl || null;
  const githubUrl = settings.githubUrl || null;
  const linkedinUrl = settings.linkedinUrl || null;
  const facebookUrl = settings.facebookUrl || null;

  return (
    <HomeView
      experiences={experiences}
      residence={residence}
      lat={lat}
      lng={lng}
      available={available}
      aboutMe={aboutMe}
      intro={intro}
      featuredProjects={featuredProjects}
      profileImage={profileImage}
      resume={resume}
      bookingUrl={bookingUrl}
      socialLinks={{
        github: githubUrl,
        linkedin: linkedinUrl,
        facebook: facebookUrl,
      }}
      contributionsSection={<ContributionsSection />}
    >
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="h-48 rounded-md border border-muted-foreground/20 bg-muted/30 animate-pulse" />
            <div className="h-48 rounded-md border border-muted-foreground/20 bg-muted/30 animate-pulse" />
          </div>
        }
      >
        <WidgetSection />
      </Suspense>
    </HomeView>
  );
}
