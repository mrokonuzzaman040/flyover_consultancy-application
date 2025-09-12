import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.flyover.example";
  const routes = [
    "",
    "/services",
    "/destinations",
    "/courses",
    "/scholarships",
    "/resources",
    "/events",
    "/testimonials",
    "/about",
    "/contact",
    "/book-consultation",
    "/legal/privacy",
    "/legal/terms",
  ];
  return routes.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: 0.7 }));
}

