import type { Metadata } from "next";
import Link from "next/link";
import {
  DataStrip,
  EditionHeader,
  IntelligenceStory,
  MorningBrief,
  OpportunityCard,
  PremiumTeaser,
  ProjectCard,
  PublicationHeader,
  SectionHeading,
  StoryCard,
  TrendCard,
  Watchlist,
} from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";
import { leadStory, metrics, premiumSignals, projects, publicGuides, sourceDesks, stories, watchlist } from "@/lib/atlanta-data";

export const metadata: Metadata = {
  title: "Latest",
  description: "What matters in Atlanta business, development, money and opportunity right now.",
  alternates: { canonical: "/atlanta" },
};

export default function AtlantaPage() {
  const topStories = stories.slice(0, 4);
  const developmentStories = stories.filter((story) => story.category === "Development").slice(0, 6);
  const businessStories = stories.filter((story) => story.category === "Business").slice(0, 4);

  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <main className="edition-page">
        <section className="front-hero shell" aria-labelledby="top-intelligence-title">
          <div className="front-hero__lede">
            <p className="eyebrow" id="top-intelligence-title">New Atlanta publication</p>
            <h1>Business news from the records before it becomes conventional wisdom.</h1>
            <p>ATLSignal follows permits, public money, development milestones, source-desk announcements and commercial openings across metro Atlanta — then explains what changed, what is confirmed and what still needs proof.</p>
          </div>
          <div className="front-hero__brief">
            <p className="eyebrow">Today’s read</p>
            <IntelligenceStory story={leadStory} />
          </div>
        </section>

        <section className="front-grid shell">
          <div className="front-grid__main">
            <SectionHeading label="Top stories" />
            <div className="story-stack">
              {topStories.map((story, index) => <StoryCard key={story.slug} story={story} numbered={index + 1} />)}
            </div>
          </div>
          <aside className="front-grid__rail">
            <div className="publisher-note">
              <p className="eyebrow">Why ATLSignal exists</p>
              <h2>Atlanta changes first in filings, permits, bids and local announcements.</h2>
              <p>We turn those scattered signals into plain-English coverage for founders, operators, brokers, vendors, residents and curious locals.</p>
            </div>
            <OpportunityCard title="Douglas County janitorial services — various locations" agency="Douglas County" timing="Open solicitation" summary="A public commercial opportunity signal. Buyer contact details and premium routing intelligence are intentionally withheld from this public view." />
            <PremiumTeaser compact />
          </aside>
        </section>

        <div className="shell"><DataStrip metrics={metrics} /></div>
        <div className="shell"><MorningBrief stories={[stories[2], stories[0], stories[4], stories[6], stories[8]]} /></div>

        <section className="shell">
          <SectionHeading label="Development" href="/atlanta/development" />
          <div className="editorial-grid editorial-grid--three">
            {developmentStories.map((story) => <StoryCard key={story.slug} story={story} />)}
          </div>
        </section>

        <section className="shell">
          <SectionHeading label="Public money & civic growth" href="/atlanta/money" />
          <div className="editorial-grid editorial-grid--three">
            {stories.filter((story) => ["Public Money", "City Hall & Policy", "Transportation & Airport", "Workforce & Economy"].includes(story.category)).slice(0, 6).map((story) => <StoryCard key={story.slug} story={story} />)}
          </div>
        </section>

        <section className="split-section shell">
          <div>
            <SectionHeading label="Business moves" href="/atlanta/business" />
            {businessStories.map((story) => <StoryCard key={story.slug} story={story} />)}
          </div>
          <div>
            <SectionHeading label="How to read us" href="/atlanta/latest" />
            <TrendCard kicker="Evidence status" title="Facts, claims and forecasts stay separated" value="3" change="evidence lanes" note="Confirmed public records are labeled differently from inferred market signals and watchlist items." />
          </div>
        </section>

        <section className="early-intelligence shell">
          <div>
            <p className="eyebrow">Reader promise</p>
            <h2>Useful local business coverage without pretending every signal is a scoop.</h2>
            <p>Each article is built from a source trail. If we know a permit was issued, we say that. If we are watching for an opening date, operator or award, we label it as unresolved.</p>
          </div>
          <div>
            <p className="eyebrow">Launch focus</p>
            <h3>Development, openings, public money, transit and commercial demand.</h3>
            <p>V2 is built for regular readers first: cleaner summaries, stronger article pages, and topic sections that feel like a publication instead of a database.</p>
          </div>
        </section>

        <section className="shell">
          <SectionHeading label="Free guides" href="/atlanta/guides" />
          <div className="guide-grid">
            {publicGuides.map((guide) => (
              <article key={guide.slug}>
                <p className="eyebrow">{guide.category} · {guide.readTime}</p>
                <h2>{guide.title}</h2>
                <p>{guide.dek}</p>
                <Link href={`/atlanta/guides/${guide.slug}`}>Read guide →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="shell">
          <SectionHeading label="Source desks" href="/atlanta/latest" />
          <div className="source-desk-grid">
            {sourceDesks.slice(0, 6).map((desk) => (
              <article key={desk.name}>
                <p className="eyebrow">{desk.status}</p>
                <h2>{desk.name}</h2>
                <p>{desk.focus}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="shell upgrade-band">
          <div>
            <p className="eyebrow">Subscriber layer</p>
            <h2>The free story is useful. The paid layer is actionable.</h2>
            <p>Public readers see confirmed facts and context. Subscribers get prioritization, enrichment and timing intelligence.</p>
          </div>
          <ul>{premiumSignals.slice(0, 4).map((signal) => <li key={signal}>{signal}</li>)}</ul>
          <Link href="/atlanta/upgrade">See upgrade tiers →</Link>
        </section>

        <section className="shell">
          <SectionHeading label="Signals we’re watching" />
          <Watchlist items={watchlist} />
        </section>

        <section className="shell">
          <SectionHeading label="Projects we’re watching" href="/atlanta/projects" />
          <div className="project-list">{projects.map((project) => <ProjectCard key={project.slug} name={project.name} location={project.location} status={project.status} detail={project.detail} href={`/atlanta/project/${project.slug}`} />)}</div>
        </section>

        <div className="shell" id="newsletter"><NewsletterSignup /></div>
      </main>
      <footer className="site-footer"><div className="shell"><strong>ATLSignal</strong><p>Atlanta business coverage, built from records and verified source trails.</p><span>V2 launch candidate · Editorial control stays on</span></div></footer>
    </>
  );
}
