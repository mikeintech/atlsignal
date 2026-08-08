import type { Metadata } from "next";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { EditorialReviewQueue, type ReviewCandidate } from "@/components/editorial-review-queue";

export const metadata: Metadata = { title: "Editorial review", robots: { index: false, follow: false } };

const candidates: ReviewCandidate[] = [
  ["ad2f50da-806e-5ecb-b93c-85a95adea6ad", "McKenney’s campus warehouse moves into construction", "Development", 81, .91, 3, "$17.45M reported value"],
  ["9e11d094-f996-583a-bdad-ca5ff633220f", "Lulah Hills Publix moves into construction", "Business", 80, .90, 4, "$4.2M reported value"],
  ["0b0e2577-141e-5955-aaa7-6ce34f7cb76a", "Residences at Perimeter Summit Phase B advances", "Development", 79, .77, 2, "$15.24M reported value"],
  ["d96a2fcb-3639-5c59-ad1c-eaff407ae46e", "Global Village Building C reaches occupancy", "Development", 78, .91, 3, "$1.2M reported value"],
  ["2efafaa7-6f38-5107-a59f-067ff22cf5be", "AutoZone buildout advances on Memorial Drive", "Business", 77, .86, 4, "$548,572 reported value"],
].map(([candidateId, headline, category, score, confidence, evidenceCount, value]) => ({
  candidateId: String(candidateId), headline: String(headline), category: String(category), score: Number(score), confidence: Number(confidence), evidenceCount: Number(evidenceCount),
  facts: [String(value), "Current project stage is supported by canonical government-source events."],
  inferences: ["The stage suggests active commercial work; service demand is not asserted as fact."],
  forecasts: [],
}));

export default async function EditorialReviewPage() {
  const user = await requireChatGPTUser("/atlanta/editorial-review");
  return <main className="review-page"><header><p className="eyebrow">Internal · noindex</p><h1>ATL editorial review</h1><p>Signed in as {user.email}. Decisions are recorded separately and never auto-publish.</p></header><EditorialReviewQueue candidates={candidates} /></main>;
}
