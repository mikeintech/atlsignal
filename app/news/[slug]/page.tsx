import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import newsroomData from "@/data/newsroom.json";
import { ArticleActions } from "@/components/article-actions";
import { NewsletterSignup } from "@/components/newsletter-signup";
import {
  EditorialImage,
  EditionHeader,
  EvidenceList,
  Headline,
  PremiumTeaser,
  PublicationCard,
  PublicationHeader,
  SectionHeading,
  SourceAttribution,
  UpdateBadge,
} from "@/components/publication";
import { attributedBriefs, getAttributedStory } from "@/lib/attributed-briefs";
import { relatedContent } from "@/lib/content-index";
import { atlanta } from "@/lib/market";
import { absoluteUrl } from "@/lib/site";

function slugFromHref(href: string) {
  return href.split("/").filter(Boolean).at(-1) ?? "";
}

function fallbackContext(category: string) {
  if (/Transportation/.test(category)) return "Transportation stories become real in the gap between an announcement and the daily experience of riders, drivers and airport passengers.";
  if (/Money|Economy|Business/.test(category)) return "The number or announcement is only the opening move. The useful Atlanta story is who pays, who benefits and what can be measured next.";
  if (/Food|Hospitality/.test(category)) return "Atlanta’s openings are also neighborhood stories: they reveal where operators, landlords and customers believe the city’s next center of gravity will form.";
  if (/Arts|Culture|Events/.test(category)) return "A cultural calendar is a map of who gets a stage, where audiences gather and which Atlanta institutions are building durable community.";
  return "The development matters because Atlanta changes block by block, often before the consequences become visible across the whole city.";
}

export function generateStaticParams() {
  return attributedBriefs.map((brief) => ({ slug: slugFromHref(brief.href) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const brief = getAttributedStory((await params).slug);
  if (!brief) return {};
  const keywords = brief.article?.keywords ?? [brief.category, "Atlanta news", brief.source.name];
  return {
    title: brief.headline,
    description: brief.description,
    keywords,
    authors: [{ name: "ATLSignal Desk", url: absoluteUrl("/masthead") }],
    category: brief.category,
    alternates: { canonical: absoluteUrl(brief.href) },
    robots: { index: brief.indexable, follow: true, googleBot: { index: brief.indexable, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { type: "article", siteName: "ATLSignal", locale: "en_US", title: brief.headline, description: brief.description, url: absoluteUrl(brief.href), publishedTime: brief.publishedAt, modifiedTime: newsroomData.generatedAt, section: brief.category, tags: keywords, images: [{ url: brief.image.src, alt: brief.image.alt }] },
    twitter: { card: "summary_large_image", title: brief.headline, description: brief.description, images: [brief.image.src] },
  };
}

export default async function ReportedStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const brief = getAttributedStory((await params).slug);
  if (!brief) notFound();
  const { article, cluster, source } = brief;
  const paragraphs = article?.sections.flatMap((section) => section.paragraphs) ?? [brief.description, cluster.draft.whyItMatters, cluster.draft.unknown, cluster.draft.next];
  const readingMinutes = Math.max(3, Math.ceil(paragraphs.join(" ").split(/\s+/).length / 220));
  const sources = article?.sources ?? [{ name: source.name, detail: "Original reporting that established the attributed claim.", url: source.url }];
  const articleSchema = brief.indexable ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${absoluteUrl(brief.href)}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(brief.href) },
    headline: brief.headline,
    description: brief.description,
    datePublished: brief.publishedAt,
    dateModified: newsroomData.generatedAt,
    articleSection: brief.category,
    keywords: article?.keywords,
    about: article?.entities.map((name) => ({ "@type": "Thing", name })),
    author: [{ "@type": "Organization", name: "ATLSignal Desk", url: absoluteUrl("/masthead") }],
    publisher: { "@type": "NewsMediaOrganization", name: "ATLSignal", url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/og-social-v2.png") } },
    image: { "@type": "ImageObject", url: brief.image.src },
    isAccessibleForFree: true,
    inLanguage: "en-US",
    wordCount: paragraphs.join(" ").split(/\s+/).length,
    citation: sources.map((item) => item.url),
  } : null;
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "ATLSignal", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Latest", item: absoluteUrl("/latest") },
    { "@type": "ListItem", position: 3, name: brief.headline, item: absoluteUrl(brief.href) },
  ] };

  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      {articleSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <main className="article-page reported-story-page shell">
        <nav className="article-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/latest">Latest</Link><span>/</span><span>{brief.category}</span></nav>
        <header className="article-hero">
          <div className="article-kicker"><span>{article?.label ?? brief.category}</span><UpdateBadge>{article ? "Reported analysis" : "Attributed report"}</UpdateBadge></div>
          <Headline as="h1" size="lead">{brief.headline}</Headline>
          <p className="article-dek">{brief.description}</p>
          <p className="article-nutgraf">{article?.lede ?? `${source.name} surfaced the central development. ATLSignal is preserving the attribution while placing the signal in its Atlanta context.`}</p>
          <div className="article-byline"><span>By ATLSignal Desk · Edited by Mike</span><time dateTime={brief.publishedAt}>{brief.sourceDate} · {readingMinutes} min read</time></div>
          <ArticleActions title={brief.headline} category={brief.category} />
          <EditorialImage image={brief.image} priority />
        </header>

        <div className="article-layout">
          <article className="article-body">
            <aside className="article-glance"><h2>The short version</h2><ul>{(article?.keyFacts ?? [
              `${source.name} is the attributed source for the central development.`,
              fallbackContext(brief.category),
              "The outcome remains open and will be updated when stronger evidence arrives.",
            ]).map((fact) => <li key={fact}>{fact}</li>)}</ul></aside>

            {article ? article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>) : <>
              <section><h2>The signal</h2><p>{source.name} reported that {cluster.headline.charAt(0).toLowerCase()}{cluster.headline.slice(1).replace(/[.!?]+$/, "")}.</p><p>{fallbackContext(brief.category)}</p></section>
              <section><h2>The Atlanta context</h2><p>{cluster.draft.whyItMatters}</p><p>ATLSignal is treating this as a development worth following, not a finished conclusion. The reporting becomes more useful as later records reveal timing, scale and outcome.</p></section>
              <section><h2>The evidence line</h2><p>{cluster.draft.unknown}</p><p>This page is withheld from search indexing until primary documentation, independent corroboration or additional ATLSignal reporting supports a stronger treatment.</p></section>
              <section><h2>The next marker</h2><p>{cluster.draft.next}</p></section>
            </>}

            <section className="article-method-note"><h2>How ATLSignal reported this</h2><p>{article ? "ATLSignal reviewed the attributed local report, checked the first-party records listed below and added independent comparison or Atlanta-specific analysis. The central facts remain attached to their sources; the interpretation and calculations are ATLSignal’s." : `ATLSignal reviewed ${source.name}’s report and preserved its attribution. No claim on this page is labeled independently confirmed without a primary record or additional reporting.`}</p></section>
            <section><SectionHeading label="Sources and receipts" /><EvidenceList sources={sources} /><SourceAttribution>Reporting and records reviewed by ATLSignal. Source photography and article text were not republished.</SourceAttribution></section>
            <section className="article-update-history"><h2>Update history</h2><p><strong>{brief.sourceDate}:</strong> Initial ATLSignal treatment published with source attribution, evidence limits and Atlanta context.</p></section>
          </article>
          <aside className="article-rail">
            <div className="fact-box"><p className="eyebrow">Editorial treatment</p><dl><div><dt>Type</dt><dd>{article ? "Reported analysis" : "Attributed report"}</dd></div><div><dt>Primary records</dt><dd>{article ? `${Math.max(1, sources.length - 1)} reviewed` : "Pending"}</dd></div><div><dt>Search status</dt><dd>{brief.indexable ? "Publicly indexable" : "Held from indexing"}</dd></div></dl><Link href="/methodology">Read the methodology →</Link></div>
            {article && <div className="fact-box"><p className="eyebrow">People, places and institutions</p><div className="article-entities">{article.entities.map((entity) => <Link key={entity} href={`/search?q=${encodeURIComponent(entity)}`}>{entity}</Link>)}</div></div>}
            <PremiumTeaser compact />
          </aside>
        </div>
        <section><SectionHeading label="More from this desk" /><div className="editorial-grid editorial-grid--three">{relatedContent(brief.category, brief.href).map((item) => <PublicationCard key={item.id} item={item} />)}</div></section>
        <NewsletterSignup compact />
      </main>
    </>
  );
}
