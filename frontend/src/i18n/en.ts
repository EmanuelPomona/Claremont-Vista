// English strings. Flat keys, `{name}` placeholders. Spanish must provide the
// same key set: es.ts is typed `typeof en`, so a missing key fails the build.
// House copy rule: no em dashes in interface strings.
export const en = {
  // chrome strings
  'skip.main': 'Skip to content',
  'brand.home': 'Claremont Vista home',
  'nav.label': 'Main',
  'nav.facilities': 'Facilities',
  'nav.events': 'Events',
  'nav.clubs': 'Clubs',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.apply': 'Application',
  'lang.label': 'Language',
  'lang.en': 'English',
  'lang.es': 'Español',
  'footer.desk': 'Front desk (909) 555-0142, daily 6am to 10pm',
  'footer.spanish': 'Se habla español',
  'footer.note': 'Claremont Vista is a design prototype: proposed housing for Claremont Colleges staff.',

  // shared states
  'state.loading': 'Loading',
  'state.error.title': 'We could not load this.',
  'state.error.body': 'Check your connection, then try again.',
  'state.retry': 'Try again',
  'state.empty.title': 'Nothing here yet.',

  // page titles (document.title)
  'title.home': 'Claremont Vista',
  'title.events': 'Events | Claremont Vista',
  'title.facilities': 'Facilities | Claremont Vista',
  'title.clubs': 'Clubs | Claremont Vista',
  'title.about': 'About | Claremont Vista',
  'title.contact': 'Contact | Claremont Vista',
  'title.apply': 'Application | Claremont Vista',
  'title.notfound': 'Page not found | Claremont Vista',

  // page headings (one h1 each)
  'home.h1': 'Come to what fits your shift.',
  'events.h1': 'Events',
  'facilities.h1': 'Facilities',
  'clubs.h1': 'Clubs',
  'about.h1': 'About Claremont Vista',
  'contact.h1': 'Contact',
  'apply.h1': 'Apply for a home',
  'notfound.h1': 'We could not find that page.',
  'notfound.body': 'Use the menu above, or go back to the homepage.',
  'notfound.home': 'Go to the homepage',

  // home
  'home.sub': 'Everything here is optional. No sign-up, and nobody takes attendance.',
  'home.strip.h2': 'Living here on your terms',
  'home.strip.1.lead': 'Your schedule',
  'home.strip.1': 'Events start at 5:30am, at noon, and at 10:30pm, because shifts do.',
  'home.strip.2.lead': 'Your pace',
  'home.strip.2': 'Drop in solo, join a small group, or skip it. Nobody takes attendance.',
  'home.strip.3.lead': 'Your privacy',
  'home.strip.3': 'We show how many neighbors are going, never who.',
  'home.week.h2': 'This week',
  'home.week.all': 'See all events',

  // carousel
  'carousel.label': 'Upcoming events',
  'carousel.prev': 'Previous event',
  'carousel.next': 'Next event',
  'carousel.goto': 'Show event {n} of {total}: {title}',
  'carousel.slide': 'Event {n} of {total}',
  'carousel.empty': 'No upcoming events yet',
  'carousel.empty.body': 'Check back soon. We add new events every week.',

  // time bands and vibes (the signature filter)
  'band.early': 'Early',
  'band.early.hint': 'before 9am',
  'band.midday': 'Midday',
  'band.midday.hint': '9am to 4pm',
  'band.evening': 'Evening',
  'band.evening.hint': 'after 4pm',
  'band.weekend': 'Weekend',
  'band.weekend.hint': 'Saturday and Sunday',
  'vibe.solo': 'Drop in solo',
  'vibe.small': 'Small group',
  'vibe.big': 'Big gathering',

  // events page
  'events.lede': 'Pick the times you can make and how social you feel like being. Every event is drop in, with no sign-up.',
  'events.filters': 'Filter events',
  'filter.when': 'When',
  'filter.vibe': 'How social',
  'filter.all': 'All',
  'events.count': '{n} events shown',
  'events.empty.title': 'No events match those filters.',
  'events.empty.body': 'Try a different time of day or a different group size.',
  'events.clear': 'Clear filters',

  // rsvp
  'rsvp.go': "I'm going · {n}",
  'rsvp.going': 'Going ✓ · {n}',
  'rsvp.undo': 'undo',
  'rsvp.go.aria': "I'm going to {title}. {n} going so far.",
  'rsvp.undo.aria': 'Undo going to {title}. {n} going.',
  'rsvp.error': 'We could not save that. Try again.',
}
