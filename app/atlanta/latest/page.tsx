import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CategoryLabel,
  EditionHeader,
  EditorialImage,
  Headline,
  PremiumTeaser,
  PublicationHeader,
  SectionHeading,
} from "@/components/publication";
import { NewsletterSignup } from "@/components/newsletter-signup";
import newsroomData from "@/data/newsroom.json";
import { dailyEditionStats, dailyPosts, editionDateLabel, type DailyPost } from "@/lib/daily-edition";
import { atlanta } from "@/lib/market";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Latest Atlanta news and city updates",
  description: "Twenty fresh, developing and archive-backed ATLSignal posts on Atlanta news, business, development, events, food, sports and public life.",
  alternates: { canonical: absoluteUrl("/latest") },
};

function LeadPost({ post }: { post: DailyPost }) {
  const title = post.external
    ? <a href={post.href} target="_blank" rel="noreferrer">{post.headline}</a>
    : <Link href={post.href}>{post.headline}</Link>;
  return (
    <article className="daily-lead-card">
      <EditorialImage image={post.image} compact />
      <div className="daily-post-meta"><CategoryLabel>{post.treatment} · {post.category}</CategoryLabel><span>{post.evidenceLabel}</span></div>
      <h2>{title}</h2>
      <p>{post.dek}</p>
      {post.external
        ? <a className="daily-post-link" href={post.href} target="_blank" rel="noreferrer">Read original report <ArrowUpRight size={14} aria-hidden="true" /></a>
        : <Link className="daily-post-link" href={post.href}>Read report <ArrowUpRight size={14} aria-hidden="true" /></Link>}
    </article>
  );
}

function DailyRow({ post, index }: { post: DailyPost; index: number }) {
  const title = post.external
    ? <a href={post.href} target="_blank" rel="noreferrer">{post.headline}</a>
    : <Link href={post.href}>{post.headline}</Link>;
  return (
    <article className="daily-feed-row">
      <span className="daily-feed-row__number">{String(index).padStart(2, "0")}</span>
      <div>
        <div className="daily-post-meta"><CategoryLabel>{post.treatment} · {post.category}</CategoryLabel><span>Source dated {post.sourceDate}</span></div>
        <h2>{title}</h2>
        <p>{post.dek}</p>
      </div>
      {post.external
        ? <a className="daily-feed-row__arrow" href={post.href} target="_blank" rel="noreferrer" aria-label={`Read ${post.headline} at its original source`}><ArrowUpRight size={18} /></a>
        : <Link className="daily-feed-row__arrow" href={post.href} aria-label={`Read ${post.headline}`}><ArrowUpRight size={18} /></Link>}
    </article>
  );
}

export default function LatestPage() {
  const leadPosts = dailyPosts.slice(0, 5);
  const morePosts = dailyPosts.slice(5);
  const generatedAt = new Date(newsroomData.generatedAt).valueOf();
  const checking = newsroomData.clusters.filter((cluster) =>
    !cluster.publishable
    && cluster.sources[0]?.url
    && cluster.scores.locality >= 70
    && new Date(cluster.publishedAt).valueOf() <= generatedAt + 12 * 3_600_000,
  ).slice(0, 5);
  const refreshed = new Date(newsroomData.generatedAt).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <PublicationHeader market={atlanta} />
      <EditionHeader market={atlanta} />
      <main className="latest-page shell">
        <header className="latest-hero">
          <div>
            <p className="eyebrow">The daily file · {editionDateLabel}</p>
            <Headline as="h1" size="large">Atlanta is always moving. Here are the 20 signals that matter today.</Headline>
            <p>New reporting leads the page. Developing stories and useful archive finds fill out the wider picture—each with a visible evidence boundary.</p>
          </div>
          <dl className="latest-hero__stats">
            <div><dt>Today’s file</dt><dd>{dailyEditionStats.total}</dd></div>
            <div><dt>New today</dt><dd>{dailyEditionStats.newToday}</dd></div>
            <div><dt>Developing</dt><dd>{dailyEditionStats.developing}</dd></div>
            <div><dt>Revisited</dt><dd>{dailyEditionStats.archive}</dd></div>
          </dl>
        </header>

        <section>
          <SectionHeading label="Today’s biggest stories" />
          <div className="daily-lead-grid">{leadPosts.map((post) => <LeadPost key={post.id} post={post} />)}</div>
        </section>

        <section>
          <SectionHeading label={`${morePosts.length} more in today’s file`} />
          <p className="latest-intro">The daily file mixes current developments with deliberately resurfaced reporting. “From the archive” means the underlying event is older—not that ATLSignal is presenting it as new.</p>
          <div className="daily-feed">{morePosts.map((post, index) => <DailyRow key={post.id} post={post} index={index + 6} />)}</div>
        </section>

        {checking.length > 0 && <section className="checking-desk">
          <SectionHeading label="What we’re checking" />
          <p className="latest-intro">These current headlines are discovery leads, not ATLSignal-confirmed reports. They stay outside the daily 20 until a primary record or corroborating source clears the evidence threshold.</p>
          <div className="checking-grid">{checking.map((item) => <article key={item.id}><CategoryLabel>Unverified discovery · {item.category}</CategoryLabel><h2><a href={item.sources[0].url} target="_blank" rel="noreferrer">{item.headline}</a></h2><small>{item.sources[0].name} · source desk</small></article>)}</div>
        </section>}

        <section className="reader-standard">
          <p className="eyebrow">Publishing rhythm</p>
          <h2>Four source sweeps. Twenty public posts. One clear hierarchy.</h2>
          <p>The engine checks Atlanta sources throughout the day, promotes verified items into short source notes, expands the biggest stories into full reports and rotates older work back into view when it adds context. Source desk refreshed {refreshed} ET.</p>
        </section>

        <PremiumTeaser />
        <NewsletterSignup compact />
      </main>
    </>
  );
}
