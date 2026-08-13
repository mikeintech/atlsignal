import Link from "next/link";
import { ArrowUpRight, Clock3, Menu, Search } from "lucide-react";
import type { MarketBrand } from "@/lib/market";

export type StoryImageData = {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
  label: "Source image" | "Editorial image";
};

export type Story = {
  slug: string;
  category: string;
  headline: string;
  dek: string;
  timestamp: string;
  metric?: string;
  metricLabel?: string;
  confidence?: "Confirmed" | "Probable" | "Early signal";
  status?: string;
  publishedAt?: string;
  image: StoryImageData;
};

export type PublicationItem = {
  id: string;
  href: string;
  headline: string;
  summary: string;
  category: string;
  desk: "news" | "business" | "development" | "city-life" | "radar";
  treatment: string;
  evidenceLabel: string;
  publishedAt?: string;
  image?: StoryImageData;
  external?: boolean;
};

const primaryNav = [
  { label: "Latest", href: "/latest" },
  { label: "News", href: "/news" },
  { label: "Business", href: "/business" },
  { label: "Development", href: "/development" },
  { label: "City Life", href: "/city-life" },
  { label: "Guides", href: "/guides" },
  { label: "Radar", href: "/radar" },
];

export function PublicationHeader({ market }: { market: MarketBrand }) {
  const editionDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  return (
    <>
      <div className="utility-bar"><div className="shell utility-bar__inner"><span>Atlanta news, business, development & city life</span><span>{editionDate}</span></div></div>
      <header className="publication-header">
        <div className="shell publication-header__main">
          <Link className="wordmark" href="/" aria-label={`${market.code} home`}>
            <span>{market.code}</span><small>{market.displayName}<b>Independent publication</b></small>
          </Link>
          <nav aria-label="Primary navigation">
            {primaryNav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
          <div className="publication-header__actions">
            <Link className="icon-link" href="/search" aria-label="Search"><Search size={18} strokeWidth={1.8} /></Link>
            <Link className="subscribe-link" href="/#newsletter">Subscribe</Link>
            <span className="menu-indicator" aria-hidden="true"><Menu size={18} /></span>
          </div>
        </div>
      </header>
    </>
  );
}

export function EditionHeader({ market }: { market: MarketBrand }) {
  const topics = [
    ["Things To Do", "/things-to-do"],
    ["Food & Drink", "/food"],
    ["Sports", "/sports"],
    ["Housing", "/housing"],
    ["Transit", "/transit"],
    ["City Hall", "/policy"],
    ["Public Money", "/money"],
  ];
  return <div className="edition-header shell"><p>{market.displayName} / Independent local reporting</p><nav aria-label="Topic navigation">{topics.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></div>;
}

export function PublicationFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div><strong>ATLSignal</strong><p>Atlanta news and useful local intelligence built from reporting, records and visible source trails.</p></div>
        <nav aria-label="Publication information">
          <Link href="/about">About</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/masthead">Masthead</Link>
          <Link href="/corrections">Corrections</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/disclosures">Disclosures</Link>
          <Link href="/feed.xml">RSS</Link>
        </nav>
        <div className="site-footer__contact"><Link href="/about#newsroom-contact-form">Newsroom, corrections & tips</Link><Link href="/upgrade#founding-access-form">Founding access & partnerships</Link><span>Published by Mike · Independent · Atlanta, Georgia</span></div>
      </div>
    </footer>
  );
}

export function CategoryLabel({ children }: { children: React.ReactNode }) {
  return <p className="category-label">{children}</p>;
}

export function Headline({ children, as = "h2", size = "medium" }: { children: React.ReactNode; as?: "h1" | "h2" | "h3"; size?: "lead" | "large" | "medium" | "small" }) {
  const Tag = as;
  return <Tag className={`headline headline--${size}`}>{children}</Tag>;
}

export function UpdateBadge({ children = "Updated" }: { children?: React.ReactNode }) {
  return <span className="update-badge">{children}</span>;
}

export function ConfidenceIndicator({ level = "Confirmed" }: { level?: Story["confidence"] }) {
  return <span className={`confidence confidence--${level?.toLowerCase().replace(" ", "-")}`}><i aria-hidden="true" />{level}</span>;
}

export function StoryMeta({ story }: { story: Story }) {
  return <div className="story-meta"><CategoryLabel>{story.category}</CategoryLabel><span><Clock3 size={13} aria-hidden="true" />{story.timestamp}</span>{story.confidence && <ConfidenceIndicator level={story.confidence} />}</div>;
}

export function IntelligenceStory({ story }: { story: Story }) {
  return (
    <article className="lead-story">
      <StoryImage story={story} priority />
      <div className="lead-story__label"><StoryMeta story={story} /><span>5 min read</span></div>
      <Headline as="h1" size="lead"><Link href={`/${story.slug}`}>{story.headline}</Link></Headline>
      <p className="lead-story__dek">{story.dek}</p>
      {story.metric && <div className="lead-story__metric"><strong>{story.metric}</strong><span>{story.metricLabel}</span></div>}
      <p className="why"><b>Why it matters:</b> ATLSignal turns public records into readable local business coverage, separating confirmed facts from watchlist signals.</p>
    </article>
  );
}

export function StoryCard({ story, numbered }: { story: Story; numbered?: number }) {
  return (
    <article className={numbered ? "story-card story-card--numbered" : "story-card"}>
      {numbered && <span className="story-card__number">{String(numbered).padStart(2, "0")}</span>}
      <div className="story-card__content"><StoryImage story={story} compact /><StoryMeta story={story} /><Headline as="h3" size="small"><Link href={`/${story.slug}`}>{story.headline}</Link></Headline><p>{story.dek}</p><small>Read the evidence brief →</small></div>
    </article>
  );
}

export function PublicationCard({ item, numbered }: { item: PublicationItem; numbered?: number }) {
  const title = item.external
    ? <a href={item.href} target="_blank" rel="noreferrer">{item.headline}</a>
    : <Link href={item.href}>{item.headline}</Link>;
  return (
    <article className={numbered ? "story-card story-card--numbered" : "story-card"}>
      {numbered && <span className="story-card__number">{String(numbered).padStart(2, "0")}</span>}
      <div className="story-card__content">
        {item.image && <EditorialImage image={item.image} compact />}
        <div className="story-meta"><CategoryLabel>{item.category}</CategoryLabel><span>{item.treatment}</span></div>
        <Headline as="h3" size="small">{title}</Headline>
        <p>{item.summary}</p>
        <small>{item.external ? "Read original reporting ↗" : `${item.evidenceLabel} · Read report →`}</small>
      </div>
    </article>
  );
}

export function StoryImage({ story, compact = false, priority = false }: { story: Story; compact?: boolean; priority?: boolean }) {
  return <EditorialImage image={story.image} compact={compact} priority={priority} />;
}

export function EditorialImage({ image, compact = false, priority = false }: { image: StoryImageData; compact?: boolean; priority?: boolean }) {
  return (
    <figure className={compact ? "story-image story-image--compact" : "story-image"}>
      <img src={image.src} alt={image.alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
      <figcaption><span>{image.label}</span><a href={image.creditUrl}>Photo: {image.credit}</a></figcaption>
    </figure>
  );
}

export function Metric({ value, label, note }: { value: string; label: string; note?: string }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span>{note && <small>{note}</small>}</div>;
}

export function DataStrip({ metrics }: { metrics: Array<{ value: string; label: string; note?: string }> }) {
  return <section className="data-strip" aria-label="Atlanta by the numbers">{metrics.map((metric) => <Metric key={metric.label} {...metric} />)}</section>;
}

export function SectionHeading({ label, href }: { label: string; href?: string }) {
  return <div className="section-heading"><h2>{label}</h2>{href && <Link href={href}>View all <ArrowUpRight size={15} aria-hidden="true" /></Link>}</div>;
}

export function ProjectStatus({ children }: { children: React.ReactNode }) {
  return <span className="project-status"><i aria-hidden="true" />{children}</span>;
}

export function ProjectCard({ name, location, status, detail, href = "#" }: { name: string; location: string; status: string; detail: string; href?: string }) {
  return <article className="project-card"><div><ProjectStatus>{status}</ProjectStatus><h3><Link href={href}>{name}</Link></h3><p>{location}</p></div><strong>{detail}</strong></article>;
}

export function TrendCard({ kicker, title, value, change, note }: { kicker: string; title: string; value: string; change: string; note: string }) {
  return <article className="trend-card"><CategoryLabel>{kicker}</CategoryLabel><h3>{title}</h3><div><strong>{value}</strong><span>{change}</span></div><p>{note}</p></article>;
}

export function OpportunityCard({ title, agency, timing, summary }: { title: string; agency: string; timing: string; summary: string }) {
  return <article className="opportunity-card"><div><CategoryLabel>Public opportunity</CategoryLabel><span>{timing}</span></div><h3>{title}</h3><p>{summary}</p><footer><span>{agency}</span><Link href="/opportunities">View public details <ArrowUpRight size={14} /></Link></footer></article>;
}

export function MorningBrief({ stories }: { stories: Story[] }) {
  return <section className="morning-brief"><div className="morning-brief__heading"><span>ATLSignal / Daily file</span><h2>The latest briefing</h2><p>Five confirmed Atlanta signals for people following growth, openings, public spending and development.</p></div><div>{stories.map((story, index) => <StoryCard key={story.slug} story={story} numbered={index + 1} />)}</div></section>;
}

export function Timeline({ events }: { events: Array<{ date: string; title: string; detail: string }> }) {
  return <ol className="timeline">{events.map((event) => <li key={`${event.date}-${event.title}`}><time>{event.date}</time><div><h3>{event.title}</h3><p>{event.detail}</p></div></li>)}</ol>;
}

export function EvidenceList({ sources }: { sources: Array<{ name: string; detail: string; url?: string }> }) {
  return <ol className="evidence-list">{sources.map((source, index) => <li key={`${source.name}-${index}`}><span>{index + 1}</span><div><strong>{source.url ? <a href={source.url}>{source.name}</a> : source.name}</strong><p>{source.detail}</p></div></li>)}</ol>;
}

export function SourceAttribution({ children }: { children: React.ReactNode }) {
  return <p className="source-attribution">Source: {children}</p>;
}

export function Watchlist({ items }: { items: Array<{ title: string; summary: string }> }) {
  return <div className="watchlist">{items.map((item) => <article key={item.title}><CategoryLabel>Watchlist</CategoryLabel><h3>{item.title}</h3><p>{item.summary}</p></article>)}</div>;
}

export function CorrectionNotice({ children }: { children: React.ReactNode }) {
  return <aside className="correction-notice"><strong>Correction</strong><p>{children}</p></aside>;
}

export function MapPreview({ label = "Atlanta project area" }: { label?: string }) {
  return <div className="map-preview" role="img" aria-label={label}><span>ATLSignal</span><i /><b>Project location</b></div>;
}

export function PremiumTeaser({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={compact ? "premium-teaser premium-teaser--compact" : "premium-teaser"}>
      <p className="eyebrow">Upgrade signal</p>
      <h2>Free readers get the story. Subscribers get the route.</h2>
      <p>Premium keeps the commercial layer private: timing scores, buyer paths, operator enrichment, contact-route research and daily watch changes.</p>
      <Link href="/upgrade">See the tiers <ArrowUpRight size={14} /></Link>
    </aside>
  );
}
