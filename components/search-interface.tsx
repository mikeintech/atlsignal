"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type SearchItem = { title: string; summary: string; category: string; href: string; external?: boolean };

export function SearchInterface({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(needle));
  }, [items, query]);
  return <div className="search-interface"><label htmlFor="site-search">Search ATLSignal</label><input id="site-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search news, projects, businesses and guides" autoFocus /><p>{matches.length} results</p><div>{matches.map((item) => <article key={`${item.href}-${item.title}`}><span>{item.category}</span><h2>{item.external ? <a href={item.href} target="_blank" rel="noreferrer">{item.title}</a> : <Link href={item.href}>{item.title}</Link>}</h2><p>{item.summary}</p></article>)}</div></div>;
}
