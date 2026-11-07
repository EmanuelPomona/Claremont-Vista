---
id: TASK-003
title: Frontend shell, tokens, wordmark header, EN/ES, API client
status: REVIEW
owner: frontend
branch: agent/frontend
priority: HIGH
round: 0
depends_on: []
blocked_on: ""
---

# TASK-003: Frontend shell, tokens, wordmark header, EN/ES, API client

**Time box: 15 minutes.** Everything else builds on this.

## Objective

A running Vite + React + TS app with the design tokens, the sketch's header
(hand-drawn SVG wordmark, ruled nav row, EN/ES toggle), seven routes, i18n
infrastructure, a typed API client, and shared loading/error/empty components.

## Scope

`frontend/` scaffolding: `package.json`, `vite.config.ts`, `tsconfig*.json`,
`index.html`, `src/main.tsx`, `src/App.tsx`,
`src/styles/{tokens,base}.css`, `src/i18n/{en,es,index}.ts(x)`,
`src/api/{types,client,fixtures}.ts`,
`src/components/{Header,Wordmark,LanguageToggle,Footer}.tsx`,
`src/components/states/{Loading,ErrorState,EmptyState}.tsx`, and stub pages in
`src/pages/` (filled by TASK-004/005).

## Steps

1. Invoke `frontend-design:frontend-design` once, then read
   `docs/DESIGN_BRIEF.md` and look at `docs/reference/homepage-sketch.jpg`.
   (Owner time directive: this is the only design skill required for this
   project; see ADR-004.)
2. Scaffold Vite react-ts in `frontend/`. Add `react-router-dom`.
   `vite.config.ts`: `envDir: '..'`, `server.port = Number(env.FRONTEND_PORT)`,
   `strictPort: true`. Commit.
3. `tokens.css`: every palette color from the brief as `--cv-*` custom
   properties, the two font stacks, and a spacing scale. Load Archivo (wdth,
   wght) and Public Sans via a Google Fonts `<link>`. Set `body` background to
   `--cv-canvas`. Commit.
4. i18n: `en.ts` exports `const en = {...} as const` and `es.ts` satisfies
   `typeof en`. `LanguageProvider` + `useLang()` returns
   `{ lang, setLang, t, pick }`, where `pick(obj: Localized)` returns `obj[lang]`.
   Persist to `localStorage["cv-lang"]` (try/catch) and set
   `document.documentElement.lang`. Commit.
5. `api/types.ts` mirrors `docs/openapi.yaml` schemas by hand (Localized, Band,
   Vibe, Event, Club, Facility, ApplicationRequest/Response, FeedbackRequest,
   Metrics, ApiError). `client.ts` exports `getEvents(params?)`, `getClubs()`,
   `getFacilities()`, `rsvp(id)`, `unrsvp(id)`, `submitApplication(body)`,
   `submitFeedback(body)`, `getMetrics()`. Non-2xx throws
   `ApiError {status, error, message, field?}`. When
   `VITE_USE_FIXTURES === '1'`, return data from `fixtures.ts`, which mirrors
   the openapi examples (a few events with real band/vibe values). Commit.
6. Header: centered `Wordmark` (inline SVG, "Claremont" hand-lettered, a tall
   stroked V crossing it and starting "ista", jacaranda stroke, links `/`, with
   `aria-label="Claremont Vista home"`). Nav in sketch order: Facilities, Events,
   Clubs, About, Contact, Application. Active route is marked. A hand-drawn SVG
   rule sits under the nav. `LanguageToggle` shows "EN | ES" in the top corner.
   At 390px the nav becomes a horizontally scrollable row or a menu button; your
   call, but no page-level horizontal scroll. Footer: front desk line and
   "Se habla español". Commit.
7. Shared states: `Loading` (skeleton rows), `ErrorState` (message + Retry
   button), `EmptyState` (message + optional action). Routes for `/`, `/events`,
   `/facilities`, `/clubs`, `/about`, `/contact`, `/apply`, each with one `h1`.
   Commit.
8. `npm run build` passes. Screenshot the header at 1440 and 390 in EN and ES.

## Acceptance Criteria

- [ ] AC-10: header, wordmark, nav order, and active state on every route
- [ ] AC-11: toggle switches chrome copy with no reload, sets `<html lang>`, and
      persists
- [ ] AC-21: tokens and fonts match the brief; canvas `#FBF8F3`
- [ ] AC-22 (header part): usable at 390px with no horizontal scroll
- [ ] `npm run build` exits 0

## Review History

| Round | Verdict | Summary |
|---|---|---|
