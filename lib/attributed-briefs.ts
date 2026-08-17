import newsroomData from "@/data/newsroom.json";
import { clusterEditorialImage } from "@/lib/daily-edition";
import { automaticArticleSlug } from "@/lib/automated-articles";
import { reportedArticles, type ReportedArticle } from "@/lib/reported-articles";

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
  image: ReturnType<typeof clusterEditorialImage>;
  indexable: boolean;
  article?: ReportedArticle;
};

const availableClusters: NewsroomCluster[] = [...newsroomData.clusters];
for (const item of newsroomData.publishedDeskBriefs) {
  if (!availableClusters.some((cluster) => cluster.id === item.cluster.id)) availableClusters.push(item.cluster);
}

export const attributedBriefs: AttributedBrief[] = availableClusters
  .filter((cluster) => !cluster.publishable
    && Boolean(reportedArticles[cluster.id])
    && Boolean(automaticArticleSlug(cluster))
    && Boolean(cluster.sources[0]?.url)
    && !sensitiveHeadline.test(`${cluster.headline} ${cluster.summary}`)
    && new Date(cluster.publishedAt).valueOf() <= generatedAt + 12 * 3_600_000)
  .map((cluster) => {
    const manualArticle = reportedArticles[cluster.id];
    const article = manualArticle;
    return {
      id: cluster.id,
      href: `/news/${automaticArticleSlug(cluster)}`,
      headline: article?.title ?? clean(cluster.headline),
      category: cluster.category,
      publishedAt: cluster.publishedAt,
      sourceDate: new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "long", day: "numeric", year: "numeric" }).format(new Date(cluster.publishedAt)),
      source: cluster.sources[0],
      cluster,
      description: article?.description ?? descriptionFor(cluster),
      image: clusterEditorialImage(cluster, article?.image),
      article,
      indexable: article?.kind === "reported-analysis" || article?.kind === "source-backed-brief" || (Boolean(manualArticle)
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
