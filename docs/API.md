# API Contract: Claremont Vista

Prose twin of `docs/openapi.yaml`. **openapi.yaml is authoritative**; this file
explains the rules and seed data behind it. Both change together, and only the
manager edits them. Backend proposes changes via `docs/AGENT_PROTOCOL.md` §6.

## Base URL

Development: `http://localhost:$BACKEND_PORT` (from `.env`; frontend reads
`VITE_API_BASE_URL`). There is no production URL, since this is a local demo.

## Conventions

- JSON in and out. All paths start with `/api`.
- **Bilingual text** is always `{ "en": "...", "es": "..." }` with both keys
  non-empty. The frontend picks `obj[lang]`. Spanish must be real Spanish, not
  machine-garbled. Use neutral Latin American Spanish.
- Datetimes are ISO 8601 **with offset**, America/Los_Angeles
  (`2026-11-10T05:30:00-08:00`).
- IDs are strings. Event, club, and facility IDs are the slugs listed below and
  are stable.
- **Errors** are always `{ "error": code, "message": text, "field"?: name }`.
  Validation failures return **400** (not 422). Codes: `validation_error`,
  `contact_required`, `invalid_query`, `event_not_found`, `internal_error`.
- Privacy: no endpoint returns or stores any resident's identity alongside an
  RSVP. Applications store contact details but are never returned by any GET.

## Endpoints

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/health` | 200 `{status:"ok"}` | |
| GET | `/api/events?band=&vibe=&limit=` | 200 `{events: Event[]}` | 400 `invalid_query` (bad band/vibe/limit, `field` = param) |
| POST | `/api/events/{id}/rsvp` | 200 `{event_id, going_count}` | 404 `event_not_found` |
| DELETE | `/api/events/{id}/rsvp` | 200 `{event_id, going_count}` (floor 0) | 404 `event_not_found` |
| GET | `/api/clubs` | 200 `{clubs: Club[]}` | |
| GET | `/api/facilities` | 200 `{facilities: Facility[]}` | |
| POST | `/api/applications` | 201 `ApplicationResponse` | 400 `validation_error` / `contact_required` |
| POST | `/api/feedback` | 201 `{feedback_id}` | 400 `validation_error` |
| GET | `/api/metrics` | 200 `Metrics` | |

### GET /api/events

- Returns only events with `ends_at >= now`, sorted by `starts_at` ascending.
- `band` and `vibe` are optional exact-match filters and combine with AND.
- **Band is derived, not stored by hand**, from `starts_at` in
  America/Los_Angeles: Sat/Sun is `weekend`; otherwise hour < 9 is `early`,
  hour < 16 is `midday`, and anything later is `evening`.
- Empty result: `{ "events": [] }` with status 200.

### RSVP

There is no body and no identity, and the count is anonymous. The frontend
remembers which events this browser RSVP'd to in `localStorage["cv-rsvps"]`
(an array of IDs), so the button shows "Going ✓ (undo)". The server does not
dedupe; that is accepted for the prototype.

### POST /api/applications: eligibility rules (TDD these)

The income limits are **2026 LA County HOME 50% AMI** limits (source cited in
pre-planning research: $58,300 for 1 person, $83,300 for 4). The 80% tier is a
prototype estimate of 1.6x the 50% limit, rounded to the nearest $50.
Hardcode this table; do not compute it at runtime.

| household_size | income_limit_50 | income_limit_80 |
|---|---|---|
| 1 | 58300 | 93300 |
| 2 | 66650 | 106650 |
| 3 | 74950 | 119900 |
| 4 | 83300 | 133300 |
| 5 | 89950 | 143900 |
| 6 | 96650 | 154650 |
| 7 | 103300 | 165300 |
| 8 | 109950 | 175900 |

Status, first match wins:

1. `employer == "other"` gives `needs_review`
2. `annual_income <= income_limit_50` gives `priority`
3. `annual_income <= income_limit_80` gives `eligible`
4. otherwise, `over_income`

`max_comfortable_rent = floor(annual_income * 0.30 / 12)`

Input typing (ADR-005): at least one of `email`/`phone` must be a non-empty
string, and `""` counts as not provided. Integers and booleans must be real JSON
types: `"3"` for `household_size` is a 400, not coerced.

Every valid application is stored (whatever its status) and returns 201.
`application_id` is `CV-` plus a 4-digit zero-padded sequence (`CV-0001`).

Required tests (owner directive: one-hour build, test only what's essential,
which is these 5 and nothing more):

- size 3, $52,000, pomona: `priority`, limits 74950/119900, rent 1300
- size 1, $58,301: `eligible` (just over the inclusive 50% boundary)
- size 4, $133,301: `over_income`
- employer other, $20,000: `needs_review`
- neither email nor phone: 400 `contact_required`, field `email`

### POST /api/feedback

`rating` is 1 to 5 (required), `message` at most 1000 characters (optional),
`page` at most 50 (optional), and `language` is en|es. Feedback is anonymous.
Returns `FB-0001`-style IDs.

### GET /api/metrics

`applications` is the count of stored applications. `rsvps` is the sum of
`going_count` across all events. `feedback_count` is the count of feedback.
`average_rating` is rounded to 1 decimal, or `null` when there is no feedback.

## Seed data (backend writes it; frontend supplies the images)

Dates are computed **relative to the current date**: each event is scheduled on
the next occurrence of its weekday, 1 to 7 days from today, at the local time
shown. Recurring events seed only their next instance.

### Events (10). Image path = `/images/events/<id>.jpg`, file owned by frontend

| id | English title | weekday, local time | vibe | audience | recurrence (en) | going_count |
|---|---|---|---|---|---|---|
| sunrise-yoga | Sunrise yoga before your shift | Tue 05:30-06:15 | solo | adults | Tuesdays and Thursdays | 6 |
| early-coffee | Coffee and pan dulce at the shuttle stop | Thu 06:00-07:00 | solo | everyone | Every Thursday | 9 |
| pickleball-open-play | Lunch-hour open pickleball | Wed 12:00-13:00 | small | adults | Every Wednesday | 8 |
| lunch-crafting | Quiet crafting hour | Thu 12:30-13:15 | solo | everyone | Every Thursday | 4 |
| kids-playgroup | Kids' playgroup with 5C student volunteers | Thu 16:30-18:00 | small | families | Every Thursday | 11 |
| walking-loop | Evening walk on the shaded loop | Mon 18:30-19:15 | solo | everyone | Every Monday | 7 |
| family-movie-night | Family movie night on the lawn | Fri 19:00-21:00 | big | families | null | 23 |
| late-shift-games | Late-shift coffee and board games | Wed 22:30-23:30 | small | adults | Every Wednesday | 5 |
| garden-workday | Community garden workday | Sat 08:00-10:00 | small | everyone | Every Saturday | 12 |
| potluck-birthdays | Monthly potluck and birthday celebration | Sun 13:00-15:00 | big | everyone | First Sunday of the month | 18 |

Locations: Movement Studio, Shuttle Stop, Pickleball Courts, Commons Hall
(craft room), Childcare Room, Shaded Walking Loop, Central Lawn, Commons Hall,
Community Garden, Commons Hall. Each event gets a 1 to 2 sentence description
that states plainly whether sign-up is needed (it never is) and whether kids
are welcome.

### Clubs (6)

| id | English name | meets | vibe | audience | how_to_join (en) |
|---|---|---|---|---|---|
| garden-club | Garden Club | Saturdays 8am, Community Garden | small | everyone | Just show up. Gloves provided. |
| pickleball-club | Pickleball Regulars | Wednesdays at noon and Sundays at 5pm | small | adults | Paddles at the front desk. |
| parents-circle | Parents' Circle | Thursdays 4:30pm, Childcare Room | small | families | Bring the kids. Student volunteers watch them. |
| trail-walkers | Trail Walkers | Sundays 7am, Claremont Hills Wilderness Park | small | everyone | Meet at the shuttle stop. |
| makers-circle | Makers' Circle | Thursdays 12:30pm, Commons Hall | solo | everyone | Drop in with any project. |
| carpool-board | Shift Carpool Board | Board in the mailroom, any time | solo | adults | Post your shift times and find a ride. No group chats required. |

### Facilities (9)

| id | English name | category | hours (en) |
|---|---|---|---|
| fitness-center | Fitness Center | fitness | Open 24 hours with your key fob |
| movement-studio | Movement Studio (yoga, stretching) | fitness | Free classes at 5:30am, 12pm, and 7pm |
| pickleball-courts | Pickleball Courts | fitness | 6am to 10pm, first come first served |
| childcare-room | Childcare Room | family | Weekdays 6am to 8pm, staffed by trained 5C student volunteers (proposed, via Pomona's Draper Center) |
| park-playground | Park, Playground and Shaded Walking Loop | outdoor | Dawn to dusk; the loop is lit until 11pm |
| community-garden | Community Garden and Fruit Trees | outdoor | Dawn to dusk; plots by request |
| commons-hall | Commons Hall (reservable for family gatherings) | community | 7am to 11pm; reserve at the front desk |
| shuttle-stop | 5C Shuttle Stop | transport | Shuttles at shift changes: 5:15am, 1:45pm, 9:45pm (proposed) |
| mailroom | Mailroom and Private Package Lockers | community | Open 24 hours |

`accessibility` (bilingual) is a concrete sentence per facility, for example
"Step-free entrance, elevator to the second floor, accessible restroom." Every
facility has one.
