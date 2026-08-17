import type { Story, StoryImageData } from "@/components/publication";
import newsroomData from "@/data/newsroom.json";
import { freshStories } from "@/lib/atlanta-data";
import { reportedArticles } from "@/lib/reported-articles";
import { automaticArticleSlug } from "@/lib/automated-articles";

type NewsroomCluster = (typeof newsroomData.clusters)[number];

export type DailyPost = {
  id: string;
  href: string;
  headline: string;
  dek: string;
  category: string;
  treatment: "New today" | "Developing" | "From the archive" | "Today in Atlanta";
  evidenceLabel: string;
  sourceDate: string;
  image: StoryImageData;
  cluster?: NewsroomCluster;
  external?: boolean;
};

const fullReportByClusterId: Record<string, string> = {
  "36656020d24c8dbf3e91": "/beltline-mortgage-assistance-30000",
  "acb27d881cb4f7742854": "/invest-atlanta-cpace-130-million-financing",
  "b1c05e21ab32f60ca452": "/invest-atlanta-39-million-affordable-housing",
  "4d56336e11476fc0eb55": "/atlanta-housing-60000-down-payment-assistance",
  "b9b9e11ba4e8ed23ebd5": "/arc-link-mexico-city-urban-innovation",
  "5d36685938fcd27ab7bc": "/invest-atlanta-senior-housing-tad-funding",
  "0ee182270f841210ce65": "/municipal-market-merchants-90000-investment",
  "298bc7e9f8f7aacb337b": "/pittsburgh-yards-piedmont-mobile-health-unit",
  "1653ceea6e15d276c2de": "/beltline-overlook-at-garson-affordable-housing",
  "47b9aed0333e1aef9145": "/beltline-bennett-street-demolition-northwest-trail",
  "8405c48461f9b912e4ec": "/atlanta-world-cup-regional-economy-review",
};

const editionDate = new Date(newsroomData.generatedAt);
export const editionDayKey = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(editionDate);

export const editionDateLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(editionDate);

function clean(text: string) {
  return text
    .replaceAll("&rsquo;", "’")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&eacute;", "é")
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/\s+The post .*? appeared first on .*?\.?$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stableNumber(value: string) {
  return [...value].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
}

export function editorialImage(category: string, key: string): StoryImageData {
  return { src: "/og-social-v2.png", alt: `ATLSignal graphic for ${category.toLowerCase()} coverage`, credit: "ATLSignal", creditUrl: "/about", label: "Editorial image", caption: "ATLSignal reporting graphic" };
}

export function clusterEditorialImage(cluster: NewsroomCluster, reviewed?: StoryImageData): StoryImageData {
  if (reviewed) return reviewed;
  const sourceItem = cluster.itemIds
    .map((id) => newsroomData.items.find((item) => item.id === id))
    .find((item) => Boolean(item?.imageUrl));
  if (!sourceItem?.imageUrl) return editorialImage(cluster.category, cluster.id);
  return {
    src: clean(sourceItem.imageUrl),
    alt: `Image accompanying ${clean(sourceItem.title)}`,
    credit: sourceItem.sourceName,
    creditUrl: sourceItem.url,
    label: "Source image",
    caption: `Image accompanying the ${sourceItem.sourceName} report`,
  };
}

function treatmentFor(sourceDate: string): DailyPost["treatment"] {
  const age = Math.max(0, editionDate.valueOf() - new Date(sourceDate).valueOf());
  if (age <= 36 * 3_600_000) return "New today";
  if (age <= 21 * 86_400_000) return "Developing";
  return "From the archive";
}

function displaySourceDate(sourceDate: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" }).format(new Date(sourceDate));
}

function clusterPost(cluster: NewsroomCluster): DailyPost {
  const source = cluster.sources[0]?.name ?? "Primary source";
  const summary = clean(cluster.summary);
  return {
    id: cluster.id,
    href: fullReportByClusterId[cluster.id] ?? `/file/${cluster.id}`,
    headline: clean(cluster.headline),
    dek: summary || `${source} published an attributable ${cluster.category.toLowerCase()} update that ATLSignal is tracking for its next verifiable milestone.`,
    category: cluster.category,
    treatment: treatmentFor(cluster.publishedAt),
    evidenceLabel: cluster.evidenceLabel,
    sourceDate: displaySourceDate(cluster.publishedAt),
    image: clusterEditorialImage(cluster),
    cluster,
  };
}

function discoveryPost(cluster: NewsroomCluster): DailyPost {
  const source = cluster.sources[0]?.name ?? "Local source";
  const article = reportedArticles[cluster.id];
  return {
    id: cluster.id,
    href: `/news/${automaticArticleSlug(cluster)}`,
    headline: article?.title ?? clean(cluster.headline),
    dek: article?.description ?? `${source} reported this Atlanta update. ATLSignal is preserving the attribution while checking primary records and adding Atlanta context.`,
    category: cluster.category,
    treatment: treatmentFor(cluster.publishedAt),
    evidenceLabel: `Reported by ${source}`,
    sourceDate: displaySourceDate(cluster.publishedAt),
    image: clusterEditorialImage(cluster, article?.image),
    cluster,
  };
}

function manualPost(story: Story): DailyPost {
  return {
    id: story.slug,
    href: `/${story.slug}`,
    headline: story.headline,
    dek: story.dek,
    category: story.category,
    treatment: story.category === "Today in Atlanta" ? "Today in Atlanta" : "New today",
    evidenceLabel: story.confidence ?? "Confirmed",
    sourceDate: "Published today",
    image: story.image,
  };
}

const excludedHeadlines = /\b(tiktok|dive bars?|hidden gems?|appointed|appointment|retirement|reaccreditation|leadership institute class|design class|accused|alleged|arrested|charged?|criminal|fugitive|indicted|investigation|lawsuit|settlement|shooting|stabbing|suspect|smoke report|emergency landing)\b/i;
const verifiedClusters = newsroomData.clusters.filter((cluster) => cluster.publishable && cluster.sourceTier === "A" && !excludedHeadlines.test(cluster.headline));
const freshClusters = verifiedClusters.filter((cluster) => treatmentFor(cluster.publishedAt) !== "From the archive");
const freshDiscoveryClusters = newsroomData.clusters.filter((cluster) =>
  !cluster.publishable
  && Boolean(reportedArticles[cluster.id])
  && Boolean(automaticArticleSlug(cluster))
  && Boolean(cluster.sources[0]?.url)
  && treatmentFor(cluster.publishedAt) === "New today"
  && new Date(cluster.publishedAt).valueOf() <= editionDate.valueOf() + 12 * 3_600_000
  && !excludedHeadlines.test(cluster.headline),
);

function diverseDiscoveryPosts(clusters: typeof freshDiscoveryClusters) {
  const sourceUses = new Map<string, number>();
  const categoryUses = new Map<string, number>();
  const categoryBoost: Record<string, number> = {
    "Events & Things To Do": 18,
    "Food, Retail & Hospitality": 14,
    "Arts & Culture": 8,
    "Atlanta Sports": 5,
    "Transportation & Airport": 4,
    "Business Moves": 4,
    "Atlanta News": -2,
  };
  const ranked = [...clusters].sort((left, right) =>
    (right.scores.total + (categoryBoost[right.category] || 0))
    - (left.scores.total + (categoryBoost[left.category] || 0)),
  );
  return ranked.flatMap((cluster) => {
    const source = cluster.sources[0]?.name ?? "Local source";
    if ((sourceUses.get(source) || 0) >= 4 || (categoryUses.get(cluster.category) || 0) >= 5) return [];
    sourceUses.set(source, (sourceUses.get(source) || 0) + 1);
    categoryUses.set(cluster.category, (categoryUses.get(cluster.category) || 0) + 1);
    return [discoveryPost(cluster)];
  });
}
const archiveClusters = verifiedClusters
  .filter((cluster) => treatmentFor(cluster.publishedAt) === "From the archive")
  .sort((left, right) => stableNumber(`${editionDayKey}-${left.id}`) - stableNumber(`${editionDayKey}-${right.id}`));

const todaysManualStories = freshStories.filter((story) => story.publishedAt?.startsWith(editionDayKey));
const manualHrefs = new Set(todaysManualStories.map((story) => `/${story.slug}`));
const clusterCandidates = [...freshClusters, ...archiveClusters]
  .map(clusterPost)
  .filter((post) => !manualHrefs.has(post.href));

function addUnique(target: DailyPost[], candidates: DailyPost[], limit: number) {
  const seen = new Set(target.map((post) => `${post.href}|${post.headline.toLowerCase()}`));
  for (const candidate of candidates) {
    const key = `${candidate.href}|${candidate.headline.toLowerCase()}`;
    if (target.length >= limit) break;
    if (seen.has(key)) continue;
    seen.add(key);
    target.push(candidate);
  }
}

const manualPosts = todaysManualStories.map(manualPost);
const verifiedNew = clusterCandidates.filter((post) => post.treatment === "New today");
const automaticNew = freshDiscoveryClusters
  .map(discoveryPost)
  .sort((left, right) => new Date(right.cluster!.publishedAt).valueOf() - new Date(left.cluster!.publishedAt).valueOf());
const attributedNew = diverseDiscoveryPosts(freshDiscoveryClusters);
const developingPosts = clusterCandidates.filter((post) => post.treatment === "Developing");
const archivePosts = clusterCandidates.filter((post) => post.treatment === "From the archive");
const selectedDailyPosts: DailyPost[] = [];

// Keep the five lead positions evidence-forward, then guarantee a useful daily
// mix instead of allowing a large breaking-news sweep to crowd out context.
addUnique(selectedDailyPosts, [...manualPosts, ...verifiedNew], 5);
addUnique(selectedDailyPosts, automaticNew, 12);
addUnique(selectedDailyPosts, attributedNew, 14);
addUnique(selectedDailyPosts, developingPosts, 17);
addUnique(selectedDailyPosts, archivePosts, 20);
addUnique(selectedDailyPosts, [...verifiedNew, ...attributedNew, ...developingPosts, ...archivePosts, ...manualPosts], 20);

export const dailyPosts: DailyPost[] = selectedDailyPosts;
export const sourceNotePosts = verifiedClusters.map(clusterPost).filter((post) => post.href.startsWith("/file/"));

export function getSourceNote(id: string) {
  return sourceNotePosts.find((post) => post.id === id);
}

export const dailyEditionStats = {
  total: dailyPosts.length,
  newToday: dailyPosts.filter((post) => post.treatment === "New today").length,
  developing: dailyPosts.filter((post) => post.treatment === "Developing").length,
  archive: dailyPosts.filter((post) => post.treatment === "From the archive" || post.treatment === "Today in Atlanta").length,
};
