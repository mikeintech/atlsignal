import type { Story } from "@/components/publication";
import publicReadModel from "@/data/atlanta.json";

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

const editorialPhoto = (id: string, alt: string) => {
  const src = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`;
  return {
    src,
    alt,
    credit: "Unsplash",
    creditUrl: src,
    label: "Editorial image" as const,
  };
};

const projectImages: Record<string, Story["image"]> = {
  "mckenney-s-campus-project-mckenney-s-warehouse": editorialPhoto("photo-1586528116311-ad8dd3c8310d", "Warehouse loading bays and logistics activity"),
  "lulah-hills-publix-super-market-2142": editorialPhoto("photo-1441986300917-64674bd600d8", "Illustrative retail storefront and pedestrian activity"),
  "residences-at-perimeter-summit-phase-b": editorialPhoto("photo-1545324418-cc1a3fa10c00", "Modern multifamily residential buildings"),
  "global-village-project-building-c": editorialPhoto("photo-1562774053-701939374585", "Educational campus building and landscaped grounds"),
  "autozone-10982-interior-alteration": editorialPhoto("photo-1486262715619-67b85e0b08d3", "Mechanic working inside an automotive service space"),
  "publix-269": editorialPhoto("photo-1578916171728-46686eac8d58", "Grocery store aisles prepared for customers"),
  "2026-002792-commercial-remodel": editorialPhoto("photo-1504307651254-35680f356dfd", "Commercial construction work in progress"),
  "2026-001375-commercial-remodel": editorialPhoto("photo-1486406146926-c627a92ad1ab", "Modern commercial building exterior"),
  "olympus-md": editorialPhoto("photo-1519494026892-80bbd2d6fd0d", "Contemporary medical and professional building exterior"),
  "bethany-s-place-office-fit-out": editorialPhoto("photo-1497366811353-6870744d04b2", "Bright modern office interior"),
};

export const freshStories: Story[] = [
  {
    slug: "beltline-mortgage-assistance-30000",
    category: "Housing & Neighborhoods",
    headline: "New BeltLine mortgage program offers up to $30,000 toward a home",
    dek: "Long-term residents and public-sector employees can qualify for the higher amount when buying inside targeted south- and west-side BeltLine communities.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T12:00:00-04:00",
    confidence: "Confirmed",
    metric: "$30,000",
    metricLabel: "maximum targeted assistance",
    image: editorialPhoto("photo-1560518883-ce09059eeffa", "Illustrative Atlanta homeownership and housing market scene"),
  },
  {
    slug: "invest-atlanta-cpace-130-million-financing",
    category: "Public Money",
    headline: "Atlanta’s C-PACE financing tops $130.4 million in 2026",
    dek: "The total includes $10 million for Pullman Yards and $56.4 million for The CTR, tying building modernization to a fast-growing financing tool.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T10:30:00-04:00",
    confidence: "Confirmed",
    metric: "$130.4M",
    metricLabel: "C-PACE financing closed in 2026",
    image: editorialPhoto("photo-1508514177221-188b1cf16e9d", "Illustrative clean-energy infrastructure and commercial property investment"),
  },
  {
    slug: "invest-atlanta-39-million-affordable-housing",
    category: "Public Money",
    headline: "$39 million backs nearly 400 affordable homes across Atlanta",
    dek: "Four west-side developments combine new construction, preservation and homeownership, with the largest financing action supporting 218 homes in Grove Park.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T09:45:00-04:00",
    confidence: "Confirmed",
    metric: "$39M",
    metricLabel: "approved housing support",
    image: editorialPhoto("photo-1545324418-cc1a3fa10c00", "Illustrative multifamily housing development"),
  },
  {
    slug: "today-in-atlanta-kimball-house-fire-journal-1883",
    category: "Today in Atlanta",
    headline: "On this date in 1883, a hotel fire helped make the Atlanta Journal",
    dek: "After the Kimball House burned before dawn, Atlanta’s young afternoon newspaper rushed out an extra edition—and built statewide credibility from the scoop.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T08:30:00-04:00",
    confidence: "Confirmed",
    image: editorialPhoto("photo-1504711434969-e33886168f5c", "Illustrative historic newspaper production and reporting"),
  },
  {
    slug: "atlanta-beltline-electric-vehicles-2016",
    category: "Transportation & Airport",
    headline: "Ten years ago today, Atlanta put five electric response vehicles on the BeltLine",
    dek: "The 2016 pilot equipped police, fire and parks teams with zero-emission neighborhood vehicles—an early marker in the city’s public-fleet transition.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T08:00:00-04:00",
    confidence: "Confirmed",
    image: editorialPhoto("photo-1597404294360-feeeda04612e", "Illustrative electric vehicle and charging infrastructure"),
  },
  {
    slug: "atlanta-housing-60000-down-payment-assistance",
    category: "Public Money",
    headline: "Atlanta Housing raises down-payment assistance to as much as $60,000",
    dek: "A new Atlanta Housing initiative more than doubles the previous maximum for eligible voucher-program participants and pairs the aid with a Pretium homeownership pilot.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T07:30:00-04:00",
    confidence: "Confirmed",
    metric: "$60,000",
    metricLabel: "maximum down-payment assistance",
    image: editorialPhoto("photo-1560518883-ce09059eeffa", "Illustrative Atlanta homeownership and housing market scene"),
  },
  {
    slug: "arc-link-mexico-city-urban-innovation",
    category: "Workforce & Economy",
    headline: "More than 180 Atlanta leaders head to Mexico City for ARC’s 2026 LINK trip",
    dek: "The regional delegation turns transportation, housing and urban innovation into a shared agenda for metro Atlanta’s government, business and civic leaders.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T07:15:00-04:00",
    confidence: "Confirmed",
    image: editorialPhoto("photo-1497366216548-37526070297c", "Illustrative civic and business leadership meeting"),
  },
  {
    slug: "invest-atlanta-senior-housing-tad-funding",
    category: "Public Money",
    headline: "Invest Atlanta financing advances 148 affordable senior homes downtown",
    dek: "Board actions support The Sanctuary and Five Peachtree Senior, two projects serving residents at 30% to 80% of area median income.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T07:00:00-04:00",
    confidence: "Confirmed",
    metric: "148",
    metricLabel: "planned affordable senior homes",
    image: editorialPhoto("photo-1545324418-cc1a3fa10c00", "Illustrative multifamily housing development"),
  },
  {
    slug: "municipal-market-merchants-90000-investment",
    category: "Business",
    headline: "$90,000 in grants will fund upgrades for nine Municipal Market merchants",
    dek: "The Invest Atlanta awards target booth function, fixtures, signage and design improvements inside Sweet Auburn’s historic public market.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T06:45:00-04:00",
    confidence: "Confirmed",
    metric: "$90,000",
    metricLabel: "approved merchant investment",
    image: editorialPhoto("photo-1441986300917-64674bd600d8", "Illustrative independent retail market activity"),
  },
  {
    slug: "pittsburgh-yards-piedmont-mobile-health-unit",
    category: "Business",
    headline: "Piedmont mobile health unit adds a recurring service stop at Pittsburgh Yards",
    dek: "The BeltLine-backed update links healthcare access with the small-business and community activity growing around the Pittsburgh Yards campus.",
    timestamp: "Published Aug. 12",
    publishedAt: "2026-08-12T06:30:00-04:00",
    confidence: "Confirmed",
    image: editorialPhoto("photo-1576091160399-112ba8d25d1d", "Illustrative community healthcare professional"),
  },
];

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

const storyOverrides: Record<string, Pick<Story, "headline" | "dek">> = {
  "mckenney-s-campus-project-mckenney-s-warehouse": { headline: "McKenney’s $17.45M warehouse permit marks a major Moreland Avenue build", dek: "An issued DeKalb County permit adds a dated construction milestone to McKenney’s campus project at 1460 Moreland Avenue." },
  "lulah-hills-publix-super-market-2142": { headline: "Lulah Hills Publix moves forward with a $4.2M construction record", dek: "The named grocery project at 1041 Mysterious Way adds another concrete milestone to EDENS’ redevelopment of the former North DeKalb Mall site." },
  "residences-at-perimeter-summit-phase-b": { headline: "$15.24M Phase B record advances housing at Perimeter Summit", dek: "The filing at 1251 Perimeter Summit Parkway gives the office-heavy Perimeter district a specific residential phase to watch." },
  "global-village-project-building-c": { headline: "Global Village Building C reaches an occupancy-stage milestone", dek: "A $1.2 million educational-project record at 2135 Shamrock Drive signals movement beyond initial construction paperwork." },
  "autozone-10982-interior-alteration": { headline: "AutoZone #10982 enters a $548,572 Memorial Drive buildout", dek: "The named interior alteration at 6130 Memorial Drive is a trackable retail opening signal, though the public opening date remains unconfirmed." },
  "publix-269": { headline: "Publix 269 reaches occupancy stage on Flakes Mill Road", dek: "The $500,000 record at 3649 Flakes Mill Road marks a later project milestone without, by itself, confirming a store opening date." },
  "2026-002792-commercial-remodel": { headline: "$15.45M commercial remodel surfaces on Due West Road", dek: "The unusually large reported value makes the 4500 Due West Road record worth watching even while the incoming operator remains unresolved." },
  "2026-001375-commercial-remodel": { headline: "$7.9M Post Oak Tritt remodel moves into the construction file", dek: "The record at 4435 Post Oak Tritt Road confirms substantial commercial work but does not yet identify the final operator in the public story." },
  "olympus-md": { headline: "Olympus MD plans a $204,000 Chamblee Tucker Road buildout", dek: "The named business project at 3288 Chamblee Tucker Road adds a modest but specific professional-space signal to the DeKalb pipeline." },
  "bethany-s-place-office-fit-out": { headline: "Bethany’s Place advances a $200,000 Kensington Road office fit-out", dek: "The address, named project and reported value create a clear construction milestone while operating timing remains unresolved." },
};

const canonicalProjects = publicReadModel.projects;
const canonicalStories: Story[] = canonicalProjects.map((project) => {
  const override = storyOverrides[project.slug];
  return {
    slug: articleSlugs[project.slug] ?? project.slug,
    category: project.category === "BUSINESS" ? "Business" : "Development",
    headline: override?.headline ?? storyHeadline(project.slug, project.editorial_stage),
    dek: override?.dek ?? publicSummary(project.summary),
    timestamp: `Published ${publicReadModel.brief.date ? "Aug. 7" : "recently"}`,
    confidence: project.confidence >= .75 ? "Confirmed" : "Probable",
    image: projectImages[project.slug] ?? editorialPhoto("photo-1504307651254-35680f356dfd", "Commercial construction activity"),
  };
});

export const sourceDeskStories: Story[] = [
  {
    slug: "beltline-overlook-at-garson-affordable-housing",
    category: "Public Money",
    headline: "BeltLine-backed Overlook at Garson moves from plan to construction",
    dek: "The official groundbreaking adds a visible affordable-housing milestone near Lindbergh and a new project for Atlanta’s public-investment watch.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: editorialPhoto("photo-1545324418-cc1a3fa10c00", "Illustrative multifamily housing development"),
  },
  {
    slug: "beltline-bennett-street-demolition-northwest-trail",
    category: "Transportation & Airport",
    headline: "Bennett Street demolition clears an early path for Northwest Trail work",
    dek: "Atlanta BeltLine’s first-party update links a near-term demolition step to the longer Northwest Trail buildout.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: editorialPhoto("photo-1500530855697-b586d89ba3ee", "Illustrative urban trail and public-space corridor"),
  },
  {
    slug: "arc-avondale-estates-town-green-transformation",
    category: "City Hall & Policy",
    headline: "Avondale Estates’ town green shows how civic projects can reshape a business district",
    dek: "ARC’s community-development account connects a municipal redevelopment project with walkability, gathering space and downtown activity.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: editorialPhoto("photo-1494526585095-c41746248156", "Illustrative neighborhood public realm and mixed-use district"),
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
    image: editorialPhoto("photo-1518604666860-9ed391f76460", "Illustrative major-event stadium and city activity"),
  },
  {
    slug: "how-invest-atlanta-shapes-development-finance",
    category: "Public Money",
    headline: "Where Invest Atlanta fits into the city’s development-money story",
    dek: "Tax incentives, neighborhood investment and business programs become more legible when the city’s economic-development authority is treated as a standing reporting beat.",
    timestamp: "Updated Aug. 8",
    confidence: "Confirmed",
    image: editorialPhoto("photo-1486406146926-c627a92ad1ab", "Illustrative commercial building and city-backed development"),
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
  "beltline-mortgage-assistance-30000": {
    nutgraf: "The new program is geographically and occupationally targeted: it reserves the largest benefit for long-term residents and public servants trying to buy in communities where BeltLine investment has intensified housing pressure.",
    whatChanged: "Invest Atlanta and Atlanta BeltLine launched a mortgage-assistance program funded through the BeltLine’s affordable-housing budget. Eligible legacy residents and public-sector employees can receive up to $30,000; other qualified buyers can receive up to $20,000 for homes inside the BeltLine Tax Allocation District on the city’s south and west sides. The money may cover down payments, closing costs, principal reduction or a permanent interest-rate buydown.",
    matters: "The program adds homeownership support to the BeltLine’s better-known rental-housing work. It also targets two groups with a direct stake in neighborhood stability: people who have lived near the corridor as values rose and public employees whose salaries may not keep pace with nearby home prices.",
    unknown: "The announcement does not state the program’s total funding pool, how many buyers can be served, the maximum qualifying home price or how many closings the program expects in its first year.",
    next: "Watch application guidance, approved lenders, completed purchases and geographic distribution. Those details will show whether the assistance reaches legacy households at meaningful scale.",
    sources: [{ name: "Invest Atlanta", detail: "First-party Aug. 12 announcement with eligibility, geography, maximum awards and permitted uses of the funds.", url: "https://www.investatlanta.com/impact-insights/invest-atlanta-and-atlanta-beltline-launch-new-mortgage-assistance-program" }],
  },
  "invest-atlanta-cpace-130-million-financing": {
    nutgraf: "The $130.4 million figure makes C-PACE more than a niche sustainability program. It is becoming a material source of capital for large Atlanta redevelopment projects.",
    whatChanged: "Invest Atlanta reported that its Commercial Property Assessed Clean Energy program had closed $130.4 million in financing during 2026. The total includes a $10 million transaction for a new 142,000-square-foot parking deck at Pullman Yards, including 84 electric-vehicle charging stations, and $56.4 million for modernization work across 1.1 million square feet at The CTR, formerly CNN Center.",
    matters: "C-PACE lets commercial owners finance eligible energy, water and resilience improvements through a property-linked assessment. The Atlanta transactions show the mechanism being used on complex, high-profile properties where operating savings and redevelopment capital intersect.",
    unknown: "The agency’s announcement does not provide a project-by-project breakdown of the entire $130.4 million, independent verification of projected savings or the financing terms borne by each property.",
    next: "The next test is performance: completed work, measured utility savings, repayment outcomes and whether more Georgia jurisdictions adopt the statewide Peach State C-PACE structure.",
    sources: [{ name: "Invest Atlanta", detail: "First-party Aug. 5 report identifying the 2026 financing total and the Pullman Yards and The CTR transactions.", url: "https://www.investatlanta.com/impact-insights/invest-atlantas-c-pace-program-surpasses-130-million-in-2026-financing" }],
  },
  "invest-atlanta-39-million-affordable-housing": {
    nutgraf: "One board action connects four different housing strategies—large-scale construction, apartment preservation, mixed-income rehabilitation and a small homeownership project—across northwest and southwest Atlanta.",
    whatChanged: "Invest Atlanta approved $39 million supporting four developments expected to create or preserve nearly 400 affordable homes. The package includes a $27.1 million tax-exempt loan for 218 affordable apartments at 350 Chappell Road, $11.5 million for the 158-unit Columbia Commons renovation, a $750,000 grant for City Line Flats and a $600,000 grant for six Staccato Row townhomes.",
    matters: "The package shows how the city’s housing pipeline is assembled from multiple financing tools and project types. It also creates a concrete delivery list that can be checked against construction, preservation and affordability commitments rather than leaving the public with one aggregate dollar figure.",
    unknown: "Board approval does not establish financial closing, construction completion, lease-up timing or the final number of homes delivered at each affordability level.",
    next: "Track closings, building permits, construction milestones, recorded affordability agreements and eventual occupancy at all four properties.",
    sources: [{ name: "Invest Atlanta", detail: "First-party July 22 board report with financing amounts, project names, unit counts and affordability ranges.", url: "https://www.investatlanta.com/impact-insights/invest-atlanta-board-approves-39-million-for-affordable-housing" }],
  },
  "today-in-atlanta-kimball-house-fire-journal-1883": {
    nutgraf: "Atlanta’s media history changed before sunrise on August 12, 1883, when a catastrophic downtown fire gave a new afternoon newspaper the chance to prove the value of speed.",
    whatChanged: "At about 4:30 a.m., the nationally known Kimball House hotel was destroyed by fire. The Constitution had already printed its Sunday edition, but the recently founded Atlanta Journal produced an extra and distributed the news statewide. The quick edition brought the paper attention and credibility during Atlanta’s competitive newspaper era.",
    matters: "The episode is an early Atlanta example of a recurring media truth: a publication earns relevance by being useful when the city changes unexpectedly. It also links the history of a vanished downtown landmark to the rise of an institution that shaped Georgia news for more than a century.",
    unknown: "The surviving historical account explains the Journal’s response and reputation gain; it does not quantify the circulation bump or isolate the fire’s long-term effect from the paper’s later ownership and editorial changes.",
    next: "ATLSignal’s Today in Atlanta series will use dated archives to reconnect current business, development and civic questions with the decisions and disruptions that formed the city.",
    sources: [{ name: "New Georgia Encyclopedia", detail: "Reference history of the Atlanta Journal-Constitution describing the Aug. 12, 1883 Kimball House fire and the Journal’s extra edition.", url: "https://www.georgiaencyclopedia.org/articles/arts-culture/atlanta-journal-constitution/" }],
  },
  "atlanta-beltline-electric-vehicles-2016": {
    nutgraf: "The five-vehicle launch was small, but it captured an early version of a question Atlanta still faces: which public operations can move to lower-emission equipment without losing practical access or response capability?",
    whatChanged: "On August 12, 2016, the City of Atlanta launched the first phase of a neighborhood electric-vehicle program with five vehicles assigned for BeltLine use. The city said Atlanta Police Department PATH Force, Atlanta Fire Rescue and Parks and Recreation teams would use the zero-emission vehicles to reach the corridor.",
    matters: "The pilot joined clean-fleet policy with a specific operational need on a trail where conventional vehicles are a poor fit. Looking back ten years later gives readers a benchmark for evaluating how quickly municipal fleet experiments become routine infrastructure.",
    unknown: "The launch announcement does not establish the vehicles’ service life, maintenance history, utilization, replacement schedule or the program’s measured emissions reduction.",
    next: "A useful follow-up is the current size and makeup of Atlanta’s electric municipal fleet, including charging capacity, procurement costs and which departments have moved beyond pilots.",
    sources: [{ name: "City of Atlanta", detail: "Official Aug. 12, 2016 release announcing the five-vehicle BeltLine program and participating departments.", url: "https://www.atlantaga.gov/Home/Components/News/News/4648/" }],
  },
  "atlanta-housing-60000-down-payment-assistance": {
    nutgraf: "The larger assistance ceiling is a meaningful policy change, but the practical story is narrower: eligibility, available homes and mortgage readiness will determine how many families can use it.",
    whatChanged: "Atlanta Housing announced that eligible Housing Choice Voucher Program participants may receive as much as $60,000 in down-payment assistance, up from a previous maximum of $25,000. The agency also announced a pilot with Pretium involving selected single-family homes inside Atlanta, seller support and post-purchase maintenance assistance.",
    matters: "Up-front cash remains one of the largest barriers between stable renting and homeownership. The higher ceiling could change the purchase math for eligible households, while successful transitions could also return rental homes to the voucher system. The program’s reach will ultimately depend on qualifying inventory, mortgage terms and participant readiness.",
    unknown: "The announcement does not establish how many households will close on homes, the total funding available, how long the pilot will operate or the full list of participating properties and lenders.",
    next: "ATLSignal will watch for formal program guidance, application volume, completed purchases, budget disclosures and evidence showing whether the pilot expands ownership without reducing affordable rental supply.",
    sources: [{ name: "Atlanta Housing", detail: "First-party May 12 announcement describing the expanded assistance ceiling, participant eligibility and Pretium pilot terms.", url: "https://www.atlantahousing.org/atlanta-housing-announces-new-60000-down-payment-assistance-program-and-partnership-with-pretium-to-expand-homeownership-opportunities/" }],
  },
  "arc-link-mexico-city-urban-innovation": {
    nutgraf: "An international study trip is not a policy decision. Its value is in the agenda it creates and the ideas Atlanta’s decision-makers bring back into local plans, budgets and projects.",
    whatChanged: "The Atlanta Regional Commission announced that more than 180 metro Atlanta government, business and civic leaders will travel to Mexico City for the 2026 LINK trip. ARC framed the visit around urban innovation and the challenges large regions face as they grow.",
    matters: "LINK places leaders from different jurisdictions and sectors inside the same working conversation. For readers, the important follow-up is whether lessons involving transportation, housing, public space or economic development appear later in Atlanta-area decisions—not simply that the delegation traveled.",
    unknown: "The announcement does not prove that a Mexico City policy will be adopted locally, identify every trip cost or establish a measurable regional outcome.",
    next: "Watch for ARC’s post-trip report, participant proposals, agency work programs and later board or budget actions that connect the visit to a specific metro Atlanta decision.",
    sources: [{ name: "Atlanta Regional Commission", detail: "First-party Aug. 11 announcement describing the delegation, destination and urban-innovation focus.", url: "https://atlantaregional.org/news/uncategorized/arcs-2026-link-trip-explores-urban-innovation-in-mexico-city/" }],
  },
  "invest-atlanta-senior-housing-tad-funding": {
    nutgraf: "The two downtown projects convert tax-allocation-district decisions into a specific housing pipeline: 148 homes, named sites and affordability bands that can be tracked through delivery.",
    whatChanged: "Invest Atlanta reported board actions supporting The Sanctuary and Five Peachtree Senior. The projects together plan 148 affordable senior homes. The Sanctuary calls for 83 homes on the Trinity United Methodist Church campus, while Five Peachtree Senior calls for 65 homes across from 2 Peachtree.",
    matters: "Senior housing affordability is a delivery question, not only a financing announcement. Both projects target households from 30% to 80% of area median income, making construction progress, long-term restrictions and leasing outcomes the next measures of whether the public support produces usable homes.",
    unknown: "The agency account does not by itself confirm final construction completion, lease-up dates, total development cost or long-term operating performance.",
    next: "ATLSignal will watch closing documents, construction milestones, affordability agreements and leasing information for both developments.",
    sources: [{ name: "Invest Atlanta", detail: "First-party May 21 account of board modifications, project sizes, affordability bands and Eastside TAD support.", url: "https://www.investatlanta.com/impact-insights/invest-atlanta-advances-new-affordable-housing-developments" }],
  },
  "municipal-market-merchants-90000-investment": {
    nutgraf: "Nine small awards are more useful when treated as a merchant-level investment story than as another broad economic-development announcement.",
    whatChanged: "Invest Atlanta approved $90,000 for booth improvements at the Municipal Market in Sweet Auburn. Nine merchants were named for $10,000 awards through the Municipal Market Vendor Success Program, with eligible work including signage, fixtures and booth-function upgrades.",
    matters: "Small physical improvements can affect customer flow, equipment reliability and the ability of independent merchants to compete inside a historic public market. The awards also show how Eastside Tax Allocation District funding is reaching individual storefront-scale businesses.",
    unknown: "The announcement does not quantify later sales growth, establish when every improvement will finish or prove that the grants alone will produce long-term business stability.",
    next: "The useful follow-up is visible project completion, merchant experience and whether the program’s design standards and matching requirement improve operations without erasing the market’s character.",
    sources: [{ name: "Invest Atlanta", detail: "First-party April 17 report naming the nine merchants, $90,000 total investment and eligible improvement categories.", url: "https://www.investatlanta.com/impact-insights/invest-atlanta-makes-strategic-investment-in-municipal-market-merchants" }],
  },
  "pittsburgh-yards-piedmont-mobile-health-unit": {
    nutgraf: "The mobile unit adds a recurring service to a site already designed around entrepreneurship and neighborhood access, widening the definition of what the Pittsburgh Yards campus provides.",
    whatChanged: "Atlanta BeltLine reported that a Piedmont mobile health unit supported by Google is serving the Pittsburgh Yards area. A later BeltLine account described the service as available on second Saturdays alongside the Indie Market experience.",
    matters: "Healthcare access, small-business programming and public connectivity are appearing in the same place. That combination can make a development more useful to surrounding residents while bringing repeat foot traffic to local makers and merchants.",
    unknown: "The available first-party material does not establish permanent service, patient volume, the complete clinical schedule or a measured economic effect on Pittsburgh Yards businesses.",
    next: "ATLSignal will watch Piedmont and BeltLine schedules, service data and future programming to determine whether the recurring stop becomes a durable neighborhood resource.",
    sources: [
      { name: "Atlanta BeltLine", detail: "First-party announcement of the Pittsburgh Yards mobile health unit.", url: "https://beltline.org/blog/pittsburgh-yards-welcomes-piedmont-mobile-health-unit-powered-by-google/" },
      { name: "Atlanta BeltLine", detail: "Later first-party account describing second-Saturday service and related small-business programming.", url: "https://beltline.org/blog/bridging-atlanta-s-digital-divide-how-the-beltline-and-google-are-powering-inclusive-connectivity/" },
    ],
  },
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
const permitLeadStory: Story = {
  ...canonicalStories[0],
  metric: displayValue(leadProject.reported_project_value),
  metricLabel: "reported project value",
};

export const leadStory = freshStories[0];
export const stories = [...freshStories.slice(1), ...sourceDeskStories, permitLeadStory, ...canonicalStories.slice(1)];

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

export const coverageLanes = [
  {
    title: "Free media",
    price: "Free · always",
    audience: "Readers, founders, operators and curious locals",
    includes: ["reported public facts", "source links", "plain-English context", "topic guides", "watchlist summaries"],
    excludes: ["buyer contact paths", "private routing notes", "unresolved operator guesses", "premium timing scores"],
  },
  {
    title: "Pro intelligence",
    price: "Founding access · limited cohort",
    audience: "Vendors, brokers, service providers and business development teams",
    includes: ["ranked opportunities", "buyer/operator enrichment", "timing scores", "daily watch changes", "contact-route research"],
    excludes: ["unsupported claims", "private personal data", "uncorroborated social rumors"],
  },
  {
    title: "Market desk",
    price: "Custom · team coverage",
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
    image: editorialPhoto("photo-1500530855697-b586d89ba3ee", "Illustrative urban trail and public-space corridor"),
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
