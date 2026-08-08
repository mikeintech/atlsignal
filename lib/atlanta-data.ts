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
}));

const opportunity = publicReadModel.brief.items.find((item) => item.section === "OPPORTUNITY");
if (opportunity) canonicalStories.push({
  slug: "douglas-county-janitorial-services",
  category: "Opportunity",
  headline: "Douglas County opens multi-location janitorial solicitation",
  dek: publicSummary(opportunity.summary),
  timestamp: "Updated Aug. 7",
  confidence: "Confirmed",
});

const leadProject = canonicalProjects[0];
export const leadStory: Story = {
  ...canonicalStories[0],
  metric: displayValue(leadProject.reported_project_value),
  metricLabel: "reported project value",
};

export const stories = canonicalStories.slice(1);

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
    status: "Collector ready",
    focus: "development, trails, affordable housing, economic impact, construction updates",
  },
  {
    name: "Atlanta Regional Commission",
    status: "Collector ready",
    focus: "regional economy, workforce, mobility, planning, infrastructure",
  },
  {
    name: "City, airport, chamber, MARTA and state sources",
    status: "Discovery only",
    focus: "high-value public signals that still need repeatable access review",
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
];

export const launchWeek = launchWeekData.publishing_days;

export const publicationReadModel = {
  schemaVersion: publicReadModel.schema_version,
  marketId: publicReadModel.market_id,
  briefDate: publicReadModel.brief.date,
  autoPublished: publicReadModel.auto_published,
};
