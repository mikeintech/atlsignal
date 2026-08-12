import type { Metadata } from "next";
import { notFound } from "next/navigation";
import socialDesk from "@/data/social-desk.json";
import "../../social-card.css";

export const metadata: Metadata = {
  title: "ATLSignal social asset",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return socialDesk.packages.flatMap((item) =>
    item.carousel.map((card) => ({ id: item.packageId, slide: String(card.slide) })),
  );
}

export default async function SocialCardPage({ params }: { params: Promise<{ id: string; slide: string }> }) {
  const { id, slide } = await params;
  const item = socialDesk.packages.find((candidate) => candidate.packageId === id);
  const card = item?.carousel.find((candidate) => String(candidate.slide) === slide);
  if (!item || !card) notFound();

  const tone = item.franchise === "$ATL"
    ? "money"
    : item.franchise === "From the File" || item.franchise === "Atlanta Then / Now"
      ? "archive"
      : item.franchise === "Opening Watch"
        ? "opening"
        : "signal";

  return (
    <main className={`social-render social-render--${tone}`}>
      <article className="social-art" aria-label={item.production.altText}>
        <header className="social-art__masthead">
          <div className="social-art__brand"><strong>ATL</strong><span>SIGNAL</span></div>
          <p>Atlanta, explained from the receipts.</p>
        </header>
        <section className="social-art__content">
          <p className="social-art__eyebrow">{card.label}</p>
          <h1>{card.heading}</h1>
          <p className="social-art__body">{card.body}</p>
        </section>
        <footer className="social-art__footer">
          <div><span>{item.category}</span><strong>{item.evidenceLabel}</strong></div>
          <p>{card.slide} / {item.carousel.length}</p>
        </footer>
      </article>
    </main>
  );
}
