import newsroomData from "@/data/newsroom.json";
import { editorialContent } from "@/lib/content-index";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function GET() {
  const generatedAt = new Date(newsroomData.generatedAt).valueOf();
  const cutoff = generatedAt - 2 * 86_400_000;
  const entries = editorialContent
    .filter((item) => !item.external && item.indexable !== false && item.publishedAt && new Date(item.publishedAt).valueOf() >= cutoff)
    .slice(0, 1000)
    .map((item) => `<url><loc>${xml(absoluteUrl(item.href))}</loc><news:news><news:publication><news:name>ATLSignal</news:name><news:language>en</news:language></news:publication><news:publication_date>${xml(item.publishedAt!)}</news:publication_date><news:title>${xml(item.headline)}</news:title></news:news></url>`)
    .join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${entries}</urlset>`, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=900" } });
}
