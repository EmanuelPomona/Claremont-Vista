---
id: TASK-006
title: Fix wordmark V, new fonts, landing map, purposeful motion
status: REVIEW
owner: frontend
branch: agent/frontend
priority: HIGH
round: 0
depends_on: [TASK-003, TASK-004, TASK-005]
blocked_on: ""
---

# TASK-006: Fix wordmark V, new fonts, landing map, purposeful motion

**Time box: 25 minutes total, owner deadline.** Work in this order and commit
after each numbered step. If time runs out, drop items from the end of step 4
first. Keep reasoning short; every value you need is below.

## Scope

`frontend/` only: `index.html`, `src/styles/*.css`, `src/components/Wordmark.tsx`,
`src/components/Carousel.tsx`, `src/components/RsvpButton.tsx`,
`src/components/EventRow.tsx`, `src/pages/Home.tsx`, a new
`src/components/SiteMap.tsx`, a new `src/hooks/useReveal.ts`, i18n files, and
`package.json` (adding `leaflet`).

## Steps

### 1. Wordmark V (owner-reported bug, ~3 min)

The V currently overlaps the "nt" of Claremont. It must sit **in the gap between
"Claremont" and "ista"** as the capital V of "Vista", touching no letter. In
`Wordmark.tsx`:
- V paths: `M300 22 C304 44 312 68 320 88` and `M320 88 C326 66 334 42 342 18`
  (keep strokeWidth 4.8; the apex sits on the baseline)
- the "ista" group becomes `transform="translate(350 0) scale(0.9 1)"`
- `viewBox="0 0 470 124"`
- add `pathLength="1"` to every `<path>` (used by step 4b)

Check: the end of Claremont's "t" crossbar is about x=293, the V spans
300 to 342, and the "i" stem is at about x=355, so nothing overlaps. Tweak by a
few px only if it looks off at 1440 and 390. Commit.

### 2. Fonts (~4 min, ADR-006)

Replace the Archivo/Public Sans `<link>` in `index.html` with:
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Atkinson+Hyperlegible+Next:wght@400;500;700&family=Atkinson+Hyperlegible+Mono:wght@400;500&display=swap" rel="stylesheet">
```
Tokens: `--font-display:"Instrument Serif", Georgia, serif;`
`--font-body:"Atkinson Hyperlegible Next", system-ui, sans-serif;`
`--font-mono:"Atkinson Hyperlegible Mono", ui-monospace, monospace;`
- body: `--font-body`, 17px, line-height 1.55
- h1/h2: `--font-display`, **weight 400 only** (Instrument Serif has no bold),
  letter-spacing -0.01em, line-height 1.05; h1 `clamp(2.6rem,6vw,4.5rem)`
- h3, nav, buttons: `--font-body` 700/500
- times, band/vibe labels, tags, counts, rents: `--font-mono` .85rem
- Remove every Archivo/Public Sans reference. Commit.

### 3. Landing map (~8 min)

At the bottom of Home, above the footer, add a "Where we'd live" section modeled
on The New Work Project's location block: a centered serif sentence, then a
full-width grayscale map with one pin.
- Copy (EN): heading "Where we'd live". Sentence: "North of Foothill Boulevard,
  between the Claremont School of Theology, the TCCS golf course, and Claremont
  Graduate University. A ten-minute walk to the colleges." Add the ES
  equivalent. Small note: "Proposed site. Location is approximate."
- `npm i leaflet @types/leaflet`. `SiteMap.tsx` uses plain Leaflet (no
  react-leaflet) in a `useEffect` with cleanup.
  - center `[34.1062, -117.7105]`, zoom 15
  - OSM tiles `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` with the
    attribution `© OpenStreetMap contributors` (required)
  - `scrollWheelZoom: false`, `dragging: !L.Browser.mobile`
  - grayscale via CSS on `.leaflet-tile-pane { filter: grayscale(1) contrast(.95) brightness(1.04) }`
  - the pin is an `L.divIcon` holding a jacaranda (`--cv-accent`) SVG map pin,
    with an `aria-label` / title of "Claremont Vista (proposed)"
  - height 380px desktop, 260px at 390px
  - import `leaflet/dist/leaflet.css`
- If Leaflet misbehaves after 5 minutes, fall back to an OSM embed iframe
  (`https://www.openstreetmap.org/export/embed.html?bbox=-117.722,34.100,-117.699,34.113&layer=mapnik&marker=34.1062,-117.7105`)
  with the same grayscale filter and a `title`. Commit.

### 4. Motion (~8 min). Plain CSS/JS, no library

Do these in order and drop from the end if short on time:
a. **Tokens + reduced motion** in `base.css`: `--ease-out:cubic-bezier(.22,1,.36,1)`.
   Add a `@media (prefers-reduced-motion:reduce)` block that kills
   animation/transition and forces `.reveal{opacity:1;transform:none}`.
b. **Wordmark draws itself** on first load: `stroke-dasharray:1;
   stroke-dashoffset:1; animation: draw 1.4s ease-in-out .2s forwards`. The
   "i" dot fades in at the end.
c. **Two-line headline** on Home directly below the carousel, as the page's h1
   (keep one h1 per page): "Come to what fits your shift." /
   "Everything here is optional." (with ES). The second line uses
   `--cv-ink-muted: #7A7088` (passes 4.5:1 on the canvas; do NOT use #9a93a8,
   which fails contrast). Lines rise 12px and fade in, the second delayed .12s.
d. **Fade up on scroll**: `useReveal()` with IntersectionObserver
   (rootMargin `0px 0px -10% 0px`, unobserve after it reveals, stagger
   `(i%6)*60ms`). Apply it to the This-week rows, the Facilities and Clubs rows,
   and the map section.
e. **Crossfade carousel**: replace the slide transition with an opacity crossfade
   (.5s). Keyboard, swipe, dots, and reduced motion keep working.
f. **Pulse ring** on the first upcoming event in "This week": an 8px jacaranda
   dot with an expanding ring, 1.8s infinite, plus visually hidden text
   "Next up".
g. **Small touches**: nav hover dims the other links to .45 opacity; the RSVP
   button gets `:active{transform:scale(.97)}`, and its count bumps (a scale
   1.15 pop, 250ms) after a successful RSVP; `<main>` fades up 16px over .4s
   on route change.

Not doing (decided): the scroll-scaled hero photo, and the sticky blurred
principles nav (glassmorphism is banned in DESIGN_CONSTRAINTS).

### 5. Verify (~2 min)

`npm run build` passes. In the browser at 1440 and 390: the wordmark V touches
no letter, the map renders with the pin, the ES toggle covers the new copy, and
the console is clean. Commit, append HANDOFF-2 to
`docs/handoffs/agent-frontend.md` (short; include What Was NOT Verified), set
status REVIEW, commit, and message claremonthousing-71.

## Acceptance Criteria

- [ ] The V sits between "Claremont" and "ista" and overlaps no letter, at 1440 and 390
- [ ] Instrument Serif headlines, Atkinson Hyperlegible Next body, and
      Atkinson Hyperlegible Mono times/labels; no Archivo/Public Sans left
- [ ] The Home map shows the proposed site pin near CST/CGU, OSM attribution is
      visible, it is grayscale, and it does not hijack page scroll
- [ ] Every animation is off under `prefers-reduced-motion`
- [ ] New copy is bilingual; `npm run build` exits 0; the console is clean

## Review History

| Round | Verdict | Summary |
|---|---|---|
