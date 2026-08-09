"use client";

import { useState } from "react";
import { Bell, Check, Copy, Mail, Share2 } from "lucide-react";

export function ArticleActions({ title, category }: { title: string; category: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function share() {
    if (navigator.share) await navigator.share({ title, url: window.location.href });
    else await copyLink();
  }

  return (
    <div className="article-actions" aria-label="Article actions">
      <button type="button" onClick={share}><Share2 size={16} /> Share</button>
      <button type="button" onClick={copyLink}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy link"}</button>
      <a href="/#newsletter"><Bell size={16} /> Follow {category}</a>
      <a href={`mailto:newsroom@atlsignal.com?subject=${encodeURIComponent(`Tip about: ${title}`)}`}><Mail size={16} /> Send a tip</a>
    </div>
  );
}
