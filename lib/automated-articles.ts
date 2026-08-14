import newsroomData from "@/data/newsroom.json";
import type { ReportedArticle } from "@/lib/reported-articles";

type NewsroomCluster = (typeof newsroomData.clusters)[number];

const allowedCategories = new Set([
  "Atlanta Sports",
  "Events & Things To Do",
  "Food, Retail & Hospitality",
  "Weather & City Life",
  "Transportation & Airport",
  "Housing & Neighborhoods",
  "Development & Infrastructure",
  "Workforce & Economy",
  "Business Moves",
]);
const unsafe = /\b(accused|alleged|arrested|assault|charged?|criminal|death|dies|died|execution|fatal|fire|funeral|fugitive|indicted|investigation|killed|lawsuit|missing|murder|police|settlement|shooting|stabbing|suspect|victim)\b/i;
const derivative = /\b(interview|review|opinion|column|ranking)\b/i;
const existingCoverage = /\bMARTA\b.*\b(CEO|general manager)\b/i;

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

function firstFact(value: string) {
  const text = clean(value).replace(/\s*\[…\].*$/, "");
  const sentence = text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || text;
  return sentence.slice(0, 260).replace(/[,;:]?\s+$/, "");
}

const framing: Record<string, { label: string; context: string; next: string }> = {
  "Atlanta Sports": { label: "Game-day brief", context: "A preseason date is more than a line on a schedule: it changes traffic around the stadium, local viewing plans and the first real evaluation window before roster decisions arrive.", next: "Watch for the final broadcast details, availability changes and the result that reshapes the next week of roster evaluation." },
  "Events & Things To Do": { label: "Plan ahead", context: "Atlanta’s event calendar is also a map of which artists, institutions and neighborhoods are building an audience right now.", next: "Check the organizer’s page before leaving for final timing, ticket availability, accessibility details and any schedule change." },
  "Weather & City Life": { label: "Service brief", context: "Weather and road disruptions become local stories through their practical effects: commute time, outdoor plans, transit connections and the people most exposed to the conditions.", next: "Watch the responsible public agency for changing times, boundaries, detours or safety guidance before making plans." },
  "Transportation & Airport": { label: "Moving Atlanta", context: "Transportation changes alter daily access immediately and can reveal where the region’s infrastructure is under its greatest strain.", next: "The next useful marker is an agency update that confirms timing, operating conditions or restoration of normal service." },
  "Food, Retail & Hospitality": { label: "Opening watch", context: "A new opening is also a neighborhood signal, showing where operators and landlords believe Atlanta’s next pocket of demand is forming.", next: "Watch for a first-party opening date, inspections, hiring, reservations and an operating location page." },
  "Housing & Neighborhoods": { label: "Neighborhood brief", context: "Housing decisions shape who can remain in a neighborhood and where Atlanta’s next round of growth will land.", next: "Watch for primary records that establish price, eligibility, delivery timing and the party responsible for implementation." },
  "Development & Infrastructure": { label: "Project watch", context: "The announcement matters most when it turns into a visible milestone: approval, financing, construction or delivery.", next: "Watch permits, board records, contracts and first-party project updates for the next verifiable milestone." },
  "Workforce & Economy": { label: "Economy brief", context: "Jobs and investment announcements offer an early reading on where employers see demand, but the durable measure is what is ultimately delivered.", next: "Watch for hiring, filings, contracts and operating milestones that turn the announcement into measurable activity." },
  "Business Moves": { label: "Business brief", context: "Business moves matter locally when they change jobs, storefronts, suppliers or the commercial life of a neighborhood.", next: "Watch for a first-party launch, lease record, hiring activity or opening milestone." },
};

export function isAutomaticArticleEligible(cluster: NewsroomCluster) {
  const source = cluster.sources[0];
  const age = new Date(newsroomData.generatedAt).valueOf() - new Date(cluster.publishedAt).valueOf();
  const text = `${cluster.headline} ${cluster.summary}`;
  return !cluster.publishable
    && allowedCategories.has(cluster.category)
    && cluster.sourceTier === "B"
    && source?.retrievedContent === true
    && clean(cluster.summary).length >= 85
    && cluster.scores.total >= 52
    && cluster.scores.timeliness >= 90
    && cluster.scores.locality >= 55
    && age >= -12 * 3_600_000
    && age <= 48 * 3_600_000
    && !unsafe.test(text)
    && !derivative.test(cluster.headline)
    && !existingCoverage.test(cluster.headline);
}

export function automaticArticleFor(cluster: NewsroomCluster): ReportedArticle | undefined {
  if (!isAutomaticArticleEligible(cluster)) return undefined;
  const source = cluster.sources[0];
  const fact = firstFact(cluster.summary);
  const frame = framing[cluster.category];
  const sourceDate = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "long", day: "numeric", year: "numeric" }).format(new Date(cluster.publishedAt));
  const reviewedSources = cluster.sources.filter((item, index, list) => item.retrievedContent && list.findIndex((candidate) => candidate.url === item.url) === index);
  return {
    kind: "source-backed-brief",
    title: clean(cluster.headline),
    description: `${fact} ATLSignal adds the practical Atlanta context and the next verifiable marker.`,
    label: frame.label,
    lede: `${fact} The immediate value is knowing what changes for Atlantans now—and which details still depend on the original publisher or a public agency update.`,
    keyFacts: [fact, `${source.name} published the underlying report on ${sourceDate}.`, reviewedSources.length > 1 ? `${reviewedSources.length} retrieved source reports are attached to this update.` : "This brief is attributed to one retrieved source report and does not claim independent confirmation."],
    sections: [
      { heading: "The update", paragraphs: [`According to ${source.name}, ${fact.charAt(0).toLowerCase()}${fact.slice(1)}`, `ATLSignal selected the item because it is timely, locally relevant and useful beyond the headline. The central claim remains attributed to ${source.name}; this desk brief adds context without presenting a secondhand report as firsthand reporting.`] },
      { heading: "Why it matters in Atlanta", paragraphs: [frame.context, `For readers, the useful question is not simply whether the update happened. It is what changes next—timing, access, cost, location or the public record that confirms the outcome.`] },
      { heading: "What to watch", paragraphs: [frame.next, "ATLSignal will update this page when a stronger primary record, a material correction or a new operating detail changes the practical takeaway."] },
    ],
    keywords: [clean(cluster.headline), cluster.category, "Atlanta news", source.name],
    entities: [source.name, "Atlanta"],
    sources: reviewedSources.map((item) => ({ name: item.name, detail: "Retrieved source report supporting the attributed update.", url: item.url })),
  };
}
