import type { MetadataRoute } from "next";
import { projects, publicGuides } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";
import { editorialContent } from "@/lib/content-index";
import newsroomData from "@/data/newsroom.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const indexedEditorial = editorialContent.filter((item) => !item.external && item.indexable !== false);
  const editorialByPath = new Map(indexedEditorial.map((item) => [item.href, item]));
  const paths = [...new Set([
    "/", "/latest", "/news", "/business", "/development", "/city-life", "/radar", "/things-to-do", "/food", "/sports", "/housing", "/money",
    "/economy", "/policy", "/transit", "/opportunities", "/projects", "/search", "/about", "/guides", "/topics", "/upgrade",
    "/masthead", "/methodology", "/corrections", "/privacy", "/terms", "/disclosures",
    ...indexedEditorial.map((item) => item.href),
    ...publicGuides.map((guide) => `/guides/${guide.slug}`),
    ...projects.map((project) => `/project/${project.slug}`),
  ])];
  return paths.map((path, index) => {
    const editorial = editorialByPath.get(path);
    return { url: absoluteUrl(path), lastModified: editorial?.publishedAt ? new Date(editorial.publishedAt) : new Date(newsroomData.generatedAt), changeFrequency: path === "/" || path === "/latest" ? "daily" as const : "weekly" as const, priority: index === 0 ? 1 : .7, images: editorial?.image ? [editorial.image.src.split("?")[0]] : undefined };
  });
}
