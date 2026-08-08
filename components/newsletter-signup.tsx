"use client";

import { FormEvent, useState } from "react";

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), marketId: "atlanta", source: compact ? "article" : "homepage" }),
    });
    setState(response.ok ? "saved" : "error");
  }

  return (
    <section className={compact ? "newsletter newsletter--compact" : "newsletter"} aria-labelledby="newsletter-title">
      <div>
        <p className="eyebrow">The ATLSignal Brief</p>
        <h2 id="newsletter-title">Know what’s changing in Atlanta.</h2>
        {!compact && <p>Business, development, policy, infrastructure and public money signals from the ATLSignal desk.</p>}
      </div>
      {state === "saved" ? (
        <p className="newsletter__success" role="status">You’re on the ATLSignal launch list.</p>
      ) : (
        <form onSubmit={submit} className="newsletter__form">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" required />
          <button type="submit" disabled={state === "saving"}>{state === "saving" ? "Saving…" : "Subscribe"}</button>
          {state === "error" && <span className="newsletter__error" role="alert">We couldn’t save that address. Try again shortly.</span>}
        </form>
      )}
    </section>
  );
}
