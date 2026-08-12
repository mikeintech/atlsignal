"use client";

import { FormEvent, useState } from "react";

export function NewsroomContact() {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/api/contact";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        contactType: form.get("contactType"),
        message: form.get("message"),
        pageUrl: form.get("pageUrl"),
        website: form.get("website"),
      }),
    }).catch(() => null);
    setState(response?.ok ? "saved" : "error");
  }

  return (
    <section className="newsroom-contact" aria-labelledby="newsroom-contact-title">
      <div>
        <p className="eyebrow">Contact the newsroom</p>
        <h2 id="newsroom-contact-title">Corrections, documents or a reporting tip?</h2>
        <p>Send the desk enough context to begin reviewing it. Do not send sensitive files or confidential personal information through this form.</p>
      </div>
      {state === "saved" ? (
        <p className="newsroom-contact__success" role="status">Your message is in the newsroom review queue.</p>
      ) : (
        <form onSubmit={submit} className="newsroom-contact__form">
          <label>Name <input name="name" autoComplete="name" maxLength={120} /></label>
          <label>Email <input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          <label>Reason
            <select name="contactType" defaultValue="TIP">
              <option value="TIP">Reporting tip</option>
              <option value="CORRECTION">Correction request</option>
              <option value="DOCUMENT">Document or source</option>
              <option value="IMAGE_RIGHTS">Image rights or attribution</option>
              <option value="OTHER">Other newsroom question</option>
            </select>
          </label>
          <label>Article or source URL <input name="pageUrl" type="url" inputMode="url" placeholder="https://…" maxLength={500} /></label>
          <label className="newsroom-contact__wide">Message <textarea name="message" rows={6} required minLength={20} maxLength={5000} /></label>
          <label className="newsletter__honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          <button type="submit" disabled={state === "saving"}>{state === "saving" ? "Sending…" : "Send to the newsroom"}</button>
          <small>Your message is used only for newsroom follow-up. This does not subscribe you to marketing or the ATLSignal Brief.</small>
          {state === "error" && <span className="newsroom-contact__error" role="alert">We couldn’t save that message. Try again shortly.</span>}
        </form>
      )}
    </section>
  );
}
