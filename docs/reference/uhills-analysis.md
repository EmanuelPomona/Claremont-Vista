# University Hills (UC Irvine): reference analysis

The owner calls University Hills "the gold standard" for this project. Borrow
what it does for each audience, **not** its layout, copy, branding, or imagery
("we won't copy it 1 for 1"). Snapshot taken 2026-11-07 from about 30 pages.

## Two sites, two audiences

University Hills runs on two websites:

- **icha.uci.edu** is the official Irvine Campus Housing Authority site. It
  covers prospective residents, eligibility, sales, rentals, rates, payment
  portals, and documents.
- **uhills.org** is the residents' community site. It covers the residents'
  advisory board, events, facility reservations, groups, and classifieds. It
  has nothing for people who don't live there yet.

We should put both on **one** site.

## Site map (condensed)

**icha.uci.edu**
- **Future Residents**
  - To Own: sales, a floor-plan finder, waitlist, documents.
  - To Rent: rentals, floor plans, rates, waitlists, eligibility.
- **Current Residents**
  - Homeowners: portal and bill pay, improvements, maintenance guide.
  - Renters: portal and bill pay, parking, autopay.
- **About, Location, Contact**

**uhills.org**
- **Utility bar:** Login, Request an account, My Reservations, Subscribe, Search.
- **Main menu:**
  - Reservations Calendar
  - Homeowner board (members, minutes)
  - About: welcome packet, FAQ, news, history, maps
  - Resources: maintenance, contractors, emergency, utilities, pets
  - Groups (9)
  - Community Ads (classifieds)
  - Facilities & Reservations: courts, playgrounds, parks, pools, community center
  - Contact

## What it does for each audience

**Prospective residents**
- Navigation splits by audience first (Future vs Current residents), then by
  intent (To Own / To Rent).
- Rental rates are a plain HTML table with effective dates, the security
  deposit, pet rent, and which utilities are included.
- Floor-plan finder with filters for bedrooms, bathrooms, square footage, and
  home type.
- **Eligibility depends on employment, not income.** Homes are for full-time UCI
  faculty and staff only. Applicants fall into 5 priority tiers, and the site
  states how long someone may stay after losing eligibility (for example,
  3 months after retirement).
- **Resale price control:** the maximum resale price is the purchase price
  adjusted by an index, plus approved improvements. The stated goal is that
  homes are not "speculative investment vehicles."

**Applicants**
- Waitlist offers go by priority tier, then by application date.
- Every step is a PDF: there is no online application, no status lookup, and no
  numbered steps.

**Current residents**
- **Household accounts:** a primary account is checked against the resident
  list, and that person approves secondary accounts for their household.
  Signing in unlocks:
  - facility booking (date picker, recurring bookings, "My Reservations")
  - classifieds
  - the contractor list
- The public event calendar can be subscribed to (Google, iCal, Outlook).
- Bill pay and maintenance requests go out to a third-party portal
  (Yardi/RentCafe).
- **Governance transparency:** board minutes are public, along with the meeting
  time, the format (hybrid), and how to submit an agenda item.

## Community features

- **Homepage events list:**
  - Weekly regulars: game night, choir, meditation, social hour, knitting.
  - One-off events: potluck, bazaar, gallery night, festivals.
- **Groups directory:**
  - intergenerational and aging-in-place
  - entertainment committee
  - wildlife reporting, sustainability, safety
  - swim team
- **Amenities:**
  - pools
  - a 4-room bookable community center
  - parks, dog parks, pickleball/tennis courts, tot lots
- **Ways to get involved:**
  - Sign-up channels: a mailing list, an email newsletter sign-up, volunteer
    RSVPs, and social accounts.
  - Prompts to participate: "Run for the board" and "Start your own activity."
  - A paid community events coordinator runs programming.

## Borrow (top 5)

1. **Audience-first navigation** on one domain: "Thinking of moving here" vs
   "I live here".
2. **Costs in plain HTML, never PDFs:** rent, deposit, utilities, and the
   **income limits** (our version of their eligibility tiers). UCI has no
   income test, so this part is ours to design.
3. **Clear eligibility and priority rules**, plus what happens when someone's
   job changes, written as numbered steps with an online interest/waitlist form.
4. **Household accounts that unlock self-service:** booking shared spaces, a
   subscribable events calendar, and a community board/classifieds.
5. **A homepage that shows the community is alive:** recurring events, a groups
   directory, and an obvious way to join or start something.

## Avoid (their gaps)

- **PDF sprawl and version drift:** the FAQ is a 2022 newsletter, and the menu
  links an outdated application.
- **Dead links and stale pages:** several 404s, and COVID-era and 2023 content
  still up.
- **Privacy:** the public calendar shows residents' names and phone numbers.
  Ours must not; this matters even more for our users.
- **Accessibility:**
  - Pinch-zoom is disabled.
  - The homepage has no h1.
  - Logos have empty alt text.
  - Form labels point to the wrong fields.
- **Two disconnected sites:** prospective residents never see the community.

## Where our users differ

- University Hills serves UCI faculty and staff and uses no income test.
- We serve low-income 5C workers. Many work shifts, hold second jobs, commute
  far by car, or are raising families.
- Our research says "community on their own terms." Every community feature is
  **optional**, privacy is the default, and events run at times that fit
  different shifts.
