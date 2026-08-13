# ATLSignal Instagram + Threads publishing (paused)

Social generation and dispatch were removed from the active newsroom workflow
on August 13, 2026 so ATLSignal can focus on its owned publication, search,
newsletter and direct-reader growth. The files documented below are retained as
an implementation archive and are not produced or scheduled by the live build.

ATLSignal builds a rolling seven-day queue of 21 reviewed story packages and
126 finished 1080×1350 PNG cards. The initial publishing surface is deliberately
limited to Instagram and Threads.

## What the newsroom produces

- `data/social-desk.json`: schedule, copy, evidence boundaries, links and public
  asset URLs.
- `public/social-assets/{packageId}/{1..6}.png`: finished original carousel
  cards. Meta can fetch these directly; no webpage screenshot step is required.
- `data/social-dispatch.json`: delivery receipts returned by the publisher.

The default public and asset origin is the working GitHub Pages deployment,
`https://mikeintech.github.io/atlsignal`. Set `SOCIAL_PUBLIC_SITE_URL` and
`SOCIAL_ASSET_BASE_URL` when `atlsignal.com` is resolving publicly.

## Editorial safeguards

- Automatic publishing is limited to Tier A, publishable evidence with enough
  source context and no sensitive or allegation-driven language.
- The cards use original typography and layouts, not downloaded publisher
  images or synthetic documentary scenes.
- Every package separates what is confirmed, why it matters, what is unknown
  and what ATLSignal will track next.
- Held packages are never sent to the publisher.

## Make scenario

Create one scenario named `ATLSignal — Instagram + Threads`:

1. **Webhooks / Custom webhook** receives the ATLSignal JSON payload.
2. **Data store / Get a record** looks up `package.idempotencyKey`.
3. If a completed record exists, return its stored receipt immediately.
4. **Instagram for Business / Create a carousel post** maps all six
   `package.production.assetUrls[]` items and `package.platforms.instagram.caption`.
5. **HTTP** creates six Threads image item containers. For each URL, send a
   `POST` to `https://graph.threads.net/v1.0/me/threads` with `media_type=IMAGE`,
   `image_url`, `is_carousel_item=true`, `alt_text`, and the Threads access token.
6. **HTTP** creates the Threads carousel container with `media_type=CAROUSEL`,
   the comma-separated child container IDs and `package.platforms.threads.post`.
7. **HTTP** publishes it with a `POST` to
   `https://graph.threads.net/v1.0/me/threads_publish` and the returned
   `creation_id`.
8. **Data store / Add or replace a record** stores both platform IDs under the
   idempotency key.
9. **Webhooks / Webhook response** returns HTTP 200 only after both platforms
   confirm publication.

The success response must have this shape:

```json
{
  "results": {
    "instagram": { "status": "published", "id": "..." },
    "threads": { "status": "published", "id": "..." }
  }
}
```

Any other response is treated as a failure and retried during a later newsroom
run. The Make data store prevents a partial retry from duplicating a post that
already succeeded.

## GitHub configuration

Add these repository secrets after the Make webhook is live:

- `SOCIAL_PUBLISH_ENDPOINT`: the Make custom-webhook URL.
- `SOCIAL_PUBLISH_TOKEN`: optional shared bearer token checked by the scenario.

Optional repository variables:

- `SOCIAL_PUBLIC_SITE_URL`: public article origin.
- `SOCIAL_ASSET_BASE_URL`: public origin that serves the generated PNGs.

GitHub Actions refreshes the newsroom four times per day and deploys its assets.
A separate lightweight publisher checks just after each 7:35, 12:15 and 18:35
ET slot in both daylight and standard time. It records only receipts that
confirm both Instagram and Threads, while duplicate checks make the extra
seasonal clock run harmless.
