import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "sonner";
import QueryProvider from "@/components/QueryProvider";
import { Footer } from "@/components/Footer";
import { TopNavbarWrapper } from "@/components/TopNavbarWrapper";
import { Suspense } from "react";
import Loading from "./loading";
import { getSiteUrl } from "@/lib/base-url";

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Thu Rein Htet - A Developer from Myanmar",
    template: "%s | Thu Rein Htet's Portfolio",
  },
  description:
    "Software developer who enjoys building modern web, mobile and software applications using React, Next.js. Focusing on creating clean, efficient, and user-friendly solutions using modern technologies. My goal is to turn ideas into functional and scalable digital products.",
  keywords: [
    "Thu Rein Htet",
    "Myanmar Web Developer",
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
    "Frontend",
    "Backend",
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
        url: "@/public/TRH.png",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <TopNavbarWrapper />
            <main className="min-h-screen p-4 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
              <Suspense fallback={<Loading />}>{children}</Suspense>
              <Toaster />
            </main>
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
