const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://mikeintech.github.io/atlsignal").replace(/\/$/, "");
const key = "7f4c5e9a2b816d30f6a1c8e457b39d02";
const sitemapResponse = await fetch(`${site}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Unable to read live sitemap: ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].replaceAll("&amp;", "&")).slice(0, 10_000);
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList: urls }),
});
if (!response.ok && response.status !== 202) throw new Error(`IndexNow rejected the update: ${response.status}`);
console.log(`Submitted ${urls.length} ATLSignal URLs to IndexNow (${response.status}).`);
