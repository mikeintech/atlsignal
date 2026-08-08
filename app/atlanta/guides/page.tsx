import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EditionHeader, EditorialImage, Headline, PremiumTeaser, PublicationHeader, SectionHeading } from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";
import { publicGuides, sourceDeskItems } from "@/lib/atlanta-data";

export const metadata: Metadata = {
  title: "Atlanta Business Guides",
  description: "Plain-English ATLSignal guides for reading Atlanta permits, public bids, BeltLine updates and occupancy signals.",
  alternates: { canonical: "/atlanta/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <main className="category-page shell">
        <header className="category-hero">
          <p className="eyebrow">Guides</p>
          <Headline as="h1" size="large">How to read Atlanta’s business signals before they become obvious.</Headline>
          <p>Free explainers for readers who want to understand permits, public bids, occupancy records, BeltLine updates and commercial development without needing to live inside government databases.</p>
        </header>

        <section>
          <SectionHeading label="Free reader guides" />
          <div className="guide-grid">
            {publicGuides.map((guide) => (
              <article key={guide.slug}>
                <EditorialImage image={guide.image} compact />
                <p className="eyebrow">{guide.category} · {guide.readTime}</p>
                <h2>{guide.title}</h2>
                <p>{guide.dek}</p>
                <Link href={`/atlanta/guides/${guide.slug}`}>Read guide <ArrowUpRight size={14} /></Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading label="Source-desk reading list" />
          <div className="source-item-list">
            {sourceDeskItems.slice(0, 6).map((item) => (
              <article key={item.url}>
                <p className="eyebrow">{item.source}</p>
                <h2><a href={item.url}>{item.title}</a></h2>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <PremiumTeaser />
        <NewsletterSignup compact />
      </main>
    </>
  );
}
