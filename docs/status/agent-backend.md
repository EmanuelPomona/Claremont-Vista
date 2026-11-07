# STATUS: agent/backend
Task: TASK-001 (GET endpoints live), then TASK-002
Round: 0
Last updated: 2026-11-07T22:20:00Z

## Skills invoked so far
ADR-004 waives all but test-driven-development and
verification-before-completion for this project.
- superpowers:test-driven-development @ TASK-002 step 1 (before any eligibility
  code) -> tests first, watch them fail, then minimal code
- superpowers:verification-before-completion: not yet (invoke right before handoff)

## Done
- [x] bootstrap.sh run: frontend 3002 / backend **8002** (.env)
- [x] requirements.txt + venv (backend/.venv, gitignored) -> commit 97c0d0f
- [x] db.py schema + seed.py (10 events, 6 clubs, 9 facilities) -> bf6c139, 5153a51
- [x] schemas.py + main.py: GET /api/health, /events, /clubs, /facilities, CORS,
      400 error handler

## In progress
- [x] manager messaged with port 8002 (TASK-001 GET endpoints live)
- [ ] TASK-002 step 1: write the 5 eligibility tests, watch them fail, commit

## Verified
- GET /api/health -> {"status":"ok"} on localhost:8002 (curl)
- /api/events returns 10; `band=evening&vibe=solo` returns only `walking-loop` (curl)
- `band=bogus` -> 400 {error:"invalid_query", field:"band"}; `limit=0` -> 400 field limit
- 99 Localized objects across events/clubs/facilities, all with non-empty en and es
- CORS echoes http://localhost:3002
- scripts/contract-test.sh: 8 paths, 0 unreachable, but schemathesis is not
  installed so this is reachability only, NOT schema conformance

## Blocked on
- nothing
