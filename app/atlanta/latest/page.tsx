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
import { atlanta, categories } from "@/lib/market";
import { editorialCategories, launchWeek, leadStory, sourceDeskItems, sourceDesks, stories, watchlist } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Latest",
  description: "The latest public ATLSignal coverage, source desk status, and launch-week publishing plan.",
  alternates: { canonical: absoluteUrl("/latest") },
};

export default function LatestPage() {
  const latestStories = [leadStory, ...stories];
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
