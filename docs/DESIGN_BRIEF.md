# Design Brief: Claremont Vista

Owner's sketch: `docs/reference/homepage-sketch.jpg`. **Its structure is binding:**
a centered wordmark, a nav row under it ruled by a hand-drawn line, and a
full-width events carousel with prev/next arrows and dots. Everything below
aims that structure.

## Target audience

5C dining, grounds, custodial, and admin workers, many bilingual
(English/Spanish), often on a phone during a break or before a 5am drive. Some
are not comfortable with technology. Parents check it at night after a second
job. Judges see it on a laptop.

## Primary interface job

Let a worker see **what's on at a time they can actually make, and how social
it is**, then join or ignore it with zero pressure.

## Reference points

1. **The owner's purple-ink sketch.** Borrow the hand-drawn wordmark with the V
   slicing through "Claremont" and the hand-ruled line under the nav. That warmth
   comes from a human hand, not from decoration.
2. **Foothill Transit / Metrolink printed timetables.** Borrow the time-band
   structure: rows read by time of day, tabular figures, and strong labels.
   Our users are commuters and shift workers who already read schedules this way.
3. **LA County Library branch event flyers.** Borrow plain bilingual civic
   language, generous type, and "everyone welcome, no sign-up" honesty.

## Desired character

- **Neighborly.** First-person-plural copy ("our garden"), and nothing salesy.
- **Unpressured.** Every social prompt is optional, and "Drop in solo" is a
  first-class choice.
- **Legible.** Large text, high contrast, and tap targets of at least 44px.
  Works on a cheap phone in sun.
- **Bilingual by default.** Spanish is not an afterthought: the toggle sits in
  the header on every page, and layouts tolerate copy that runs ~25% longer.

## Anti-character

Must never feel like a **luxury leasing site** ("resort-style living", stock
couples on balconies, "Schedule a tour" pressure), an **HR or campus portal**
(institutional blue, forms first), or a **social network** that demands
participation (profiles, attendee faces, "people you may know").

## Typography

Revised 2026-11-07 by owner request (ADR-006):

- Display: **Instrument Serif** 400 (and italic) for h1/h2 only. It is an
  editorial serif, The New Work Project's register. It has no bold, so h3 and
  below use the body face.
- Text: **Atkinson Hyperlegible Next** 400/500/700. The Braille Institute made it
  for low-vision readers, which serves our accessibility users, and it covers
  Spanish glyphs (á é í ó ú ñ ¿ ¡).
- Times, labels, tags, counts, rents: **Atkinson Hyperlegible Mono**. Monospaced
  figures keep the timetable columns aligned, so the transit-schedule reference
  survives.
- Wordmark: an **inline SVG** recreating the sketch, with "Claremont" lettered
  by hand and a tall stroked V crossing the "nt" and starting "ista". It is a
  single jacaranda stroke. It is the only hand-drawn element besides the nav
  rule.

## Palette

| Role | Color | Why |
|---|---|---|
| canvas | `#FBF8F3` | warm flyer paper, never pure white |
| surface (panels, carousel caption) | `#F3EEE6` | tonal step instead of shadows |
| primary text | `#231B2E` | purple-black ink |
| secondary text | `#5F566B` | metadata (times, places) |
| rule / border | `#E3DCD2` | timetable rules, card borders |
| accent / action (jacaranda) | `#6B3FA0` | the sketch's ink and Claremont's jacaranda trees: links, buttons, the active filter, wordmark |
| accent tint | `#EDE6F6` | selected filter chip background, hover |
| success | `#2F6B3F` | RSVP confirmed, application received |
| warning / error | `#B3261E` | field errors, failed requests |

No other hues. Time bands and vibes are distinguished by label plus icon,
never by color.

## Information density

Moderate. The events timetable is the one dense view, and everything else is
spacious and readable.

## Content hierarchy

1. Homepage: the wordmark and nav, then the carousel, then a short "Living here
   on your terms" strip (3 plain sentences, no cards), then this week's
   timetable preview.
2. Events: the filter bar, then the timetable grouped by band.
3. Application: who qualifies, then rents, then the form.

## Signature element

**The "When / How social" timetable filter.** Two rows of chips sit above the
events:

- **When** (shift band): Early (before 9am), Midday, Evening (after 4pm),
  Weekend
- **How social** (vibe): Drop in solo / Small group / Big gathering

Events render as **timetable rows grouped under band headings**, transit-schedule
style. Each row shows the time (tabular), title, place, a vibe label, and an
"I'm going" button with an **anonymous count** ("12 going"). Names and faces are
never shown. The same band and vibe labels appear on carousel slides. This is
the HMW problem statement made literal: community on your schedule, at your
social pace.

## Justified exceptions

| Pattern | Why it belongs in this product |
|---|---|
| Shadow on the carousel arrow buttons and any dropdown | real elevation over the photo |
| Full-bleed photos in the carousel | the owner's sketch explicitly asks for photos/videos of events |

## Images

Event photos are free-license (Unsplash), downloaded into
`frontend/public/images/events/` with the filenames in `docs/API.md` (seed
section) and credited in `frontend/public/images/CREDITS.md`. Choose real,
modest scenes: a garden, a pickleball court, a potluck table, a playground, a
yoga mat, a movie on a wall. **No faces in close-up, and no luxury interiors.** If
an image is missing, render a jacaranda-tint panel showing the band label. Never
show a broken image icon.
