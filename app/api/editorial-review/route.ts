import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { editorialReviewDecisions } from "@/db/schema";

const decisions = new Set(["APPROVED", "CHANGES_REQUIRED", "REJECTED"]);

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await request.json().catch(() => null) as { candidateId?: unknown; decision?: unknown; notes?: unknown } | null;
  if (typeof body?.candidateId !== "string" || typeof body?.decision !== "string" || !decisions.has(body.decision)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await getDb().insert(editorialReviewDecisions).values({
    decisionId: crypto.randomUUID(), candidateId: body.candidateId,
    reviewerEmail: user.email, decision: body.decision,
    notes: typeof body.notes === "string" ? body.notes.slice(0, 2000) : null,
    createdAt: new Date(),
  });
  return NextResponse.json({ ok: true });
}
