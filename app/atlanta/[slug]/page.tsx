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
import { ArticleActions } from "@/components/article-actions";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { atlanta } from "@/lib/market";
import { leadStory, projects, sourceDeskArticleDetails, stories } from "@/lib/atlanta-data";
import { absoluteUrl } from "@/lib/site";

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

type ArticleContext = {
  nutgraf: string;
  whatChanged: string;
  matters: string;
  unknown: string;
  next: string;
  sources: Array<{ name: string; detail: string; url?: string }>;
  timeline?: Array<{ date: string; title: string; detail: string }>;
};

const informationPages: Record<string, { title: string; dek: string; sections: Array<{ title: string; body: string }> }> = {
  masthead: {
    title: "Masthead",
    dek: "The people and standards responsible for ATLSignal’s public reporting.",
    sections: [
      { title: "ATLSignal Desk", body: "ATLSignal is an independent Atlanta publication. The desk monitors public records, official announcements and attributable local sources, then reviews every public claim before publication. Staff bylines will replace the desk byline when a named reporter takes direct responsibility for original reporting." },
      { title: "Newsroom contact", body: "Send corrections, documents and reporting tips to newsroom@atlsignal.com. Sensitive material should not be sent until a secure channel is arranged." },
      { title: "Commercial contact", body: "Questions about founding access, team intelligence and partnerships can be sent to partnerships@atlsignal.com. Commercial relationships do not determine editorial conclusions." },
    ],
  },
  methodology: {
    title: "Reporting methodology",
    dek: "How ATLSignal turns fragmented Atlanta records into evidence-backed local coverage.",
    sections: [
      { title: "Source order", body: "We prefer government records, regulatory filings and first-party project documents. We then use reputable local reporting, broker and developer announcements, company materials and selected social signals. A lower-tier source may trigger reporting, but it does not automatically confirm a claim." },
      { title: "Evidence labels", body: "Confirmed means a primary or independently corroborated source supports the central fact. Probable means the evidence is strong but an important element remains unresolved. Early signal means the item is useful to watch but is not ready to carry a definitive claim." },
      { title: "What records do not prove", body: "A permit does not prove an opening date, vendor need or completed construction. A lease announcement does not prove occupancy. A public bid does not guarantee an award. We state those limits in coverage and update a report when later evidence changes the picture." },
      { title: "Corrections and updates", body: "Material changes are dated in an article’s update history. Errors are corrected promptly and significant corrections are explained on the article rather than silently overwritten." },
    ],
  },
  corrections: {
    title: "Corrections policy",
    dek: "Accuracy is part of the product, not a note added after publication.",
    sections: [
      { title: "Request a review", body: "Email newsroom@atlsignal.com with the article URL, the statement you believe is wrong and the best supporting source. We review factual challenges against the underlying evidence trail." },
      { title: "How corrections appear", body: "Typographical fixes may be made without a note. A material factual correction receives a dated notice explaining what changed. New information is labeled as an update rather than presented as if it was known at publication." },
      { title: "Right of response", body: "People and organizations named in ATLSignal coverage may submit attributable context or documentary evidence. A response does not guarantee a change, but it will be evaluated on the same evidence standard." },
    ],
  },
  privacy: {
    title: "Privacy policy",
    dek: "A short, readable account of what ATLSignal collects and why.",
    sections: [
      { title: "Information you provide", body: "ATLSignal may collect an email address when you subscribe, request access or contact the newsroom. We use it to deliver the requested communication and do not sell subscriber contact information." },
      { title: "Site measurement", body: "Basic traffic and referral data may be measured to understand which coverage is useful. ATLSignal does not intentionally publish private personal contact intelligence in the free publication." },
      { title: "Requests", body: "Questions about subscriber information may be sent to newsroom@atlsignal.com. This policy will be updated before any material change in collection or third-party processing." },
    ],
  },
  terms: {
    title: "Terms of use",
    dek: "The public publication is reporting and research, not a promise of commercial outcomes.",
    sections: [
      { title: "Use of reporting", body: "ATLSignal reporting may be read and shared with attribution. Republishing substantial portions, bulk extraction or reselling the publication requires written permission." },
      { title: "No outcome guarantee", body: "Records can change and public systems can contain errors. ATLSignal does not guarantee that a project, opening, procurement or commercial opportunity will proceed, and the publication is not legal, financial or procurement advice." },
      { title: "Images and source material", body: "Image credits and source links identify the origin of third-party material. Rights remain with their respective owners. Contact the newsroom with a documented rights or attribution concern." },
    ],
  },
  disclosures: {
    title: "Editorial disclosures",
    dek: "How ATLSignal handles automation, commercial relationships, source imagery and conflicts.",
    sections: [
      { title: "Editorial independence", body: "Advertisers, partners and subscribers do not receive approval over ATLSignal conclusions. Sponsored material, if introduced, will be labeled clearly and will not use the same evidence label as independent reporting." },
      { title: "Automation and human review", body: "Software helps monitor records, match entities and draft structured research. Public stories are reviewed against their cited evidence before publication. ATLSignal does not publish an automated inference as a confirmed fact merely because a system assigned it a high score." },
      { title: "Images", body: "Source images are credited to the organization or publisher that supplied them. Editorial images are illustrative and are labeled as such; they should not be read as a photograph of the specific project unless the caption says otherwise." },
      { title: "Commercial intelligence", body: "The free publication reports public facts and context. Paid products may add prioritization, timing and organizational routing based on lawful public or first-party information. ATLSignal does not sell private personal data or guarantee a business outcome." },
      { title: "Conflicts and corrections", body: "A material financial relationship with a covered organization will be disclosed on the relevant report. Readers can challenge facts through the corrections process linked on every page." },
    ],
  },
};

const priorityArticleDetails: Record<string, ArticleContext> = {
  "lulah-hills-publix-construction": {
    nutgraf: "A $4.2 million store record adds a specific tenant, address and construction value to the much larger Lulah Hills redevelopment story.",
    whatChanged: "DeKalb County records identify Publix Super Market #2142 at 1041 Mysterious Way and place the retail project at the construction-ready stage with a reported value of $4.2 million. Separate county planning material identifies NDM (EDENS), LLC as the Lulah Hills owner and developer, while an earlier January permit at the same address names VCC, LLC as contractor for a Publix canopy package.",
    matters: "The permit connects a nationally known grocer to a redevelopment of the former North DeKalb Mall site. County planning documents describe the broader plan as a roughly 75-acre mixed-use project with retail, office, hotel and residential components, so the store is one piece of a district-scale commercial reset rather than an isolated buildout.",
    unknown: "The reviewed records do not establish Publix’s public opening date, the final tenant roster, completion of every phase or whether the contractor on the canopy package controls the full store buildout.",
    next: "Watch for inspections, a certificate of occupancy, Publix location materials, EDENS construction updates and additional tenant announcements tied to the site.",
    sources: [
      { name: "DeKalb County permit report", detail: "January 2026 issued-permit report naming the 1041 Mysterious Way site, NDM EDENS LLC and VCC, LLC.", url: "https://www.dekalbcountyga.gov/sites/default/files/users/user3732/Permits%20Issued%20-%20Jan%202026.pdf" },
      { name: "DeKalb County planning application", detail: "Official Lulah Hills planning record identifying EDENS and the broader mixed-use program.", url: "https://www.dekalbcountyga.gov/sites/default/files/2025-08/2050%20Lawrenceville%20Hwy%20SLUP-25-1247734.pdf" },
      { name: "Urbanize Atlanta", detail: "Local reporting and site imagery documenting construction at the former mall property.", url: "https://atlanta.urbanize.city/post/north-dekalb-mall-lulah-hills-project-demo-construction" },
    ],
    timeline: [
      { date: "May 2022", title: "County approves the mixed-use framework", detail: "DeKalb County planning material records the rezoning that established the larger Lulah Hills redevelopment plan." },
      { date: "Jan. 26, 2026", title: "Publix canopy permit issued", detail: "The county permit report names 1041 Mysterious Way, NDM EDENS LLC and contractor VCC, LLC." },
      { date: "Aug. 7, 2026", title: "$4.2M store record enters the public file", detail: "ATLSignal qualifies the named Publix project as construction-ready while keeping the opening date unresolved." },
      { date: "Next", title: "Inspections and occupancy", detail: "The next decisive signals are inspections, occupancy records and first-party opening information." },
    ],
  },
  "residences-perimeter-summit-phase-b": {
    nutgraf: "A $15.24 million permit-stage record gives the Perimeter Center housing pipeline a concrete address, value and phase to follow.",
    whatChanged: "The reviewed DeKalb County record identifies Residences at Perimeter Summit — Phase B at 1251 Perimeter Summit Parkway, with a reported project value of $15,242,719. ATLSignal classifies the filing as construction-ready evidence, not proof that residents can occupy the building.",
    matters: "The Perimeter Summit address places the project inside one of metro Atlanta’s largest employment districts. New residential capacity there can affect commuting patterns, retail demand and the mix of uses around an office-heavy submarket, but those effects must be measured after delivery.",
    unknown: "The current record does not establish unit count, affordability mix, final delivery date, leasing start, general contractor or certificate-of-occupancy status.",
    next: "The next decisive records are inspection activity, later permit changes, owner or developer announcements, leasing materials and occupancy documentation.",
    sources: [{ name: "DeKalb Building Permit Applications", detail: "County permit dataset supporting the address, stage and reported construction value.", url: "https://dcgis.dekalbcountyga.gov/mapping/rest/services/Building_Permit_Applications/FeatureServer/0" }],
    timeline: [
      { date: "Aug. 7, 2026", title: "Phase B record qualified", detail: "The address and $15.24 million reported value clear ATLSignal’s public evidence threshold." },
      { date: "Next", title: "Delivery evidence", detail: "Inspections, leasing materials and occupancy documentation will determine whether the project advances from construction into use." },
    ],
  },
  "global-village-building-c-occupancy": {
    nutgraf: "An occupancy-stage record at 2135 Shamrock Drive marks a later and more operationally meaningful milestone than a permit application alone.",
    whatChanged: "DeKalb County evidence places Global Village Project, Building C at the occupancy stage and reports a $1.2 million value for the educational project. The named building and street address make this a trackable campus milestone rather than a generic construction signal.",
    matters: "Occupancy-stage movement suggests that a building has advanced beyond initial construction paperwork. For an education-oriented site, the practical follow-up is when and how the space enters use—not an assumption that a public opening has already occurred.",
    unknown: "The record does not by itself confirm the date students or staff begin using Building C, the permitted capacity, final inspection details or the complete funding and contractor picture.",
    next: "Watch the county inspection trail and first-party Global Village Project announcements for a use date, program details and confirmation of completed occupancy requirements.",
    sources: [{ name: "DeKalb Building Permit Applications", detail: "County evidence supporting the Building C address, occupancy-stage classification and reported value.", url: "https://dcgis.dekalbcountyga.gov/mapping/rest/services/Building_Permit_Applications/FeatureServer/0" }],
    timeline: [
      { date: "Aug. 7, 2026", title: "Building C reaches the occupancy file", detail: "ATLSignal records the named educational building, address and $1.2 million reported value as a later-stage milestone." },
      { date: "Next", title: "Operational confirmation", detail: "County inspection detail and first-party program announcements can establish when the building enters active use." },
    ],
  },
  "autozone-10982-interior-alteration": {
    nutgraf: "A named AutoZone interior alteration on Memorial Drive gives readers a specific retail buildout to follow without overstating when the location will open.",
    whatChanged: "DeKalb County records identify AutoZone #10982 at 6130 Memorial Drive as an interior-alteration project with a reported value of $548,572. The evidence supports active buildout at a named location; it does not establish that the store is already operating.",
    matters: "Named-tenant permits are stronger business signals than anonymous alterations because the operator and corridor are known. The record can anchor later reporting on the opening, hiring and effect on the surrounding retail cluster.",
    unknown: "ATLSignal has not confirmed an opening date, hiring schedule, landlord, project team or certificate of occupancy from the reviewed evidence.",
    next: "Watch for inspections, occupancy records, AutoZone’s location directory and first-party hiring or opening announcements tied to 6130 Memorial Drive.",
    sources: [{ name: "DeKalb Building Permit Applications", detail: "County permit dataset supporting the AutoZone name, address, alteration stage and reported value.", url: "https://dcgis.dekalbcountyga.gov/mapping/rest/services/Building_Permit_Applications/FeatureServer/0" }],
    timeline: [
      { date: "Aug. 7, 2026", title: "Named buildout qualified", detail: "The AutoZone number, Memorial Drive address and $548,572 alteration value enter ATLSignal’s reviewed business file." },
      { date: "Next", title: "Opening evidence", detail: "Inspections, occupancy records, hiring and AutoZone’s own location directory can establish operating timing." },
    ],
  },
  "douglas-county-janitorial-services": {
    nutgraf: "A countywide cleaning solicitation is both a public-spending story and a practical test of how much procurement context belongs in free coverage.",
    whatChanged: "The ATLSignal procurement record identifies a Douglas County solicitation for janitorial services across multiple locations and classifies it as open. The free report confirms the public opportunity while reserving ranked buyer-routing research for subscribers.",
    matters: "Multi-location facilities work can create recurring local service demand rather than a one-time construction expense. Douglas County’s purchasing guidance also says vendor registration is encouraged but is not required to submit a bid, a useful distinction for smaller firms evaluating the process.",
    unknown: "The publication record currently does not carry a verified closing date, complete facility list, contract term, award value or incumbent. Those details should not be inferred from the title alone.",
    next: "Prospective vendors should confirm the live posting and addenda with Douglas County Purchasing. ATLSignal will watch for a closing date, award notice and archived contract record.",
    sources: [
      { name: "Douglas County Purchasing FAQ", detail: "Official vendor-registration and bid-submission guidance.", url: "https://www.douglascountyga.gov/faq.aspx?TID=55" },
      { name: "Douglas County bid archive", detail: "Official archive used to track closed and awarded county opportunities.", url: "https://www.douglascountyga.gov/303/Awards-Archive" },
      { name: "ATLSignal procurement record", detail: "Canonical solicitation title and open-stage classification reviewed Aug. 7, 2026." },
    ],
    timeline: [
      { date: "Aug. 7, 2026", title: "Open solicitation qualified", detail: "ATLSignal publishes the multi-location janitorial opportunity after the procurement record clears review." },
      { date: "Next", title: "Addenda, closing and award", detail: "The county’s live posting and later award archive are the authoritative places to confirm the procurement outcome." },
    ],
  },
};

function storyDates(story: typeof leadStory) {
  const sourceDesk = Boolean(sourceDeskArticleDetails[story.slug]);
  return sourceDesk
    ? { publishedIso: "2026-08-08T10:20:00-04:00", modifiedIso: "2026-08-08T10:20:00-04:00", display: "August 8, 2026 · 10:20 AM ET" }
    : { publishedIso: "2026-08-07T08:10:00-04:00", modifiedIso: "2026-08-08T10:20:00-04:00", display: "August 7, 2026 · 8:10 AM ET" };
}

function articleContext(story: typeof leadStory, isLead: boolean): ArticleContext {
  if (priorityArticleDetails[story.slug]) return priorityArticleDetails[story.slug];
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
  return [...allStories.map(({ slug }) => ({ slug })), ...Object.keys(categoryNames).map((slug) => ({ slug })), ...Object.keys(informationPages).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (informationPages[slug]) return { title: informationPages[slug].title, description: informationPages[slug].dek, alternates: { canonical: absoluteUrl(`/${slug}`) } };
  if (categoryNames[slug]) return { title: categoryNames[slug], description: `${categoryNames[slug]} across the Atlanta commercial economy.`, alternates: { canonical: absoluteUrl(`/${slug}`) } };
  const story = allStories.find((item) => item.slug === slug);
  if (!story) return {};
  const dates = storyDates(story);
  return { title: story.headline, description: story.dek, alternates: { canonical: absoluteUrl(`/${story.slug}`) }, openGraph: { type: "article", title: story.headline, description: story.dek, publishedTime: dates.publishedIso, modifiedTime: dates.modifiedIso, images: [story.image.src] }, twitter: { card: "summary_large_image", title: story.headline, description: story.dek, images: [story.image.src] } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (informationPages[slug]) return <InformationPage slug={slug} />;
  if (categoryNames[slug]) return <CategoryLanding slug={slug} />;
  const story = allStories.find((item) => item.slug === slug);
  if (!story) notFound();
  const isLead = story.slug === leadStory.slug;
  const isSourceDeskStory = Boolean(sourceDeskArticleDetails[story.slug]);
  const context = articleContext(story, isLead);
  const dates = storyDates(story);
  const timelineEvents = context.timeline ?? (isLead ? [
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
  ]);
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: story.headline, description: story.dek, datePublished: dates.publishedIso, dateModified: dates.modifiedIso, author: { "@type": "Organization", name: "ATLSignal Desk" }, publisher: { "@type": "Organization", name: "ATLSignal" }, image: story.image.src };

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
          <div className="article-byline"><span>By ATLSignal Desk</span><time dateTime={dates.publishedIso}>{dates.display} · 5 min read</time></div>
          <ArticleActions title={story.headline} category={story.category} />
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
            <section><h2>Why it matters</h2><p>{context.matters}</p><p>The broader story is Atlanta’s fragmented information environment. Development activity often appears across county systems, city agendas, economic-development announcements, broker notes, developer sites and local coverage. ATLSignal connects those pieces into readable reporting instead of forcing readers to interpret raw records on their own.</p>{story.metric && <p className="article-number"><strong>{story.metric}</strong><span>{story.metricLabel}</span></p>}</section>
            <section><h2>What we do not know yet</h2><p>{context.unknown}</p></section>
            <section><h2>What happens next</h2><p>{context.next}</p></section>
            <section><SectionHeading label="Intelligence timeline" />
              <Timeline events={timelineEvents} />
            </section>
            <section><SectionHeading label="Sources" /><EvidenceList sources={context.sources} /><SourceAttribution>Public records, first-party sources and ATLSignal review. No contact intelligence is displayed.</SourceAttribution></section>
            <section className="article-update-history"><h2>Update history</h2>{isSourceDeskStory ? <p><strong>Aug. 8, 2026:</strong> Initial source-desk report published with evidence limits and follow-up questions.</p> : <><p><strong>Aug. 8, 2026:</strong> Source links, evidence limits and follow-up questions reviewed for publication.</p><p><strong>Aug. 7, 2026:</strong> Initial report published from the qualified ATLSignal evidence record.</p></>}</section>
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
          <div className="project-list category-list">{projects.map((project) => <ProjectCard key={project.slug} name={project.name} location={project.location} status={project.status} detail={project.detail} href={`/project/${project.slug}`} />)}</div>
        ) : match.length ? (
          <div className="category-list">{match.map((story, index) => <StoryCard key={story.slug} story={story} numbered={index + 1} />)}</div>
        ) : (
          <div className="category-empty"><p className="eyebrow">Evidence state</p><h2>No story cleared today’s public threshold.</h2><p>We found signals in this category, but none passed the current source, confidence and classification checks. The archive will populate when supported intelligence is approved.</p></div>
        )}
      </main>
    </>
  );
}

function InformationPage({ slug }: { slug: string }) {
  const page = informationPages[slug];
  return (
    <>
      <PublicationHeader market={atlanta} /><EditionHeader market={atlanta} />
      <main className="category-page shell institutional-page">
        <header className="category-hero"><p className="eyebrow">ATLSignal standards</p><Headline as="h1" size="large">{page.title}</Headline><p>{page.dek}</p></header>
        <div className="institutional-sections">{page.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</div>
      </main>
    </>
  );
}
