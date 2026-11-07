"""SQLite connection and schema (docs/DATABASE.md). No ORM, stdlib sqlite3."""

from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "claremont_vista.db"

TABLES = ("events", "clubs", "facilities", "applications", "feedback")

SCHEMA = """
CREATE TABLE IF NOT EXISTS events (
    id             TEXT PRIMARY KEY,
    title_en       TEXT NOT NULL,
    title_es       TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_es TEXT NOT NULL,
    location_en    TEXT NOT NULL,
    location_es    TEXT NOT NULL,
    starts_at      TEXT NOT NULL,
    ends_at        TEXT NOT NULL,
    vibe           TEXT NOT NULL CHECK (vibe IN ('solo','small','big')),
    audience       TEXT NOT NULL CHECK (audience IN ('everyone','families','adults')),
    image          TEXT NOT NULL,
    recurrence_en  TEXT,
    recurrence_es  TEXT,
    going_count    INTEGER NOT NULL DEFAULT 0 CHECK (going_count >= 0),
    CHECK ((recurrence_en IS NULL) = (recurrence_es IS NULL))
);

CREATE TABLE IF NOT EXISTS clubs (
    id              TEXT PRIMARY KEY,
    name_en         TEXT NOT NULL,
    name_es         TEXT NOT NULL,
    description_en  TEXT NOT NULL,
    description_es  TEXT NOT NULL,
    meets_en        TEXT NOT NULL,
    meets_es        TEXT NOT NULL,
    vibe            TEXT NOT NULL CHECK (vibe IN ('solo','small','big')),
    audience        TEXT NOT NULL CHECK (audience IN ('everyone','families','adults')),
    how_to_join_en  TEXT NOT NULL,
    how_to_join_es  TEXT NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS facilities (
    id               TEXT PRIMARY KEY,
    name_en          TEXT NOT NULL,
    name_es          TEXT NOT NULL,
    description_en   TEXT NOT NULL,
    description_es   TEXT NOT NULL,
    hours_en         TEXT NOT NULL,
    hours_es         TEXT NOT NULL,
    accessibility_en TEXT NOT NULL,
    accessibility_es TEXT NOT NULL,
    category         TEXT NOT NULL
        CHECK (category IN ('fitness','outdoor','family','community','transport')),
    sort_order       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS applications (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name             TEXT NOT NULL,
    email                 TEXT,
    phone                 TEXT,
    employer              TEXT NOT NULL,
    job_category          TEXT NOT NULL,
    unit_type             TEXT NOT NULL,
    preferred_language    TEXT NOT NULL,
    household_size        INTEGER NOT NULL,
    annual_income         INTEGER NOT NULL,
    needs_accessible_unit INTEGER NOT NULL DEFAULT 0,
    status                TEXT NOT NULL,
    income_limit_50       INTEGER NOT NULL,
    income_limit_80       INTEGER NOT NULL,
    max_comfortable_rent  INTEGER NOT NULL,
    submitted_at          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    message    TEXT,
    page       TEXT,
    language   TEXT NOT NULL,
    created_at TEXT NOT NULL
);
"""


def get_conn() -> sqlite3.Connection:
    """Open a connection to the demo database, creating its directory."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=10, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    conn.commit()


def drop_all(conn: sqlite3.Connection) -> None:
    for table in TABLES:
        conn.execute(f"DROP TABLE IF EXISTS {table}")
    conn.commit()


@contextmanager
def connection() -> Iterator[sqlite3.Connection]:
    """Per-request connection: commits on success, rolls back on error, always closes."""
    conn = get_conn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
