"use client";

import { useEffect } from "react";

export function SiteAnalytics() {
  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || "/api/analytics";
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" && !process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) return;
    const send = (eventType: string, target?: string) => {
      const payload = JSON.stringify({ eventType, path: window.location.pathname, target });
      void fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true }).catch(() => null);
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
