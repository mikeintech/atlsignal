import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleActions } from "@/components/article-actions";
import { NewsletterSignup } from "@/components/newsletter-signup";
import {
  EditorialImage,
  EditionHeader,
  Headline,
  PremiumTeaser,
  PublicationCard,
  PublicationHeader,
  SectionHeading,
  SourceAttribution,
  UpdateBadge,
} from "@/components/publication";
import { attributedBriefs, getAttributedBrief } from "@/lib/attributed-briefs";
import { relatedContent } from "@/lib/content-index";
import { atlanta } from "@/lib/market";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return attributedBriefs.map((brief) => ({ id: brief.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const brief = getAttributedBrief(id);
  if (!brief) return {};
  return {
    title: brief.headline,
    description: brief.description,
    alternates: { canonical: absoluteUrl(brief.href) },
    robots: { index: brief.indexable, follow: true },
    openGraph: { type: "article", title: brief.headline, description: brief.description, images: [brief.image.src] },
    twitter: { card: "summary_large_image", title: brief.headline, description: brief.description, images: [brief.image.src] },
  };
}

export default async function AttributedBriefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brief = getAttributedBrief(id);
  if (!brief) notFound();
  const { cluster, source } = brief;
  const jsonLd = brief.indexable ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: brief.headline,
    description: brief.description,
    datePublished: brief.publishedAt,
    dateModified: brief.publishedAt,
    author: { "@type": "Organization", name: "ATLSignal Desk" },
    publisher: { "@type": "NewsMediaOrganization", name: "ATLSignal", url: absoluteUrl("/") },
    mainEntityOfPage: absoluteUrl(brief.href),
    image: brief.image.src,
  } : null;

  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <main className="article-page source-note-page shell">
        <header className="article-hero">
          <div className="article-kicker"><span>{brief.category}</span><UpdateBadge>Attributed brief</UpdateBadge></div>
          <Headline as="h1" size="lead">{brief.headline}</Headline>
          <p className="article-dek">{brief.description}</p>
          <p className="article-nutgraf">This ATLSignal desk brief adds local context and a visible evidence boundary to reporting first published by {source.name}. It is not presented as independent confirmation.</p>
          <div className="article-byline"><span>By ATLSignal Desk</span><time dateTime={brief.publishedAt}>Source published {brief.sourceDate}</time></div>
          <ArticleActions title={brief.headline} category={brief.category} />
          <EditorialImage image={brief.image} priority />
        </header>

        <div className="article-layout source-note-layout">
          <article className="article-body">
            <aside className="article-glance">
              <h2>At a glance</h2>
              <ul>
                <li>{source.name} is the attributed source for the central claim.</li>
                <li>ATLSignal’s locality score for this item is {cluster.scores.locality}/100.</li>
                <li>The item is classified under {brief.category.toLowerCase()}.</li>
                <li>{brief.indexable ? "This brief clears ATLSignal’s public indexing threshold." : "This brief remains available to readers but is withheld from search indexing pending stronger evidence."}</li>
              </ul>
            </aside>
            <section><h2>What was reported</h2><p>{source.name} reported that {brief.headline.charAt(0).toLowerCase()}{brief.headline.slice(1).replace(/[.!?]+$/, "")}.</p><p>ATLSignal has retained the source’s framing as an attributed claim. The original report is linked below so readers can inspect its full reporting, wording and supporting material directly.</p></section>
            <section><h2>Why this matters in Atlanta</h2><p>{cluster.draft.whyItMatters}</p><p>The useful signal is not simply that a headline appeared. It is that the development can now be tracked against later public records, first-party announcements and measurable outcomes instead of disappearing in a daily news cycle.</p></section>
            <section><h2>What remains unconfirmed</h2><p>{cluster.draft.unknown}</p><p>ATLSignal has not independently confirmed every assertion in the source report. This page will be promoted to a full report only when primary documentation, direct reporting or independent corroboration supports that treatment.</p></section>
            <section><h2>What ATLSignal is watching next</h2><p>{cluster.draft.next}</p></section>
            <section className="source-note-callout"><h2>Read the original reporting</h2><p>The source remains the authority for its reporting and deserves the direct referral.</p><p><a href={source.url} target="_blank" rel="noreferrer">Read {source.name}’s original report ↗</a></p><SourceAttribution>{source.name} · Tier {source.tier} attributed source. ATLSignal has not republished the source article or its photography.</SourceAttribution></section>
          </article>
          <aside className="article-rail">
            <div className="fact-box"><p className="eyebrow">Evidence status</p><dl><div><dt>Treatment</dt><dd>Attributed brief</dd></div><div><dt>Source</dt><dd>{source.name}</dd></div><div><dt>Evidence</dt><dd>Not independently confirmed</dd></div></dl><Link href="/methodology">How ATLSignal labels evidence →</Link></div>
            <PremiumTeaser compact />
          </aside>
        </div>
        <section><SectionHeading label="Keep reading" /><div className="editorial-grid editorial-grid--three">{relatedContent(brief.category, brief.href).map((item) => <PublicationCard key={item.id} item={item} />)}</div></section>
        <NewsletterSignup compact />
      </main>
    </>
  );
}
