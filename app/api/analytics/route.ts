import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { contentAnalytics } from "@/db/schema";

const allowed = new Set(["PAGE_VIEW", "LINK_CLICK"]);
const allowedOrigins = new Set(["https://atlsignal.com", "https://www.atlsignal.com", "https://mikeintech.github.io"]);

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
  const headers = corsHeaders(request);
  if (request.headers.get("origin") && !Object.keys(headers).length) return new NextResponse(null, { status: 403 });
  const body = await request.json().catch(() => null) as { eventType?: unknown; path?: unknown; target?: unknown } | null;
  if (typeof body?.eventType !== "string" || !allowed.has(body.eventType) || typeof body.path !== "string" || !body.path.startsWith("/") || body.path.length > 500) {
    return NextResponse.json({ ok: false }, { status: 400, headers });
  }
  try {
    await getDb().insert(contentAnalytics).values({
      analyticsId: crypto.randomUUID(), eventType: body.eventType,
      path: body.path, target: typeof body.target === "string" ? body.target.slice(0, 500) : null,
      createdAt: new Date(),
    });
  } catch {
    return new NextResponse(null, { status: 204, headers });
  }
  return new NextResponse(null, { status: 204, headers });
}
