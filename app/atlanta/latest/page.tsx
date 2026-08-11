import type { Metadata } from "next";
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
import { atlanta, categories } from "@/lib/market";
import { editorialCategories, launchWeek, leadStory, sourceDeskItems, sourceDesks, stories, watchlist } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Latest",
  description: "The latest public ATLSignal coverage, source desk status, and launch-week publishing plan.",
  alternates: { canonical: absoluteUrl("/latest") },
};

type NewsroomCluster = (typeof newsroomData.clusters)[number];

function briefItems(ids: string[]) {
  return ids.flatMap((id) => {
    const match = newsroomData.clusters.find((cluster) => cluster.id === id);
    return match ? [match] : [];
  });
}

function NewsroomBrief({ label, items }: { label: string; items: NewsroomCluster[] }) {
  return (
    <div>
      <CategoryLabel>{label}</CategoryLabel>
      <div className="source-item-list">
        {items.map((item) => (
          <article key={item.id}>
            <CategoryLabel>{item.evidenceLabel} · {item.category}</CategoryLabel>
            <h2><a href={item.sources[0]?.url} target="_blank" rel="noreferrer">{item.headline}</a></h2>
            <p>{item.summary}</p>
            <small>{[...new Set(item.sources.map((source) => source.name))].join(" · ")}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function LatestPage() {
  const latestStories = [leadStory, ...stories];
  const morning = briefItems(newsroomData.morningBrief.itemIds);
  const afternoon = briefItems(newsroomData.afternoonUpdate.itemIds);
  const coreHealth = newsroomData.sourceHealth.filter((source) => source.critical);
  const discoveryHealth = newsroomData.sourceHealth.filter((source) => !source.critical);
  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <main className="latest-page shell">
        <header className="category-hero">
          <p className="eyebrow">Latest</p>
          <Headline as="h1" size="large">The ATLSignal launch desk</Headline>
          <p>Evidence-backed Atlanta business, development, policy and infrastructure coverage. Public facts are separated from claims still in review.</p>
        </header>

        <section>
          <SectionHeading label="Live newsroom cycle" />
          <div className="data-strip newsroom-status" aria-label="Automated newsroom status">
            <div className="metric"><strong>{newsroomData.automation.status}</strong><span>worker status</span></div>
            <div className="metric"><strong>{coreHealth.filter((source) => source.status === "OK").length}/{coreHealth.length}</strong><span>primary desks healthy</span></div>
            <div className="metric"><strong>{newsroomData.stats.clusters}</strong><span>event clusters</span></div>
            <div className="metric"><strong>{newsroomData.stats.needsCorroboration}</strong><span>held for evidence</span></div>
          </div>
          <p className="source-attribution">Last automated collection: {new Date(newsroomData.generatedAt).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })} ET. Restricted publishers remain metadata-only discovery sources; their pages are not crawled.</p>
          <div className="newsroom-brief-grid">
            <NewsroomBrief label="Morning brief" items={morning} />
            <NewsroomBrief label="Afternoon update" items={afternoon} />
          </div>
          <p className="source-attribution">Coverage monitor: {discoveryHealth.length} local media and first-party desks. Discovery items do not become published claims until primary evidence clears the corroboration gate.</p>
        </section>

        <section>
          <SectionHeading label="Top coverage" />
          <div className="category-list">
            {latestStories.slice(0, 8).map((story, index) => <StoryCard key={story.slug} story={story} numbered={index + 1} />)}
          </div>
        </section>

        <section>
          <SectionHeading label="Source desks" />
          <div className="source-desk-grid">
            {sourceDesks.map((desk) => (
              <article key={desk.name}>
                <CategoryLabel>{desk.status}</CategoryLabel>
                <h2>{desk.name}</h2>
                <p>{desk.focus}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading label="New source-desk items" />
          <div className="source-item-list">
            {sourceDeskItems.map((item) => (
              <article key={item.url}>
                <CategoryLabel>{item.source}</CategoryLabel>
                <h2><a href={item.url}>{item.title}</a></h2>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading label="Launch-week plan" />
          <div className="launch-week">
            {launchWeek.map((day) => (
              <article key={day.date}>
                <time>{day.date}</time>
                <h2>{day.theme}</h2>
                <p>{day.lead}</p>
                <small>{day.public_note}</small>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading label="Public categories" />
          <div className="category-pills" aria-label="ATLSignal public coverage categories">
            {editorialCategories.map((category) => <span key={category}>{category}</span>)}
          </div>
        </section>

        <PremiumTeaser />

        <section>
          <SectionHeading label="Watchlist" />
          <div className="watchlist">
            {watchlist.map((item) => (
              <article key={item.title}>
                <CategoryLabel>Watchlist</CategoryLabel>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <p className="source-attribution">Navigation set: {categories.join(", ")}. No contact intelligence is published.</p>
        <NewsletterSignup compact />
      </main>
    </>
  );
}
