import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?><OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"><ShortName>ATLSignal</ShortName><Description>Search Atlanta reporting from ATLSignal</Description><InputEncoding>UTF-8</InputEncoding><Url type="text/html" template="${xml(absoluteUrl("/search"))}?q={searchTerms}" /></OpenSearchDescription>`;
  return new Response(body, { headers: { "content-type": "application/opensearchdescription+xml; charset=utf-8", "cache-control": "public, max-age=86400" } });
}
