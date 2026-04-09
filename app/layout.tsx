import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "sonner";
import QueryProvider from "@/components/QueryProvider";
import { Footer } from "@/components/Footer";
import { TopNavbar } from "@/components/top-navbar";
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
    "Full-Stack Next.js Developer specializing in React, TypeScript, and modern web applications. Building scalable solutions with clean code and exceptional user experiences.",
  keywords: [
    "Thu Rein Htet",
    "Myanmar Web Developer",
    "React Developer",
    "React Native Developer",
    "Typescript Developer",
    "Next.js",
    "React",
    "React Native",
    "Node.js",
    "Express.js",
    "TypeScript",
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
    title: "Thu Rein Htet - A Developer from Myanmar",
    description:
      "A web developer specializing in React, Next.js, TypeScript, and modern web applications.",
    siteName: "Thu Rein Htet Portfolio",
    images: [
      {
        url: "/me.jpg",
        width: 1200,
        height: 630,
        alt: "Thu Rein Htet - A Developer from Myanmar",
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
            <TopNavbar />
            <main className="min-h-screen px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:px-8">
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
