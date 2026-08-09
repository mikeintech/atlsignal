export const publicSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://atlsignal.com").replace(/\/$/, "");

export function absoluteUrl(path: string) {
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const isFile = /\/[^/]+\.[a-z0-9]+$/i.test(`/${cleanPath}`);
  const normalized = path === "/" ? "/" : `/${cleanPath}${isFile ? "" : "/"}`;
  return `${publicSiteUrl}${normalized}`;
}
