"use client";

import { useState } from "react";

export type ReviewCandidate = {
  candidateId: string;
  headline: string;
  category: string;
  score: number;
  confidence: number;
  evidenceCount: number;
  facts: string[];
  inferences: string[];
  forecasts: string[];
};

export function EditorialReviewQueue({ candidates }: { candidates: ReviewCandidate[] }) {
  const [selected, setSelected] = useState(candidates[0]);
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function decide(decision: "APPROVED" | "CHANGES_REQUIRED" | "REJECTED") {
    setBusy(true);
    const response = await fetch("/api/editorial-review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ candidateId: selected.candidateId, decision }),
    });
    if (response.ok) setSaved((current) => ({ ...current, [selected.candidateId]: decision }));
    setBusy(false);
  }

  return (
    <div className="review-layout">
      <aside className="review-queue" aria-label="Editorial candidates">
        {candidates.map((candidate) => (
          <button key={candidate.candidateId} className={selected.candidateId === candidate.candidateId ? "is-active" : ""} onClick={() => setSelected(candidate)}>
            <span>{candidate.category} · {candidate.score}</span><strong>{candidate.headline}</strong><small>{saved[candidate.candidateId] ?? "Pending"}</small>
          </button>
        ))}
      </aside>
      <section className="review-panel">
        <header><div><p className="eyebrow">{selected.category} · score {selected.score}</p><h2>{selected.headline}</h2></div><div className="review-confidence"><strong>{Math.round(selected.confidence * 100)}%</strong><span>confidence</span></div></header>
        <div className="review-checks"><span>Passed · Public-safe</span><span>Passed · {selected.evidenceCount} canonical events</span><span>Review · Human decision required</span></div>
        <ReviewClass title="Facts" items={selected.facts} tone="fact" />
        <ReviewClass title="Inferences" items={selected.inferences} tone="inference" />
        <ReviewClass title="Forecasts" items={selected.forecasts} tone="forecast" />
        <div className="review-actions"><button disabled={busy} onClick={() => decide("APPROVED")}>Approve</button><button disabled={busy} onClick={() => decide("CHANGES_REQUIRED")}>Request changes</button><button disabled={busy} onClick={() => decide("REJECTED")}>Reject</button></div>
        <p className="review-guardrail">A saved approval records a review decision only. It does not publish or change the canonical intelligence graph.</p>
      </section>
    </div>
  );
}

function ReviewClass({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return <section className={`review-class review-class--${tone}`}><h3>{title}</h3>{items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p>None stated.</p>}</section>;
}
