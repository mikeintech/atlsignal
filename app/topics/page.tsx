import type { Metadata } from "next";
import Link from "next/link";
import { EditionHeader, Headline, PublicationHeader } from "@/components/publication";
import { contentForCategory } from "@/lib/content-index";
import { atlanta } from "@/lib/market";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Atlanta topics: transit, housing, food, events and public money",
  description: "Explore ATLSignal’s permanent Atlanta coverage hubs for transportation, housing, restaurants, events, sports, City Hall and public spending.",
  alternates: { canonical: absoluteUrl("/topics") },
};

const topics = [
  ["Things To Do", "/things-to-do", "Events, weekend plans and useful ways to experience Atlanta.", "Events & Things To Do"],
  ["Food & Drink", "/food", "Restaurant openings, hospitality moves and food reporting.", "Food, Retail & Hospitality"],
  ["Sports", "/sports", "Teams, venues and the business and culture around Atlanta sports.", "Atlanta Sports"],
  ["Housing", "/housing", "Housing programs, neighborhood change and residential development.", "Housing & Neighborhoods"],
  ["Transit", "/transit", "MARTA, airport, trail and mobility developments.", "Transportation & Airport"],
  ["City Hall", "/policy", "Government decisions affecting neighborhoods and daily life.", "City Hall & Policy"],
  ["Public Money", "/money", "Incentives, contracts and public investment shaping Atlanta.", "Public Money"],
] as const;

export default function TopicsPage() {
  return <><PublicationHeader market={atlanta} /><EditionHeader market={atlanta} /><main className="section-page shell"><header className="section-page__header"><p className="eyebrow">Explore ATLSignal</p><Headline as="h1" size="lead">Atlanta topics</Headline><p>Permanent pathways into ATLSignal’s reporting, source notes and attributed briefs.</p></header><div className="editorial-grid editorial-grid--three">{topics.map(([name, href, description, category]) => <article className="fact-box" key={href}><p className="eyebrow">{contentForCategory(category).length} reports and briefs</p><h2><Link href={href}>{name}</Link></h2><p>{description}</p><Link href={href}>Explore {name} →</Link></article>)}</div></main></>;
}
