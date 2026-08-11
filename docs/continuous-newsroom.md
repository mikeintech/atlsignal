# ATLSignal Continuous Newsroom v1

## Operating loop

The GitHub Pages workflow runs at 11:15 and 20:15 UTC and on every push to
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

## Failure behavior

Invest Atlanta, BeltLine, ARC, and Atlanta Housing are critical. Under `STRICT_NEWSROOM=1`, a
failed or empty critical source stops deployment and makes the failed workflow
the operational alert. The previous deployed edition remains available.

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
