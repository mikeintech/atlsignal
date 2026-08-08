export type MarketBrand = {
  marketId: string;
  slug: string;
  code: string;
  displayName: string;
  editionName: string;
  tagline: string;
};

export const atlanta: MarketBrand = {
  marketId: "atlanta",
  slug: "atlanta",
  code: "ATLSignal",
  displayName: "Atlanta",
  editionName: "ATLSignal",
  tagline: "Know what’s changing before it becomes obvious.",
};

export const categories = [
  "Latest",
  "Business",
  "Development",
  "Policy",
  "Transit",
  "Money",
  "Economy",
  "Opportunities",
  "Projects",
] as const;
