"use client";

import { useEffect } from "react";

export function SiteAnalytics() {
  useEffect(() => {
    const send = (eventType: string, target?: string) => {
      const payload = JSON.stringify({ eventType, path: window.location.pathname, target });
      navigator.sendBeacon?.("/api/analytics", new Blob([payload], { type: "application/json" }));
    };
    send("PAGE_VIEW");
    const click = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (anchor) send("LINK_CLICK", anchor.getAttribute("href") ?? undefined);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
