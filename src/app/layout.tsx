import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-dm-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: "Bayzicks | The digital world, made simple", template: "%s | Bayzicks" },
  description: "Understand digital careers, remote work, freelancing and tech with beginner-friendly guides from Bayzicks. Start with the free Digital Careers Field Guide.",
  applicationName: "Bayzicks",
  openGraph: { type: "website", locale: "en_US", siteName: "Bayzicks", title: "Bayzicks | The digital world, made simple", description: "A clearer starting point for your digital career.", images: [{ url: process.env.SOCIAL_IMAGE_URL || "/opengraph-image", width: 1200, height: 630, alt: "Bayzicks. The digital world, made simple." }] },
  twitter: { card: "summary_large_image", title: "Bayzicks | The digital world, made simple", description: "A clearer starting point for your digital career.", images: [process.env.SOCIAL_IMAGE_URL || "/opengraph-image"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#193c32" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" className={`${sans.variable} ${serif.variable}`}><body><a href="#main-content" className="skip-link">Skip to content</a>{children}</body></html>;
}
