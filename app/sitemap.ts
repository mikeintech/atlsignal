import type { MetadataRoute } from "next";
import { leadStory, projects, publicGuides, stories } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/latest", "/business", "/development", "/money",
    "/economy", "/policy", "/transit", "/opportunities", "/projects", "/search", "/about", "/guides", "/upgrade",
    "/masthead", "/methodology", "/corrections", "/privacy", "/terms", "/disclosures",
    ...[leadStory, ...stories].map((story) => `/${story.slug}`),
    ...publicGuides.map((guide) => `/guides/${guide.slug}`),
    ...projects.map((project) => `/project/${project.slug}`),
  ];
  return paths.map((path, index) => ({ url: absoluteUrl(path), lastModified: new Date("2026-08-09T12:00:00-04:00"), changeFrequency: index === 0 ? "daily" : "weekly", priority: index === 0 ? 1 : .7 }));
}
