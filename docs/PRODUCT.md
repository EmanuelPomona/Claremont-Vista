# Product Specification

## Product Name

**Claremont Vista**

## One-Sentence Description

A bilingual (English/Spanish) website for a proposed affordable housing community
for low-income Claremont Colleges workers. Prospective residents can check
eligibility and apply, and residents can find events, clubs, and facilities they
join on their own terms.

## Problem

Low-income 5C workers (dining, grounds, custodial, admin) are priced out of
Claremont. Median gross rent is $2,237/month, while dining pay averages about
$28/hr. Many commute 20 to 100 miles a day, split apartments they would rather
not share, or hold second jobs. Research found the community they want is
**chosen, not imposed**:

- many already have friend groups
- many do not want to see coworkers at home
- parents want a park, a room for family gatherings, and something for the kids
- second jobs and shifts leave little time, so anything social must fit odd hours

**Problem statement (team's chosen HMW):** How might we empower low-income 5C
workers to build community on their own terms, balancing opportunities for
social connection with their need for privacy and independence?

## Target User

Personas (distilled from interviews; never use interviewee names anywhere):

1. **Late-20s dining worker.** 25-minute drive, splits rent and dislikes it, would
   join some events if they were easy to drop into.
2. **Mid-30s parent, two kids, second job.** Wants a park, a common room for family
   parties, and kids' activities, and has little free time.
3. **Early-30s admin worker, 12 years at a college.** Wants privacy and distance
   from coworkers. Parking matters. Community is optional for her.
4. **Judges.** They score the 5-stage design-thinking rubric. The site is the
   *prototype* stage, so it must demo end to end and show success metrics and
   feedback collection.

## Core User Story

As a 5C worker with an unusual shift, I want to see what's happening at Claremont
Vista at times I can actually make, and how social each thing is, so that I can
join what I want without being pushed into anything.

## MVP Goal (1-hour build, local demo)

A user can:

1. Open the homepage and browse upcoming events in a carousel (per the owner's
   sketch, `docs/reference/homepage-sketch.jpg`).
2. Filter events by **when** (shift band) and **how social** (vibe), and tap
   "I'm going". The anonymous count goes up, and no names are collected.
3. Read Facilities, Clubs, About, and Contact.
4. Check eligibility and submit an application. It returns an eligibility
   estimate and the most rent they can comfortably afford.
5. Switch the whole site between English and Spanish.
6. Leave anonymous feedback (rubric: Test stage).

## Primary Demo Flow

1. Open `/`. The carousel shows upcoming events with photos.
2. Switch to **Español**. Navigation, page copy, and event content all switch.
3. Go to **Events** and filter to "Evening" + "Drop in solo". Tap **I'm going**
   on one event and watch the count increase.
4. Visit **Facilities** (childcare, fitness, pickleball, shuttle stop) and
   **Clubs**.
5. Go to **Application**, read the proposed rent table, and submit a household of
   3 earning $52,000 at Pomona College. The result shows "Priority" and a
   comfortable rent of $1,300/mo.
6. Go to **Contact**, submit 4-star feedback, and see the confirmation.
7. Open **About**. "How we'll know it's working" shows live counts from the demo
   (applications, RSVPs, feedback).

## Must-Have Features

- [ ] Header: hand-drawn-style "Claremont Vista" wordmark (V through the name),
      a nav row (Facilities, Events, Clubs, About, Contact, Application), and an
      EN/ES toggle
- [ ] Homepage carousel of upcoming events (photo, title, when, vibe, prev/next,
      dots, keyboard and swipe)
- [ ] Events page with the shift-band + vibe filter and an anonymous RSVP
- [ ] Facilities page (from API)
- [ ] Clubs page (from API)
- [ ] About page (the research story in plain language, success metrics)
- [ ] Contact page (front desk details + anonymous feedback form)
- [ ] Application page (proposed rent table, eligibility steps, form, result)
- [ ] Full EN/ES support for UI copy and API content

## Nice-to-Have Features (only after every must-have works)

- [ ] Events calendar `.ics` download
- [ ] Video in a carousel slide
- [ ] Printable "cork board" flyer view of the week's events (for residents who
      don't use the site; a physical prototype in the PDF)

## Explicitly Out of Scope

- accounts, logins, resident profiles
- forum / message board (privacy risk, no moderation in 1 hour)
- facility booking and payments
- admin/event-posting UI
- deployment (local laptop demo only)
- any real person's name, photo, or story in site copy

## Success Criteria (product)

Shown on the About page as the prototype's test plan. Targets are hypotheses,
not results:

- Rent at or below 30% of household income for every resident
- Commute time cut (from a 20 to 100 mile daily drive to walking distance)
- Share of residents attending at least 1 event a month **by choice** (an opt-in
  survey, never tracked)
- Feedback responses and average rating from the site's feedback form, shown
  live on About via `GET /api/metrics`

## Hackathon Constraints

Time available: ~1 hour for implementation agents
Team: manager, frontend, backend, reviewer (Claude Code sessions)
Deployment: none. Local demo.
