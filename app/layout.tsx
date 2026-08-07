import { Footer } from "@/components/layout/footer";
import { TopNavbar } from "@/components/layout/top-navbar";
import QueryProvider from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  getSettings,
  getSiteViews,
} from "@/features/admin/services/settings.service";
import { getSiteUrl } from "@/lib/base-url";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist_Mono, JetBrains_Mono } from "next/font/google";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Thu Rein Htet",
    template: "%s | Thu Rein Htet's Portfolio",
  },
  description:
    "Software developer who enjoys building modern web, mobile and software applications using React, Next.js. Focusing on creating clean, efficient, and user-friendly solutions using modern technologies. My goal is to turn ideas into functional and scalable digital products.",
  keywords: [
    "Thu Rein Htet",
    "React Developer",
    "React Native Developer",
    "Typescript Developer",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "React",
    "React Native",
    "Node.js",
    "Express.js",
    "Expo",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Myanmar Developer",
  ],
  authors: [{ name: "Thu Rein Htet" }],
  creator: "Thu Rein Htet",
  publisher: "Thu Rein Htet",
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Thu Rein Htet - Software Developer from Myanmar",
    description:
      "Software developer who enjoys building modern web, mobile and software applications using React, Next.js. My goal is to turn ideas into functional and scalable digital products.",
    siteName: "Thu Rein Htet Portfolio",
    images: [
      {
        url: "/TRH.png",
        width: 1200,
        height: 630,
        alt: "Thu Rein Htet - Software Developer from Myanmar",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [settings, siteViews] = await Promise.all([
    getSettings(),
    getSiteViews(),
  ]);
  const viewCount = siteViews.toLocaleString();

  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <QueryProvider>
          <main className="min-h-screen">
            <div className="mx-auto flex w-full flex-col justify-center">
              <TopNavbar
                viewCount={viewCount}
                githubUrl={settings.githubUrl || ""}
                linkedinUrl={settings.linkedinUrl || ""}
                emailUrl={settings.emailUrl || ""}
              />
              <Suspense>
                <TooltipProvider>{children}</TooltipProvider>
              </Suspense>
            </div>
            <Toaster />
          </main>
          <Footer
            viewCount={viewCount}
            githubUrl={settings.githubUrl || ""}
            linkedinUrl={settings.linkedinUrl || ""}
            emailUrl={settings.emailUrl || ""}
          />
        </QueryProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
