import { ContributionsSection } from "@/features/home/components/contributions-section";
import { HomeView } from "@/features/home/components/home-view";
import { getResidenceCoordinates } from "@/features/home/services/location.service";
import { WidgetSection } from "@/features/home/components/widget-section";
import { getSettings } from "@/features/admin/services/settings.service";
import { getProjects } from "@/features/projects/services/project.service";
import { getWorkExperiences } from "@/features/timeline/services/work-experience.service";
import { Suspense } from "react";

export default async function Home() {
  const settings = await getSettings();

  const residence = settings.residence || "Myanmar";
  const available = settings.available === "true";
  const aboutMe = settings.aboutMe || "";
  const intro = settings.intro || "";
  const profileImage = settings.profileImage || null;
  const resume = settings.resume || null;
  const bookingUrl = settings.bookingUrl || null;
  const githubUrl = settings.githubUrl || null;
  const linkedinUrl = settings.linkedinUrl || null;
  const facebookUrl = settings.facebookUrl || null;

  const [featuredProjects, experiences, location] = await Promise.all([
    getProjects({ featured: true }),
    getWorkExperiences(),
    getResidenceCoordinates(residence),
  ]);

  return (
    <HomeView
      experiences={experiences}
      residence={residence}
      lat={location.lat}
      lng={location.lng}
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
