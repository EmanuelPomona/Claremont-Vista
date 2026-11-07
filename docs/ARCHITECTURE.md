# System Architecture

## Architecture Status

Accepted (2026-11-07). One-hour build, local laptop demo, no deployment.

## System Overview

```text
Browser (EN/ES)
  -> Vite + React SPA          frontend/   port FRONTEND_PORT
  -> REST JSON (fetch)         VITE_API_BASE_URL
  -> FastAPI                   backend/    port BACKEND_PORT
  -> SQLite file               backend/data/claremont_vista.db (gitignored)
```

No auth, no external services, no secrets. Nothing in this project needs an API key.

## Frontend

- Framework: **Vite 5 + React 18 + TypeScript**, `react-router-dom` v6
- Styling: plain CSS. Tokens from `docs/DESIGN_BRIEF.md` are CSS custom
  properties in `frontend/src/styles/tokens.css`. No UI kit.
- Fonts: Archivo + Public Sans from Google Fonts (`<link>` in `index.html`)
- i18n: in-house, no library.
  - `frontend/src/i18n/en.ts` and `es.ts` export the same typed key set
  - `LanguageContext` provides `lang` and `t(key)`
  - the choice persists in `localStorage["cv-lang"]` (wrapped in try/catch) and
    sets `<html lang>`
  - API content arrives as `{ en, es }` objects; render `obj[lang]`
- API client: `frontend/src/api/client.ts`, typed against `docs/API.md`, base
  URL `import.meta.env.VITE_API_BASE_URL`
- Env: `vite.config.ts` sets `envDir: '..'` so the worktree-root `.env` (written
  by `scripts/bootstrap.sh`) is read, and `server.port = Number(FRONTEND_PORT)`
  with `strictPort: true`
- Routes: `/`, `/events`, `/facilities`, `/clubs`, `/about`, `/contact`, `/apply`
- Before the backend is merged, frontend may develop against
  `frontend/src/api/fixtures.ts` when `VITE_USE_FIXTURES=1`. It defaults to off.
  The fixtures must mirror the `docs/openapi.yaml` examples exactly.

## Backend

- **Python 3.11+, FastAPI, Uvicorn, Pydantic v2, stdlib `sqlite3`.** No ORM.
- Layout: `backend/app/main.py` (app, CORS, routes), `backend/app/db.py`
  (connection, schema), `backend/app/seed.py` (bilingual demo data),
  `backend/app/eligibility.py` (pure functions), `backend/tests/` (pytest)
- CORS: `allow_origin_regex = r"http://(localhost|127\.0\.0\.1):\d+"`
- Seed: on startup, create tables and seed if `events` is empty.
  `python -m app.seed --reset` drops and reseeds. Event dates are computed
  **relative to today** (America/Los_Angeles) so the carousel is always upcoming.
- Errors: every 4xx/5xx body is `{ "error": code, "message": text, "field"?: name }`.
  Override FastAPI's default 422 handler to return status 400 in this shape.

## Run commands (each worktree)

```bash
scripts/bootstrap.sh && set -a && . ./.env && set +a
# backend
cd backend && python3 -m venv .venv && . .venv/bin/activate \
  && pip install -r requirements.txt \
  && uvicorn app.main:app --reload --port "$BACKEND_PORT"
# backend tests
cd backend && . .venv/bin/activate && pytest -q
# frontend
cd frontend && npm install && npm run dev        # reads ../.env
cd frontend && npm run build && npm run lint      # typecheck runs in build (tsc -b)
```

## Directory Structure

```text
frontend/   Vite app (frontend-engineer owns)
backend/    FastAPI app + tests (backend-engineer owns)
docs/       contracts and records (manager owns contracts)
```

## Model Assignment

This is a demo-judged prototype. The rubric scores the prototype on how it
looks and works in front of judges, and the backend is a small CRUD API with
one calculation. **The risk lives in the frontend**: eight screens, a
carousel, bilingual copy, and the signature filter, all in one hour.

| Agent | Model | Effort | Why this project |
|---|---|---|---|
| manager | opus | high | contracts must be right the first time; there is no time for a second round |
| frontend-engineer | **opus** | **medium** | most of the work and all of the visual judgment. Medium, not high: the brief already made the design decisions |
| backend-engineer | sonnet | low | small CRUD + one tested calculation, fully specified in API.md |
| reviewer | sonnet | medium | functional gate; visual findings are advisory |

**Time budget (owner directive):** about 1 hour total. Agents keep reasoning
short, follow the docs rather than re-deriving them, and do not gold-plate.
Backend target: GET endpoints live in 15 minutes, everything else in 35.
Frontend target: shell + homepage in 25 minutes, all pages in 50.

## Ports and Environment

Assigned per worktree by `scripts/bootstrap.sh`. Never hardcode 3000/8000.

## Deployed Preview

None. The reviewer runs the integrated `main` locally.

## Demo Data

The backend seeds automatically on first start. To reset:
`cd backend && python -m app.seed --reset`.
