# Claremont Vista

Sparkathon 2026

A bilingual (English/Spanish) website for a proposed affordable housing community
for low-income workers at the Claremont Colleges (5C), on the North Campus site.

The site is built around the team's problem statement:

> How might we empower low-income 5C workers to build community on their own
> terms, balancing opportunities for social connection with their need for
> privacy and independence?

It has an events carousel, an events timetable you can filter by shift and by how
social an event is (with anonymous RSVPs), facilities, clubs, an about page with
live success metrics, a contact page with anonymous feedback, and an application
that estimates eligibility and affordable rent. A map shows the proposed site.
University Hills at UC Irvine (https://uhills.org) is the reference for what a
college workforce-housing site should do. We borrow its functions, not its look.

## Run it locally

Requires Python 3.11+ and Node 18+.

```bash
scripts/bootstrap.sh && set -a && . ./.env && set +a
# terminal 1: API (FastAPI + SQLite; seeds itself on first start)
cd backend && python3 -m venv .venv && . .venv/bin/activate \
  && pip install -r requirements.txt && uvicorn app.main:app --port "$BACKEND_PORT"
# terminal 2: website (Vite + React)
cd frontend && npm install && npm run dev
```

Reset demo data: `cd backend && python -m app.seed --reset`.
Backend tests: `cd backend && pytest -q`.

## Status

Working prototype. Product spec: `docs/PRODUCT.md`. Design: `docs/DESIGN_BRIEF.md`.
API contract: `docs/openapi.yaml`. Decisions: `docs/DECISIONS.md`.

## How this repo is built

Several Claude Code agents work in separate git worktrees under
`docs/AGENT_PROTOCOL.md`:

| Folder | Branch | Agent |
|---|---|---|
| `claremonthousing` | `main` | `claude --agent manager` |
| `claremonthousing-Frontend` | `agent/frontend` | `claude --agent frontend-engineer` |
| `claremonthousing-Backend` | `agent/backend` | `claude --agent backend-engineer` |
| `claremonthousing-Reviewer` | `agent/reviewer` | `claude --agent reviewer` |

The full loop, scripts, and enforcement rules are in `docs/WORKFLOW.md`.
