import newsroomData from "@/data/newsroom.json";
import { editorialContent } from "@/lib/content-index";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function GET() {
  const feedPosts = editorialContent.slice(0, 50);
  const buildDate = new Date(newsroomData.generatedAt).toUTCString();
  const items = feedPosts.map((story) => {
    const url = story.external ? story.href : absoluteUrl(story.href);
    return `
    <item>
      <title>${xml(story.headline)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <description>${xml(story.summary)}</description>
      <category>${xml(story.category)}</category>
      <pubDate>${story.publishedAt ? new Date(story.publishedAt).toUTCString() : buildDate}</pubDate>
    </item>`;
  }).join("");

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>ATLSignal</title>
    <link>${xml(absoluteUrl("/"))}</link>
    <description>Atlanta news, business, development and city-life coverage with visible source trails.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=900" } });
}
