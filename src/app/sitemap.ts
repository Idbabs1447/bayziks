import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/start-here", "/resources", "/resources/digital-careers-field-guide", "/about", "/contact", "/collaborate", "/privacy", "/terms"];
  return paths.map((path) => ({ url: `${getSiteUrl()}${path === "/" ? "" : path}`, changeFrequency: path === "/privacy" || path === "/terms" ? "yearly" : "monthly", priority: path === "/" ? 1 : path.includes("field-guide") ? .9 : path === "/resources" || path === "/start-here" ? .8 : .5 }));
}
