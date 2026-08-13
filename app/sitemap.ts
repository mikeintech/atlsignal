import type { MetadataRoute } from "next";
import { projects, publicGuides } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";
import { editorialContent } from "@/lib/content-index";
import newsroomData from "@/data/newsroom.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...new Set([
    "/", "/latest", "/news", "/business", "/development", "/city-life", "/radar", "/things-to-do", "/food", "/sports", "/housing", "/money",
    "/economy", "/policy", "/transit", "/opportunities", "/projects", "/search", "/about", "/guides", "/upgrade",
    "/masthead", "/methodology", "/corrections", "/privacy", "/terms", "/disclosures",
    ...editorialContent.filter((item) => !item.external).map((item) => item.href),
    ...publicGuides.map((guide) => `/guides/${guide.slug}`),
    ...projects.map((project) => `/project/${project.slug}`),
  ])];
  return paths.map((path, index) => ({ url: absoluteUrl(path), lastModified: new Date(newsroomData.generatedAt), changeFrequency: path === "/" || path === "/latest" ? "daily" : "weekly", priority: index === 0 ? 1 : .7 }));
}
