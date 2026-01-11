import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "sonner";
import QueryProvider from "@/components/QueryProvider";
import { Footer } from "@/components/Footer";
import { TopNavbar } from "@/components/top-navbar";

const robotoMono = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Thu Rein Htet - A Developer form Myanmar",
    template: "%s | Thu Rein Htet's Portfolio",
  },
  description:
    "Full-Stack Next.js Developer specializing in React, TypeScript, and modern web applications. Building scalable solutions with clean code and exceptional user experiences.",
  keywords: [
    "Thu Rein Htet",
    "Myanmar Web Developer",
    "Myanmar Mobile Developer",
    "React Developer",
    "React Native Developer",
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://thureinhtet.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Thu Rein Htet - Web Developer",
    description:
      "A web developer specializing in React, Next.js, TypeScript, and modern web applications.",
    siteName: "Thu Rein Htet Portfolio",
    images: [
      {
        url: "/me.jpg",
        width: 1200,
        height: 630,
        alt: "Thu Rein Htet - Web Developer",
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
      <body className={`${robotoMono.className} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <TopNavbar />
            <main className="min-h-screen px-4 md:px-6 lg:px-8 pt-4 md:pt-6">
              {children}
              <Toaster />
            </main>
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
