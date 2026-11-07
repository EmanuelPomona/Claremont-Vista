# Architectural Decisions

Decisions that affect more than one agent.

## ADR-001: Bilingual content as `{en, es}` objects in the API

Date: 2026-11-07. Status: Accepted.

**Context.** The owner chose an EN/ES toggle. Most interviewed workers were
Hispanic, and switching language must not cost a refetch or a page reload.

**Decision.** Every user-facing string from the API is `{ "en": ..., "es": ... }`.
UI chrome strings live in `frontend/src/i18n/{en,es}.ts`. The frontend renders
`obj[lang]`.

**Alternatives considered.**
- `?lang=` query param: rejected because it refetches on every toggle and
  doubles the cache.
- An i18n library: rejected as unnecessary for a 1-hour build.

**Consequences.** Payloads are about 2x the text size, which is negligible here.
The backend writes the Spanish seed copy.

## ADR-002: No accounts; anonymous RSVP counts

Date: 2026-11-07. Status: Accepted.

**Context.** The research says community must be optional and private ("doesn't
want to see coworkers outside work"). University Hills' public calendar leaks
residents' names and phones. The build has 1 hour.

**Decision.** There are no logins. RSVP is an anonymous counter, and this
browser's RSVPs are remembered in `localStorage`. Applications store contact
details but no GET ever returns them.

**Alternatives considered.** Household accounts like University Hills: rejected
for both time and privacy reasons.

**Consequences.** Counts can be inflated by repeat clicks, which is accepted for
the prototype. A real launch would add resident verification.

## ADR-004: One-hour time box overrides the default skill and test load

Date: 2026-11-07. Status: Accepted (owner directive).

The owner gave implementation one hour and said to "test only what is
essentially required" and not to over-think. For this project only:

- **Frontend** invokes `frontend-design:frontend-design` (before UI) and
  `superpowers:verification-before-completion` (before handoff). The other three
  mandatory design skills in `docs/SKILL_ROUTING.md` are waived: the brief has
  already made the design decisions. No frontend unit tests.
- **Backend** invokes `superpowers:test-driven-development` for eligibility only
  and `superpowers:verification-before-completion`. Exactly 5 tests.
- **Reviewer** invokes `ecc:browser-qa` and
  `superpowers:verification-before-completion`. Evidence is the 3 width
  screenshots, the console log, `contract-test.sh`, and `pytest` output.
  Per-state screenshots are needed only for the states the demo flow hits.
- `superpowers:requesting-code-review` is waived for workers. The reviewer is
  the review.

Skills not invoked must not be claimed. The audit in protocol §2 still applies.

## ADR-005: Contract change request from the backend accepted (email-or-phone, strict types)

Date: 2026-11-07. Status: Accepted. Source: the CONTRACT CHANGE REQUEST in
`docs/handoffs/agent-backend.md`.

`ApplicationRequest` in `openapi.yaml` now expresses "email or phone required" as
`anyOf` (each branch a required non-empty string), matching the prose and the
implementation. The contract also states that the backend's strict typing (no
string-to-int/bool coercion) is intended. There is no consumer-visible change,
so tasks were not blocked. `scripts/contract-test.sh` was also fixed to use
`--url` with schemathesis 4.x.

## ADR-006: Type change to Instrument Serif + Atkinson Hyperlegible; landing map; motion

Date: 2026-11-07. Status: Accepted (owner request, manager agreed).

**Fonts.** Instrument Serif (headlines), Atkinson Hyperlegible Next (body),
Atkinson Hyperlegible Mono (times and labels) replace Archivo + Public Sans.
Atkinson was designed for low-vision readers, which suits our accessibility
users. The alternative set (Newsreader + Inter Tight + Geist Mono) was rejected
because Inter and Geist are on the DESIGN_CONSTRAINTS default-identity ban list.

**Map.** Leaflet + OpenStreetMap tiles (no API key, attribution required),
grayscale, with one jacaranda pin at the proposed site near CST, the TCCS golf
course, and CGU. Google Maps was rejected because it needs a key and billing.

**Motion.** Accepted: wordmark draw-on, headline rise, scroll reveal, crossfade
carousel, next-up pulse, and micro-interactions, all disabled under
prefers-reduced-motion. Rejected: the scroll-scaled hero photo (there is no hero
photo) and the blurred sticky nav (glassmorphism is banned).

## ADR-007: Typeset wordmark; map copy rewritten

Date: 2026-11-07. Status: Accepted (owner request). The hand-drawn SVG wordmark read as
too playful, so the header now sets "Claremont Vista" in Instrument Serif (jacaranda),
with a short fade-in instead of the stroke-draw animation. The map caption now
describes the site's surroundings: a commercial corridor, the California Botanic
Garden, the Bernard Field Station, and protected coastal sage scrub habitat.

## ADR-003: Local SQLite, no deployment

Date: 2026-11-07. Status: Accepted. The owner chose a local laptop demo.
SQLite needs zero setup, and the DB seeds itself on first start, with event
dates relative to today so the demo never shows past events.
