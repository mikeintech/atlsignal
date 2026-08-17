# ATLSignal Continuous Newsroom v1

## Operating loop

The GitHub Pages workflow runs at 11:15, 15:15, 19:15 and 23:15 UTC and on every push to
`main`. One run:

1. collects Invest Atlanta, Atlanta BeltLine, Atlanta Regional Commission, and
   Atlanta Housing;
2. reads a public news-search RSS feed for metadata from the configured Atlanta
   media and first-party coverage desks;
3. filters the discovery feed to Atlanta business, civic, development,
   transportation, housing, public-money, and hospitality subjects;
4. clusters similar headlines into a canonical event candidate;
5. assigns an evidence state and holds metadata-only discoveries for primary
   corroboration;
6. scores reader impact, novelty, timeliness, shareability, commercial context,
   evidence, and Atlanta locality;
7. writes a morning brief, afternoon update, and editorial queue to
   `data/newsroom.json`;
8. builds and deploys the static publication, then commits the source-health
   ledger for the next comparison.

## Publication boundary

- A first-party item is labeled `Primary-source report`; its publisher's claims
  are attributable, not treated as independently verified.
- A material claim becomes `Corroborated` only when at least two independent
  retrieved-content sources support the same event cluster.
- A media-search item contains headline, timestamp, outlet, and link metadata
  only. The publisher page is not crawled and the item remains
  `NEEDS_CORROBORATION`.
- No buyer contact, private submission route, subscriber-only field, or premium
  opportunity score is exported.
- The worker generates briefs and review candidates; it does not automatically
  create a full reported article from unreviewed discovery metadata.
- Discovery score and freshness never qualify a story for a permanent article
  on their own. A publication ID enters the permanent ledger only after a
  researched treatment is added to `lib/researched-desk-articles.ts` and the ID
  is added to the reviewed publication set in `scripts/run-newsroom.mjs`.

## Article review standard

A researched ATLSignal article must have:

1. a clear Atlanta news question rather than a rewritten source headline;
2. the original report plus a first-party record or another useful independent
   source whenever one exists;
3. concrete names, dates, locations and numbers checked against those links;
4. a story form chosen for the material—news, service, preview, feature or
   analysis—instead of a universal section template;
5. an original lede and paragraph-level synthesis that does not reproduce the
   source article's prose;
6. a relevant image with a photographer or organization credit, a source link
   and documented public-domain, Creative Commons, official promotional or
   reviewed editorial-use basis;
7. explicit archive language on expired weather, traffic and event information;
8. a permanent URL and update history when facts are likely to change.

If that standard is not met, the item stays in the editorial queue. It may be
linked as an attributed discovery, but the automation does not manufacture a
generic indexable article around it.

## Failure behavior

Invest Atlanta, BeltLine, ARC, and Atlanta Housing are critical. Under `STRICT_NEWSROOM=1`, the
workflow retries a failed sweep up to three times with a short backoff. A failed
or empty critical source after all three attempts stops deployment and makes the
failed workflow the operational alert. The previous deployed edition remains available.

The coverage search is non-critical because it is a discovery aid. A failed
search is recorded as `DISCOVERY_DEGRADED` for every affected desk, while the
primary-source cycle may still publish.

## Access policy

The source registry records tier, access state, acquisition method, request
caps, and crawl delay. AJC, Atlanta Business Chronicle, Urbanize Atlanta,
Rough Draft Atlanta, Axios Atlanta, Eater Atlanta, SaportaReport, What Now
Atlanta, and Bisnow are discovery/coverage desks. Their pages are not fetched by
the newsroom worker. Their content may enter reporting only through a linked,
attributed review and primary-source corroboration.
