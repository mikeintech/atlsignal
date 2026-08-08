import type { Metadata } from "next";
import { EditionHeader, Headline, PublicationHeader } from "@/components/publication";
import { SearchInterface, type SearchItem } from "@/components/search-interface";
import { atlanta } from "@/lib/market";
import { leadStory, projects, stories } from "@/lib/atlanta-data";

export const metadata: Metadata = { title: "Search", description: "Search ATLSignal intelligence and living project pages." };

const items: SearchItem[] = [leadStory, ...stories].map((story) => ({ title: story.headline, summary: story.dek, category: story.category, href: `/${story.slug}` })).concat(projects.map((project) => ({ title: project.name, summary: `${project.location} · ${project.status} · ${project.detail}`, category: "Project", href: `/project/${project.slug}` })));

export default function SearchPage() {
  return <><PublicationHeader market={atlanta} /><EditionHeader market={atlanta} /><main className="search-page shell"><p className="eyebrow">Archive</p><Headline as="h1" size="large">Search ATLSignal</Headline><SearchInterface items={items} /></main></>;
}
