import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { attributedBriefs, getAttributedBrief } from "@/lib/attributed-briefs";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return attributedBriefs.map((brief) => ({ id: brief.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const brief = getAttributedBrief((await params).id);
  if (!brief) return {};
  return { title: brief.headline, alternates: { canonical: absoluteUrl(brief.href) }, robots: { index: false, follow: true } };
}

export default async function LegacyBriefRedirect({ params }: { params: Promise<{ id: string }> }) {
  const brief = getAttributedBrief((await params).id);
  if (!brief) notFound();
  return <main className="shell legacy-redirect"><meta httpEquiv="refresh" content={`0;url=${brief.href}`} /><h1>This ATLSignal story has a new address.</h1><p><Link href={brief.href}>Continue to “{brief.headline}” →</Link></p></main>;
}
