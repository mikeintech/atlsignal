import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ConfidenceIndicator,
  EditionHeader,
  EvidenceList,
  Headline,
  MapPreview,
  PublicationHeader,
  ProjectCard,
  SectionHeading,
  SourceAttribution,
  StoryCard,
  Timeline,
  UpdateBadge,
} from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";
import { leadStory, projects, stories } from "@/lib/atlanta-data";

const allStories = [leadStory, ...stories];
const categoryNames: Record<string, string> = {
  latest: "Latest intelligence",
  business: "Business",
  development: "Development",
  policy: "City Hall & Policy",
  transit: "Transportation & Airport",
  money: "Money",
  economy: "Economy",
  opportunities: "Opportunities",
  projects: "Projects we’re watching",
};

export function generateStaticParams() {
  return [...allStories.map(({ slug }) => ({ slug })), ...Object.keys(categoryNames).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (categoryNames[slug]) return { title: categoryNames[slug], description: `${categoryNames[slug]} across the Atlanta commercial economy.`, alternates: { canonical: `/atlanta/${slug}` } };
  const story = allStories.find((item) => item.slug === slug);
  if (!story) return {};
  return { title: story.headline, description: story.dek, alternates: { canonical: `/atlanta/${story.slug}` }, openGraph: { type: "article", title: story.headline, description: story.dek, publishedTime: "2026-08-07T08:10:00-04:00", modifiedTime: "2026-08-07T08:10:00-04:00", images: ["/og.png"] }, twitter: { card: "summary_large_image", title: story.headline, description: story.dek, images: ["/og.png"] } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (categoryNames[slug]) return <CategoryLanding slug={slug} />;
  const story = allStories.find((item) => item.slug === slug);
  if (!story) notFound();
  const isLead = story.slug === leadStory.slug;
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: story.headline, description: story.dek, datePublished: "2026-08-07T08:10:00-04:00", dateModified: "2026-08-07T08:10:00-04:00", author: { "@type": "Organization", name: "ATLSignal Desk" }, publisher: { "@type": "Organization", name: "ATLSignal" }, image: "/og.png" };

  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className="article-page shell">
        <header className="article-hero">
          <div className="article-kicker"><span>{story.category}</span><UpdateBadge>Intelligence update</UpdateBadge><ConfidenceIndicator level={story.confidence} /></div>
          <Headline as="h1" size="lead">{story.headline}</Headline>
          <p className="article-dek">{story.dek}</p>
          <div className="article-byline"><span>By ATLSignal Desk</span><time>August 7, 2026 · 8:10 AM ET</time></div>
        </header>

        <div className="article-layout">
          <article className="article-body">
            <section><h2>What changed</h2><p>{isLead ? "Canonical DeKalb County records show the McKenney’s campus warehouse project progressing from land-development evidence to a building permit application and then a permit issuance. ATLSignal now classifies the project as construction-ready." : story.dek}</p></section>
            <section><h2>Why it matters</h2><p>The stage change is a factual signal of commercial activity. It does not, by itself, prove a completion date, tenant opening date, vendor need or contract award.</p>{story.metric && <p className="article-number"><strong>{story.metric}</strong><span>{story.metricLabel}</span></p>}</section>
            <section><h2>What happens next</h2><p>We will watch for subsequent permit updates, occupancy evidence, first-party announcements and independently sourced project participants. Any forecast will remain labeled separately from confirmed facts.</p></section>
            <section><SectionHeading label="Intelligence timeline" />
              <Timeline events={isLead ? [
                { date: "Oct. 7, 2025", title: "Land-development evidence observed", detail: "The project enters the canonical event graph through DeKalb planning records." },
                { date: "Feb. 20, 2026", title: "Building permit applied", detail: "A permit application provides a second dated project milestone." },
                { date: "May 29, 2026", title: "Building permit issued", detail: "The issued permit supports the construction-ready classification." },
                { date: "Aug. 7, 2026", title: "Editorial candidate generated", detail: "The project clears the public-safe confidence threshold and enters human review." },
              ] : [
                { date: "Aug. 7, 2026", title: "Canonical stage recorded", detail: "ATLSignal generated a public-safe editorial candidate from qualified evidence." },
                { date: "Now", title: "Continued monitoring", detail: "The project remains under review for new evidence and material changes." },
              ]} />
            </section>
            <section><SectionHeading label="Sources" /><EvidenceList sources={isLead ? [
              { name: "DeKalb County Planning Applications", detail: "Land-development event dated Oct. 7, 2025." },
              { name: "DeKalb Building Permit Applications", detail: "Building permit application dated Feb. 20, 2026 and issuance dated May 29, 2026.", url: "https://dcgis.dekalbcountyga.gov/mapping/rest/services/Building_Permit_Applications/FeatureServer/0" },
              { name: "ATLSignal evidence graph", detail: "Project resolution, stage classification and evidence lineage reviewed Aug. 7, 2026." },
            ] : [
              { name: "ATLSignal evidence graph", detail: "Qualified public-source evidence and project-stage classification." },
            ]} /><SourceAttribution>Government records and ATLSignal canonical data. No contact intelligence is displayed.</SourceAttribution></section>
          </article>
          <aside className="article-rail">
            <MapPreview label={`Project area for ${story.headline}`} />
            <div className="fact-box"><p className="eyebrow">Evidence discipline</p><dl><div><dt>Fact</dt><dd>Recorded stage and reported value</dd></div><div><dt>Inference</dt><dd>Commercial activity may follow</dd></div><div><dt>Forecast</dt><dd>None published</dd></div></dl></div>
          </aside>
        </div>
        <section><SectionHeading label="Related intelligence" />
          <div className="editorial-grid editorial-grid--three">{allStories.filter((item) => item.slug !== story.slug).slice(0, 3).map((item) => <StoryCard key={item.slug} story={item} />)}</div>
        </section>
        <NewsletterSignup compact />
      </main>
    </>
  );
}

function CategoryLanding({ slug }: { slug: string }) {
  const title = categoryNames[slug];
  const categoryMatch: Record<string, string> = {
    opportunities: "Opportunity",
    policy: "City Hall & Policy",
    transit: "Transportation & Airport",
  };
  const match = slug === "latest"
    ? allStories
    : allStories.filter((story) => story.category.toLowerCase() === (categoryMatch[slug] ?? slug).toLowerCase());
  return (
    <>
      <PublicationHeader market={atlanta} /><EditionHeader market={atlanta} />
      <main className="category-page shell">
        <header className="category-hero"><p className="eyebrow">ATLSignal</p><Headline as="h1" size="large">{title}</Headline><p>Permanent, evidence-backed coverage of what is changing across Atlanta.</p></header>
        {slug === "projects" ? (
          <div className="project-list category-list">{projects.map((project) => <ProjectCard key={project.slug} name={project.name} location={project.location} status={project.status} detail={project.detail} href={`/atlanta/project/${project.slug}`} />)}</div>
        ) : match.length ? (
          <div className="category-list">{match.map((story, index) => <StoryCard key={story.slug} story={story} numbered={index + 1} />)}</div>
        ) : (
          <div className="category-empty"><p className="eyebrow">Evidence state</p><h2>No story cleared today’s public threshold.</h2><p>We found signals in this category, but none passed the current source, confidence and classification checks. The archive will populate when supported intelligence is approved.</p></div>
        )}
      </main>
    </>
  );
}
