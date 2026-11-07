---
id: TASK-002
title: RSVP, applications with eligibility, feedback, metrics
status: REVIEW
status: DONE
owner: backend
branch: agent/backend
priority: HIGH
round: 1
depends_on: [TASK-001]
blocked_on: ""
---

# TASK-002: RSVP, applications with eligibility, feedback, metrics

**Time box: 20 minutes.**

## Objective

Implement `POST/DELETE /api/events/{id}/rsvp`, `POST /api/applications`,
`POST /api/feedback`, and `GET /api/metrics` exactly per `docs/openapi.yaml`,
with the eligibility rules and income table in `docs/API.md`.

## Scope

`backend/app/eligibility.py` (new), `backend/app/main.py` (add routes),
`backend/app/schemas.py`, `backend/tests/test_eligibility.py` (new).

## Steps

1. Invoke `superpowers:test-driven-development`. Write
   `backend/tests/test_eligibility.py` with **exactly the 5 required tests**
   from `docs/API.md` (4 call `evaluate()` directly; the contact_required one
   uses FastAPI `TestClient` against `POST /api/applications`). Run
   `pytest -q` and confirm they fail. Commit.
2. `eligibility.py`: `INCOME_LIMITS: dict[int, tuple[int, int]]`, the hardcoded
   table from API.md, and
   `evaluate(household_size: int, annual_income: int, employer: str) -> dict`
   returning `{status, income_limit_50, income_limit_80, max_comfortable_rent}`.
   Rules are first-match-wins as listed. Rent = `annual_income * 30 // 1200`.
3. `POST /api/applications`: a Pydantic model per `ApplicationRequest`. If both
   email and phone are empty, return 400 `{error:"contact_required",
   field:"email"}`. Store the row with its eligibility snapshot and return 201
   with `application_id = f"CV-{id:04d}"` and `submitted_at` in LA time. Run
   `pytest -q`; all 5 pass. Commit.
4. RSVP: POST increments, DELETE decrements with `MAX(going_count-1, 0)`.
   Unknown id gives 404 `{error:"event_not_found"}`. Commit.
5. `POST /api/feedback` (rating 1 to 5, message <= 1000, page <= 50, language
   en|es) returns 201 `{feedback_id:"FB-0001"}`. `GET /api/metrics` per
   API.md. Commit.
6. Verify with curl: RSVP a real id twice and see the count go up by 2; DELETE
   once; submit the demo application (size 3, $52,000, pomona) and get
   `priority` with rent 1300; then call metrics. Then run
   `scripts/contract-test.sh` and `pytest -q`. Invoke
   `superpowers:verification-before-completion`, write the handoff (§16,
   including What Was NOT Verified), and set both backend tasks to `REVIEW`.

## Acceptance Criteria

- [ ] AC-31: `pytest -q` shows 5 passed
- [ ] AC-32: invalid input gives 400 `{error, message, field}`; an unknown
      event gives 404 `event_not_found`
- [ ] The demo application returns 201 with `status: priority`,
      `income_limit_50: 74950`, `income_limit_80: 119900`,
      `max_comfortable_rent: 1300`
- [ ] DELETE rsvp on a count of 0 stays at 0
- [ ] `GET /api/metrics` reflects the submissions made above
- [ ] AC-30: `scripts/contract-test.sh` passes

## Review History

| Round | Verdict | Summary |
|---|---|---|
