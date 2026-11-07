// English strings. Flat keys, `{name}` placeholders. Spanish must provide the
// same key set: es.ts is typed `typeof en`, so a missing key fails the build.
// House copy rule: no em dashes in interface strings.
export const en = {
  // chrome
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
}
