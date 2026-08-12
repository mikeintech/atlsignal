import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const newsroomPath = path.join(root, "data", "newsroom.json");
const outputPath = path.join(root, "data", "social-desk.json");
const newsroom = JSON.parse(await readFile(newsroomPath, "utf8"));
const now = new Date(process.env.SOCIAL_NOW || newsroom.generatedAt || Date.now());
const timezone = newsroom.timezone || "America/New_York";
const siteUrl = (process.env.SOCIAL_PUBLIC_SITE_URL || "https://mikeintech.github.io/atlsignal").replace(/\/$/, "");
const assetBaseUrl = (process.env.SOCIAL_ASSET_BASE_URL || siteUrl).replace(/\/$/, "");

const schedule = ["07:35", "12:15", "18:35"];
const excluded = /\b(tiktok|dive bars?|hidden gems?|appointed|appointment|retirement|reaccreditation|leadership institute class|design class|names? interim|chief financial officer|governance|ethics|oversight measures|ice cream favorites|rent a bike|trip explores|in review|second chance|succeed on the world stage|strengthening .* ecosystem|supporting small business sustainability|design and construction updates|takes center stage|forum focuses)\b/i;
const highRisk = /\b(alleged|arrest|charged|crime|dead|death|died|killed|lawsuit|minor|shooting|victim)\b/i;
const stopWords = new Set("a an and are as at be by for from has have in into is it its new of on or that the their this to with atlanta georgia announces announced report reports says said update updates latest city county regional commission beltline".split(" "));

const articlePaths = {
  "99fc3e9c500c6cc1b945": "/beltline-mortgage-assistance-30000",
  "acb27d881cb4f7742854": "/invest-atlanta-cpace-130-million-financing",
  "b1c05e21ab32f60ca452": "/invest-atlanta-39-million-affordable-housing",
  "4d56336e11476fc0eb55": "/atlanta-housing-60000-down-payment-assistance",
  "b9b9e11ba4e8ed23ebd5": "/arc-link-mexico-city-urban-innovation",
  "5d36685938fcd27ab7bc": "/invest-atlanta-senior-housing-tad-funding",
  "0ee182270f841210ce65": "/municipal-market-merchants-90000-investment",
  "298bc7e9f8f7aacb337b": "/pittsburgh-yards-piedmont-mobile-health-unit",
  "1653ceea6e15d276c2de": "/beltline-overlook-at-garson-affordable-housing",
  "47b9aed0333e1aef9145": "/beltline-bennett-street-demolition-northwest-trail",
  "8405c48461f9b912e4ec": "/atlanta-world-cup-regional-economy-review",
};

const storyOverrides = {
  "99fc3e9c500c6cc1b945": {
    headline: "New BeltLine mortgage program offers up to $30,000 toward a home",
    summary: "Eligible buyers can receive as much as $20,000, while long-term residents and public-sector employees buying in targeted south- and west-side BeltLine communities may qualify for up to $30,000.",
    why: "The higher targeted amount changes the up-front purchase math for some buyers and gives residents a concrete program to compare with rising BeltLine-area housing costs.",
    unknown: "The announcement does not establish how many buyers will close, how long funding will last or whether eligible homes will be available at workable prices.",
    next: "Track formal guidance, applications, completed purchases and the geographic distribution of assistance.",
  },
  "4d56336e11476fc0eb55": {
    headline: "Atlanta Housing raises down-payment assistance to as much as $60,000",
    summary: "Eligible Housing Choice Voucher participants may receive up to $60,000 in down-payment assistance, up from a previous maximum of $25,000, alongside a homeownership pilot with Pretium.",
    why: "Up-front cash is one of the largest barriers between stable renting and homeownership, but qualifying inventory and mortgage readiness will determine the program’s reach.",
    unknown: "The agency has not reported how many households will close, the total funding available or the full list of participating properties and lenders.",
    next: "Track program guidance, application volume, completed purchases and available homes.",
  },
  "b1c05e21ab32f60ca452": {
    headline: "$39 million backs nearly 400 affordable homes across Atlanta",
    summary: "Invest Atlanta approved $39 million for four west-side developments expected to create or preserve nearly 400 affordable homes, including 218 homes in Grove Park.",
    why: "The approvals turn a broad affordability commitment into named projects, locations and unit counts that can be followed through construction and occupancy.",
    unknown: "Board approval does not establish closing, construction completion, lease-up timing or the final number of homes delivered at each affordability level.",
    next: "Track closings, permits, construction milestones, affordability agreements and occupancy at all four properties.",
  },
  "acb27d881cb4f7742854": {
    headline: "Atlanta’s C-PACE financing tops $130.4 million in 2026",
    summary: "Invest Atlanta reports $130.4 million in C-PACE financing closed in 2026, including $10 million for Pullman Yards and $56.4 million for The CTR.",
    why: "The financing tool ties energy and building upgrades to named commercial properties, giving Atlanta measurable projects to track beyond the headline total.",
    unknown: "The announcement does not establish every construction deadline, projected savings or the upgrades’ eventual operating performance.",
    next: "Track project scopes, construction milestones, completion and measured energy or operating results.",
  },
  "0ee182270f841210ce65": {
    headline: "$90,000 in grants will fund upgrades for nine Municipal Market merchants",
    summary: "Nine Municipal Market merchants in Sweet Auburn received $10,000 awards for booth function, fixtures, signage and design improvements.",
    why: "Storefront-scale improvements can affect customer flow, equipment reliability and the ability of independent merchants to compete inside a historic public market.",
    unknown: "The announcement does not establish when every improvement will finish or whether the upgrades will produce lasting sales growth.",
    next: "Track completed booth projects, merchant experience and measurable operating effects.",
  },
  "1653ceea6e15d276c2de": {
    headline: "BeltLine-backed Overlook at Garson moves from plan to construction",
    summary: "Atlanta BeltLine and Atlanta Housing marked the start of construction on Overlook at Garson, an affordable-housing development near Lindbergh.",
    why: "The groundbreaking changes the story from a plan into an observable delivery milestone near major transportation and commercial corridors.",
    unknown: "The milestone does not establish every deadline, final lease-up date, downstream contract or neighborhood effect.",
    next: "Track financing disclosures, construction progress, eligibility information and completion.",
  },
  "47b9aed0333e1aef9145": {
    headline: "Bennett Street demolition clears an early path for Northwest Trail work",
    summary: "Atlanta BeltLine announced Bennett Street demolition as an enabling step for future Northwest Trail construction and related infrastructure work.",
    why: "The dated site activity lets readers track a major corridor project through intermediate milestones instead of waiting for a finished trail announcement.",
    unknown: "The source does not settle the full delivery schedule, final cost, every procurement package or nearby commercial impact.",
    next: "Track contract awards, detours, construction notices, funding actions and a firmer segment schedule.",
  },
  "298bc7e9f8f7aacb337b": {
    headline: "Piedmont mobile health unit adds a recurring stop at Pittsburgh Yards",
    summary: "A Piedmont mobile health unit supported by Google is serving Pittsburgh Yards, with later BeltLine information describing second-Saturday availability alongside the Indie Market.",
    why: "Healthcare, small-business programming and community activity are appearing in the same place, potentially widening the campus’s usefulness and repeat foot traffic.",
    unknown: "The available sources do not establish permanent service, patient volume, a complete clinical schedule or a measured business effect.",
    next: "Track Piedmont and BeltLine schedules, service data and future programming.",
  },
};

function hash(value) {
  return createHash("sha256").update(String(value)).digest("hex").slice(0, 20);
}

function clean(value = "") {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&rsquo;", "’")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&ndash;", "–")
    .replaceAll("&mdash;", "—")
    .replaceAll("&eacute;", "é")
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/\s+The post .*? appeared first on .*?\.?$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shorten(value, limit) {
  const text = clean(value);
  if (text.length <= limit) return text;
  const sliced = text.slice(0, limit - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, lastSpace > limit * 0.7 ? lastSpace : limit - 1).trim()}…`;
}

function tokens(value) {
  return new Set(
    clean(value)
      .toLowerCase()
      .replace(/[^a-z0-9$]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !stopWords.has(token)),
  );
}

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  return [...a].filter((token) => b.has(token)).length / Math.min(a.size, b.size);
}

function dateKey(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(dayKey, days) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days, 12)).toISOString().slice(0, 10);
}

function zonedIso(dayKey, time) {
  const [year, month, day] = dayKey.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const target = Date.UTC(year, month - 1, day, hour, minute);
  const represented = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(target));
  const values = Object.fromEntries(represented.map((part) => [part.type, part.value]));
  const wallClockAsUtc = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second));
  return new Date(target - (wallClockAsUtc - target)).toISOString();
}

function nextSlots(count) {
  const slots = [];
  const today = dateKey(now);
  const remainingToday = schedule.filter((time) => new Date(zonedIso(today, time)).valueOf() > now.valueOf() + 10 * 60_000).length;
  const firstDayOffset = remainingToday > 0 ? 0 : 1;
  for (let dayOffset = firstDayOffset; slots.length < count && dayOffset < firstDayOffset + 10; dayOffset += 1) {
    const day = addDays(today, dayOffset);
    for (const time of schedule) {
      const scheduledFor = zonedIso(day, time);
      if (new Date(scheduledFor).valueOf() > now.valueOf() + 10 * 60_000) slots.push({ day, time, scheduledFor });
      if (slots.length === count) break;
    }
  }
  return slots;
}

function ageDays(cluster) {
  return Math.max(0, (now.valueOf() - new Date(cluster.publishedAt).valueOf()) / 86_400_000);
}

function pickCandidates(count) {
  const candidates = newsroom.clusters.filter((cluster) =>
    cluster.publishable
    && cluster.sourceTier === "A"
    && clean(cluster.summary).length >= 70
    && !excluded.test(cluster.headline),
  );
  const selected = [];
  const categoryUses = new Map();
  while (selected.length < count) {
    const slotType = selected.length % 3;
    const ranked = candidates
      .filter((candidate) => !selected.some((chosen) => chosen.id === candidate.id || similarity(chosen.headline, candidate.headline) >= 0.55))
      .map((candidate) => {
        const age = ageDays(candidate);
        const categoryPenalty = (categoryUses.get(candidate.category) || 0) * 7;
        const recentBoost = slotType === 0 ? (age <= 14 ? 24 : age <= 45 ? 10 : -8) : 0;
        const consequenceBoost = slotType === 1 ? (candidate.scores.impact + candidate.scores.shareability) / 8 : 0;
        const archiveBoost = slotType === 2 ? (age > 45 ? 18 : -3) : 0;
        return { candidate, rank: candidate.scores.total + recentBoost + consequenceBoost + archiveBoost - categoryPenalty };
      })
      .sort((left, right) => right.rank - left.rank);
    if (!ranked.length) break;
    const chosen = ranked[0].candidate;
    selected.push(chosen);
    categoryUses.set(chosen.category, (categoryUses.get(chosen.category) || 0) + 1);
  }
  return selected;
}

function franchiseFor(cluster, slotIndex) {
  if (ageDays(cluster) > 45 && /\b(history|historic|restore|preserv|façade)\w*\b/i.test(cluster.headline)) return "Atlanta Then / Now";
  if (slotIndex % 3 === 2 && ageDays(cluster) > 45) return "From the File";
  if (cluster.category === "Public Money" || cluster.eventType === "FINANCING") return "$ATL";
  if (cluster.category === "Food, Retail & Hospitality" && /\b(open|opening|market|store|restaurant|retail|merchant|pop-up)\w*\b/i.test(cluster.headline)) return "Opening Watch";
  if (cluster.eventType === "CONSTRUCTION") return "The Signal";
  return "The Receipt";
}

function questionFor(category) {
  if (/Housing/.test(category)) return "Which housing commitment should ATLSignal track through delivery?";
  if (/Money/.test(category)) return "Which public investment should we follow to its next measurable result?";
  if (/Transportation/.test(category)) return "Which route or project should we check next?";
  if (/Food|Business/.test(category)) return "Which Atlanta business move should be on our watchlist?";
  return "What should ATLSignal verify next?";
}

function hookFor(cluster, franchise) {
  const headline = clean(cluster.headline).replace(/\.$/, "");
  if (franchise === "Atlanta Then / Now") return shorten(`Atlanta then and now: ${headline}`, 100);
  if (franchise === "From the File") return shorten(`From the file: ${headline}`, 100);
  if (franchise === "$ATL") return shorten(`Follow the money: ${headline}`, 100);
  if (franchise === "Opening Watch") return shorten(`Opening watch: ${headline}`, 100);
  if (franchise === "The Receipt") return shorten(`Here’s the receipt: ${headline}`, 100);
  return shorten(headline, 100);
}

function sourceLine(cluster) {
  const names = [...new Set(cluster.sources.map((source) => source.name))];
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];
}

function packageFor(cluster, slot, slotIndex, itemById) {
  const override = storyOverrides[cluster.id];
  const editorialCluster = override ? {
    ...cluster,
    headline: override.headline,
    summary: override.summary,
    draft: {
      ...cluster.draft,
      whyItMatters: override.why,
      unknown: override.unknown,
      next: override.next,
    },
  } : cluster;
  const franchise = franchiseFor(cluster, slotIndex);
  const hook = hookFor(editorialCluster, franchise);
  const summary = shorten(editorialCluster.summary, 420);
  const why = shorten(editorialCluster.draft.whyItMatters, 260);
  const unknown = shorten(editorialCluster.draft.unknown, 230);
  const next = shorten(editorialCluster.draft.next, 230);
  const source = sourceLine(cluster);
  const publicPath = articlePaths[cluster.id] || `/file/${cluster.id}`;
  const articleUrl = `${siteUrl}${publicPath}`;
  const question = questionFor(cluster.category);
  const format = "CAROUSEL_4X5";
  const riskReasons = highRisk.test(`${cluster.headline} ${cluster.summary}`) ? ["SENSITIVE_OR_ALLEGATION_LANGUAGE"] : [];
  const sourceMedia = cluster.itemIds
    .map((id) => itemById.get(id))
    .filter((item) => item?.imageUrl)
    .map((item) => ({ url: item.imageUrl, source: item.sourceName, usage: "REFERENCE_OR_LINK_ONLY_UNTIL_LICENSE_CONFIRMED" }));
  const packageId = hash(`${cluster.id}|${slot.scheduledFor}|social-v2`);
  const instagramCaption = `${hook}\n\n${summary}\n\nWhy it matters: ${why}\n\nWhat remains unknown: ${unknown}\n\nSources: ${source}. Full context and source trail: ${articleUrl}\n\n${question}`;
  const assetUrls = Array.from({ length: 6 }, (_, index) => `${assetBaseUrl}/social-assets/${packageId}/${index + 1}.png`);

  return {
    packageId,
    storyId: cluster.id,
    idempotencyKey: `atlsignal:${cluster.id}:social-v2`,
    scheduledFor: slot.scheduledFor,
    localSlot: `${slot.day} ${slot.time} ET`,
    status: riskReasons.length ? "HOLD" : "AUTO_READY",
    holdReasons: riskReasons,
    humanPresenceRequired: false,
    franchise,
    category: cluster.category,
    evidenceLabel: cluster.evidenceLabel,
    headline: clean(editorialCluster.headline),
    hook,
    articleUrl,
    sources: cluster.sources.map((item) => ({ name: item.name, url: item.url, tier: item.tier })),
    editorialBoundary: {
      confirmed: summary,
      whyItMatters: why,
      unknown,
      next,
    },
    production: {
      format,
      preferredAssetMode: "ORIGINAL_EDITORIAL_GRAPHIC",
      assetStatus: "GENERATED",
      aiNarration: "ALLOWED_WITHOUT_SYNTHETIC_PERSON",
      disclosure: "AI-assisted production. Reporting and source review by ATLSignal.",
      visualDirection: "Six finished 4:5 ATLSignal editorial cards generated from reviewed copy. No synthetic documentary photography or third-party media is used.",
      sourceMedia,
      mediaRule: sourceMedia.length ? "Use the linked source media only with documented permission, a license, a native repost, or an embed; otherwise use the original graphic plan." : "Use the original graphic plan; no third-party image is required.",
      altText: `${franchise} explainer about ${shorten(cluster.headline, 140)}, with the source status and next milestone shown in ATLSignal graphics.`,
      renderUrls: Array.from({ length: 6 }, (_, index) => `${siteUrl}/social-card/${packageId}/${index + 1}`),
      assetUrls,
    },
    carousel: [
      { slide: 1, label: franchise, heading: hook, body: "Atlanta, explained from the receipts." },
      { slide: 2, label: "What changed", heading: "The signal", body: shorten(summary, 190) },
      { slide: 3, label: "Why it matters", heading: "The consequence", body: shorten(why, 190) },
      { slide: 4, label: "The receipt", heading: cluster.evidenceLabel, body: `Source trail: ${source}.` },
      { slide: 5, label: "Not confirmed", heading: "What we still need", body: shorten(unknown, 190) },
      { slide: 6, label: "Track it", heading: "The next signal", body: shorten(next, 190) },
    ],
    platforms: {
      instagram: {
        publishAt: slot.scheduledFor,
        format: "CAROUSEL",
        caption: instagramCaption,
        storyFrames: [hook, shorten(summary, 120), `${question} Read: ${articleUrl}`],
      },
      threads: {
        publishOffsetMinutes: 12,
        post: `${hook}\n\n${shorten(summary, 300)}\n\nReceipt: ${source}. ${articleUrl}`,
        followUp: `${shorten(unknown, 300)}\n\n${question}`,
      },
    },
    measurement: {
      campaign: `social_${slot.day.replaceAll("-", "")}`,
      content: `${franchise.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${cluster.id.slice(0, 8)}`,
      primary: ["shares_per_reach", "saves_per_reach", "qualified_questions", "newsletter_signups"],
      secondary: ["reel_completion", "profile_to_site_clicks", "follows"],
    },
  };
}

const slots = nextSlots(21);
const candidates = pickCandidates(slots.length);
const itemById = new Map(newsroom.items.map((item) => [item.id, item]));
const packages = candidates.map((cluster, index) => packageFor(cluster, slots[index], index, itemById));
const start = packages[0]?.localSlot.slice(0, 10) || dateKey(now);
const end = packages.at(-1)?.localSlot.slice(0, 10) || start;

const output = {
  schemaVersion: "atlsignal_social_desk_v2",
  generatedAt: now.toISOString(),
  basedOnNewsroomRun: newsroom.generatedAt,
  timezone,
  calendarStart: start,
  calendarEnd: end,
  policy: {
    operatingModel: "AI_FIRST_NO_REGULAR_HUMAN_PRESENCE",
    enabledPlatforms: ["instagram", "threads"],
    autoReadyRule: "Tier A publishable evidence, sufficient source summary, no sensitive or allegation language, original asset plan.",
    externalMedia: "Never download and repost by default. Link, embed, request permission, use a native repost, or replace with an original ATLSignal graphic.",
    syntheticMedia: "AI narration, typography, maps and diagrams are allowed. Synthetic documentary scenes, fake people, cloned voices and invented event footage are prohibited.",
    sponsorRule: "Paid placement must be labeled and cannot alter evidence status or suppress unknowns.",
  },
  cadence: {
    instagram: "3 feed posts per day plus story frames",
    threads: "3 original posts and 3 evidence or question follow-ups per day",
    website: "20-item daily file remains the reporting backbone",
  },
  stats: {
    packages: packages.length,
    autoReady: packages.filter((item) => item.status === "AUTO_READY").length,
    held: packages.filter((item) => item.status === "HOLD").length,
    originalAssetPlans: packages.filter((item) => item.production.preferredAssetMode === "ORIGINAL_EDITORIAL_GRAPHIC").length,
    sourceMediaReferences: packages.reduce((total, item) => total + item.production.sourceMedia.length, 0),
  },
  packages,
};

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output: path.relative(root, outputPath), ...output.stats, calendarStart: start, calendarEnd: end }, null, 2));
