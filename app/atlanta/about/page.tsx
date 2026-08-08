import type { Metadata } from "next";
import { EditionHeader, Headline, PublicationHeader, SectionHeading } from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";

export const metadata: Metadata = {
  title: "About ATLSignal",
  description: "How ATLSignal reports Atlanta business, development, public money and commercial activity from public-source evidence.",
  alternates: { canonical: "/atlanta/about" },
};

const principles = [
  {
    title: "Records first",
    text: "We start with public records, government feeds, first-party announcements and identifiable source trails before writing a claim as fact.",
  },
  {
    title: "Plain English",
    text: "A permit, procurement notice or development milestone should be understandable to a normal Atlanta reader, not just an industry insider.",
  },
  {
    title: "Evidence labels",
    text: "Confirmed facts, inferences and watchlist items are separated so readers know what is proven and what still needs corroboration.",
  },
  {
    title: "Local usefulness",
    text: "ATLSignal covers the parts of Atlanta’s economy that show up early: development, openings, public money, infrastructure and commercial demand.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <main className="category-page shell">
        <header className="category-hero about-hero">
          <p className="eyebrow">About ATLSignal</p>
          <Headline as="h1" size="large">A local business publication built from Atlanta’s public evidence trail.</Headline>
          <p>ATLSignal watches the records, announcements and civic signals that often show change before a conventional story appears.</p>
        </header>

        <section className="early-intelligence about-promise">
          <div>
            <p className="eyebrow">What we cover</p>
            <h2>Development, business moves, openings, procurement, infrastructure and public money.</h2>
            <p>We are not trying to publish every record. We are trying to turn the most useful records into readable coverage for people who want to understand what is changing across metro Atlanta.</p>
          </div>
          <div>
            <p className="eyebrow">What we avoid</p>
            <h3>No unsupported hype, no private contact intelligence, no pretending uncertainty is proof.</h3>
            <p>When a record does not identify an operator, timeline or buyer, we say so. Watchlist signals remain watchlist signals until stronger evidence arrives.</p>
          </div>
        </section>

        <section>
          <SectionHeading label="Editorial principles" />
          <div className="source-desk-grid">
            {principles.map((principle) => (
              <article key={principle.title}>
                <p className="eyebrow">Principle</p>
                <h2>{principle.title}</h2>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading label="How to read ATLSignal" />
          <div className="source-item-list">
            <article><h2>Fact</h2><p>A public record, official source, or directly attributable announcement supports the claim.</p></article>
            <article><h2>Inference</h2><p>A reasonable business implication follows from the evidence, but it is labeled separately from the confirmed record.</p></article>
            <article><h2>Watchlist</h2><p>A signal is worth monitoring but not yet strong enough to carry a fully reported claim.</p></article>
          </div>
        </section>

        <NewsletterSignup compact />
      </main>
    </>
  );
}
