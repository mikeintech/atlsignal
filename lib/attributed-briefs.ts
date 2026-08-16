import newsroomData from "@/data/newsroom.json";
import { editorialImage } from "@/lib/daily-edition";
import { automaticArticleFor, automaticArticleSlug, isAutomaticArticleEligible } from "@/lib/automated-articles";
import { reportedArticles, type ReportedArticle } from "@/lib/reported-articles";
import { storyHref } from "@/lib/story-slug";

type NewsroomCluster = (typeof newsroomData.clusters)[number];

const generatedAt = new Date(newsroomData.generatedAt).valueOf();
const sensitiveHeadline = /\b(accused|alleged|arrested|charged?|criminal|fugitive|indicted|investigation|lawsuit|settlement|shooting|stabbing|suspect|smoke report|emergency landing)\b/i;

function clean(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&rsquo;", "’")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replace(/\s+The post .*? appeared first on .*?\.?$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sentenceCase(value: string) {
  const cleaned = clean(value).replace(/[.!?]+$/, "");
  return cleaned ? `${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}` : "a new Atlanta development";
}

function descriptionFor(cluster: NewsroomCluster) {
  const source = cluster.sources[0]?.name ?? "an attributed local source";
  return `ATLSignal is tracking ${sentenceCase(cluster.headline)}, first reported by ${source}. See what is known, why it matters and what remains unconfirmed.`;
}

export type AttributedBrief = {
  id: string;
  href: string;
  headline: string;
  category: string;
  publishedAt: string;
  sourceDate: string;
  source: NewsroomCluster["sources"][number];
  cluster: NewsroomCluster;
  description: string;
  image: ReturnType<typeof editorialImage>;
  indexable: boolean;
  article?: ReportedArticle;
};

const availableClusters: NewsroomCluster[] = [...newsroomData.clusters];
for (const item of newsroomData.publishedDeskBriefs) {
  if (!availableClusters.some((cluster) => cluster.id === item.cluster.id)) availableClusters.push(item.cluster);
}

export const attributedBriefs: AttributedBrief[] = availableClusters
  .filter((cluster) => !cluster.publishable
    && Boolean(cluster.sources[0]?.url)
    && (cluster.scores.locality >= 70 || isAutomaticArticleEligible(cluster))
    && !sensitiveHeadline.test(`${cluster.headline} ${cluster.summary}`)
    && new Date(cluster.publishedAt).valueOf() <= generatedAt + 12 * 3_600_000)
  .map((cluster) => {
    const manualArticle = reportedArticles[cluster.id];
    const article = manualArticle ?? automaticArticleFor(cluster);
    return {
      id: cluster.id,
      href: automaticArticleSlug(cluster) ? `/news/${automaticArticleSlug(cluster)}` : storyHref(cluster.id, article?.title ?? cluster.headline),
      headline: article?.title ?? clean(cluster.headline),
      category: cluster.category,
      publishedAt: cluster.publishedAt,
      sourceDate: new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "long", day: "numeric", year: "numeric" }).format(new Date(cluster.publishedAt)),
      source: cluster.sources[0],
      cluster,
      description: article?.description ?? descriptionFor(cluster),
      image: editorialImage(cluster.category, cluster.id),
      article,
      indexable: article?.kind === "source-backed-brief" || (Boolean(manualArticle)
        && cluster.sourceTier === "B"
        && cluster.sources[0].retrievedContent
        && cluster.scores.locality >= 85
        && cluster.scores.total >= 55
        && cluster.scores.impact >= 48),
    };
  });

export function getAttributedBrief(id: string) {
  return attributedBriefs.find((brief) => brief.id === id);
}

export function getAttributedStory(slug: string) {
  return attributedBriefs.find((brief) => brief.href === `/news/${slug}`);
}
