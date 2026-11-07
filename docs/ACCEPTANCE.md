# Acceptance Criteria: Claremont Vista

The reviewer gates against this file and the per-task criteria. Task files quote
these IDs.

## Product

- **AC-01** The primary demo flow in `docs/PRODUCT.md` (steps 1 to 7) completes
  end to end on integrated `main` with no manual DB edits.
- **AC-02** No real interviewee name appears anywhere in `frontend/` or
  `backend/` (`grep -ri` for the names in the private notes returns nothing;
  the reviewer asks the manager for the list if needed).

## Frontend functionality

- **AC-10** Header on every route: the SVG wordmark (links to `/`), six nav links
  in sketch order (Facilities, Events, Clubs, About, Contact, Application), and an
  EN/ES toggle. The active route is visibly marked.
- **AC-11** Toggling to ES switches all nav, page copy, button labels, and API
  content (titles, descriptions, locations, hours) with no reload. `<html lang>`
  becomes `es`. The choice survives a reload.
- **AC-12** The homepage carousel shows upcoming events from `GET /api/events`
  with photo, title, day and time, band and vibe labels. Prev/next arrows and
  dots work, the left/right arrow keys work when focused, and swipe works on
  touch. Auto-advance (if any) pauses on hover and focus and is disabled under
  `prefers-reduced-motion`.
- **AC-13** Events page: selecting "Evening" + "Drop in solo" shows only matching
  rows, grouped under band headings. Clearing the filters restores all rows. A
  filter combination with no matches shows a designed empty state with a
  "Clear filters" button.
- **AC-14** "I'm going" increments the count from the server response, changes to
  "Going ✓" with an undo, and survives a reload (via `localStorage`). On network
  failure the count does not change and an inline error appears.
- **AC-15** Application form: client-side validation (required fields, household
  1 to 8, income >= 0, email or phone) shows inline field errors without a network
  call. Submit shows a loading state. Success shows the status in plain words,
  `max_comfortable_rent`, and which proposed unit rents fit under it. A server
  400 maps `field` to the inline error.
- **AC-16** Contact page feedback form: rating 1 to 5 is required, and success
  shows a confirmation; failure shows an error and keeps the typed text.
- **AC-17** Every API-backed view has loading, error (with retry), and empty
  states.

## UI/UX

- **AC-20** The signature "When / How social" timetable filter from
  `docs/DESIGN_BRIEF.md` is present on Events, and band/vibe labels appear on
  carousel slides.
- **AC-21** Palette and type match the brief (Archivo + Public Sans, the
  jacaranda accent, the `#FBF8F3` canvas). No pure white canvas, no extra hues.
- **AC-22** At 390px: nav is usable (wraps or collapses into a menu), the
  carousel arrows don't cover the caption, there is no horizontal scroll, and tap
  targets are at least 44px.
- **AC-23** Keyboard: all controls are reachable, with a visible focus ring.
  Images have alt text. Pinch-zoom is not disabled. There is one `h1` per page.
- **AC-24** `scripts/slop-check.sh` hits are removed or justified in the brief.

## Backend

- **AC-30** `scripts/contract-test.sh` passes against the running backend.
- **AC-31** `pytest -q` passes the 5 required tests listed in `docs/API.md`.
  That is the whole test suite: no further unit tests, by owner directive.
  Frontend has no unit tests; it is verified by `npm run build` plus the browser.
- **AC-32** Invalid input returns 400 with `{error, message, field}`; an unknown
  event returns 404 `event_not_found`.
- **AC-33** A fresh start with no DB file seeds 10 events, 6 clubs, and 9
  facilities, and all events are upcoming.

## Integration

- **AC-40** The frontend reaches the backend at the configured port with no CORS
  errors, and `VITE_USE_FIXTURES` is off on integrated `main`.
- **AC-41** The browser console is clean of errors during the primary flow.

## Demo

- **AC-50** From a clean clone: `scripts/bootstrap.sh`, then the backend and
  frontend run commands in `docs/ARCHITECTURE.md`, give a working, non-empty site.
