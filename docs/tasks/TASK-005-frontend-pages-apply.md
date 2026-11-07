---
id: TASK-005
title: Facilities, Clubs, About, Contact+feedback, Application form
status: REVIEW
owner: frontend
branch: agent/frontend
priority: HIGH
round: 0
depends_on: [TASK-003]
blocked_on: ""
---

# TASK-005: Facilities, Clubs, About, Contact + feedback, Application

**Time box: 20 minutes.** Keep these pages simple and well typeset. No card
grids: use lists with rules, timetable-style.

## Objective

The remaining five routes, with real bilingual copy, API-backed where the
contract provides data.

## Scope

`src/pages/{Facilities,Clubs,About,Contact,Apply}.tsx`,
`src/components/{FeedbackForm,ApplicationForm,RentTable,EligibilityResult}.tsx`,
plus new i18n keys.

## Steps

1. **Facilities** (`GET /api/facilities`): grouped by category, each row
   showing name, description, hours, and an accessibility line with an icon.
   Loading, error, and empty states. Commit.
2. **Clubs** (`GET /api/clubs`): each row shows name, meets, vibe label,
   description, and "How to join". Intro line: "Join what you like. Skip what you
   don't. No one keeps attendance." (with a Spanish equivalent). Commit.
3. **About**: plain-language story with no interviewee names. Who it's for (5C
   dining, grounds, custodial, maintenance, admin staff). What we heard (many
   commute 20 to 100 miles a day; Claremont median rent is $2,237/mo while dining
   pay averages about $28/hr; parents want a park and a room for family
   gatherings; many prefer distance from coworkers at home). The problem
   statement (HMW). Three principles: "Your schedule. Your pace. Your
   privacy." Then **"How we'll know it's working"**: the 4 success targets from
   `docs/PRODUCT.md`, each next to the live number from `GET /api/metrics`
   (applications, RSVPs, feedback responses, average rating), styled as
   plain text rows, not stat tiles. If metrics fail, show the targets without
   numbers. Commit.
4. **Contact**: front desk "Claremont Vista Front Desk · North Campus,
   Claremont, CA (proposed)", phone `(909) 555-0142`, hours "Daily 6am to 10pm",
   "Se habla español", and a note that a printed events board hangs in the
   mailroom for neighbors who prefer paper. Then `FeedbackForm`: 1 to 5 rating
   (radio group styled as buttons; required), optional message (max 1000 with a
   counter), which sends `page:"contact"` and the current `lang`. States are
   submitting, success ("Thank you. We read every note."), and error (keeps the
   text, offers retry). Commit.
5. **Application** (`/apply`), in this order:
   a. Who qualifies: 3 numbered plain steps (work at a Claremont College or
      consortium office, any role or shift; household income within the limits;
      apply below and we contact you in your language).
   b. `RentTable` (static, plain HTML table, labeled "Proposed rent"): Studio
      $800, 1 bedroom $1,000, 2 bedrooms $1,250, 3 bedrooms $1,500. Water and
      trash included, a $500 deposit, no pet rent. A caption compares this to the
      Claremont median of $2,237/mo.
   c. `ApplicationForm` fields per `ApplicationRequest`: employer and
      job_category as selects with human labels (Pomona College, Claremont
      McKenna, Scripps, Pitzer, Harvey Mudd, CGU, KGI, The Claremont Colleges
      Services, Other). Income accepts "52,000" or "$52,000" (strip non-digits).
      Client validation shows inline errors with no network call; on submit,
      a loading state; a server 400 maps `field` to its input.
   d. `EligibilityResult`: status in plain words (priority = "You're in our
      priority group", eligible = "You're eligible", over_income = "Your
      income is above this program's limit; we'll still keep your application
      on file", needs_review = "We'll review your employment and contact you"),
      plus the application id, "Rent you can comfortably afford:
      $1,300/mo", and which `RentTable` units fit under it. Commit.
6. Verify: the demo application (household 3, $52,000, Pomona) shows priority
   and $1,300, with studio, 1BR, and 2BR fitting. Submit feedback. Toggle ES on
   every page. Screenshots at 1440/768/390 of Apply and the result state. Run
   `npm run build`. Invoke `superpowers:verification-before-completion`, write
   the handoff (§16), and set TASK-003/004/005 to `REVIEW`.

## Acceptance Criteria

- [ ] AC-15: application validation, loading, result, and server-error mapping
- [ ] AC-16: feedback required rating, success, and error that keeps the text
- [ ] AC-17: loading, error, and empty states on Facilities and Clubs
- [ ] AC-11: every page fully switches to Spanish
- [ ] AC-23: one h1 per page, labels tied to inputs, visible focus
- [ ] `npm run build` exits 0

## Review History

| Round | Verdict | Summary |
|---|---|---|
