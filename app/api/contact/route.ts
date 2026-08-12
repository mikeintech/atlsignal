import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { newsroomContacts } from "@/db/schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactTypes = new Set(["TIP", "CORRECTION", "DOCUMENT", "IMAGE_RIGHTS", "OTHER"]);
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
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const headers = corsHeaders(request);
  if (request.headers.get("origin") && !Object.keys(headers).length) return NextResponse.json({ ok: false }, { status: 403 });
  if (typeof body?.website === "string" && body.website.trim()) return NextResponse.json({ ok: true }, { headers });

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const pageUrl = typeof body?.pageUrl === "string" ? body.pageUrl.trim().slice(0, 500) : "";
  const contactType = typeof body?.contactType === "string" && contactTypes.has(body.contactType) ? body.contactType : "OTHER";

  if (!emailPattern.test(email) || message.length < 20 || message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Enter a valid email and a message of at least 20 characters." }, { status: 400, headers });
  }

  try {
    await getDb().insert(newsroomContacts).values({
      contactId: crypto.randomUUID(), name: name || null, email, contactType,
      message, pageUrl: pageUrl || null, status: "NEW", createdAt: new Date(),
    });
    return NextResponse.json({ ok: true }, { headers });
  } catch {
    return NextResponse.json({ ok: false, error: "Newsroom contact is temporarily unavailable." }, { status: 503, headers });
  }
}
