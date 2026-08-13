import type { PublicationItem } from "@/components/publication";
import newsroomData from "@/data/newsroom.json";
import { leadStory, projects, stories } from "@/lib/atlanta-data";
import { dailyPosts, sourceNotePosts } from "@/lib/daily-edition";
import { attributedBriefs } from "@/lib/attributed-briefs";

export type DeskSlug = "news" | "business" | "development" | "city-life" | "radar";

export const publicDesks: Record<DeskSlug, { name: string; description: string }> = {
  news: { name: "News", description: "The civic decisions, transportation changes, public-safety updates and citywide developments shaping Atlanta." },
  business: { name: "Business", description: "Companies, openings, jobs, public investment and economic changes moving metro Atlanta." },
  development: { name: "Development", description: "Construction, housing, infrastructure and major project movement across the region." },
  "city-life": { name: "City Life", description: "What to do, eat, watch and experience across Atlanta, with the original reporting clearly attributed." },
  radar: { name: "Radar", description: "Living project files, public opportunities and evidence-backed signals for readers who need to act earlier." },
};

const categoryDesk: Record<string, DeskSlug> = {
  "Atlanta News": "news",
  "City Hall & Policy": "news",
  "Public Safety": "news",
  "Weather & City Life": "news",
  "Transportation & Airport": "news",
  "Business": "business",
  "Business Moves": "business",
  "Business & Economy": "business",
  "Workforce & Economy": "business",
  "Transportation & Economy": "business",
  "Public Money": "business",
  "Development": "development",
  "Development & Infrastructure": "development",
  "Housing & Neighborhoods": "development",
  "Events & Things To Do": "city-life",
  "Food, Retail & Hospitality": "city-life",
  "Arts & Culture": "city-life",
  "Atlanta Sports": "city-life",
  "Today in Atlanta": "city-life",
  "Opportunity": "radar",
  "Project": "radar",
};

export function deskForCategory(category: string): DeskSlug {
  return categoryDesk[category] ?? "news";
}

function dateValue(value?: string) {
  const parsed = value ? new Date(value).valueOf() : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

const manualItems: PublicationItem[] = [leadStory, ...stories].map((story) => ({
  id: story.slug,
  href: `/${story.slug}`,
  headline: story.headline,
  summary: story.dek,
  category: story.category,
  desk: deskForCategory(story.category),
  treatment: "ATLSignal report",
  evidenceLabel: story.confidence ?? "Confirmed",
  publishedAt: story.publishedAt,
  image: story.image,
}));

const newsroomItems: PublicationItem[] = [...dailyPosts, ...sourceNotePosts].map((post) => {
  const attributedBrief = attributedBriefs.find((brief) => brief.id === post.id);
  return {
    id: post.id,
    href: post.href,
    headline: attributedBrief?.headline ?? post.headline,
    summary: attributedBrief?.description ?? post.dek,
    category: post.category,
    desk: deskForCategory(post.category),
    treatment: attributedBrief ? `Reported by ${attributedBrief.source.name}` : post.href.startsWith("/file/") ? "ATLSignal source note" : "ATLSignal report",
    evidenceLabel: post.evidenceLabel,
    publishedAt: post.cluster?.publishedAt,
    image: post.image,
    external: post.external,
    indexable: attributedBrief?.indexable,
  };
});

function cleanSummary(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&rsquo;", "’")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replace(/\s+The post .*? appeared first on .*?\.?$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

const discoveryCutoff = new Date(newsroomData.generatedAt).valueOf() - 7 * 86_400_000;
const sensitiveHeadline = /\b(accused|alleged|arrested|charged?|criminal|fugitive|indicted|investigation|lawsuit|settlement|shooting|stabbing|suspect|smoke report|emergency landing)\b/i;
const discoveryUses = new Map<string, number>();
const discoveryItems: PublicationItem[] = [...newsroomData.clusters]
  .filter((cluster) => !cluster.publishable
    && cluster.sources[0]?.url
    && cluster.scores.locality >= 70
    && !sensitiveHeadline.test(`${cluster.headline} ${cluster.summary}`)
    && new Date(cluster.publishedAt).valueOf() >= discoveryCutoff
    && new Date(cluster.publishedAt).valueOf() <= new Date(newsroomData.generatedAt).valueOf() + 12 * 3_600_000)
  .sort((left, right) => right.scores.total - left.scores.total)
  .flatMap((cluster) => {
    const uses = discoveryUses.get(cluster.category) ?? 0;
    if (uses >= 12) return [];
    discoveryUses.set(cluster.category, uses + 1);
    const source = cluster.sources[0];
    const brief = attributedBriefs.find((candidate) => candidate.id === cluster.id);
    if (!brief) return [];
    return [{
      id: cluster.id,
      href: brief.href,
      headline: brief.headline,
      summary: brief?.description ?? `${source.name} published an Atlanta update that remains in ATLSignal’s attributed discovery file.`,
      category: cluster.category,
      desk: deskForCategory(cluster.category),
      treatment: `Reported by ${source.name}`,
      evidenceLabel: "Attributed discovery",
      publishedAt: cluster.publishedAt,
      image: brief?.image,
      indexable: brief?.indexable,
    } satisfies PublicationItem];
  });

function dedupe(items: PublicationItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.href}|${item.headline.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const editorialContent = dedupe([...newsroomItems, ...discoveryItems, ...manualItems]).sort((left, right) =>
  dateValue(right.publishedAt) - dateValue(left.publishedAt),
);

export const projectContent: PublicationItem[] = projects.map((project) => ({
  id: project.slug,
  href: `/project/${project.slug}`,
  headline: project.name,
  summary: `${project.location} · ${project.status} · ${project.detail}`,
  category: "Project",
  desk: "radar",
  treatment: "Living project file",
  evidenceLabel: project.status,
}));

export const searchContent = dedupe([...editorialContent, ...projectContent]);

export function contentForDesk(desk: DeskSlug) {
  return editorialContent.filter((item) => item.desk === desk);
}

export function contentForCategory(category: string) {
  return editorialContent.filter((item) => item.category === category);
}

export function relatedContent(category: string, currentHref: string, limit = 3) {
  const desk = deskForCategory(category);
  return editorialContent
    .filter((item) => item.href !== currentHref && item.desk === desk)
    .sort((left, right) => Number(right.indexable !== false) - Number(left.indexable !== false) || dateValue(right.publishedAt) - dateValue(left.publishedAt))
    .slice(0, limit);
}
