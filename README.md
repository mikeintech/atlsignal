# ATLSignal

Static-first Atlanta intelligence publication.

## GitHub Pages

This project can be deployed directly to GitHub Pages as a static site.

1. Push this `publication` folder to a GitHub repository.
2. In the repo, enable Pages with source set to GitHub Actions.
3. Optionally set repository variables:
   - `NEXT_PUBLIC_SITE_URL`: the final site URL, such as `https://yourname.github.io/atlsignal`.
   - `NEXT_PUBLIC_BASE_PATH`: set to `/atlsignal` only when deploying to a project page under that repo path. Leave blank for `yourname.github.io`.
   - `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`: optional external form endpoint such as Formspree, Buttondown, Beehiiv, ConvertKit, or a small serverless form handler.
   - `NEXT_PUBLIC_CONTACT_ENDPOINT`: the persistent newsroom-contact endpoint used by the static edition.
   - `NEXT_PUBLIC_ANALYTICS_ENDPOINT`: the privacy-light event endpoint used by the static edition.
4. Push to `main`; `.github/workflows/pages.yml` builds and publishes the static site.

The same workflow runs the evidence-gated newsroom at 11:15, 15:15, 19:15 and 23:15 UTC
every day. It collects approved first-party sources, monitors restricted local
publishers through search-result metadata only, clusters related coverage, and
writes `data/newsroom.json`, rebuilds the twenty-post daily file and rotates older verified work back into view. A scheduled run fails closed when a critical
first-party desk is unavailable; discovery-provider failures are recorded as
degraded without turning secondary headlines into publishable facts.

Local static build:

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://yourname.github.io/atlsignal NEXT_PUBLIC_BASE_PATH=/atlsignal npm run build:github
```

Run one newsroom cycle locally:

```bash
npm run newsroom
```

The active cycle is now owned-media only. Qualified primary-source items become
ATLSignal reports or source notes; reputable attributed discoveries receive a
hosted ATLSignal brief with a direct source trail. Stronger briefs can enter the
XML and news sitemaps, while weaker discovery pages are explicitly `noindex`.
The former social packaging files remain in the repository as an archive, but
the newsroom build no longer generates or dispatches social content.

Source access rules and request caps live in `config/newsroom-sources.json`.
Metadata-only discoveries may receive an attributed monitoring page for reader
continuity, but those pages are `noindex` and never presented as confirmed
reporting. They remain in the corroboration queue until stronger evidence is
available.

The static export is written to `.next-github`.

Newsletter capture on GitHub Pages requires `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`.
Without it, the form falls back to the dynamic `/api/newsletter` path used by
the Codex/Sites build and will not capture submissions on GitHub Pages.

## Codex/Sites build

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
