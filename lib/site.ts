export const publicSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://atlsignal.com").replace(/\/$/, "");

export function absoluteUrl(path: string) {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`;
  return `${publicSiteUrl}${normalized}`;
}
