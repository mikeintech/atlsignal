import type { Metadata } from "next";
import { EditionHeader, Headline, PremiumTeaser, PublicationHeader, SectionHeading } from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";
import { coverageLanes, premiumSignals } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Upgrade ATLSignal",
  description: "ATLSignal free media and premium intelligence tiers for Atlanta commercial opportunity tracking.",
  alternates: { canonical: absoluteUrl("/upgrade") },
};

export default function UpgradePage() {
  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <main className="category-page shell">
        <header className="category-hero">
          <p className="eyebrow">ATLSignal tiers</p>
          <Headline as="h1" size="large">Free readers get Atlanta context. Subscribers get the commercial route.</Headline>
          <p>ATLSignal publishes useful public media while keeping premium buyer paths, enrichment, timing scores and opportunity routing behind the paid layer.</p>
        </header>

        <section>
          <SectionHeading label="Choose your level" />
          <div className="tier-grid">
            {coverageLanes.map((lane) => (
              <article key={lane.title}>
                <p className="eyebrow">{lane.audience}</p>
                <h2>{lane.title}</h2>
                <p className="tier-price">{lane.price}</p>
                <h3>Includes</h3>
                <ul>{lane.includes.map((item) => <li key={item}>{item}</li>)}</ul>
                <h3>Does not expose</h3>
                <ul>{lane.excludes.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="sample-report">
          <div>
            <p className="eyebrow">Sample subscriber view</p>
            <h2>What “the commercial route” actually means</h2>
            <p>A Pro report keeps the public facts intact, then adds decision support without publishing private personal data.</p>
          </div>
          <dl>
            <div><dt>Signal</dt><dd>Named retail buildout enters construction</dd></div>
            <div><dt>Priority</dt><dd>High · value, stage and operator all confirmed</dd></div>
            <div><dt>Best route</dt><dd>Owner, general contractor and published vendor channel</dd></div>
            <div><dt>Timing</dt><dd>Act during buildout; monitor inspections and occupancy</dd></div>
            <div><dt>Daily change</dt><dd>New permit milestone added to the evidence trail</dd></div>
          </dl>
        </section>

        <section className="early-intelligence">
          <div>
            <p className="eyebrow">Premium signal examples</p>
            <h2>What the public article intentionally leaves out.</h2>
            <p>The free publication explains what happened. The paid layer helps a subscriber decide whether, when and how to act.</p>
          </div>
          <div>
            <ul className="premium-list">{premiumSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
          </div>
        </section>

        <section className="founding-access">
          <p className="eyebrow">Founding access</p>
          <h2>Help shape the first paid Atlanta intelligence desk.</h2>
          <p>Founding members receive direct onboarding and early pricing before standard subscriptions open. Tell us what territory, service category and signal type you need.</p>
          <a className="button-link" href="mailto:partnerships@atlsignal.com?subject=ATLSignal%20founding%20access">Request founding access</a>
        </section>
        <PremiumTeaser />
        <NewsletterSignup compact />
      </main>
    </>
  );
}
