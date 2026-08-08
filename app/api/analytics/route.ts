import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { contentAnalytics } from "@/db/schema";

const allowed = new Set(["PAGE_VIEW", "LINK_CLICK"]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { eventType?: unknown; path?: unknown; target?: unknown } | null;
  if (typeof body?.eventType !== "string" || !allowed.has(body.eventType) || typeof body.path !== "string" || !body.path.startsWith("/") || body.path.length > 500) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    await getDb().insert(contentAnalytics).values({
      analyticsId: crypto.randomUUID(), eventType: body.eventType,
      path: body.path, target: typeof body.target === "string" ? body.target.slice(0, 500) : null,
      createdAt: new Date(),
    });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  return new NextResponse(null, { status: 204 });
}
