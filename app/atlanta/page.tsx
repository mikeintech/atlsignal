import type { Metadata } from "next";
import Link from "next/link";
import {
  DataStrip,
  EditionHeader,
  EditorialImage,
  IntelligenceStory,
  OpportunityCard,
  PremiumTeaser,
  ProjectCard,
  PublicationCard,
  PublicationHeader,
  SectionHeading,
  TrendCard,
  Watchlist,
} from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";
import { leadStory, metrics, premiumSignals, projects, publicGuides, sourceDesks, watchlist } from "@/lib/atlanta-data";
import { contentForDesk, editorialContent } from "@/lib/content-index";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Atlanta news, business, development and city life",
  description: "Independent Atlanta reporting on news, business, development, housing, events, food, sports and public money—with visible source trails.",
  alternates: { canonical: absoluteUrl("/") },
};

export default function AtlantaPage() {
  const topStories = editorialContent.filter((item) => item.href !== `/${leadStory.slug}`).slice(0, 4);
  const developmentStories = contentForDesk("development").slice(0, 6);
  const businessStories = contentForDesk("business").slice(0, 4);
  const newsStories = contentForDesk("news").slice(0, 6);
  const cityLifeStories = contentForDesk("city-life").slice(0, 6);

  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <main className="edition-page">
        <section className="front-hero shell" aria-labelledby="top-intelligence-title">
          <div className="front-hero__lede">
            <p className="eyebrow" id="top-intelligence-title">Atlanta’s independent newsroom</p>
            <h1>Atlanta news with the source trail still attached.</h1>
            <p>ATLSignal follows the city’s biggest stories, business moves, development, events and everyday culture—then shows what is original reporting, what is attributed and what still needs proof.</p>
          </div>
          <div className="front-hero__brief">
            <p className="eyebrow">Lead report</p>
            <IntelligenceStory story={leadStory} />
          </div>
        </section>

        <section className="front-grid shell">
          <div className="front-grid__main">
            <SectionHeading label="Top stories" />
            <div className="story-stack">
              {topStories.map((item, index) => <PublicationCard key={item.id} item={item} numbered={index + 1} />)}
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
        <section className="shell">
          <SectionHeading label="Development" href="/development" />
          <div className="editorial-grid editorial-grid--three">
            {developmentStories.map((item) => <PublicationCard key={item.id} item={item} />)}
          </div>
        </section>

        <section className="shell">
          <SectionHeading label="News & civic life" href="/news" />
          <div className="editorial-grid editorial-grid--three">
            {newsStories.map((item) => <PublicationCard key={item.id} item={item} />)}
          </div>
        </section>

        <section className="split-section shell">
          <div>
            <SectionHeading label="Business moves" href="/business" />
            {businessStories.map((item) => <PublicationCard key={item.id} item={item} />)}
          </div>
          <div>
            <SectionHeading label="How to read us" href="/latest" />
            <TrendCard kicker="Evidence status" title="Facts, claims and forecasts stay separated" value="3" change="evidence lanes" note="Confirmed public records are labeled differently from inferred market signals and watchlist items." />
          </div>
        </section>

        <section className="shell">
          <SectionHeading label="City Life" href="/city-life" />
          <div className="editorial-grid editorial-grid--three">
            {cityLifeStories.map((item) => <PublicationCard key={item.id} item={item} />)}
          </div>
        </section>

        <section className="early-intelligence shell">
          <div>
            <p className="eyebrow">Reader promise</p>
            <h2>Useful local business coverage without pretending every signal is a scoop.</h2>
            <p>Each article is built from a source trail. If we know a permit was issued, we say that. If we are watching for an opening date, operator or award, we label it as unresolved.</p>
          </div>
          <div>
            <p className="eyebrow">Coverage focus</p>
            <h3>Development, openings, public money, transit and commercial demand.</h3>
            <p>Our desk is built for regular readers first: clear reporting, durable explainers and topic sections that connect individual records to Atlanta’s larger story.</p>
          </div>
        </section>

        <section className="shell">
          <SectionHeading label="Free guides" href="/guides" />
          <div className="guide-grid">
            {publicGuides.map((guide) => (
              <article key={guide.slug}>
                <EditorialImage image={guide.image} compact />
                <p className="eyebrow">{guide.category} · {guide.readTime}</p>
                <h2>{guide.title}</h2>
                <p>{guide.dek}</p>
                <Link href={`/guides/${guide.slug}`}>Read guide →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="shell">
          <SectionHeading label="Source desks" href="/latest" />
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
          <Link href="/upgrade">See upgrade tiers →</Link>
        </section>

        <section className="shell">
          <SectionHeading label="Signals we’re watching" />
          <Watchlist items={watchlist} />
        </section>

        <section className="shell">
          <SectionHeading label="Projects we’re watching" href="/projects" />
          <div className="project-list">{projects.map((project) => <ProjectCard key={project.slug} name={project.name} location={project.location} status={project.status} detail={project.detail} href={`/project/${project.slug}`} />)}</div>
        </section>

        <div className="shell" id="newsletter"><NewsletterSignup /></div>
      </main>
    </>
  );
}
