import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "config", "newsroom-sources.json");
const outputPath = path.join(root, "data", "newsroom.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
const now = new Date(process.env.NEWSROOM_NOW || Date.now());
const nowIso = now.toISOString();
const delayScale = Number(process.env.NEWSROOM_REQUEST_DELAY_SCALE ?? "1");
const strict = process.env.STRICT_NEWSROOM === "1";

const previous = await readJson(outputPath, {
  items: [],
  clusters: [],
  generatedAt: null,
});
const previousItems = new Map(previous.items.map((item) => [item.id, item]));
const userAgent = "ATLSignalNewsroom/1.0 (+https://atlsignal.com/about)";

function errorMessage(error) {
  return (error instanceof Error ? error.message : String(error)).slice(0, 240);
}

const STOP_WORDS = new Set(
  "a an and are as at be by for from has have in into is it its new of on or that the their this to with atlanta georgia announces announced report reports says said update updates latest city county regional commission beltline".split(" "),
);

const CATEGORY_RULES = [
  ["Events & Things To Do", /\b(events?|weekend|festival|concert|live show|performance|theater|theatre|nightlife|free admission)\b/i],
  ["Arts & Culture", /\b(arts?|culture|museum|exhibition|gallery|film|music|dance|book|author)\b/i],
  ["Atlanta Sports", /\b(sports?|football|falcons|braves|hawks|dream|atlanta united|game|match|season)\b/i],
  ["Public Safety", /\b(public safety|police|fire|shooting|crash|arrest|missing|jail|crime)\b/i],
  ["Weather & City Life", /\b(weather|heat|storm|traffic|closure|commute)\b/i],
  ["Transportation & Airport", /\b(transit|marta|airport|aviation|road|bridge|trail|mobility|bus|rail|transportation)\b/i],
  ["Food, Retail & Hospitality", /\b(restaurant|steakhouse|chef|dining|sushi|cuisine|menu|retail|hotel|food|store|cafe|bar|brewery|hospitality|tenant|boutique|pop-up|merchant|market)\b/i],
  ["Housing & Neighborhoods", /\b(housing|homes?|apartments?|residential|neighborhood|affordable|units?)\b/i],
  ["Public Money", /\b(budget|grant|funding|financing|bond|tax|million|billion|contract|procurement)\b/i],
  ["Development & Infrastructure", /\b(construction|development|project|build|renovation|infrastructure|groundbreaking)\b/i],
  ["Workforce & Economy", /\b(jobs?|workforce|economy|economic|employment|headquarters|expansion|investment)\b/i],
  ["City Hall & Policy", /\b(mayor|council|ordinance|policy|zoning|planning|board|authority)\b/i],
  ["Business Moves", /\b(company|business|lease|opens?|opening|relocat|acqui|merger)\b/i],
];

const EVENT_RULES = [
  ["EVENT", /\b(events?|festival|concert|show|theater|game|match|exhibition)\b/i],
  ["OPENING", /\b(opens?|opening|ribbon cutting|launches?)\b/i],
  ["CONSTRUCTION", /\b(construction|groundbreaking|breaks ground|buildout|build-out)\b/i],
  ["APPROVAL", /\b(approves?|approved|adopts?|green light)\b/i],
  ["FINANCING", /\b(financ|funding|grant|loan|budget|bond)\w*\b/i],
  ["LEASE", /\b(lease|leased|leasing)\b/i],
  ["HIRING", /\b(hiring|jobs?|workforce|employees?)\b/i],
  ["MILESTONE", /\b(completes?|completed|milestone|delivers?|expands?|expansion)\b/i],
];

const DESK_BRIEF_SEED_IDS = new Set([
  "79f8e0f643ac8506808c",
  "97b180015bc3b56bb362",
  "c61cfffb32cfa4acc526",
  "22fbec87ba014f4cfa48",
  "697c18f6c4bd463bd665",
  "350e308a24e5a0326f80",
  "235ccc286834bd8d8cd5",
  "ef1eba9dded0a816c69d",
  "1ad1b99ddd21f51d8343",
  "7fc6191bac887aec8cfe",
  "f30475f47eb731195efe",
  "e2b73db7ea6222a917b2",
  "02f75aca84321697156f",
]);
const DESK_BRIEF_CATEGORIES = new Set([
  "Atlanta Sports", "Events & Things To Do", "Food, Retail & Hospitality",
  "Weather & City Life", "Transportation & Airport", "Housing & Neighborhoods",
  "Development & Infrastructure", "Workforce & Economy", "Business Moves",
]);
const DESK_BRIEF_UNSAFE = /\b(accused|alleged|arrested|assault|charged?|criminal|death|dies|died|execution|fatal|fires?|funeral|fugitive|indicted|investigation|killed|lawsuit|missing|murder|police|settlement|shooting|shots?|stabbing|suspect|victim)\b/i;
const DESK_BRIEF_DERIVATIVE = /\b(interview|review|opinion|column|ranking)\b/i;
const DESK_BRIEF_EXISTING = /\bMARTA\b.*\b(CEO|general manager)\b/i;
const DESK_BRIEF_SLUG_OVERRIDES = {
  "350e308a24e5a0326f80": "atlanta-falcons-2026-preseason-schedule-how-to-watch",
  "697c18f6c4bd463bd665": "visionary-justice-storylab-atlanta-film-screening-2026",
  "22fbec87ba014f4cfa48": "i-285-weekend-closure-southwest-fulton-2026",
  "c61cfffb32cfa4acc526": "atlanta-georgia-heat-advisory-109-degrees",
};

function deskBriefHeadlineKey(value) {
  return cleanText(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function deskBriefSlug(cluster) {
  return DESK_BRIEF_SLUG_OVERRIDES[cluster.id] || deskBriefHeadlineKey(cluster.headline).replaceAll(" ", "-").slice(0, 82).replace(/-+$/g, "");
}

function deskBriefBaseSafe(cluster) {
  const text = `${cluster.headline} ${cluster.summary}`;
  return !cluster.publishable
    && DESK_BRIEF_CATEGORIES.has(cluster.category)
    && cluster.sourceTier === "B"
    && cluster.sources[0]?.retrievedContent === true
    && cleanText(cluster.summary).length >= 85
    && cluster.scores.locality >= 55
    && !DESK_BRIEF_UNSAFE.test(text)
    && !DESK_BRIEF_DERIVATIVE.test(cluster.headline)
    && !DESK_BRIEF_EXISTING.test(cluster.headline);
}

function deskBriefFreshEligible(cluster) {
  const age = now.valueOf() - new Date(cluster.publishedAt).valueOf();
  return deskBriefBaseSafe(cluster)
    && cluster.scores.total >= 52
    && cluster.scores.timeliness >= 90
    && age >= -12 * 3_600_000
    && age <= 48 * 3_600_000;
}

function hash(value) {
  return createHash("sha256").update(String(value)).digest("hex").slice(0, 20);
}

async function readJson(filename, fallback) {
  try {
    return JSON.parse(await readFile(filename, "utf8"));
  } catch {
    return fallback;
  }
}

function sleep(ms) {
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms * delayScale)) : Promise.resolve();
}

function decodeEntities(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function cleanText(value = "") {
  return decodeEntities(
    String(value)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function safeDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? null : parsed.toISOString();
}

async function fetchText(url, accept = "text/html,*/*", { retry429 = false } = {}) {
  for (let attempt = 0; attempt <= (retry429 ? 1 : 0); attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch(url, {
        headers: { Accept: accept, "User-Agent": userAgent },
        redirect: "follow",
        signal: controller.signal,
      });
      if (response.status === 429 && retry429 && attempt === 0) {
        await sleep(6500);
        continue;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { text: await response.text(), status: response.status, url: response.url };
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error("Request retry exhausted");
}

function metaValue(html, key) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = Object.fromEntries(
      [...tag.matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [match[1].toLowerCase(), decodeEntities(match[2])]),
    );
    if (attrs.property?.toLowerCase() === key.toLowerCase() || attrs.name?.toLowerCase() === key.toLowerCase()) {
      return attrs.content?.trim() || "";
    }
  }
  return "";
}

function pageMetadata(html, url, fallbackDate) {
  const jsonLd = [];
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      jsonLd.push(...(Array.isArray(parsed) ? parsed : [parsed]), ...((parsed && parsed["@graph"]) || []));
    } catch {
      // Malformed publisher JSON-LD should not discard otherwise usable metadata.
    }
  }
  const article = jsonLd.find((entry) => /Article|NewsArticle|BlogPosting/i.test(String(entry?.["@type"] || ""))) || {};
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = cleanText(article.headline || metaValue(html, "og:title") || titleMatch?.[1] || titleFromUrl(url)).split(/\s+[|–—-]\s+/)[0].trim();
  const description = cleanText(article.description || metaValue(html, "description") || metaValue(html, "og:description")).slice(0, 700);
  const publishedAt = safeDate(article.datePublished || metaValue(html, "article:published_time") || fallbackDate);
  const image = Array.isArray(article.image) ? article.image[0] : typeof article.image === "object" ? article.image?.url : article.image;
  return { title, summary: description, publishedAt, imageUrl: image || metaValue(html, "og:image") || null };
}

function titleFromUrl(url) {
  const slug = new URL(url).pathname.replace(/\/$/, "").split("/").pop() || "Update";
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function xmlBlocks(xml, tag) {
  return [...xml.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "gi"))].map((match) => match[1]);
}

function xmlValue(block, tag) {
  const match = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i"));
  return match ? decodeEntities(match[1].trim()) : "";
}

function allowedUrl(source, url) {
  const pathname = new URL(url).pathname;
  if (!(source.allowedPaths || []).some((part) => pathname.includes(part))) return false;
  return !(source.excludedPaths || []).some((part) => pathname.replace(/\/$/, "") === part.replace(/\/$/, ""));
}

function makeItem(source, values) {
  const prior = previousItems.get(hash(`${source.sourceId}|${values.url}`));
  const publishedAt = safeDate(values.publishedAt) || safeDate(values.updatedAt) || nowIso;
  const text = `${values.title}. ${values.summary || ""}`;
  return {
    id: hash(`${source.sourceId}|${values.url}`),
    sourceId: source.sourceId,
    sourceName: source.name,
    sourceTier: source.tier,
    sourceClass: source.sourceClass || "first_party",
    sourceCategory: source.category || "Atlanta News",
    discoveryLane: values.discoveryLane || null,
    acquisition: values.acquisition || source.collector,
    claimBoundary: values.claimBoundary || "publisher_attribution_only",
    title: cleanText(values.title),
    summary: cleanText(values.summary || "").slice(0, 700),
    url: values.url,
    publisherUrl: values.publisherUrl || source.sourceUrl || null,
    publishedAt,
    updatedAt: safeDate(values.updatedAt) || publishedAt,
    imageUrl: values.imageUrl || null,
    contentHash: hash(`${text}|${publishedAt}`),
    retrievedContent: values.retrievedContent === true,
    firstSeenAt: prior?.firstSeenAt || nowIso,
    lastSeenAt: nowIso,
  };
}

async function collectInvestAtlanta(source) {
  const endpoint = new URL(source.endpoint);
  endpoint.searchParams.set("year", String(now.getUTCFullYear()));
  const response = await fetchText(endpoint, "application/json", { retry429: true });
  const payload = JSON.parse(response.text);
  if (!Array.isArray(payload.result)) throw new Error("Invest Atlanta response has no result list");
  return payload.result
    .filter((row) => row?.id && row?.title && row?.filename)
    .sort((a, b) => String(b.published_date || "").localeCompare(String(a.published_date || "")))
    .slice(0, source.maxItems)
    .map((row) =>
      makeItem(source, {
        title: row.title,
        summary: cleanText(row.promo_description || row.content || ""),
        url: `https://www.investatlanta.com/impact-insights/${row.filename}`,
        publishedAt: row.published_date,
        updatedAt: row.updated_at,
        imageUrl: row.featured_image?.filename_hash
          ? `https://www.investatlanta.com/uploads/resources/${row.featured_image.filename_hash}`
          : null,
        retrievedContent: true,
      }),
    );
}

async function collectSitemap(source) {
  let requests = 0;
  const rootResponse = await fetchText(source.endpoint, "application/xml,text/xml,*/*");
  requests += 1;
  let urlBlocks = xmlBlocks(rootResponse.text, "url");

  if (source.collector === "sitemap_index") {
    const sitemapUrls = xmlBlocks(rootResponse.text, "sitemap")
      .map((block) => xmlValue(block, "loc"))
      .filter((url) => (source.allowedSitemaps || []).some((marker) => url.includes(marker)));
    urlBlocks = [];
    for (const sitemapUrl of sitemapUrls) {
      if (requests >= source.maxRequests) break;
      await sleep(source.requestDelayMs);
      const child = await fetchText(sitemapUrl, "application/xml,text/xml,*/*");
      requests += 1;
      urlBlocks.push(...xmlBlocks(child.text, "url"));
    }
  }

  const entries = urlBlocks
    .map((block) => ({ url: xmlValue(block, "loc"), lastmod: xmlValue(block, "lastmod") }))
    .filter((entry) => entry.url && allowedUrl(source, entry.url))
    .sort((a, b) => String(b.lastmod).localeCompare(String(a.lastmod)))
    .slice(0, source.maxItems);

  const items = [];
  for (const entry of entries) {
    let metadata = { title: titleFromUrl(entry.url), summary: "", publishedAt: safeDate(entry.lastmod), imageUrl: null };
    let retrievedContent = false;
    if (requests < source.maxRequests) {
      await sleep(source.requestDelayMs);
      try {
        const page = await fetchText(entry.url);
        requests += 1;
        metadata = pageMetadata(page.text, entry.url, entry.lastmod);
        retrievedContent = true;
      } catch {
        requests += 1;
      }
    }
    items.push(
      makeItem(source, {
        ...metadata,
        url: entry.url,
        updatedAt: entry.lastmod,
        retrievedContent,
      }),
    );
  }
  return items;
}

async function collectRss(source) {
  const response = await fetchText(source.endpoint, "application/rss+xml,application/xml,text/xml,*/*", { retry429: true });
  return xmlBlocks(response.text, "item").slice(0, source.maxItems).flatMap((block) => {
    const title = xmlValue(block, "title");
    const link = xmlValue(block, "link");
    if (!title || !link) return [];
    let canonicalUrl = link;
    try {
      const parsed = new URL(link);
      for (const key of [...parsed.searchParams.keys()]) {
        if (key.startsWith("utm_")) parsed.searchParams.delete(key);
      }
      canonicalUrl = parsed.toString();
    } catch {
      // Keep the publisher-provided link when it cannot be normalized.
    }
    const item = makeItem(source, {
      title,
      summary: cleanText(xmlValue(block, "description") || xmlValue(block, "content:encoded")),
      url: canonicalUrl,
      publishedAt: xmlValue(block, "pubDate"),
      updatedAt: xmlValue(block, "pubDate"),
      acquisition: "official_rss",
      retrievedContent: true,
    });
    if (source.localOnly && !isLocallyRelevant({ title: item.title, sourceUrl: item.publisherUrl }, source)) return [];
    return [item];
  });
}

function sourceForDomain(hostname) {
  const host = hostname.replace(/^www\./, "");
  return config.discoverySources.find((source) => host === source.domain || host.endsWith(`.${source.domain}`));
}

function isLocallyRelevant(article, source) {
  const haystack = `${article.title || ""} ${article.sourceUrl || ""}`;
  const local = /\b(atlanta|georgia|fulton|dekalb|cobb|gwinnett|buckhead|midtown|alpharetta|marietta|decatur|sandy springs|marta|beltline)\b/i.test(haystack);
  const outsideMarket = /\b(alabama|denver|miami|nashville|charlotte|birmingham|savannah|macon|augusta|columbus|jacksonville)\b/i.test(article.title || "");
  if (local) return true;
  return !outsideMarket && ["ajc", "rough_draft_atlanta", "saporta_report", "urbanize_atlanta", "eater_atlanta"].includes(source.sourceId);
}

function isNewsworthyDiscovery(title) {
  if (/\b(archives?|obituaries?|lottery numbers?|horoscope)\b/i.test(title)) return false;
  return /\b(business|company|development|construction|housing|apartment|real estate|restaurant|retail|store|opening|opens|lease|office|jobs?|employment|economy|transit|marta|airport|infrastructure|budget|council|policy|zoning|permit|contract|funding|investment|bank|healthcare|hospital|hotel|data center|warehouse|tower|property|foreclosure|university|school|neighborhood|events?|weekend|festival|concert|show|theater|museum|arts?|culture|music|nightlife|free|sports?|football|falcons|braves|hawks|dream|united|game|traffic|weather|restaurant|dining|food|bar|cafe|brewery|public safety|police|fire|election)\b/i.test(title);
}

function stripOutletSuffix(title, sourceName) {
  const suffixes = [sourceName, "Atlanta Business Chronicle", "AJC.com", "Rough Draft Atlanta", "Urbanize Atlanta", "Axios Atlanta", "Eater Atlanta", "SaportaReport", "What Now Atlanta", "Bisnow Atlanta"].filter(Boolean);
  let cleaned = title;
  for (const suffix of suffixes) {
    if (cleaned.toLowerCase().endsWith(` - ${suffix.toLowerCase()}`)) cleaned = cleaned.slice(0, -(` - ${suffix}`).length);
  }
  return cleaned.trim();
}

async function collectDiscoveryMetadata() {
  const provider = config.discoveryProvider;
  const lanes = provider.lanes?.length ? provider.lanes : [{ id: "news", query: "(Atlanta OR Fulton OR DeKalb OR Cobb OR Gwinnett)" }];
  const batchSize = provider.sourceBatchSize || config.discoverySources.length;
  const sourceBatches = Array.from({ length: Math.ceil(config.discoverySources.length / batchSize) }, (_, index) =>
    config.discoverySources.slice(index * batchSize, (index + 1) * batchSize),
  );
  const discovered = [];
  let requestIndex = 0;
  for (const lane of lanes) {
    for (const sourceBatch of sourceBatches) {
      if (requestIndex) await sleep(provider.requestDelayMs || 0);
      requestIndex += 1;
      const domainQuery = sourceBatch.map((source) => `site:${source.domain}`).join(" OR ");
      const endpoint = new URL(provider.endpoint);
      endpoint.searchParams.set("q", `${lane.query} when:${provider.timespan} (${domainQuery})`);
      endpoint.searchParams.set("hl", "en-US");
      endpoint.searchParams.set("gl", "US");
      endpoint.searchParams.set("ceid", "US:en");
      const response = await fetchText(endpoint, "application/rss+xml,application/xml,text/xml,*/*", { retry429: true });
      discovered.push(...xmlBlocks(response.text, "item").slice(0, provider.maxRecords).flatMap((block) => {
    const sourceMatch = block.match(/<source[^>]+url=["']([^"']+)["'][^>]*>([\s\S]*?)<\/source>/i);
    const article = {
      title: xmlValue(block, "title"),
      url: xmlValue(block, "link"),
      seendate: xmlValue(block, "pubDate"),
      sourceUrl: sourceMatch?.[1] || "",
      sourceName: cleanText(sourceMatch?.[2] || ""),
    };
    let parsed;
    try {
      parsed = new URL(article.sourceUrl);
    } catch {
      return [];
    }
    const source = sourceForDomain(parsed.hostname);
    const title = stripOutletSuffix(article.title, article.sourceName);
    if (!source || !title || !isLocallyRelevant({ ...article, title }, source) || !isNewsworthyDiscovery(title)) return [];
    return [
      makeItem(source, {
        title,
        summary: "",
        url: article.url,
        publishedAt: article.seendate,
        updatedAt: article.seendate,
        acquisition: "google_news_rss_metadata",
        discoveryLane: lane.id,
        claimBoundary: "discovery_only_no_publisher_retrieval",
        publisherUrl: article.sourceUrl,
        retrievedContent: false,
      }),
    ];
      }));
    }
  }
  return [...new Map(discovered.map((item) => [item.id, item])).values()];
}

function tokens(value) {
  return new Set(
    cleanText(value)
      .toLowerCase()
      .replace(/[^a-z0-9$]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  );
}

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  const overlap = [...a].filter((token) => b.has(token)).length;
  return overlap / Math.min(a.size, b.size);
}

function categoryFor(text, fallback = "Atlanta News") {
  return CATEGORY_RULES.find(([, rule]) => rule.test(text))?.[0] || fallback;
}

function eventFor(text) {
  return EVENT_RULES.find(([, rule]) => rule.test(text))?.[0] || "UPDATE";
}

function ageHours(date) {
  return Math.max(0, (now.valueOf() - new Date(date).valueOf()) / 3_600_000);
}

function scoreCluster(cluster, wasKnown) {
  const text = `${cluster.headline} ${cluster.summary}`;
  const hours = ageHours(cluster.publishedAt);
  const timeliness = Math.round(Math.max(20, 100 - hours / 2.4));
  const novelty = wasKnown ? 35 : 92;
  const impactSignals = (text.match(/\b(million|billion|jobs?|housing|transit|airport|budget|construction|investment|neighborhoods?|businesses?)\b/gi) || []).length;
  const impact = Math.min(100, 48 + impactSignals * 8 + (cluster.sourceTier === "A" ? 8 : 0));
  const shareSignals = (text.match(/\b(first|largest|new|opens?|major|million|billion|deadline|free)\b/gi) || []).length + (/\d/.test(text) ? 1 : 0);
  const shareability = Math.min(100, 42 + shareSignals * 8);
  const commercialSignals = (text.match(/\b(business|contract|construction|development|lease|jobs?|investment|retail|restaurant|hotel|funding)\b/gi) || []).length;
  const commercial = Math.min(100, 38 + commercialSignals * 9);
  const evidence = cluster.corroboration.status === "CORROBORATED" ? 100 : cluster.corroboration.status === "ATTRIBUTED_PRIMARY" ? 84 : 35;
  const localSignals = (text.match(/\b(atlanta|fulton|dekalb|cobb|gwinnett|buckhead|midtown|downtown|beltline|marta|airport)\b/gi) || []).length;
  const locality = Math.min(100, 45 + localSignals * 14);
  const formatPenalty = /\b(trip|conference|in review|roundup|class|cohort)\b/i.test(cluster.headline) ? 10 : 0;
  const total = Math.round((impact * 0.25 + novelty * 0.15 + timeliness * 0.17 + shareability * 0.13 + commercial * 0.07 + evidence * 0.1 + locality * 0.13 - formatPenalty) * 100) / 100;
  return { total, impact, novelty, timeliness, shareability, commercial, evidence, locality };
}

function whyItMatters(category) {
  const reasons = {
    "Transportation & Airport": "Changes to Atlanta's transportation network affect daily access, development patterns and the regional economy.",
    "Housing & Neighborhoods": "Housing supply, affordability and neighborhood investment shape who can remain in Atlanta and where growth lands.",
    "Public Money": "Public dollars reveal Atlanta's priorities and create measurable commitments that can be checked over time.",
    "Food, Retail & Hospitality": "Openings and tenant moves show where consumer demand and neighborhood commercial activity are changing.",
    "Development & Infrastructure": "Major projects change the built environment, nearby business conditions and the timing of future activity.",
    "Workforce & Economy": "Jobs and investment decisions provide an early reading on Atlanta's economic direction.",
    "City Hall & Policy": "Public decisions can change costs, access, development rights and services across the city.",
    "Business Moves": "Company openings, leases and expansions show where business confidence and local demand are forming.",
    "Events & Things To Do": "A reliable city calendar helps Atlantans decide where to spend their time and money now.",
    "Arts & Culture": "Atlanta's cultural calendar reveals the people, institutions and neighborhood activity shaping the city.",
    "Atlanta Sports": "Games and team developments affect travel, gatherings and the shared rhythm of the region.",
    "Weather & City Life": "Timely practical information helps Atlantans navigate the city safely and efficiently.",
    "Public Safety": "Verified public-safety developments can affect neighborhoods, travel and immediate community awareness.",
  };
  return reasons[category] || "The development adds a verifiable signal to the picture of what is changing across metro Atlanta.";
}

function clusterItems(items) {
  const groups = [];
  for (const item of [...items].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))) {
    const match = groups.find((group) => group.some((candidate) => similarity(candidate.title, item.title) >= 0.62));
    if (match) match.push(item);
    else groups.push([item]);
  }

  const priorClusterItems = new Set((previous.clusters || []).flatMap((cluster) => cluster.itemIds || []));
  return groups.map((group) => {
    const primaryItems = group.filter((item) => item.sourceTier === "A" && item.retrievedContent);
    const uniqueContentSources = new Set(group.filter((item) => item.retrievedContent).map((item) => item.sourceId));
    const lead = primaryItems[0] || group[0];
    const category = categoryFor(lead.title, lead.sourceCategory || "Atlanta News");
    const status = primaryItems.length && uniqueContentSources.size >= 2 ? "CORROBORATED" : primaryItems.length ? "ATTRIBUTED_PRIMARY" : "NEEDS_PRIMARY_EVIDENCE";
    const cluster = {
      id: hash(group.map((item) => item.id).sort().join("|")),
      itemIds: group.map((item) => item.id),
      headline: lead.title,
      summary: lead.summary,
      category,
      eventType: eventFor(lead.title),
      publishedAt: group.map((item) => item.publishedAt).sort().at(-1),
      sourceTier: lead.sourceTier,
      sources: group.map((item) => ({
        sourceId: item.sourceId,
        name: item.sourceName,
        tier: item.sourceTier,
        url: item.url,
        acquisition: item.acquisition,
        retrievedContent: item.retrievedContent,
      })),
      corroboration: {
        status,
        contentSourceCount: uniqueContentSources.size,
        primaryEvidenceCount: primaryItems.length,
        evidenceRule: "material_claim_requires_primary_content_or_two_independent_content_sources",
      },
      evidenceLabel: status === "CORROBORATED" ? "Corroborated" : status === "ATTRIBUTED_PRIMARY" ? "Primary-source report" : "Unverified discovery",
      publishable: status !== "NEEDS_PRIMARY_EVIDENCE" && Boolean(lead.summary),
      draft: {
        headline: lead.title,
        dek: lead.summary,
        whatChanged: `${lead.sourceName} published this attributable update. ATLSignal has not treated the publisher's broader conclusions as independently verified.`,
        whyItMatters: whyItMatters(category),
        unknown: status === "CORROBORATED" ? "Later implementation and outcome evidence may still change the picture." : "Independent corroboration and later outcome evidence remain outstanding.",
        next: "Watch for a second primary record, implementation milestone, board action, contract filing or independently reported confirmation.",
      },
    };
    cluster.scores = scoreCluster(cluster, group.every((item) => priorClusterItems.has(item.id)));
    return cluster;
  }).sort((a, b) => b.scores.total - a.scores.total);
}

const health = [];
const collected = [];
for (const source of config.activeSources) {
  const startedAt = new Date();
  try {
    const items = source.collector === "invest_atlanta_json"
      ? await collectInvestAtlanta(source)
      : source.collector === "rss"
        ? await collectRss(source)
        : await collectSitemap(source);
    collected.push(...items);
    health.push({ sourceId: source.sourceId, name: source.name, status: items.length ? "OK" : "EMPTY", itemCount: items.length, critical: source.critical, durationMs: Date.now() - startedAt.valueOf() });
  } catch (error) {
    health.push({ sourceId: source.sourceId, name: source.name, status: "FAILED", itemCount: 0, critical: source.critical, error: errorMessage(error), durationMs: Date.now() - startedAt.valueOf() });
  }
}

const discoveryStart = new Date();
try {
  const discovery = await collectDiscoveryMetadata();
  collected.push(...discovery);
  for (const source of config.discoverySources) {
    health.push({ sourceId: source.sourceId, name: source.name, status: "DISCOVERY_OK", itemCount: discovery.filter((item) => item.sourceId === source.sourceId).length, critical: false, accessState: source.accessState, durationMs: Date.now() - discoveryStart.valueOf() });
  }
} catch (error) {
  for (const source of config.discoverySources) {
    health.push({ sourceId: source.sourceId, name: source.name, status: "DISCOVERY_DEGRADED", itemCount: 0, critical: false, accessState: source.accessState, error: errorMessage(error), durationMs: Date.now() - discoveryStart.valueOf() });
  }
}

const retentionCutoff = now.valueOf() - 365 * 86_400_000;
const itemsById = new Map();
for (const item of previous.items || []) {
  const retainedTitle = stripOutletSuffix(item.title, item.sourceName);
  const configuredSource = config.activeSources.find((source) => source.sourceId === item.sourceId);
  const retainedDiscovery = item.acquisition !== "google_news_rss_metadata"
    || (isNewsworthyDiscovery(retainedTitle) && isLocallyRelevant({ title: retainedTitle, sourceUrl: item.publisherUrl }, { sourceId: item.sourceId }));
  const retainedLocal = !configuredSource?.localOnly
    || isLocallyRelevant({ title: retainedTitle, sourceUrl: item.publisherUrl }, configuredSource);
  if (retainedDiscovery && retainedLocal && new Date(item.lastSeenAt || item.publishedAt).valueOf() >= retentionCutoff) itemsById.set(item.id, { ...item, title: retainedTitle });
}
for (const item of collected) itemsById.set(item.id, item);
const items = [...itemsById.values()].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
const clusters = clusterItems(items);
const currentClustersById = new Map(clusters.map((cluster) => [cluster.id, cluster]));
const currentClustersByHeadline = new Map(clusters.map((cluster) => [deskBriefHeadlineKey(cluster.headline), cluster]));
const publishedDeskBriefsBySlug = new Map();
for (const prior of previous.publishedDeskBriefs || []) {
  const current = currentClustersById.get(prior.clusterId)
    || currentClustersByHeadline.get(prior.headlineKey)
    || prior.cluster;
  if (!current || !deskBriefBaseSafe(current)) continue;
  const record = {
    clusterId: current.id,
    slug: prior.slug || deskBriefSlug(current),
    headlineKey: deskBriefHeadlineKey(current.headline),
    firstPublishedAt: prior.firstPublishedAt || prior.cluster?.publishedAt || nowIso,
    lastSeenAt: nowIso,
    cluster: current,
  };
  publishedDeskBriefsBySlug.set(record.slug, record);
}
for (const cluster of clusters) {
  if (!DESK_BRIEF_SEED_IDS.has(cluster.id) && !deskBriefFreshEligible(cluster)) continue;
  if (!deskBriefBaseSafe(cluster)) continue;
  const slug = deskBriefSlug(cluster);
  const prior = publishedDeskBriefsBySlug.get(slug);
  publishedDeskBriefsBySlug.set(slug, {
    clusterId: cluster.id,
    slug,
    headlineKey: deskBriefHeadlineKey(cluster.headline),
    firstPublishedAt: prior?.firstPublishedAt || nowIso,
    lastSeenAt: nowIso,
    cluster,
  });
}
const publishedDeskBriefs = [...publishedDeskBriefsBySlug.values()].sort((left, right) => String(right.cluster.publishedAt).localeCompare(String(left.cluster.publishedAt)));
const publishable = clusters.filter((cluster) => cluster.publishable);
const briefEligible = publishable.filter((cluster) => ageHours(cluster.publishedAt) <= 45 * 24);
const morningItems = briefEligible.slice(0, 5);
const morningIds = new Set(morningItems.map((item) => item.id));
const afternoonItems = briefEligible.filter((item) => !morningIds.has(item.id)).slice(0, 5);
const atlantaHour = Number(
  new Intl.DateTimeFormat("en-US", { timeZone: config.timezone, hour: "2-digit", hourCycle: "h23" }).format(now),
);
const criticalFailures = health.filter((source) => source.critical && source.status !== "OK");
const output = {
  schemaVersion: "atlsignal_newsroom_v1",
  generatedAt: nowIso,
  market: config.market,
  timezone: config.timezone,
  editionWindow: atlantaHour < 13 ? "MORNING" : "AFTERNOON",
  automation: {
    schedule: ["11:15 UTC", "15:15 UTC", "19:15 UTC", "23:15 UTC"],
    intendedCadence: "four_daily",
    status: criticalFailures.length ? "DEGRADED" : "HEALTHY",
    criticalFailures: criticalFailures.map((source) => source.sourceId),
    previousRunAt: previous.generatedAt,
  },
  stats: {
    activeSources: config.activeSources.length,
    discoverySources: config.discoverySources.length,
    items: items.length,
    clusters: clusters.length,
    publishable: publishable.length,
    needsCorroboration: clusters.filter((cluster) => !cluster.publishable).length,
  },
  sourceHealth: health,
  items,
  clusters,
  publishedDeskBriefs,
  morningBrief: {
    generatedAt: nowIso,
    label: "Morning Brief",
    itemIds: morningItems.map((item) => item.id),
  },
  afternoonUpdate: {
    generatedAt: nowIso,
    label: "Afternoon Update",
    itemIds: afternoonItems.map((item) => item.id),
  },
  editorialQueue: clusters.map((cluster) => ({
    clusterId: cluster.id,
    headline: cluster.headline,
    category: cluster.category,
    score: cluster.scores.total,
    evidenceLabel: cluster.evidenceLabel,
    sourceCount: cluster.sources.length,
    status: cluster.publishable ? "READY_TO_REVIEW" : "NEEDS_CORROBORATION",
  })),
  policy: {
    autoPublish: "qualified_source_backed_desk_briefs",
    autoPublishRule: "Fresh, non-sensitive Tier B reports with retrieved content, sufficient summary, high timeliness and local relevance in approved service, event, sports, business and development categories.",
    publisherPagesCrawledForDiscoverySources: false,
    discoveryUse: "metadata_only_until_primary_evidence",
    premiumBoundary: "No buyer, contact, procurement route, or subscriber-only intelligence is exported.",
  },
};

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output: path.relative(root, outputPath), status: output.automation.status, ...output.stats }, null, 2));

if (strict && criticalFailures.length) process.exitCode = 1;
