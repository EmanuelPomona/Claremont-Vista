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

## ADR-003: Local SQLite, no deployment

Date: 2026-11-07. Status: Accepted. The owner chose a local laptop demo.
SQLite needs zero setup, and the DB seeds itself on first start, with event
dates relative to today so the demo never shows past events.
