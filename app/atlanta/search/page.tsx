import type { Metadata } from "next";
import { EditionHeader, Headline, PublicationHeader } from "@/components/publication";
import { SearchInterface, type SearchItem } from "@/components/search-interface";
import { atlanta } from "@/lib/market";
import { publicGuides } from "@/lib/atlanta-data";
import { searchContent } from "@/lib/content-index";

export const metadata: Metadata = { title: "Search", description: "Search ATLSignal intelligence and living project pages." };

const items: SearchItem[] = [
  ...searchContent.map((item) => ({ title: item.headline, summary: item.summary, category: item.category, href: item.href, external: item.external })),
  ...publicGuides.map((guide) => ({ title: guide.title, summary: guide.dek, category: guide.category, href: `/guides/${guide.slug}` })),
];

export default function SearchPage() {
  return <><PublicationHeader market={atlanta} /><EditionHeader market={atlanta} /><main className="search-page shell"><p className="eyebrow">Archive</p><Headline as="h1" size="large">Search ATLSignal</Headline><SearchInterface items={items} /></main></>;
}
