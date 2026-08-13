const slugOverrides: Record<string, string> = {
  "6fbe1c73b53c39b71105": "marta-jonathan-hunt-permanent-ceo",
  "985c2707a769c601eeaf": "metro-atlanta-population-growth-slows-2026",
  "c33955ffa01fcd736353": "marta-world-cup-ridership-2026",
  "f67453ba8c2bdce075f7": "childrens-healthcare-atlanta-economic-impact",
  "6b249e7c034af59fd58e": "midtown-green-98-14th-street-park",
  "50b8c14cc69a9832b524": "hals-steakhouse-spring-quarter-midtown",
  "8b5f7c37bc216143b7a9": "tulsa-welding-school-decatur-women-trades",
  "58557e3aa94b4f70b591": "nabj-2026-atlanta-convention",
};

export function storySlug(id: string, headline: string) {
  if (slugOverrides[id]) return slugOverrides[id];
  return headline
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 82)
    .replace(/-+$/g, "");
}

export function storyHref(id: string, headline: string) {
  return `/news/${storySlug(id, headline)}`;
}
