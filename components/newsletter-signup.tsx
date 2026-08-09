"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type NewsletterSignupProps = {
  compact?: boolean;
  source?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  successMessage?: string;
};

export function NewsletterSignup({
  compact = false,
  source,
  eyebrow = "The ATLSignal Brief",
  title = "Know what’s changing in Atlanta.",
  description = "Business, development, policy, infrastructure and public money signals from the ATLSignal desk.",
  buttonLabel = "Subscribe",
  successMessage = "You’re on the ATLSignal Brief list.",
}: NewsletterSignupProps) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;
  const captureUnavailable = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" && !endpoint;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const captureSource = source ?? (compact ? "article" : "homepage");
    if (endpoint) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, marketId: "atlanta", source: captureSource, website: form.get("website") }),
      }).catch(() => null);
      setState(response?.ok ? "saved" : "error");
      return;
    }
    if (captureUnavailable) {
      window.location.href = `mailto:newsletter@atlsignal.com?subject=${encodeURIComponent("Join the ATLSignal Brief")}&body=${encodeURIComponent(`Please add ${email} to the ATLSignal Brief.`)}`;
      setState("saved");
      return;
    }
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), marketId: "atlanta", source: captureSource }),
    });
    setState(response.ok ? "saved" : "error");
  }

  return (
    <section className={compact ? "newsletter newsletter--compact" : "newsletter"} aria-labelledby="newsletter-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="newsletter-title">{title}</h2>
        {!compact && <p>{description}</p>}
      </div>
      {state === "saved" ? (
        <p className="newsletter__success" role="status">{successMessage}</p>
      ) : (
        <form onSubmit={submit} className="newsletter__form">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" required />
          <label className="newsletter__honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          <button type="submit" disabled={state === "saving"}>{state === "saving" ? "Saving…" : buttonLabel}</button>
          {state === "error" && <span className="newsletter__error" role="alert">We couldn’t save that address. Try again shortly.</span>}
          {captureUnavailable && <span className="newsletter__note">Subscription opens a pre-addressed email while direct web capture is being activated.</span>}
          {!captureUnavailable && <span className="newsletter__note">By subscribing, you agree to receive the ATLSignal Brief. See our <Link href="/privacy">privacy policy</Link>.</span>}
        </form>
      )}
    </section>
  );
}
