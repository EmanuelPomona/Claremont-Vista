## HANDOFF-1 — agent/backend — 2026-11-07

**Backend port: `8002`** (`BACKEND_PORT` in this worktree's `.env`, assigned by
`scripts/bootstrap.sh`). Frontend should use `VITE_API_BASE_URL=http://localhost:8002`.
CORS allows `http://localhost:<any port>` and `http://127.0.0.1:<any port>`.

Start it: `cd backend && . .venv/bin/activate && set -a && . ../.env && set +a && uvicorn app.main:app --port "$BACKEND_PORT"`
(`python3 -m venv .venv && pip install -r requirements.txt` first on a fresh checkout).
The DB seeds itself on first start. Reset: `cd backend && python -m app.seed --reset`.

### Summary

FastAPI + SQLite backend implementing all nine endpoints in `docs/openapi.yaml`,
with bilingual seed data and the eligibility calculation. 5 tests pass.

### Tasks Completed

**TASK-001** (commits `97c0d0f` to `6eb9282`)
- AC-33: fresh start seeds 10 events, 6 clubs, 9 facilities; every `ends_at` is in the future.
- `GET /api/events?band=evening&vibe=solo` returns exactly `walking-loop`.
- `GET /api/events?band=bogus` returns 400 `{error:"invalid_query", field:"band"}`.
- Every Localized field has non-empty `en` and `es` (99 objects checked).
- AC-30: see "What Was NOT Verified" (reachability passes; full schema conformance has 3 explained findings).

**TASK-002** (commits `b7cf155` to `e91feca`)
- AC-31: `pytest -q` shows 5 passed.
- AC-32: invalid input gives 400 `{error, message, field}`; unknown event gives 404 `event_not_found`.
- Demo application (size 3, $52,000, pomona) returns 201 `priority`, 74950 / 119900, rent 1300.
- DELETE rsvp at 0 stays at 0 (lunch-crafting 4 -> 0 -> 0).
- `GET /api/metrics` reflects submissions (see Verification).
- AC-30: same note as above.

### Files Changed

`backend/requirements.txt`, `backend/pytest.ini`, `backend/app/{__init__,db,seed,schemas,eligibility,main}.py`,
`backend/tests/test_eligibility.py`, `docs/status/agent-backend.md`, this file, and the
`status:` line of `docs/tasks/TASK-001-*.md` and `TASK-002-*.md`.
`docs/tasks/INDEX.md` was **not** regenerated (shared file; run `scripts/tasks.sh` at integration).

### Contracts

The implementation follows `docs/openapi.yaml`. Behavior the frontend should know that the
contract does not spell out:

- **Integers and booleans are strict JSON types.** `household_size`, `annual_income`, `rating`
  must be JSON numbers (`3`, not `"3"`; `52000.0` is fine) and `needs_accessible_unit` a real
  boolean (`needs_accessible_unit: 0` gives 400). A typed client sending numbers is fine.
- **Blank contact fields are "not provided".** `email: ""` or `phone: ""` (also whitespace) are
  treated as missing, per API.md "if both email and phone are empty". If both are missing:
  400 `contact_required`, `field:"email"`.
- **Extra error codes** beyond the documented list, all in the standard `{error, message}` shape:
  `not_found` (404, unknown route), `method_not_allowed` (405), `internal_error` (500).
- **Validation `message` is English pydantic text** prefixed with the field (e.g.
  `household_size: Input should be less than or equal to 8`). Show your own localized copy; use `field`.
- **Events past their `ends_at` drop out of `GET /api/events`.** The DB is seeded once, with dates
  relative to the seeding day. After about a week with the same DB file the list empties; run
  `python -m app.seed --reset`.
- **Applications are never returned by any GET** (`GET /api/applications` is 405).
- New dependency beyond the task list: `email-validator` (pydantic needs it for `format: email`).

## CONTRACT CHANGE REQUEST

(Non-blocking. I did **not** set the tasks to `BLOCKED`: the implementation matches the
documented prose exactly and no consumer is affected. Manager decides.)

- **Current shape:** `ApplicationRequest` in `docs/openapi.yaml` lists only `full_name`, `employer`,
  `job_category`, `household_size`, `annual_income`, `unit_type`, `preferred_language` as required.
  The description says "at least one of email or phone is required" but the schema does not express it,
  so a schema-driven tester treats a body with neither as valid.
- **Proposed shape:** add `anyOf: [{required: [email]}, {required: [phone]}]` to `ApplicationRequest`
  (and optionally `minLength: 1` on `phone`/`email`, since blanks are accepted but not valid per schema).
- **Why:** schemathesis reports `ST202 Schema-valid request rejected` for it.
- **If not changed:** nothing breaks at runtime; only automated conformance runs show that finding.

### Skills Used

| Skill | Stage invoked | What it actually changed |
|---|---|---|
| superpowers:test-driven-development | TASK-002 step 1, before any eligibility code | Wrote the 5 tests first and saw them fail (`ModuleNotFoundError: app.eligibility`), then implemented `evaluate()`. 4 passed; the 5th failed `404 == 400` until the route existed, then passed. |
| superpowers:verification-before-completion | After all implementation (HEAD `e91feca`), before this handoff | Forced fresh runs of pytest, curl checks, schemathesis, and diff checks. It caught that my shell had no `PIPESTATUS` (zsh), so I re-ran pytest and captured the exit code properly. |

All other skills are waived for this project by ADR-004 and were **not** invoked.

### Verification

Run from HEAD `e91feca` (record in `docs/status/agent-backend.md`; raw output in the session scratchpad):

```
$ cd backend && pytest -q ; echo $?
5 passed, 1 warning in 0.14s          # exit 0
  warning: StarletteDeprecationWarning: Using `httpx` with `starlette.testclient` is deprecated; install `httpx2` instead.

$ curl localhost:8002/api/health
{"status":"ok"}

$ fresh seed: events/clubs/facilities: 10 6 9 ; all ends_at >= now: True ; Localized objects: 99 all non-empty en+es: True
$ GET /api/events?band=evening&vibe=solo        -> ['walking-loop']
$ GET /api/events?band=bogus                    -> 400 {"error":"invalid_query",...,"field":"band"}
$ POST /api/events/nope/rsvp                    -> 404 {"error":"event_not_found",...}
$ RSVP sunrise-yoga POST, POST, DELETE          -> 7, 8, 7
$ DELETE lunch-crafting x5 (count was 4)        -> 3, 2, 1, 0, 0
$ POST /api/applications (size 3, 52000, pomona)-> 201 CV-0001 priority 74950 119900 rent 1300
$ POST /api/applications (no email/phone)       -> 400 contact_required field email
$ POST /api/feedback (rating 4, es)             -> 201 FB-0001
$ GET /api/metrics                              -> {"applications":1,"rsvps":100,"feedback_count":1,"average_rating":4.0}
```
(`rsvps` 100 = seed 103, +2, -1, -4.)

Invalid input (each returned 400 with `{error, message, field}`): household_size 9, bad email, bad
phone, bad employer, negative income, missing field, malformed JSON, no body, rating 6, bad language,
message 1001 chars, page 51 chars, `annual_income: false`, `household_size: "3"`, `needs_accessible_unit: 0`.

```
$ scripts/contract-test.sh      # default mode, schemathesis not on PATH
8 documented path(s), 0 unreachable          # exit 0; "reachability only, NOT schema conformance"

$ st run docs/openapi.yaml --url http://localhost:8002 --checks all     # schemathesis 4.33.1, scratch venv
1175 test cases generated, 3 unique failures (all explained below). Examples and Stateful phases pass;
Coverage and Fuzzing phases fail only on those 3.

$ CORS preflight OPTIONS (Origin http://localhost:3002, Request-Method DELETE)  -> 200, allow-origin echoed, allow-methods includes DELETE
$ CORS preflight POST from http://127.0.0.1:3002                                -> 200, allow-origin echoed
$ Origin http://evil.example                                                    -> 400, no allow-origin header
```

Scope and secrets: `git diff --stat main...HEAD` touches only `backend/` and my status file; no `.env`
or `.db` tracked; no credential patterns in the diff; server log has no PII matches.

### What Was NOT Verified

- **Full schema conformance (AC-30) is not clean.** `scripts/contract-test.sh` only ever ran its
  reachability fallback: schemathesis is not in `requirements.txt`, and the script's call
  `schemathesis run ... --base-url` is rejected by schemathesis 4.x (`No such option '--base-url'`;
  it is `--url` now). I ran schemathesis myself from a scratch venv. Three findings remain, all understood:
  1. `ST202` no email/phone rejected: documented behavior; schema under-expresses it (see CONTRACT CHANGE REQUEST).
  2. `ST201` `phone: ""` accepted: deliberate leniency for blank form fields (see Contracts).
  3. `ST205` `OPTIONS /api/events/{id}/rsvp` returns `Allow: POST` only (Starlette quirk when two
     decorators share a path). Cosmetic: CORS preflights are answered by the middleware and verified above.
  Two real defects schemathesis found were fixed first (missing `Allow` header on 405; booleans and
  numeric strings coerced into int/bool fields).
- **No linter or type checker was run.** None is configured in the repo (`ruff`/`mypy` are not in
  `requirements.txt`). `python -m app.seed`, uvicorn startup, and the tests import every module, so
  syntax and import errors would have surfaced, but static typing is unchecked.
- **No frontend integration.** I never ran the frontend against this backend; I checked CORS and the
  JSON shapes with curl only.
- **Concurrency and load** are unexercised. RSVP updates are single atomic `UPDATE` statements, but I
  did not test parallel requests. The RSVP endpoint does not dedupe (accepted in API.md).
- **A DST transition** in seeded dates was not exercised (seeding uses `zoneinfo` and the filter parses
  offsets, but all of today's seeded events fall in PST).
- **The 500 handler** (`internal_error`) was not triggered, so its body shape is untested. Note that
  500 responses are emitted outside the CORS middleware and carry no CORS headers.
- **Python 3.14 only.** `requirements.txt` has no version pins; I did not test other Python versions
  (ARCHITECTURE.md says 3.11+).

### Known Issues

- Stale DB: see Contracts (events empty after ~7 days; `python -m app.seed --reset`).
- `StarletteDeprecationWarning` about `httpx` in the pytest output (harmless; Starlette suggests `httpx2`).
- A background `uvicorn` on port 8002 was left running with a freshly reseeded DB for the frontend.
  It does not auto-reload; restart it after pulling backend changes.

### Commit

Code complete at `e91feca` (12 commits on `agent/backend` since `main`). This handoff, the final status
file, and the two task `status: REVIEW` edits are committed together in the commit that follows it.
