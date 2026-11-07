---
id: TASK-001
title: Backend scaffold, bilingual seed, and read endpoints
status: DONE
owner: backend
branch: agent/backend
priority: HIGH
round: 1
depends_on: []
blocked_on: ""
---

# TASK-001: Backend scaffold, bilingual seed, and read endpoints

**Time box: 15 minutes.** The frontend integrates against this, so ship the GET
endpoints first and commit as soon as they answer.

## Objective

Build a FastAPI app serving `GET /api/health`, `/api/events`, `/api/clubs`, and
`/api/facilities` exactly per `docs/openapi.yaml`, backed by SQLite that seeds
itself with the bilingual data listed in `docs/API.md`.

## Scope

`backend/requirements.txt`, `backend/app/__init__.py`, `backend/app/main.py`,
`backend/app/db.py`, `backend/app/seed.py`, `backend/app/schemas.py`.
Nothing outside `backend/` (plus your own status/handoff files).

## Steps

1. `requirements.txt`: `fastapi`, `uvicorn[standard]`, `pydantic>=2`, `pytest`,
   `httpx`. Commit.
2. `db.py`: `get_conn() -> sqlite3.Connection` (row_factory = Row, path
   `backend/data/claremont_vista.db`, creates the dir) and `init_schema(conn)`
   using the tables in `docs/DATABASE.md`.
3. `seed.py`: `seed(conn, today: date)` inserts the 10 events, 6 clubs, and
   9 facilities from `docs/API.md` with real Spanish. Each event goes on the next
   occurrence of its weekday 1 to 7 days after `today`, at the listed local time,
   America/Los_Angeles (`zoneinfo`), stored as ISO 8601 with offset.
   `python -m app.seed --reset` drops, recreates, and reseeds. Commit.
4. `main.py`: on startup, `init_schema` and seed if `events` is empty. CORS
   `allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+"`. A custom
   `RequestValidationError` handler returns **400**
   `{error:"validation_error"|"invalid_query", message, field}`; other
   HTTPExceptions return `{error, message}`.
5. `band_for(starts_at: datetime) -> str` in `main.py` (or `schemas.py`):
   Sat/Sun gives `weekend`, hour < 9 `early`, hour < 16 `midday`, else `evening`.
   `GET /api/events` filters `ends_at >= now`, applies optional `band`/`vibe`
   (validated enums; bad values give 400 `invalid_query` with `field`), takes
   `limit` 1 to 50, sorts by `starts_at`, and serializes `{en, es}` objects per
   openapi. Commit.
6. `GET /api/clubs` and `GET /api/facilities` in `sort_order`. Commit.
7. Verify: run uvicorn on `$BACKEND_PORT`, then
   `curl -s localhost:$BACKEND_PORT/api/events | python3 -m json.tool | head -40`,
   then `scripts/contract-test.sh`. Write a short handoff (protocol §16)
   saying the GET endpoints are live and naming your port.

No tests in this task (owner directive; TASK-002 holds the only tests).

## Acceptance Criteria

- [ ] AC-33: a fresh start with no DB seeds 10 events, 6 clubs, and 9
      facilities, and every event's `ends_at` is in the future
- [ ] `GET /api/events?band=evening&vibe=solo` returns exactly one event,
      `walking-loop`
- [ ] `GET /api/events?band=bogus` returns 400 `{error:"invalid_query", field:"band"}`
- [ ] Every Localized field has non-empty `en` and `es`
- [ ] AC-30: `scripts/contract-test.sh` passes

## Notes

Skills: `superpowers:verification-before-completion` before the handoff.
Keep reasoning brief, because the contract already decided everything.

## Review History

| Round | Verdict | Summary |
|---|---|---|
