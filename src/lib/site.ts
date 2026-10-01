import type { Metadata } from "next";

export function getSiteUrl(): string {
  const configured = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  try {
    const url = new URL(configured || "http://localhost:3000");
    if (!["https:", "http:"].includes(url.protocol)) throw new Error("Invalid protocol");
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | Bayzicks`, description, url: path, siteName: "Bayzicks", type: "website", images: [{ url: process.env.SOCIAL_IMAGE_URL || "/opengraph-image", width: 1200, height: 630, alt: "Bayzicks. The digital world, made simple." }] },
    twitter: { card: "summary_large_image", title: `${title} | Bayzicks`, description, images: [process.env.SOCIAL_IMAGE_URL || "/opengraph-image"] },
  };
}

export function newsletterConfiguration() {
  const credentials = Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_SERVER_PREFIX && process.env.MAILCHIMP_AUDIENCE_ID);
  const live = process.env.MAILCHIMP_MODE === "live";
  const deliveryReady = process.env.MAILCHIMP_DELIVERY_READY === "true";
  return { mode: live ? "live" as const : "preview" as const, ready: live && credentials && deliveryReady };
}

export function inquiryConfiguration() {
  const live = process.env.FORMS_MODE === "live";
  const credentials = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL);
  return { mode: live ? "live" as const : "preview" as const, ready: live && credentials };
}

export function getInstagramUrl() {
  const value = process.env.INSTAGRAM_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["instagram.com", "www.instagram.com"].includes(url.hostname) ? url.toString() : null;
  } catch { return null; }
}
