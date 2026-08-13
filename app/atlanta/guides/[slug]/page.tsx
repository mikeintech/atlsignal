import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditionHeader, EditorialImage, Headline, PremiumTeaser, PublicationHeader, SectionHeading } from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";
import { publicGuides } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return publicGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = publicGuides.find((item) => item.slug === slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.dek, authors: [{ name: "ATLSignal Desk", url: absoluteUrl("/masthead") }], category: guide.category, keywords: [guide.category, "Atlanta guide", "Atlanta public records", "ATLSignal"], alternates: { canonical: absoluteUrl(`/guides/${guide.slug}`) }, robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }, openGraph: { type: "article", siteName: "ATLSignal", url: absoluteUrl(`/guides/${guide.slug}`), title: guide.title, description: guide.dek, images: [{ url: guide.image.src, alt: guide.image.alt }] }, twitter: { card: "summary_large_image", title: guide.title, description: guide.dek, images: [guide.image.src] } };
}

const guideCopy: Record<string, { sections: Array<{ title: string; body: string }> }> = {
  "how-atlanta-commercial-permits-become-news": {
    sections: [
      { title: "The useful record is usually not the whole story", body: "A commercial permit can show that a project moved, but it rarely explains every business implication. ATLSignal treats permits as evidence of stage, location, scope and timing — not as proof of an opening date, operator need or contract award." },
      { title: "What free readers get", body: "The free media layer explains the public milestone, links the source class, adds neighborhood or market context and labels uncertainty. That is enough for public understanding without exposing the premium commercial route." },
      { title: "What subscribers get", body: "Premium turns the same public event into a ranked opportunity: likely buyer path, operator/owner enrichment, daily change tracking, service relevance and confidence scoring." },
    ],
  },
  "certificate-of-occupancy-atlanta-business-openings": {
    sections: [
      { title: "Occupancy is a strong stage signal", body: "A certificate of occupancy or occupancy-stage record can indicate that a space is moving toward use. It is useful for readers because it often appears close to a public opening, move-in or operational shift." },
      { title: "It is not always an opening announcement", body: "ATLSignal does not convert occupancy into an opening date unless another source supports that claim. The free article can say the record reached occupancy stage; premium can watch for the next evidence event." },
      { title: "Why this matters commercially", body: "Occupancy-stage signals may affect cleaning, maintenance, security, staffing, supplies, signage and other operational decisions. Those service-route details belong in the subscriber layer." },
    ],
  },
  "public-bids-vs-premium-routing-intelligence": {
    sections: [
      { title: "Public bids stay public", body: "If a government solicitation is public, ATLSignal can summarize the agency, general scope and public timing for free readers. We do not need to hide the existence of public civic activity." },
      { title: "Routing is the paid layer", body: "The paid product starts where public notice ends: prioritization, fit, buyer path, likely decision points, supporting documents, deadline urgency and recommended follow-up route." },
      { title: "Why the wall matters", body: "A media publication earns trust by explaining civic and commercial activity. A data product earns revenue by helping subscribers act on the right items faster." },
    ],
  },
  "beltline-business-development-watch": {
    sections: [
      { title: "Infrastructure creates commercial context", body: "BeltLine trail, housing, park and corridor updates can reshape pedestrian activity, retail demand, construction timing and neighborhood investment. That makes official BeltLine updates a core source desk." },
      { title: "Context is not a forecast", body: "A trail update does not automatically prove a specific tenant, vendor need or opening date. ATLSignal uses BeltLine items as context unless a project-level claim is corroborated." },
      { title: "How this becomes premium intelligence", body: "Subscribers can follow the project-change layer: which corridors moved, which nearby projects overlap, which operators or public buyers deserve monitoring and what changed since the previous watch." },
    ],
  },
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = publicGuides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const copy = guideCopy[guide.slug];
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", "@id": `${absoluteUrl(`/guides/${guide.slug}`)}#article`, mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`), headline: guide.title, description: guide.dek, articleSection: guide.category, author: { "@type": "Organization", name: "ATLSignal Desk", url: absoluteUrl("/masthead") }, publisher: { "@type": "NewsMediaOrganization", name: "ATLSignal", url: absoluteUrl("/") }, image: guide.image.src, isAccessibleForFree: true, inLanguage: "en-US" };
  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className="article-page shell">
        <header className="article-hero">
          <div className="article-kicker"><span>{guide.category}</span><span>{guide.readTime}</span></div>
          <Headline as="h1" size="lead">{guide.title}</Headline>
          <p className="article-dek">{guide.dek}</p>
          <p className="article-nutgraf">This free guide is designed for public readers. It explains the signal without publishing premium buyer routing, contact paths or unsupported operator guesses.</p>
          <EditorialImage image={guide.image} priority />
        </header>
        <div className="article-layout">
          <article className="article-body">
            <aside className="article-glance">
              <h2>Free vs. premium</h2>
              <ul>
                <li>Free: source-backed explanation and public context.</li>
                <li>Premium: prioritization, enrichment, timing and action route.</li>
                <li>Never: unsupported claims presented as fact.</li>
              </ul>
            </aside>
            {copy.sections.map((section) => (
              <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>
            ))}
            <section>
              <SectionHeading label="Evidence standard" />
              <p>ATLSignal separates facts, inferences and forecasts so readers can tell what the record proves and what still needs review.</p>
            </section>
          </article>
          <aside className="article-rail"><PremiumTeaser compact /></aside>
        </div>
        <NewsletterSignup compact />
      </main>
    </>
  );
}
