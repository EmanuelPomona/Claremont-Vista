---
id: TASK-004
title: Homepage events carousel and Events timetable with shift filter + RSVP
status: READY
owner: frontend
branch: agent/frontend
priority: HIGH
round: 0
depends_on: [TASK-003]
blocked_on: ""
---

# TASK-004: Homepage carousel and Events timetable (the signature)

**Time box: 20 minutes.** This is the demo's centerpiece.

## Objective

The homepage carousel from the owner's sketch and the Events page with the
"When / How social" timetable filter and anonymous RSVP, both fed by
`GET /api/events`.

## Scope

`src/pages/Home.tsx`, `src/pages/Events.tsx`,
`src/components/{Carousel,TimetableFilter,EventRow,RsvpButton,VibeLabel}.tsx`,
`src/hooks/useRsvps.ts`, `public/images/events/*.jpg`,
`public/images/CREDITS.md`, plus new i18n keys.

## Steps

1. **Images (5-minute cap):** download free-license photos (Unsplash) for the
   10 event ids in `docs/API.md` to `public/images/events/<id>.jpg` (about
   1600px wide, compressed), and credit them in `CREDITS.md`. Modest real
   scenes, no close-up faces. If the cap runs out, ship the designed fallback
   instead (jacaranda-tint panel with the band label). Never ship a broken image
   icon. Commit.
2. `Carousel`: full-width slides showing photo, title, localized
   "Tue 5:30 AM" / "mar 5:30" (use `Intl.DateTimeFormat(lang)`), location, band
   label, and vibe label. Prev/next buttons (44px, aria-labels), dots
   (`aria-current`), left/right arrow keys, and touch swipe. If it
   auto-advances, it pauses on hover and focus and stops under
   `prefers-reduced-motion`. It handles loading, error (retry), and empty
   ("No upcoming events yet"). Commit.
3. Home: the carousel shows the first 6 events. Below it is the "Living here on
   your terms" strip (3 plain sentences, no cards). Then "This week" shows the
   next 4 rows using `EventRow`, with a link to `/events`. Commit.
4. `TimetableFilter`: two chip rows, **When**: All / Early (before 9am) /
   Midday / Evening (after 4pm) / Weekend, and **How social**: All / Drop in solo /
   Small group / Big gathering. Chips are toggle buttons with `aria-pressed`.
   Filtering happens client-side over one fetch. State lives in the URL query
   (`?band=evening&vibe=solo`). Commit.
5. Events page: rows grouped under band headings in the order early, midday,
   evening, weekend, timetable style (tabular time column, title, place,
   recurrence, `VibeLabel`, `RsvpButton`). No matches shows `EmptyState` with
   "Clear filters". Commit.
6. `useRsvps` keeps a `Set` of ids in `localStorage["cv-rsvps"]`. `RsvpButton`
   shows "I'm going · 12" and then "Going ✓ · 13 (undo)". It disables while the
   request is pending (no double-submit), takes the count from the server
   response, and on failure shows an inline error and leaves the count
   unchanged. Commit.
7. Verify in the browser against the running backend (or fixtures before the
   merge): filter "Evening" + "Drop in solo", RSVP, reload, and toggle ES.
   Take screenshots at 1440/768/390.

## Acceptance Criteria

- [ ] AC-12: the carousel behaves as specified, including keyboard, swipe, and
      reduced motion
- [ ] AC-13: the filter narrows correctly, groups by band, and has an empty
      state with Clear filters
- [ ] AC-14: RSVP count comes from the server, undo works, it survives a
      reload, and failure is handled
- [ ] AC-20: the signature filter is present; band/vibe labels appear on slides
- [ ] AC-17: loading, error with retry, and empty states on both pages
- [ ] Spanish copy at 390px does not overflow chips or buttons

## Review History

| Round | Verdict | Summary |
|---|---|---|
