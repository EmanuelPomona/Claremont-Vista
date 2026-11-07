# Database Design: Claremont Vista

## Provider

SQLite via Python stdlib `sqlite3`. File: `backend/data/claremont_vista.db`
(gitignored, created on startup). No ORM, no migrations: `CREATE TABLE IF NOT
EXISTS` on startup, and `python -m app.seed --reset` drops and recreates.

Consumers never see these tables. They see `docs/openapi.yaml`. Bilingual
columns are stored flat (`title_en`, `title_es`) and serialized as
`{en, es}` objects at the API boundary.

## Tables

### events

| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | slug from the seed list in API.md |
| title_en, title_es | TEXT NOT NULL | |
| description_en, description_es | TEXT NOT NULL | |
| location_en, location_es | TEXT NOT NULL | |
| starts_at, ends_at | TEXT NOT NULL | ISO 8601 with offset |
| vibe | TEXT NOT NULL | CHECK in ('solo','small','big') |
| audience | TEXT NOT NULL | CHECK in ('everyone','families','adults') |
| image | TEXT NOT NULL | `/images/events/<id>.jpg` |
| recurrence_en, recurrence_es | TEXT NULL | both null or both set |
| going_count | INTEGER NOT NULL DEFAULT 0 | CHECK >= 0; anonymous |

`band` is **not stored**. It is derived from `starts_at` at read time (rules in
API.md).

### clubs

id TEXT PK, name_en/es, description_en/es, meets_en/es, vibe, audience,
how_to_join_en/es (all TEXT NOT NULL), sort_order INTEGER.

### facilities

id TEXT PK, name_en/es, description_en/es, hours_en/es, accessibility_en/es
(all TEXT NOT NULL), category TEXT CHECK in
('fitness','outdoor','family','community','transport'), sort_order INTEGER.

### applications

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | API id = `CV-` + zero-padded 4 digits |
| full_name | TEXT NOT NULL | |
| email, phone | TEXT NULL | at least one set (enforced in the API layer) |
| employer, job_category, unit_type, preferred_language | TEXT NOT NULL | enums per openapi |
| household_size | INTEGER NOT NULL | 1 to 8 |
| annual_income | INTEGER NOT NULL | whole dollars |
| needs_accessible_unit | INTEGER NOT NULL DEFAULT 0 | 0/1 |
| status | TEXT NOT NULL | priority / eligible / over_income / needs_review |
| income_limit_50, income_limit_80, max_comfortable_rent | INTEGER NOT NULL | snapshot at submit time |
| submitted_at | TEXT NOT NULL | ISO 8601 with offset |

Never exposed by any GET (privacy).

### feedback

id INTEGER PK AUTOINCREMENT (API id `FB-` + 4 digits), rating INTEGER NOT NULL
CHECK 1-5, message TEXT NULL, page TEXT NULL, language TEXT NOT NULL,
created_at TEXT NOT NULL.

## Relationships

None. The tables are independent on purpose: no table links a person to an
event.
