import { leadStory, stories } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function GET() {
  const items = [leadStory, ...stories].slice(0, 25).map((story) => `
    <item>
      <title>${xml(story.headline)}</title>
      <link>${xml(absoluteUrl(`/${story.slug}`))}</link>
      <guid isPermaLink="true">${xml(absoluteUrl(`/${story.slug}`))}</guid>
      <description>${xml(story.dek)}</description>
      <category>${xml(story.category)}</category>
      <pubDate>${story.timestamp.includes("Aug. 12") ? "Wed, 12 Aug 2026 11:00:00 GMT" : "Sat, 08 Aug 2026 14:20:00 GMT"}</pubDate>
    </item>`).join("");

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>ATLSignal</title>
    <link>${xml(absoluteUrl("/"))}</link>
    <description>Atlanta business, development and public-money reporting built from verified source trails.</description>
    <language>en-us</language>
    <lastBuildDate>Wed, 12 Aug 2026 11:00:00 GMT</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=900" } });
}
