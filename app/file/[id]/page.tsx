import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleActions } from "@/components/article-actions";
import {
  ConfidenceIndicator,
  EditorialImage,
  EditionHeader,
  EvidenceList,
  Headline,
  PremiumTeaser,
  PublicationHeader,
  SectionHeading,
  SourceAttribution,
  UpdateBadge,
} from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { editionDateLabel, getSourceNote, sourceNotePosts } from "@/lib/daily-edition";
import { atlanta } from "@/lib/market";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return sourceNotePosts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = getSourceNote(id);
  if (!post) return {};
  return {
    title: post.headline,
    description: post.dek,
    alternates: { canonical: absoluteUrl(`/file/${post.id}`) },
    openGraph: { type: "article", title: post.headline, description: post.dek, images: [post.image.src] },
    twitter: { card: "summary_large_image", title: post.headline, description: post.dek, images: [post.image.src] },
  };
}

export default async function SourceNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getSourceNote(id);
  if (!post?.cluster) notFound();
  const cluster = post.cluster;
  const sources = cluster.sources.map((source) => ({
    name: source.name,
    detail: `${source.tier === "A" ? "Primary" : "Attributed"} source reviewed for this source note.`,
    url: source.url,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.headline,
    description: post.dek,
    datePublished: cluster.publishedAt,
    dateModified: new Date().toISOString(),
    author: { "@type": "Person", name: "Mike", url: "https://github.com/mikeintech" },
    publisher: { "@type": "NewsMediaOrganization", name: "ATLSignal", url: absoluteUrl("/") },
    image: post.image.src,
  };

  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className="article-page source-note-page shell">
        <header className="article-hero">
          <div className="article-kicker"><span>{post.category}</span><UpdateBadge>Source note</UpdateBadge><ConfidenceIndicator level={cluster.evidenceLabel === "Corroborated" ? "Confirmed" : "Probable"} /></div>
          <Headline as="h1" size="lead">{post.headline}</Headline>
          <p className="article-dek">{post.dek}</p>
          <p className="article-nutgraf">This is a concise ATLSignal source note: a verified primary-source development promoted into today’s public file while deeper follow-up reporting continues.</p>
          <div className="article-byline"><span>By Mike · ATLSignal Publisher & Editor</span><time dateTime={cluster.publishedAt}>Source dated {post.sourceDate} · Added to the {editionDateLabel} file</time></div>
          <ArticleActions title={post.headline} category={post.category} />
          <EditorialImage image={post.image} priority />
        </header>

        <div className="article-layout source-note-layout">
          <article className="article-body">
            <aside className="article-glance">
              <h2>At a glance</h2>
              <ul>
                <li>{cluster.sources.length} attributable source{cluster.sources.length === 1 ? "" : "s"} reviewed.</li>
                <li>Evidence status: {cluster.evidenceLabel.toLowerCase()}.</li>
                <li>Original publication date: {post.sourceDate}.</li>
                <li>Treatment today: {post.treatment.toLowerCase()}.</li>
              </ul>
            </aside>
            <section><h2>What entered the file</h2><p>{cluster.sources[0]?.name ?? "A primary source"} published an attributable update titled “{post.headline}.” ATLSignal has promoted the item into the daily file because it clears the primary-source threshold. The linked source remains the authority for its own announcement.</p></section>
            <section><h2>Why it matters</h2><p>{cluster.draft.whyItMatters}</p><p>Short source notes keep the publication current without presenting an announcement as a completed outcome. The largest or most consequential items are expanded into full reported briefs as additional facts become available.</p></section>
            <section><h2>Evidence boundary</h2><p>{cluster.draft.unknown}</p><p>{cluster.corroboration.status === "CORROBORATED" ? "More than one first-party record supports the central development." : "One first-party source currently supports the central development; ATLSignal has not labeled the wider implications independently confirmed."}</p></section>
            <section><h2>What we are watching next</h2><p>{cluster.draft.next}</p></section>
            <section><SectionHeading label="Sources" /><EvidenceList sources={sources} /><SourceAttribution>First-party material reviewed by ATLSignal. Subscriber-only contacts and routing intelligence are not displayed.</SourceAttribution></section>
          </article>
          <aside className="article-rail">
            <div className="fact-box"><p className="eyebrow">Daily-file treatment</p><dl><div><dt>Status</dt><dd>{post.treatment}</dd></div><div><dt>Category</dt><dd>{post.category}</dd></div><div><dt>Evidence</dt><dd>{cluster.evidenceLabel}</dd></div></dl></div>
            <PremiumTeaser compact />
          </aside>
        </div>
        <NewsletterSignup compact />
      </main>
    </>
  );
}
