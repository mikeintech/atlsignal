import type { MetadataRoute } from "next";
import { leadStory, projects, publicGuides, stories } from "@/lib/atlanta-data";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/atlanta", "/atlanta/latest", "/atlanta/business", "/atlanta/development", "/atlanta/money",
    "/atlanta/economy", "/atlanta/policy", "/atlanta/transit", "/atlanta/opportunities", "/atlanta/projects", "/atlanta/search", "/atlanta/about", "/atlanta/guides", "/atlanta/upgrade",
    ...[leadStory, ...stories].map((story) => `/atlanta/${story.slug}`),
    ...publicGuides.map((guide) => `/atlanta/guides/${guide.slug}`),
    ...projects.map((project) => `/atlanta/project/${project.slug}`),
  ];
  return paths.map((path, index) => ({ url: new URL(path, base).toString(), lastModified: new Date("2026-08-07T12:00:00-04:00"), changeFrequency: index === 0 ? "daily" : "weekly", priority: index === 0 ? 1 : .7 }));
}
