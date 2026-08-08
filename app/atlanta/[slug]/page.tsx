import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ConfidenceIndicator,
  EditionHeader,
  EvidenceList,
  Headline,
  MapPreview,
  PremiumTeaser,
  PublicationHeader,
  ProjectCard,
  SectionHeading,
  SourceAttribution,
  StoryCard,
  StoryImage,
  Timeline,
  UpdateBadge,
} from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";
import { leadStory, projects, sourceDeskArticleDetails, stories } from "@/lib/atlanta-data";

const allStories = [leadStory, ...stories];
const categoryNames: Record<string, string> = {
  latest: "Latest intelligence",
  business: "Business",
  development: "Development",
  policy: "City Hall & Policy",
  transit: "Transportation & Airport",
  money: "Public Money",
  economy: "Workforce & Economy",
  opportunities: "Opportunities",
  projects: "Projects we’re watching",
};

const categoryDescriptions: Record<string, string> = {
  business: "Openings, expansions and operating milestones shaping Atlanta’s commercial map.",
  development: "Construction, occupancy and major project movement across metro Atlanta.",
  policy: "The city and regional decisions that change neighborhoods, public space and the business climate.",
  transit: "Airport, transit, trail and mobility decisions with consequences beyond the commute.",
  money: "Follow the incentives, public investment, development finance and contracts behind Atlanta’s growth.",
  economy: "Workforce, major events and regional signals that explain how metro Atlanta is changing.",
  opportunities: "Confirmed public solicitations, with public reporting separated from subscriber-only routing intelligence.",
  projects: "A durable watchlist of projects with documented public milestones.",
};

function articleContext(story: typeof leadStory, isLead: boolean) {
  const deskContext = sourceDeskArticleDetails[story.slug];
  if (deskContext) return deskContext;
  const projectType = story.category === "Business" ? "business" : "development";
  return {
    nutgraf: isLead
      ? "The project gives Atlanta readers a useful example of why public records matter: a commercial development can show meaningful movement before a traditional announcement, ribbon cutting or tenant story appears."
      : `The update gives ATLSignal a confirmed ${projectType} signal to track as the project moves through the public record and toward its next visible milestone.`,
    whatChanged: isLead
      ? "Canonical DeKalb County records show the McKenney’s campus warehouse project progressing from land-development evidence to a building permit application and then to an issued permit. That sequence is enough for ATLSignal to classify the project as construction-ready, while still withholding any unsupported claim about completion timing, vendor need or operating plans."
      : `${story.dek} ATLSignal is treating the record as a confirmed public milestone, not as a forecast about opening date, hiring, procurement or tenant operations.`,
    matters: "For regular readers, the value is context: permits and public-source milestones help explain where commercial activity is forming, which corridors are drawing investment and which projects deserve follow-up. For business readers, the same evidence can become an early signal that contractors, operators, property managers or public buyers may soon make downstream decisions.",
    unknown: "The public record does not necessarily identify the final operating date, complete procurement route, all vendors, tenant operations or every project participant. Those details will stay out of the headline unless they are supported by stronger evidence.",
    next: "The next useful evidence would be a later permit update, inspection record, certificate of occupancy, first-party company announcement, broker/developer release, job listing, public bid, or local reporting that identifies an operator or timeline. Until then, ATLSignal will keep the confirmed record separate from any inference.",
    sources: isLead ? [
      { name: "DeKalb County Planning Applications", detail: "Land-development event dated Oct. 7, 2025." },
      { name: "DeKalb Building Permit Applications", detail: "Building permit application dated Feb. 20, 2026 and issuance dated May 29, 2026.", url: "https://dcgis.dekalbcountyga.gov/mapping/rest/services/Building_Permit_Applications/FeatureServer/0" },
      { name: "ATLSignal evidence graph", detail: "Project resolution, stage classification and evidence lineage reviewed Aug. 7, 2026." },
    ] : [{ name: "ATLSignal evidence graph", detail: "Qualified public-source evidence and project-stage classification." }],
  };
}

export function generateStaticParams() {
  return [...allStories.map(({ slug }) => ({ slug })), ...Object.keys(categoryNames).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (categoryNames[slug]) return { title: categoryNames[slug], description: `${categoryNames[slug]} across the Atlanta commercial economy.`, alternates: { canonical: `/atlanta/${slug}` } };
  const story = allStories.find((item) => item.slug === slug);
  if (!story) return {};
  return { title: story.headline, description: story.dek, alternates: { canonical: `/atlanta/${story.slug}` }, openGraph: { type: "article", title: story.headline, description: story.dek, publishedTime: "2026-08-07T08:10:00-04:00", modifiedTime: "2026-08-08T10:20:00-04:00", images: [story.image.src] }, twitter: { card: "summary_large_image", title: story.headline, description: story.dek, images: [story.image.src] } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (categoryNames[slug]) return <CategoryLanding slug={slug} />;
  const story = allStories.find((item) => item.slug === slug);
  if (!story) notFound();
  const isLead = story.slug === leadStory.slug;
  const isSourceDeskStory = Boolean(sourceDeskArticleDetails[story.slug]);
  const context = articleContext(story, isLead);
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: story.headline, description: story.dek, datePublished: "2026-08-07T08:10:00-04:00", dateModified: "2026-08-08T10:20:00-04:00", author: { "@type": "Organization", name: "ATLSignal Desk" }, publisher: { "@type": "Organization", name: "ATLSignal" }, image: story.image.src };

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
          <p className="article-nutgraf">{context.nutgraf}</p>
          <div className="article-byline"><span>By ATLSignal Desk</span><time>August 7, 2026 · 8:10 AM ET · 5 min read</time></div>
          <StoryImage story={story} priority />
        </header>

        <div className="article-layout">
          <article className="article-body">
            <aside className="article-glance">
              <h2>At a glance</h2>
              {isSourceDeskStory ? <ul>
                <li>A first-party public source supports the reported update.</li>
                <li>The significance is explained without turning context into a forecast.</li>
                <li>Missing outcomes, costs or timelines remain explicitly unresolved.</li>
                <li>The original source is linked below for reader review.</li>
              </ul> : <ul>
                <li>Confirmed public-source milestone recorded by ATLSignal.</li>
                <li>Commercial activity is visible, but timing claims remain limited.</li>
                <li>Project facts are separated from inferences and watchlist items.</li>
                <li>Source trail remains attached for reader review.</li>
              </ul>}
            </aside>
            <section><h2>What changed</h2><p>{context.whatChanged}</p><p>That distinction matters. A public record or first-party update can confirm movement, but it cannot answer every question readers may care about. ATLSignal’s job is to publish the part that is supported, then keep watching for the part that is not.</p></section>
            <section><h2>Why it matters</h2><p>{context.matters}</p><p>The broader story is Atlanta’s fragmented information environment. Development activity often appears across county systems, city agendas, economic-development announcements, broker notes, developer sites and local coverage. V2 of ATLSignal is designed to connect those pieces into readable coverage instead of forcing readers to interpret raw records on their own.</p>{story.metric && <p className="article-number"><strong>{story.metric}</strong><span>{story.metricLabel}</span></p>}</section>
            <section><h2>What we do not know yet</h2><p>{context.unknown}</p></section>
            <section><h2>What happens next</h2><p>{context.next}</p></section>
            <section><SectionHeading label="Intelligence timeline" />
              <Timeline events={isLead ? [
                { date: "Oct. 7, 2025", title: "Land-development evidence observed", detail: "The project enters the canonical event graph through DeKalb planning records." },
                { date: "Feb. 20, 2026", title: "Building permit applied", detail: "A permit application provides a second dated project milestone." },
                { date: "May 29, 2026", title: "Building permit issued", detail: "The issued permit supports the construction-ready classification." },
                { date: "Aug. 7, 2026", title: "Editorial candidate generated", detail: "The project clears the public-safe confidence threshold and enters human review." },
              ] : isSourceDeskStory ? [
                { date: "Aug. 8, 2026", title: "First-party source reviewed", detail: "ATLSignal separated the attributable public facts from broader claims that still need evidence." },
                { date: "Now", title: "Desk watch continues", detail: "The story remains open for later budgets, milestones, outcomes and corroborating reporting." },
              ] : [
                { date: "Aug. 7, 2026", title: "Canonical stage recorded", detail: "ATLSignal generated a public-safe editorial candidate from qualified evidence." },
                { date: "Now", title: "Continued monitoring", detail: "The project remains under review for new evidence and material changes." },
              ]} />
            </section>
            <section><SectionHeading label="Sources" /><EvidenceList sources={context.sources} /><SourceAttribution>Public records, first-party sources and ATLSignal review. No contact intelligence is displayed.</SourceAttribution></section>
          </article>
          <aside className="article-rail">
            <MapPreview label={`Project area for ${story.headline}`} />
            <div className="fact-box"><p className="eyebrow">Evidence discipline</p><dl><div><dt>Fact</dt><dd>Recorded stage and reported value</dd></div><div><dt>Inference</dt><dd>Commercial activity may follow</dd></div><div><dt>Forecast</dt><dd>None published without more evidence</dd></div></dl></div>
            <PremiumTeaser compact />
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
    money: "Public Money",
    economy: "Workforce & Economy",
  };
  const match = slug === "latest"
    ? allStories
    : allStories.filter((story) => story.category.toLowerCase() === (categoryMatch[slug] ?? slug).toLowerCase());
  return (
    <>
      <PublicationHeader market={atlanta} /><EditionHeader market={atlanta} />
      <main className="category-page shell">
        <header className="category-hero"><p className="eyebrow">ATLSignal · {match.length || projects.length} reports</p><Headline as="h1" size="large">{title}</Headline><p>{categoryDescriptions[slug] ?? "Permanent, evidence-backed coverage of what is changing across Atlanta."}</p></header>
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
