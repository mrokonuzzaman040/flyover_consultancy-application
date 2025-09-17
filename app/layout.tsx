import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ui/scroll-progress";
import LenisProvider from "@/components/ui/lenis-provider";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flyover Consultancy — Study Abroad Advisors",
  description:
    "Flyover Consultancy helps students study abroad with end-to-end assistance across admissions, visas, scholarships, and more.",
  metadataBase: new URL("https://www.flyover.example"),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    title: "Flyover Consultancy — Study Abroad Advisors",
    description:
      "End-to-end assistance for studying abroad. 22,000+ students, 550+ partners.",
    url: "https://www.flyover.example",
    siteName: "Flyover Consultancy",
    images: [
      { url: "/logo.png", width: 1200, height: 630, alt: "Flyover Consultancy" },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flyover Consultancy",
    description:
      "End-to-end assistance for studying abroad. 22,000+ students, 550+ partners.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LenisProvider />
        <ScrollProgress />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
