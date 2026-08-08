import { NextResponse } from "next/server";
import { newsletterStore } from "@/lib/newsletter";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; marketId?: unknown; source?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!emailPattern.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  const marketId = body?.marketId === "atlanta" ? "atlanta" : "atlanta";
  const source = typeof body?.source === "string" && body.source.length <= 80 ? body.source : "publication";
  try {
    await newsletterStore.subscribe({ email, marketId, source, consentVersion: "atl_newsletter_v1" });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Subscription capture is temporarily unavailable." }, { status: 503 });
  }
}
