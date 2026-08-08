import Link from "next/link";
import { ArrowUpRight, Clock3, Search } from "lucide-react";
import type { MarketBrand } from "@/lib/market";
import { categories } from "@/lib/market";

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
};

export function PublicationHeader({ market }: { market: MarketBrand }) {
  return (
    <>
      <div className="utility-bar"><div className="shell utility-bar__inner"><span>{market.editionName}</span><span>Friday, August 7, 2026</span></div></div>
      <header className="publication-header">
        <div className="shell publication-header__main">
          <Link className="wordmark" href={`/${market.slug}`} aria-label={`${market.code} home`}>
            <span>{market.code}</span><small>{market.displayName} Intelligence</small>
          </Link>
          <nav aria-label="Primary navigation">
            {categories.map((category) => (
              <Link key={category} href={category === "Latest" ? `/${market.slug}` : `/${market.slug}/${category.toLowerCase()}`}>{category}</Link>
            ))}
          </nav>
          <div className="publication-header__actions">
            <Link className="icon-link" href={`/${market.slug}/search`} aria-label="Search"><Search size={18} strokeWidth={1.8} /></Link>
            <Link className="subscribe-link" href="#newsletter">Subscribe</Link>
          </div>
        </div>
      </header>
    </>
  );
}

export function EditionHeader({ market }: { market: MarketBrand }) {
  return <div className="edition-header shell"><p>{market.displayName} / Daily intelligence</p><span>{market.tagline}</span></div>;
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
      <StoryMeta story={story} />
      <Headline as="h1" size="lead"><Link href={`/atlanta/${story.slug}`}>{story.headline}</Link></Headline>
      <p className="lead-story__dek">{story.dek}</p>
      {story.metric && <div className="lead-story__metric"><strong>{story.metric}</strong><span>{story.metricLabel}</span></div>}
      <p className="why"><b>Why it matters:</b> This project is entering a stage where construction activity and operating decisions become visible across Atlanta’s commercial economy.</p>
    </article>
  );
}

export function StoryCard({ story, numbered }: { story: Story; numbered?: number }) {
  return (
    <article className="story-card">
      {numbered && <span className="story-card__number">{String(numbered).padStart(2, "0")}</span>}
      <div><StoryMeta story={story} /><Headline as="h3" size="small"><Link href={`/atlanta/${story.slug}`}>{story.headline}</Link></Headline><p>{story.dek}</p></div>
    </article>
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
  return <article className="opportunity-card"><div><CategoryLabel>Public opportunity</CategoryLabel><span>{timing}</span></div><h3>{title}</h3><p>{summary}</p><footer><span>{agency}</span><Link href="/atlanta/opportunities">View public details <ArrowUpRight size={14} /></Link></footer></article>;
}

export function MorningBrief({ stories }: { stories: Story[] }) {
  return <section className="morning-brief"><div className="morning-brief__heading"><span>ATLSignal / 08.07</span><h2>Atlanta Today</h2><p>The five-minute briefing.</p></div><div>{stories.map((story, index) => <StoryCard key={story.slug} story={story} numbered={index + 1} />)}</div></section>;
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
