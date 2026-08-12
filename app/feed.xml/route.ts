import { leadStory, stories } from "@/lib/atlanta-data";
import { dailyPosts } from "@/lib/daily-edition";
import newsroomData from "@/data/newsroom.json";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function GET() {
  const dailyHrefs = new Set(dailyPosts.map((post) => post.href));
  const feedPosts = [
    ...dailyPosts.map((post) => ({ headline: post.headline, href: post.href, dek: post.dek, category: post.category })),
    ...[leadStory, ...stories].filter((story) => !dailyHrefs.has(`/${story.slug}`)).map((story) => ({ headline: story.headline, href: `/${story.slug}`, dek: story.dek, category: story.category })),
  ].slice(0, 35);
  const buildDate = new Date(newsroomData.generatedAt).toUTCString();
  const items = feedPosts.map((story) => `
    <item>
      <title>${xml(story.headline)}</title>
      <link>${xml(absoluteUrl(story.href))}</link>
      <guid isPermaLink="true">${xml(absoluteUrl(story.href))}</guid>
      <description>${xml(story.dek)}</description>
      <category>${xml(story.category)}</category>
      <pubDate>${buildDate}</pubDate>
    </item>`).join("");

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>ATLSignal</title>
    <link>${xml(absoluteUrl("/"))}</link>
    <description>Atlanta business, development and public-money reporting built from verified source trails.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=900" } });
}
