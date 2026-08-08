import type { Story } from "@/components/publication";
import publicReadModel from "@/data/atlanta.json";
import launchWeekData from "@/data/launch-week.json";

const displayNames: Record<string, string> = {
  "mckenney-s-campus-project-mckenney-s-warehouse": "McKenney’s Campus Warehouse",
  "lulah-hills-publix-super-market-2142": "Lulah Hills Publix",
  "residences-at-perimeter-summit-phase-b": "Residences at Perimeter Summit — Phase B",
  "global-village-project-building-c": "Global Village — Building C",
  "autozone-10982-interior-alteration": "AutoZone #10982",
  "publix-269": "Publix 269",
  "2026-002792-commercial-remodel": "Due West Road commercial project",
  "2026-001375-commercial-remodel": "Post Oak Tritt Road commercial project",
  "olympus-md": "Olympus MD",
  "bethany-s-place-office-fit-out": "Bethany’s Place Office Fit Out",
};

const articleSlugs: Record<string, string> = {
  "mckenney-s-campus-project-mckenney-s-warehouse": "mckenneys-campus-warehouse-construction",
  "lulah-hills-publix-super-market-2142": "lulah-hills-publix-construction",
  "residences-at-perimeter-summit-phase-b": "residences-perimeter-summit-phase-b",
  "global-village-project-building-c": "global-village-building-c-occupancy",
  "autozone-10982-interior-alteration": "autozone-10982-interior-alteration",
  "publix-269": "publix-269-occupancy",
  "2026-002792-commercial-remodel": "due-west-road-commercial-project",
  "2026-001375-commercial-remodel": "post-oak-tritt-commercial-project",
  "olympus-md": "olympus-md-construction",
  "bethany-s-place-office-fit-out": "bethanys-place-office-fit-out",
};

const editorialPhoto = (id: string, alt: string) => ({
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`,
  alt,
  credit: "Unsplash",
  creditUrl: `https://unsplash.com/photos/${id.replace("photo-", "")}`,
  label: "Editorial image" as const,
});

const projectImages: Record<string, Story["image"]> = {
  "mckenney-s-campus-project-mckenney-s-warehouse": editorialPhoto("photo-1586528116311-ad8dd3c8310d", "Warehouse loading bays and logistics activity"),
  "lulah-hills-publix-super-market-2142": {
    src: "https://atlanta.urbanize.city/sites/default/files/styles/1140w/public/2025-10/North%20DeKalb%20Mall%20site%20Lulah%20Hills%201.png?itok=1RfUfA6R",
    alt: "Aerial view of the cleared Lulah Hills redevelopment site",
    credit: "Urbanize Atlanta",
    creditUrl: "https://atlanta.urbanize.city/post/north-dekalb-mall-lulah-hills-project-demo-construction",
    label: "Source image",
  },
  "residences-at-perimeter-summit-phase-b": editorialPhoto("photo-1545324418-cc1a3fa10c00", "Modern multifamily residential buildings"),
  "global-village-project-building-c": editorialPhoto("photo-1562774053-701939374585", "Educational campus building and landscaped grounds"),
  "autozone-10982-interior-alteration": editorialPhoto("photo-1486262715619-67b85e0b08d3", "Mechanic working inside an automotive service space"),
  "publix-269": editorialPhoto("photo-1578916171728-46686eac8d58", "Grocery store aisles prepared for customers"),
  "2026-002792-commercial-remodel": editorialPhoto("photo-1504307651254-35680f356dfd", "Commercial construction work in progress"),
  "2026-001375-commercial-remodel": editorialPhoto("photo-1486406146926-c627a92ad1ab", "Modern commercial building exterior"),
  "olympus-md": editorialPhoto("photo-1519494026892-80bbd2d6fd0d", "Contemporary medical and professional building exterior"),
  "bethany-s-place-office-fit-out": editorialPhoto("photo-1497366811353-6870744d04b2", "Bright modern office interior"),
};

function displayValue(value: number | null) {
  if (!value) return "Value pending";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`;
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function displayStage(stage: string) {
  return stage === "OCCUPANCY" ? "Occupancy" : stage === "CONSTRUCTION_READY" ? "Construction ready" : stage.replaceAll("_", " ").toLowerCase();
}

function storyHeadline(slug: string, stage: string) {
  const name = displayNames[slug] ?? slug;
  return stage === "OCCUPANCY" ? `${name} reaches occupancy stage` : `${name} moves into construction`;
}

function publicSummary(summary: string) {
  return summary.replace("Contract Radar records", "ATLSignal records");
}

const canonicalProjects = publicReadModel.projects;
const canonicalStories: Story[] = canonicalProjects.map((project) => ({
  slug: articleSlugs[project.slug] ?? project.slug,
  category: project.category === "BUSINESS" ? "Business" : "Development",
  headline: storyHeadline(project.slug, project.editorial_stage),
  dek: publicSummary(project.summary),
  timestamp: `Updated ${publicReadModel.brief.date ? "Aug. 7" : "recently"}`,
  confidence: project.confidence >= .75 ? "Confirmed" : "Probable",
  image: projectImages[project.slug] ?? editorialPhoto("photo-1504307651254-35680f356dfd", "Commercial construction activity"),
}));

export const sourceDeskStories: Story[] = [
  {
    slug: "beltline-overlook-at-garson-affordable-housing",
    category: "Public Money",
    headline: "BeltLine-backed Overlook at Garson moves from plan to construction",
    dek: "The official groundbreaking adds a visible affordable-housing milestone near Lindbergh and a new project for Atlanta’s public-investment watch.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: {
      src: "https://a-us.storyblok.com/f/1020195/1563x889/72f9168877/garson-drive-drone-shot.webp",
      alt: "Aerial view of the Garson Drive development site near Piedmont Road",
      credit: "Atlanta BeltLine",
      creditUrl: "https://beltline.org/learn/current-projects/garson-drive/",
      label: "Source image",
    },
  },
  {
    slug: "beltline-bennett-street-demolition-northwest-trail",
    category: "Transportation & Airport",
    headline: "Bennett Street demolition clears an early path for Northwest Trail work",
    dek: "Atlanta BeltLine’s first-party update links a near-term demolition step to the longer Northwest Trail buildout.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: {
      src: "https://a2-us.storyblok.com/f/1020195/5472x3648/ae661ddcb7/bennett-st-photo-by-loknows-drones-6-26-2025_07.JPG/m/1200x630/filters:format(jpeg)",
      alt: "Aerial view of the Bennett Street corridor in Atlanta",
      credit: "Atlanta BeltLine / LoKnows Drones",
      creditUrl: "https://beltline.org/blog/atlanta-beltline-to-begin-bennett-street-demolition-advancing-future-northwest-trail/",
      label: "Source image",
    },
  },
  {
    slug: "arc-avondale-estates-town-green-transformation",
    category: "City Hall & Policy",
    headline: "Avondale Estates’ town green shows how civic projects can reshape a business district",
    dek: "ARC’s community-development account connects a municipal redevelopment project with walkability, gathering space and downtown activity.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: {
      src: "https://atlantaregional.org/wp-content/uploads/avondale-lci-5.png",
      alt: "Avondale Estates Town Green and surrounding downtown development",
      credit: "Atlanta Regional Commission",
      creditUrl: "https://atlantaregional.org/news/community-development/from-drive-through-to-drive-to-avondale-estates-transformation/",
      label: "Source image",
    },
  },
  {
    slug: "connectatl-regional-transportation-future",
    category: "Transportation & Airport",
    headline: "ConnectATL puts metro Atlanta’s transportation choices on one regional agenda",
    dek: "The ARC forum is a useful marker for the mobility, infrastructure and growth decisions shaping the region’s next cycle.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: editorialPhoto("photo-1449824913935-59a10b8d2000", "Metro Atlanta traffic and regional transportation infrastructure"),
  },
  {
    slug: "atlanta-world-cup-regional-economy-review",
    category: "Workforce & Economy",
    headline: "ARC’s World Cup review turns a global event into a regional economic case study",
    dek: "The agency’s post-event review gives Atlanta readers a starting point for examining mobility, civic capacity and the business effects of major events.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: {
      src: "https://res.cloudinary.com/atlanta/images/w_1024%2Ch_683%2Cc_scale/f_auto%2Cq_auto/v1749748170/newAtlanta.com/MBS_20250611_FWCOneYearOutUpdate_CS1_2797/MBS_20250611_FWCOneYearOutUpdate_CS1_2797.jpg?_i=AA",
      alt: "Atlanta civic and business leaders at a FIFA World Cup 26 event",
      credit: "Discover Atlanta",
      creditUrl: "https://discoveratlanta.com/news/atlanta-marks-one-year-to-go-until-the-fifa-world-cup-26-with-joint-host-city-efforts-and-citywide-celebrations/",
      label: "Source image",
    },
  },
  {
    slug: "how-invest-atlanta-shapes-development-finance",
    category: "Public Money",
    headline: "Where Invest Atlanta fits into the city’s development-money story",
    dek: "Tax incentives, neighborhood investment and business programs become more legible when the city’s economic-development authority is treated as a standing reporting beat.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: {
      src: "https://www.investatlanta.com/assets/developers_newmarkettaxcredits_mantle_940x360_V1rQmP8.jpg",
      alt: "Atlanta skyline representing city-backed economic development",
      credit: "Invest Atlanta",
      creditUrl: "https://www.investatlanta.com/",
      label: "Source image",
    },
  },
];

export const sourceDeskArticleDetails: Record<string, {
  nutgraf: string;
  whatChanged: string;
  matters: string;
  unknown: string;
  next: string;
  sources: Array<{ name: string; detail: string; url?: string }>;
}> = {
  "beltline-overlook-at-garson-affordable-housing": {
    nutgraf: "The news is the transition from an announced idea to a documented construction milestone. That makes the project relevant to readers following housing delivery, neighborhood investment and BeltLine-adjacent growth.",
    whatChanged: "Atlanta BeltLine reported a groundbreaking for Overlook at Garson, an affordable-housing development near Lindbergh. ATLSignal classifies the update as confirmed because it comes from the public entity directly associated with the program and describes a completed milestone rather than a forecast.",
    matters: "Affordable housing near major transportation and commercial corridors is both a public-policy story and a development story. The milestone gives residents and business readers something concrete to track: whether publicly supported plans are moving into delivery and how that activity may change the surrounding district over time.",
    unknown: "The announcement does not, by itself, establish every construction deadline, downstream contract, operating detail or neighborhood effect. Those claims require separate records or later reporting.",
    next: "ATLSignal will watch for construction updates, financing disclosures, leasing or eligibility information, and later completion milestones from first-party and government sources.",
    sources: [{ name: "Atlanta BeltLine", detail: "First-party groundbreaking announcement for Overlook at Garson.", url: "https://beltline.org/blog/atlanta-beltline-breaks-ground-on-overlook-at-garson/" }],
  },
  "beltline-bennett-street-demolition-northwest-trail": {
    nutgraf: "Demolition is a modest step, but it is a dated and observable one. It moves the Northwest Trail story beyond a broad future promise and into a sequence readers can follow.",
    whatChanged: "Atlanta BeltLine announced the start of Bennett Street demolition as an enabling step for future Northwest Trail work. The update does not mean the full trail segment is complete or immediately opening; it confirms preparatory activity tied to the corridor plan.",
    matters: "Trail and street projects can alter access, construction conditions and the way nearby commercial districts function. Publishing the intermediate milestones helps readers understand why visible site work may begin well before a finished public amenity arrives.",
    unknown: "The source does not settle the full delivery schedule, final cost, every procurement package or the commercial impact on nearby properties.",
    next: "The useful follow-ups are contract awards, construction notices, detours, funding actions and a firmer segment schedule.",
    sources: [{ name: "Atlanta BeltLine", detail: "First-party Bennett Street demolition and Northwest Trail update.", url: "https://beltline.org/blog/atlanta-beltline-to-begin-bennett-street-demolition-advancing-future-northwest-trail/" }],
  },
  "arc-avondale-estates-town-green-transformation": {
    nutgraf: "ARC’s account is useful because it explains a local redevelopment project as more than a construction event: it connects the public realm, downtown identity and the conditions surrounding small-business activity.",
    whatChanged: "The Atlanta Regional Commission published a community-development feature on Avondale Estates’ transformation from a drive-through corridor toward a more walkable destination centered on the town green. ATLSignal is treating the piece as regional civic context, not an independent measure of business performance.",
    matters: "Public-space investments often sit upstream of private openings, foot traffic and leasing decisions. Following them as a standing beat gives regular readers a clearer picture of how municipal choices can change a commercial district’s shape.",
    unknown: "The feature does not prove that every nearby business benefited, quantify a universal economic effect or establish the outcome of future development proposals.",
    next: "Later coverage should test the civic narrative against new openings, vacancies, development applications, public budgets and direct reporting from local operators.",
    sources: [{ name: "Atlanta Regional Commission", detail: "Community-development feature on Avondale Estates’ downtown transformation.", url: "https://atlantaregional.org/news/community-development/from-drive-through-to-drive-to-avondale-estates-transformation/" }],
  },
  "connectatl-regional-transportation-future": {
    nutgraf: "Regional forums are not project approvals, but they show which mobility questions are being elevated and which institutions are participating before individual decisions reach construction.",
    whatChanged: "ARC’s ConnectATL coverage placed metro Atlanta’s transportation future at the center of a regional discussion. ATLSignal records the event as an agenda-setting signal and keeps it separate from funded-project or construction claims.",
    matters: "Transportation capacity influences where people can work, where companies can hire and which districts can absorb growth. A regional view helps connect individual transit, road and trail projects to the larger economic map.",
    unknown: "Discussion does not equal adoption. The source does not confirm funding, final project selection, construction dates or a specific outcome for any corridor.",
    next: "ATLSignal will look for board actions, adopted plans, funding commitments, procurement notices and project-level schedules that turn the agenda into measurable decisions.",
    sources: [{ name: "Atlanta Regional Commission", detail: "Regional transportation forum coverage.", url: "https://atlantaregional.org/news/transportation-mobility/metro-atlantas-transportation-future-takes-center-stage-at-connectatl-in-focus/" }],
  },
  "atlanta-world-cup-regional-economy-review": {
    nutgraf: "The value of a post-event review is not another victory lap. It is a public starting point for separating observed regional activity from larger claims about long-term economic impact.",
    whatChanged: "ARC published a review of Atlanta’s FIFA World Cup 26 hosting period. ATLSignal adds it to the regional economy desk as an attributable agency account that can be compared with later transportation, tourism, workforce and fiscal evidence.",
    matters: "Major events put unusual pressure on airports, transit, public safety, hospitality and city operations. Looking back at that performance can expose lessons that matter for future events and everyday regional capacity.",
    unknown: "An agency review alone cannot establish the complete economic impact, net public cost, distribution of benefits or long-term effect on local businesses.",
    next: "The next layer should include visitor data, tax receipts, public expenditures, transit and airport reporting, and independent business accounts.",
    sources: [{ name: "Atlanta Regional Commission", detail: "Agency review of the region’s FIFA World Cup 26 experience.", url: "https://atlantaregional.org/news/uncategorized/fifa-world-cup-26-in-review/" }],
  },
  "how-invest-atlanta-shapes-development-finance": {
    nutgraf: "Public money is not a single feed. Invest Atlanta sits at the intersection of incentives, real estate, neighborhood investment and business support, making its actions a necessary beat for understanding how city-backed growth is financed.",
    whatChanged: "ATLSignal has promoted Invest Atlanta from a link in the source list to a permanent editorial desk. Its public materials will be used to identify programs, board actions and project-finance facts that deserve individual reporting.",
    matters: "Development announcements often mention incentives or public participation without explaining the institution, mechanism or tradeoff. A standing desk creates a place to follow those decisions consistently instead of rediscovering the agency each time a project appears.",
    unknown: "This desk launch is not evidence that every supported project succeeds or that every public incentive produces the same return. Each project and program still needs its own source trail and outcome reporting.",
    next: "Coverage will focus on board materials, financing approvals, program changes, neighborhood funds and the later milestones needed to evaluate delivery.",
    sources: [{ name: "Invest Atlanta", detail: "Official economic-development authority programs and public materials.", url: "https://www.investatlanta.com/" }],
  },
};

const opportunity = publicReadModel.brief.items.find((item) => item.section === "OPPORTUNITY");
if (opportunity) canonicalStories.push({
  slug: "douglas-county-janitorial-services",
  category: "Opportunity",
  headline: "Douglas County opens multi-location janitorial solicitation",
  dek: publicSummary(opportunity.summary),
  timestamp: "Updated Aug. 7",
  confidence: "Confirmed",
  image: editorialPhoto("photo-1581578731548-c64695cc6952", "Professional cleaning team preparing a commercial facility"),
});

const leadProject = canonicalProjects[0];
export const leadStory: Story = {
  ...canonicalStories[0],
  metric: displayValue(leadProject.reported_project_value),
  metricLabel: "reported project value",
};

export const stories = [...sourceDeskStories, ...canonicalStories.slice(1)];

export const metrics = publicReadModel.brief.items
  .filter((item) => item.section === "BY_THE_NUMBERS")
  .map((item) => ({
    value: item.summary,
    label: item.headline.toLowerCase(),
    note: item.item_data.methodology ?? publicReadModel.brief.methodology_version ?? undefined,
  }));

export const projects = canonicalProjects.map((project) => ({
  name: displayNames[project.slug] ?? project.name,
  location: project.address ?? [project.city, project.state].filter(Boolean).join(", "),
  status: displayStage(project.editorial_stage),
  detail: displayValue(project.reported_project_value),
  slug: project.slug,
}));

export const watchlist = publicReadModel.brief.items
  .filter((item) => item.section === "WHAT_WERE_WATCHING")
  .map((item) => ({
    title: item.headline,
    summary: publicSummary(item.summary),
  }));

export const editorialCategories = [
  "City Hall & Policy",
  "Development & Infrastructure",
  "Business Moves",
  "Transportation & Airport",
  "Workforce & Economy",
  "Food, Retail & Hospitality",
  "Public Money",
  "Watchlist",
];

export const sourceDesks = [
  {
    name: "Atlanta BeltLine",
    status: "Tier A public source",
    focus: "official trail, housing, construction, budget and corridor updates",
  },
  {
    name: "Atlanta Regional Commission",
    status: "Tier A civic source",
    focus: "regional economy, workforce, mobility, planning and infrastructure context",
  },
  {
    name: "Invest Atlanta",
    status: "Tier A economic source",
    focus: "incentives, neighborhood investment, small business, site selection and development finance",
  },
  {
    name: "Airport, MARTA, ATLDOT and transit authorities",
    status: "Tier A/B watch",
    focus: "transportation, airport commercial activity, transit access and project timing",
  },
  {
    name: "Local business and development press",
    status: "Tier B media source",
    focus: "tenant announcements, openings, broker notes, restaurant moves and development reporting",
  },
  {
    name: "Broker, developer and company announcements",
    status: "Tier C commercial source",
    focus: "leases, projects, first-party openings, expansion plans and operator identity clues",
  },
];

export const sourceDeskItems = [
  {
    source: "Atlanta BeltLine",
    title: "Atlanta BeltLine breaks ground on Overlook at Garson",
    summary: "A new BeltLine source-desk item flags affordable housing activity near Lindbergh. ATLSignal will treat the source as first-party for BeltLine program facts while keeping project claims separately reviewed.",
    url: "https://beltline.org/blog/atlanta-beltline-breaks-ground-on-overlook-at-garson/",
  },
  {
    source: "Atlanta BeltLine",
    title: "Bennett Street demolition advances future Northwest Trail work",
    summary: "The BeltLine desk now watches corridor construction updates that can affect public infrastructure, nearby business activity and development timing.",
    url: "https://beltline.org/blog/atlanta-beltline-to-begin-bennett-street-demolition-advancing-future-northwest-trail/",
  },
  {
    source: "Atlanta Regional Commission",
    title: "ARC publishes FIFA World Cup 26 review",
    summary: "The ARC desk adds regional-event and civic-capacity context to ATLSignal's business coverage after Atlanta's World Cup hosting window.",
    url: "https://atlantaregional.org/news/uncategorized/fifa-world-cup-26-in-review/",
  },
  {
    source: "Atlanta Regional Commission",
    title: "Avondale Estates transformation enters the regional news file",
    summary: "ARC's community-development coverage gives ATLSignal more context around municipal redevelopment, streetscape and local business districts.",
    url: "https://atlantaregional.org/news/community-development/from-drive-through-to-drive-to-avondale-estates-transformation/",
  },
  {
    source: "Atlanta Regional Commission",
    title: "ConnectATL puts transportation future on the public agenda",
    summary: "Regional mobility coverage now feeds the Transportation & Airport desk as context, not as a forecast of individual project outcomes.",
    url: "https://atlantaregional.org/news/transportation-mobility/metro-atlantas-transportation-future-takes-center-stage-at-connectatl-in-focus/",
  },
  {
    source: "Invest Atlanta",
    title: "Invest Atlanta remains a primary economic-development desk",
    summary: "ATLSignal treats Invest Atlanta as a first-party source for city economic-development programs, business resources, developer incentives and neighborhood reinvestment signals.",
    url: "https://www.investatlanta.com/",
  },
  {
    source: "Hartsfield-Jackson Atlanta International Airport",
    title: "Airport press releases join the Transportation & Airport desk",
    summary: "ATLSignal will use airport releases for public commercial context around passenger activity, concessions, local retail, hiring, operations and facility updates.",
    url: "https://www.atl.com/media-center/press-releases/",
  },
  {
    source: "ATLDOT",
    title: "ATLDOT project pages add civic infrastructure context",
    summary: "Transportation project pages are monitored for scope, budget and phase evidence, while subscriber-only routing remains separate from the free media layer.",
    url: "https://atldot.atlantaga.gov/projects/atlanta-beltline/",
  },
];

export const launchWeek = launchWeekData.publishing_days;

export const coverageLanes = [
  {
    title: "Free media",
    audience: "Readers, founders, operators and curious locals",
    includes: ["reported public facts", "source links", "plain-English context", "topic guides", "watchlist summaries"],
    excludes: ["buyer contact paths", "private routing notes", "unresolved operator guesses", "premium timing scores"],
  },
  {
    title: "Pro intelligence",
    audience: "Vendors, brokers, service providers and business development teams",
    includes: ["ranked opportunities", "buyer/operator enrichment", "timing scores", "daily watch changes", "contact-route research"],
    excludes: ["unsupported claims", "private personal data", "uncorroborated social rumors"],
  },
  {
    title: "Market desk",
    audience: "Teams that need repeatable monitoring",
    includes: ["custom source desks", "saved territories", "source-change alerts", "procurement route notes", "exportable research packets"],
    excludes: ["facts ATLSignal cannot source", "claims that fail evidence review"],
  },
];

export const publicGuides = [
  {
    slug: "how-atlanta-commercial-permits-become-news",
    title: "How Atlanta commercial permits become news",
    dek: "A plain-English guide to reading permit movement without overclaiming what the record proves.",
    category: "Guide",
    readTime: "6 min read",
    image: editorialPhoto("photo-1454165804606-c3d57bc86b40", "Plans, research and project notes arranged on a work table"),
  },
  {
    slug: "certificate-of-occupancy-atlanta-business-openings",
    title: "What a certificate of occupancy can — and cannot — tell you",
    dek: "Occupancy records can signal a project is nearing use, but they do not always prove a public opening date.",
    category: "Explainer",
    readTime: "5 min read",
    image: editorialPhoto("photo-1487958449943-2429e8be8625", "Completed modern building ready for occupancy"),
  },
  {
    slug: "public-bids-vs-premium-routing-intelligence",
    title: "Public bids are free. Routing intelligence is the premium layer.",
    dek: "ATLSignal publishes public solicitation context while reserving buyer-path research and commercial prioritization for paid tiers.",
    category: "Methodology",
    readTime: "4 min read",
    image: editorialPhoto("photo-1450101499163-c8848c66ca85", "Public contract documents being reviewed and signed"),
  },
  {
    slug: "beltline-business-development-watch",
    title: "Why BeltLine updates matter for business readers",
    dek: "Trail, housing and corridor updates can shape commercial timing long before a storefront opens.",
    category: "Source desk",
    readTime: "5 min read",
    image: {
      src: "https://a-us.storyblok.com/f/1020195/118d9ed589/03-13-23-atlanta-beltline-southside-groundbreaking-2023_03_13-southside-trail-groundbreaking_abi_web-res_127a3088-1024x683.jpg",
      alt: "Atlanta BeltLine and community leaders at a trail groundbreaking",
      credit: "Atlanta BeltLine / Erin Sintos",
      creditUrl: "https://beltline.org/press-release/atlanta-beltline-inc-and-community-leaders-break-ground-on-southside-trail-in-grant-park-glenwood-park/",
      label: "Source image" as const,
    },
  },
];

export const premiumSignals = [
  "Which public items are most likely to become paid commercial work",
  "What changed since yesterday across watched projects",
  "Which operator, owner, contractor or agency path appears most useful",
  "Which signals are confirmed, probable, weak or rejected",
  "When to act based on stage, timing and source-corroboration score",
];

export const publicationReadModel = {
  schemaVersion: publicReadModel.schema_version,
  marketId: publicReadModel.market_id,
  briefDate: publicReadModel.brief.date,
  autoPublished: publicReadModel.auto_published,
};
