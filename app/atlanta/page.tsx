import type { Metadata } from "next";
import {
  DataStrip,
  EditionHeader,
  IntelligenceStory,
  MorningBrief,
  OpportunityCard,
  ProjectCard,
  PublicationHeader,
  SectionHeading,
  StoryCard,
  TrendCard,
  Watchlist,
} from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";
import { leadStory, metrics, projects, stories, watchlist } from "@/lib/atlanta-data";

export const metadata: Metadata = {
  title: "Latest",
  description: "What matters in Atlanta business, development, money and opportunity right now.",
  alternates: { canonical: "/atlanta" },
};

export default function AtlantaPage() {
  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <main className="shell edition-page">
        <section className="top-intelligence" aria-labelledby="top-intelligence-title">
          <div>
            <p className="eyebrow" id="top-intelligence-title">Top intelligence</p>
            <IntelligenceStory story={leadStory} />
          </div>
          <aside aria-label="More top intelligence">
            {stories.slice(0, 3).map((story) => <StoryCard key={story.slug} story={story} />)}
          </aside>
        </section>

        <MorningBrief stories={[stories[2], stories[0], stories[4], stories[6], stories[8]]} />
        <DataStrip metrics={metrics} />

        <section>
          <SectionHeading label="Development" href="/atlanta/development" />
          <div className="editorial-grid editorial-grid--three">
            {stories.filter((story) => story.category === "Development").map((story) => <StoryCard key={story.slug} story={story} />)}
          </div>
        </section>

        <section className="split-section">
          <div>
            <SectionHeading label="Business moves" href="/atlanta/business" />
            {stories.filter((story) => story.category === "Business").map((story) => <StoryCard key={story.slug} story={story} />)}
          </div>
          <div>
            <SectionHeading label="Economy" href="/atlanta/economy" />
            <TrendCard kicker="Evidence status" title="No economy trend cleared today’s public threshold" value="—" change="review pending" note="We omit trend claims until sample size, coverage and baseline checks pass." />
          </div>
        </section>

        <section className="early-intelligence">
          <div>
            <p className="eyebrow">Before it’s obvious</p>
            <h2>Signals worth watching—without pretending they are settled facts.</h2>
            <p>Early intelligence only appears here when its lead-time advantage is verified. Today’s unresolved signals remain in editorial review.</p>
          </div>
          <div>
            <p className="eyebrow">Money moving</p>
            <h3>No supported public-safe money item today.</h3>
            <p>Several procurement records are labeled as awards upstream but describe open solicitations. They are excluded until the source classification is corrected.</p>
          </div>
        </section>

        <section>
          <SectionHeading label="Signals we’re watching" />
          <Watchlist items={watchlist} />
        </section>

        <section>
          <SectionHeading label="Projects we’re watching" href="/atlanta/projects" />
          <div className="project-list">{projects.map((project) => <ProjectCard key={project.slug} name={project.name} location={project.location} status={project.status} detail={project.detail} href={`/atlanta/project/${project.slug}`} />)}</div>
        </section>

        <section>
          <SectionHeading label="Opportunity" href="/atlanta/opportunities" />
          <OpportunityCard title="Douglas County janitorial services — various locations" agency="Douglas County" timing="Open solicitation" summary="A public commercial opportunity signal. Buyer contact details and premium routing intelligence are intentionally withheld from this public view." />
        </section>

        <div id="newsletter"><NewsletterSignup /></div>
      </main>
      <footer className="site-footer"><div className="shell"><strong>ATLSignal</strong><p>Atlanta intelligence, built from evidence.</p><span>Launch candidate · Editorial control stays on</span></div></footer>
    </>
  );
}
