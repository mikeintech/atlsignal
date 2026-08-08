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
          <SectionHeading label="Tier boundaries" />
          <div className="tier-grid">
            {coverageLanes.map((lane) => (
              <article key={lane.title}>
                <p className="eyebrow">{lane.audience}</p>
                <h2>{lane.title}</h2>
                <h3>Includes</h3>
                <ul>{lane.includes.map((item) => <li key={item}>{item}</li>)}</ul>
                <h3>Does not expose</h3>
                <ul>{lane.excludes.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
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

        <PremiumTeaser />
        <NewsletterSignup compact />
      </main>
    </>
  );
}
