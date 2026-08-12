import type { Metadata } from "next";
import Link from "next/link";
import {
  CategoryLabel,
  EditionHeader,
  Headline,
  PremiumTeaser,
  PublicationHeader,
  SectionHeading,
  StoryCard,
} from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import newsroomData from "@/data/newsroom.json";
import { atlanta } from "@/lib/market";
import { leadStory, stories } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Latest Atlanta business and development news",
  description: "The latest evidence-backed ATLSignal reporting on Atlanta business, development, housing, transportation and public money.",
  alternates: { canonical: absoluteUrl("/latest") },
};

type NewsroomCluster = (typeof newsroomData.clusters)[number];

const internalReports: Record<string, string> = {
  "Atlanta Beltline Breaks Ground on Overlook at Garson": "/beltline-overlook-at-garson-affordable-housing",
  "ARC’s 2026 LINK™ Trip Explores Urban Innovation in Mexico City": "/arc-link-mexico-city-urban-innovation",
  "Atlanta Beltline to Begin Bennett Street Demolition, Advancing Future Northwest Trail": "/beltline-bennett-street-demolition-northwest-trail",
  "Pittsburgh Yards Welcomes Piedmont Mobile Health Unit Powered by Google": "/pittsburgh-yards-piedmont-mobile-health-unit",
  "FIFA World Cup 26™ In Review": "/atlanta-world-cup-regional-economy-review",
};

function briefItems(ids: string[]) {
  return ids.flatMap((id) => {
    const match = newsroomData.clusters.find((cluster) => cluster.id === id);
    return match ? [match] : [];
  });
}

function clean(text: string) {
  return text
    .replaceAll("&rsquo;", "’")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function SourceDeskBrief({ label, items }: { label: string; items: NewsroomCluster[] }) {
  return (
    <div>
      <CategoryLabel>{label}</CategoryLabel>
      <div className="source-item-list">
        {items.map((item) => {
          const href = internalReports[item.headline] ?? item.sources[0]?.url;
          const headline = <>{item.headline}</>;
          return (
            <article key={item.id}>
              <CategoryLabel>{item.evidenceLabel === "Corroborated" ? "Corroborated report" : "Primary-source update"} · {item.category}</CategoryLabel>
              <h2>{href?.startsWith("/") ? <Link href={href}>{headline}</Link> : <a href={href} target="_blank" rel="noreferrer">{headline}</a>}</h2>
              <p>{clean(item.summary)}</p>
              <small>{[...new Set(item.sources.map((source) => source.name))].join(" · ")}</small>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function LatestPage() {
  const allStories = [leadStory, ...stories];
  const today = allStories.filter((story) => story.timestamp.includes("Aug. 12"));
  const archive = allStories.filter((story) => !story.timestamp.includes("Aug. 12")).slice(0, 8);
  const morning = briefItems(newsroomData.morningBrief.itemIds).filter((item) => internalReports[item.headline]);
  const afternoon = briefItems(newsroomData.afternoonUpdate.itemIds);
  const refreshed = new Date(newsroomData.generatedAt).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <main className="latest-page shell">
        <header className="category-hero">
          <p className="eyebrow">Latest · Wednesday, August 12</p>
          <Headline as="h1" size="large">What changed in Atlanta today.</Headline>
          <p>Five new reports on housing, public investment, regional leadership and neighborhood business—each written from an attributable source trail.</p>
        </header>

        <section>
          <SectionHeading label="Today’s reporting" />
          <div className="category-list">
            {today.map((story, index) => <StoryCard key={story.slug} story={story} numbered={index + 1} />)}
          </div>
        </section>

        <section>
          <SectionHeading label="The Atlanta source desk" />
          <p className="latest-intro">The desk tracks official announcements and public records throughout the day. When ATLSignal has completed a report, the headline stays on-site; otherwise the original first-party source opens directly.</p>
          <div className="newsroom-brief-grid">
            <SourceDeskBrief label="Morning file" items={morning} />
            <SourceDeskBrief label="Afternoon file" items={afternoon} />
          </div>
          <p className="source-attribution">Source desk refreshed {refreshed} ET. Items that do not clear the evidence threshold remain unpublished.</p>
        </section>

        <section>
          <SectionHeading label="Recent reporting" />
          <div className="category-list">
            {archive.map((story, index) => <StoryCard key={story.slug} story={story} numbered={index + 1} />)}
          </div>
        </section>

        <section className="reader-standard">
          <p className="eyebrow">Reader standard</p>
          <h2>What is confirmed stays separate from what is merely developing.</h2>
          <p>ATLSignal reports attributable facts, explains why they matter and names the evidence still missing. Read the full methodology, masthead and correction policy from the publication footer.</p>
        </section>

        <PremiumTeaser />
        <NewsletterSignup compact />
      </main>
    </>
  );
}
