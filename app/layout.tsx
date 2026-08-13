import type { Metadata } from "next";
import "./globals.css";
import { SiteAnalytics } from "@/components/site-analytics";
import { PublicationFooter } from "@/components/publication";
import { absoluteUrl, publicSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(`${publicSiteUrl}/`),
  title: {
    default: "ATLSignal",
    template: "%s | ATLSignal",
  },
  description: "Atlanta news, business, development and city-life reporting with visible source trails and a separate commercial Radar layer.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ATLSignal",
    title: "ATLSignal",
    description: "Know what’s changing in Atlanta before it becomes obvious.",
    images: [{ url: absoluteUrl("/og-social-v2.png"), width: 1733, height: 907, alt: "ATLSignal — Atlanta, explained from the receipts" }],
  },
  twitter: { card: "summary_large_image", images: [absoluteUrl("/og-social-v2.png")] },
  icons: {
    icon: absoluteUrl("/favicon.svg"),
    shortcut: absoluteUrl("/favicon.svg"),
  },
  alternates: { types: { "application/rss+xml": absoluteUrl("/feed.xml") } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publisher = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "ATLSignal",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/og-social-v2.png"),
    areaServed: "Metro Atlanta",
    founder: { "@type": "Person", name: "Mike", url: "https://github.com/mikeintech" },
    publishingPrinciples: absoluteUrl("/methodology"),
    correctionsPolicy: absoluteUrl("/corrections"),
  };
  return (
    <html lang="en">
      <body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(publisher).replace(/</g, "\\u003c") }} />{children}<PublicationFooter /><SiteAnalytics /></body>
    </html>
  );
}
