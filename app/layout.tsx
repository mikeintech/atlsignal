import type { Metadata } from "next";
import "./globals.css";
import { SiteAnalytics } from "@/components/site-analytics";
import { absoluteUrl, publicSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(`${publicSiteUrl}/`),
  title: {
    default: "ATLSignal",
    template: "%s | ATLSignal",
  },
  description: "Business, development, money and opportunity intelligence for Atlanta.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ATLSignal",
    title: "ATLSignal",
    description: "Know what’s changing in Atlanta before it becomes obvious.",
    images: [{ url: absoluteUrl("/og.png"), width: 1734, height: 907, alt: "Atlanta skyline and commercial development" }],
  },
  twitter: { card: "summary_large_image", images: [absoluteUrl("/og.png")] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}<SiteAnalytics /></body>
    </html>
  );
}
