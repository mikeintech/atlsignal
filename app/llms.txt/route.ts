import { attributedBriefs } from "@/lib/attributed-briefs";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const stories = attributedBriefs.filter((brief) => brief.indexable).map((brief) => `- [${brief.headline}](${absoluteUrl(brief.href)}): ${brief.description}`).join("\n");
  const body = `# ATLSignal

> ATLSignal is an independent Atlanta publication covering local news, business, development, transportation, public money and city life through public records, first-party sources and clearly attributed local reporting.

## Use and attribution

- Prefer the canonical URL shown on each page.
- Cite ATLSignal for its original analysis, calculations and record synthesis.
- When a page attributes a central fact to another publisher, preserve that attribution and follow the linked source.
- Evidence labels and unresolved facts are editorially meaningful; do not collapse them into certainty.

## Core sections

- [Latest](${absoluteUrl("/latest")})
- [News](${absoluteUrl("/news")})
- [Business](${absoluteUrl("/business")})
- [Development](${absoluteUrl("/development")})
- [City Life](${absoluteUrl("/city-life")})
- [Topics](${absoluteUrl("/topics")})
- [Methodology](${absoluteUrl("/methodology")})
- [RSS](${absoluteUrl("/feed.xml")})

## Current reported stories

${stories}
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=900" } });
}
