"""Claremont Vista API (docs/API.md, docs/openapi.yaml)."""

import logging
import sqlite3
from contextlib import asynccontextmanager
from datetime import datetime
from decimal import ROUND_HALF_UP, Decimal
from typing import Optional

from fastapi import FastAPI, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app import schemas
from app.db import connection
from app.eligibility import evaluate
from app.schemas import Band, Vibe
from app.seed import LA, ensure_seeded

log = logging.getLogger("claremont")


# --- errors: every 4xx/5xx body is {error, message, field?} -----------------------


class ApiError(Exception):
    def __init__(self, status: int, code: str, message: str, field: str | None = None):
        self.status = status
        self.code = code
        self.message = message
        self.field = field


def error_body(code: str, message: str, field: str | None = None) -> dict:
    body = {"error": code, "message": message}
    if field:
        body["field"] = field
    return body


# --- app --------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(_: FastAPI):
    with connection() as conn:
        ensure_seeded(conn)
    yield


app = FastAPI(title="Claremont Vista API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ApiError)
async def api_error_handler(_: Request, exc: ApiError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status, content=error_body(exc.code, exc.message, exc.field)
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    err = exc.errors()[0]
    loc = err["loc"]
    source = loc[0] if loc else "body"
    field = next((p for p in reversed(loc[1:]) if isinstance(p, str)), None)
    code = "invalid_query" if source == "query" else "validation_error"
    message = f"{field}: {err['msg']}" if field else str(err["msg"])
    return JSONResponse(status_code=400, content=error_body(code, message, field))


@app.exception_handler(StarletteHTTPException)
async def http_error_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse:
    code = {404: "not_found", 405: "method_not_allowed"}.get(exc.status_code, "http_error")
    return JSONResponse(
        status_code=exc.status_code, content=error_body(code, str(exc.detail))
    )


@app.exception_handler(Exception)
async def unhandled_error_handler(_: Request, exc: Exception) -> JSONResponse:
    log.exception("unhandled error", exc_info=exc)
    return JSONResponse(
        status_code=500, content=error_body("internal_error", "Something went wrong.")
    )


# --- helpers ----------------------------------------------------------------------


def band_for(starts_at: datetime) -> str:
    """Derived from the start time in America/Los_Angeles (docs/API.md)."""
    if starts_at.tzinfo is None:
        starts_at = starts_at.replace(tzinfo=LA)
    local = starts_at.astimezone(LA)
    if local.weekday() >= 5:
        return "weekend"
    if local.hour < 9:
        return "early"
    if local.hour < 16:
        return "midday"
    return "evening"


def _loc(row: sqlite3.Row, name: str) -> dict:
    return {"en": row[f"{name}_en"], "es": row[f"{name}_es"]}


def event_out(row: sqlite3.Row) -> dict:
    recurrence = _loc(row, "recurrence") if row["recurrence_en"] is not None else None
    return {
        "id": row["id"],
        "title": _loc(row, "title"),
        "description": _loc(row, "description"),
        "location": _loc(row, "location"),
        "starts_at": row["starts_at"],
        "ends_at": row["ends_at"],
        "band": band_for(datetime.fromisoformat(row["starts_at"])),
        "vibe": row["vibe"],
        "audience": row["audience"],
        "image": row["image"],
        "recurrence": recurrence,
        "going_count": row["going_count"],
    }


# --- routes: read -----------------------------------------------------------------


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/events", response_model=schemas.EventsResponse)
def list_events(
    band: Optional[Band] = None,
    vibe: Optional[Vibe] = None,
    limit: int = Query(50, ge=1, le=50),
) -> dict:
    now = datetime.now(LA)
    with connection() as conn:
        rows = conn.execute("SELECT * FROM events").fetchall()
    upcoming = []
    for row in rows:
        # Parse before comparing: stored offsets differ across a DST change.
        if datetime.fromisoformat(row["ends_at"]) < now:
            continue
        event = event_out(row)
        if band and event["band"] != band:
            continue
        if vibe and event["vibe"] != vibe:
            continue
        upcoming.append((datetime.fromisoformat(row["starts_at"]), event))
    upcoming.sort(key=lambda pair: pair[0])
    return {"events": [event for _, event in upcoming[:limit]]}


@app.get("/api/clubs", response_model=schemas.ClubsResponse)
def list_clubs() -> dict:
    with connection() as conn:
        rows = conn.execute("SELECT * FROM clubs ORDER BY sort_order").fetchall()
    return {
        "clubs": [
            {
                "id": r["id"],
                "name": _loc(r, "name"),
                "description": _loc(r, "description"),
                "meets": _loc(r, "meets"),
                "vibe": r["vibe"],
                "audience": r["audience"],
                "how_to_join": _loc(r, "how_to_join"),
            }
            for r in rows
        ]
    }


@app.get("/api/facilities", response_model=schemas.FacilitiesResponse)
def list_facilities() -> dict:
    with connection() as conn:
        rows = conn.execute("SELECT * FROM facilities ORDER BY sort_order").fetchall()
    return {
        "facilities": [
            {
                "id": r["id"],
                "name": _loc(r, "name"),
                "description": _loc(r, "description"),
                "hours": _loc(r, "hours"),
                "accessibility": _loc(r, "accessibility"),
                "category": r["category"],
            }
            for r in rows
        ]
    }


# --- routes: write ----------------------------------------------------------------


def _now_la() -> str:
    return datetime.now(LA).replace(microsecond=0).isoformat()


@app.post("/api/applications", status_code=201, response_model=schemas.ApplicationResponse)
def create_application(req: schemas.ApplicationRequest) -> dict:
    if not req.email and not req.phone:
        raise ApiError(
            400, "contact_required", "Provide an email address or a phone number.", "email"
        )
    result = evaluate(req.household_size, req.annual_income, req.employer)
    submitted_at = _now_la()
    with connection() as conn:
        cur = conn.execute(
            """INSERT INTO applications (full_name, email, phone, employer, job_category,
                   unit_type, preferred_language, household_size, annual_income,
                   needs_accessible_unit, status, income_limit_50, income_limit_80,
                   max_comfortable_rent, submitted_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                req.full_name, req.email, req.phone, req.employer, req.job_category,
                req.unit_type, req.preferred_language, req.household_size,
                req.annual_income, int(req.needs_accessible_unit), result["status"],
                result["income_limit_50"], result["income_limit_80"],
                result["max_comfortable_rent"], submitted_at,
            ),
        )
        application_id = cur.lastrowid
    return {
        "application_id": f"CV-{application_id:04d}",
        "submitted_at": submitted_at,
        "eligibility": result,
    }


def _change_rsvp(event_id: str, set_clause: str) -> dict:
    with connection() as conn:
        cur = conn.execute(f"UPDATE events SET {set_clause} WHERE id = ?", (event_id,))
        if cur.rowcount == 0:
            raise ApiError(404, "event_not_found", f"No event with id '{event_id}'")
        count = conn.execute(
            "SELECT going_count FROM events WHERE id = ?", (event_id,)
        ).fetchone()[0]
    return {"event_id": event_id, "going_count": count}


@app.post("/api/events/{event_id}/rsvp", response_model=schemas.RsvpResponse)
def rsvp(event_id: str) -> dict:
    return _change_rsvp(event_id, "going_count = going_count + 1")


@app.delete("/api/events/{event_id}/rsvp", response_model=schemas.RsvpResponse)
def undo_rsvp(event_id: str) -> dict:
    return _change_rsvp(event_id, "going_count = MAX(going_count - 1, 0)")


@app.post("/api/feedback", status_code=201, response_model=schemas.FeedbackResponse)
def create_feedback(req: schemas.FeedbackRequest) -> dict:
    with connection() as conn:
        cur = conn.execute(
            """INSERT INTO feedback (rating, message, page, language, created_at)
               VALUES (?,?,?,?,?)""",
            (req.rating, req.message or None, req.page or None, req.language, _now_la()),
        )
        feedback_id = cur.lastrowid
    return {"feedback_id": f"FB-{feedback_id:04d}"}


@app.get("/api/metrics", response_model=schemas.Metrics)
def metrics() -> dict:
    with connection() as conn:
        applications = conn.execute("SELECT COUNT(*) FROM applications").fetchone()[0]
        rsvps = conn.execute("SELECT COALESCE(SUM(going_count), 0) FROM events").fetchone()[0]
        count, total = conn.execute(
            "SELECT COUNT(*), COALESCE(SUM(rating), 0) FROM feedback"
        ).fetchone()
    average = None
    if count:
        # half-up to 1 decimal, avoiding float banker's-style surprises
        average = float((Decimal(total) / count).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))
    return {
        "applications": applications,
        "rsvps": rsvps,
        "feedback_count": count,
        "average_rating": average,
    }
