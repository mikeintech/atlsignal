import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  EditionHeader,
  EvidenceList,
  Headline,
  MapPreview,
  ProjectStatus,
  PublicationHeader,
  SectionHeading,
  Timeline,
} from "@/components/publication";
import { atlanta } from "@/lib/market";
import { projects } from "@/lib/atlanta-data";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: `${project.name} project`, description: `Living intelligence page for ${project.name} in Atlanta.`, alternates: { canonical: `/atlanta/project/${project.slug}` }, openGraph: { type: "article", title: `${project.name} project`, description: `${project.status} · ${project.location} · ${project.detail} reported value.`, images: ["/og.png"] }, twitter: { card: "summary_large_image", images: ["/og.png"] } } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const lead = project.slug === "mckenney-s-campus-project-mckenney-s-warehouse";
  return (
    <>
      <PublicationHeader market={atlanta} /><EditionHeader market={atlanta} />
      <main className="project-page shell">
        <header className="project-hero"><div><p className="eyebrow">Living project file</p><Headline as="h1" size="large">{project.name}</Headline><p>{project.location} · Atlanta market</p><ProjectStatus>{project.status}</ProjectStatus></div><div className="project-hero__number"><strong>{project.detail}</strong><span>reported project value</span></div></header>
        <div className="project-layout">
          <div>
            <section><SectionHeading label="Overview" /><p className="project-copy">This page tracks the verified public record around {project.name}. Its state changes as new evidence enters the canonical project graph; historical versions remain attributable.</p></section>
            <section><SectionHeading label="Timeline" /><Timeline events={lead ? [
              { date: "Oct. 7, 2025", title: "Land-development event", detail: "Observed in DeKalb County planning applications." },
              { date: "Feb. 20, 2026", title: "Permit application", detail: "Building permit application recorded." },
              { date: "May 29, 2026", title: "Permit issuance", detail: "Issued-permit evidence supports construction-ready stage." },
            ] : [{ date: "Aug. 7, 2026", title: project.status, detail: "Current canonical project stage captured for editorial review." }]} /></section>
            <section><SectionHeading label="Companies involved" /><div className="empty-state"><strong>Not yet publicly resolved</strong><p>Developer, owner and general contractor identities remain withheld until separately supported by canonical evidence.</p></div></section>
            <section><SectionHeading label="Sources" /><EvidenceList sources={lead ? [
              { name: "DeKalb County Planning Applications", detail: "Planning milestone evidence." },
              { name: "DeKalb Building Permit Applications", detail: "Permit application and issuance evidence.", url: "https://dcgis.dekalbcountyga.gov/mapping/rest/services/Building_Permit_Applications/FeatureServer/0" },
            ] : [{ name: "ATLSignal evidence graph", detail: "Qualified public-source project evidence." }]} /></section>
          </div>
          <aside><MapPreview label={`${project.name} location preview`} /><div className="watch-box"><p className="eyebrow">What we’re watching</p><ul><li>Construction milestone updates</li><li>Verified project participants</li><li>Occupancy evidence</li><li>Material changes to reported value</li></ul></div></aside>
        </div>
      </main>
    </>
  );
}
