import { NextResponse } from "next/server";
import { newsletterStore } from "@/lib/newsletter";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedOrigins = new Set([
  "https://atlsignal.com",
  "https://www.atlsignal.com",
  "https://mikeintech.github.io",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const sameOrigin = origin === new URL(request.url).origin;
  return origin && (sameOrigin || allowedOrigins.has(origin))
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" }
    : {};
}

export async function OPTIONS(request: Request) {
  const headers = corsHeaders(request);
  return new Response(null, { status: Object.keys(headers).length ? 204 : 403, headers });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; marketId?: unknown; source?: unknown; website?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const headers = corsHeaders(request);
  if (request.headers.get("origin") && !Object.keys(headers).length) {
    return NextResponse.json({ ok: false, error: "Origin not allowed." }, { status: 403 });
  }
  if (typeof body?.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true }, { headers });
  }
  if (!emailPattern.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400, headers });
  }
  const marketId = body?.marketId === "atlanta" ? "atlanta" : "atlanta";
  const source = typeof body?.source === "string" && body.source.length <= 80 ? body.source : "publication";
  try {
    await newsletterStore.subscribe({ email, marketId, source, consentVersion: "atl_newsletter_v1" });
    return NextResponse.json({ ok: true }, { headers });
  } catch {
    return NextResponse.json({ ok: false, error: "Subscription capture is temporarily unavailable." }, { status: 503, headers });
  }
}
