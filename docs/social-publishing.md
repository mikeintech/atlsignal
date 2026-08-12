# ATLSignal social publishing desk

The newsroom cycle writes `data/social-desk.json`, a rolling seven-day queue of
21 evidence-linked story packages. Each package contains an Instagram carousel
or Reel treatment, an AI narration script when appropriate, Threads and X copy,
story frames, alt text, source links, an original-asset brief, and an
idempotency key.

## Editorial operating model

- Regular human on-camera presence is not required.
- AI may produce narration, motion typography, maps, diagrams, captions and
  original branded layouts.
- AI may not create synthetic documentary footage, fake witnesses, cloned
  voices, invented places or fabricated event imagery.
- Third-party photos and videos are reference-only until a license, permission,
  press-use grant, native repost or embed right is documented.
- When media rights are unclear, publish the ATLSignal graphic and link to the
  original source.
- Sensitive, allegation-driven and crime-related language is held instead of
  being automatically dispatched.

## Automatic delivery

The default build creates the queue without sending anything externally. To
connect a scheduler or automation service, configure these GitHub Actions
secrets:

- `SOCIAL_PUBLISH_ENDPOINT`: a Make, Zapier, Buffer-compatible middleware, or
  other HTTPS webhook that accepts a complete ATLSignal package.
- `SOCIAL_PUBLISH_TOKEN`: optional bearer token used to authenticate the
  webhook.

Every delivery is a JSON `POST` with the event name
`atlsignal.social.package.ready`. The `idempotency-key` header prevents a
compliant receiver from publishing a story twice. Successful deliveries are
recorded in `data/social-dispatch.json`; failed requests are not recorded and
retry on a later run.

The receiving automation should create the final branded asset from the
`production` and `carousel` fields. Every package also includes six public
`renderUrls` that display finished, original 4:5 ATLSignal cards without using
third-party imagery. The receiver can capture those card URLs, upload the
resulting images, publish the matching platform copy, and retain the ATLSignal
article URL and source trail.
