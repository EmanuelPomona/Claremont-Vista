import type { en } from './en'

// Neutral Latin American Spanish. Same keys as en.ts (enforced by the type).
// Layouts tolerate roughly 25% longer copy.
export const es: typeof en = {
  // chrome strings
  'skip.main': 'Saltar al contenido',
  'brand.home': 'Inicio de Claremont Vista',
  'nav.label': 'Principal',
  'nav.facilities': 'Instalaciones',
  'nav.events': 'Eventos',
  'nav.clubs': 'Clubes',
  'nav.about': 'Nosotros',
  'nav.contact': 'Contacto',
  'nav.apply': 'Solicitud',
  'lang.label': 'Idioma',
  'lang.en': 'English',
  'lang.es': 'Español',
  'footer.desk': 'Recepción (909) 555-0142, todos los días de 6 a. m. a 10 p. m.',
  'footer.spanish': 'Se habla español',
  'footer.note':
    'Claremont Vista es un prototipo de diseño: una propuesta de vivienda para el personal de las Claremont Colleges.',

  // shared states
  'state.loading': 'Cargando',
  'state.error.title': 'No pudimos cargar esto.',
  'state.error.body': 'Revisa tu conexión e inténtalo de nuevo.',
  'state.retry': 'Intentar de nuevo',
  'state.empty.title': 'Todavía no hay nada aquí.',

  // page titles (document.title)
  'title.home': 'Claremont Vista',
  'title.events': 'Eventos | Claremont Vista',
  'title.facilities': 'Instalaciones | Claremont Vista',
  'title.clubs': 'Clubes | Claremont Vista',
  'title.about': 'Nosotros | Claremont Vista',
  'title.contact': 'Contacto | Claremont Vista',
  'title.apply': 'Solicitud | Claremont Vista',
  'title.notfound': 'Página no encontrada | Claremont Vista',

  // page headings (one h1 each)
  'home.h1': 'Ven a lo que se ajuste a tu turno.',
  'events.h1': 'Eventos',
  'facilities.h1': 'Instalaciones',
  'clubs.h1': 'Clubes',
  'about.h1': 'Sobre Claremont Vista',
  'contact.h1': 'Contacto',
  'apply.h1': 'Solicita una vivienda',
  'notfound.h1': 'No encontramos esa página.',
  'notfound.body': 'Usa el menú de arriba, o vuelve a la página de inicio.',
  'notfound.home': 'Ir al inicio',

  // home
  'home.sub': 'Todo aquí es opcional. No hay que inscribirse y nadie pasa lista.',
  'home.strip.h2': 'Vivir aquí a tu manera',
  'home.strip.1.lead': 'Tu horario',
  'home.strip.1': 'Hay eventos desde las 5:30 a. m., al mediodía y a las 10:30 p. m., porque los turnos también son así.',
  'home.strip.2.lead': 'Tu ritmo',
  'home.strip.2': 'Ven por tu cuenta, únete a un grupo pequeño o sáltate el evento. Nadie pasa lista.',
  'home.strip.3.lead': 'Tu privacidad',
  'home.strip.3': 'Mostramos cuántos vecinos van, nunca quiénes.',
  'home.week.h2': 'Esta semana',
  'home.week.all': 'Ver todos los eventos',

  // carousel
  'carousel.label': 'Próximos eventos',
  'carousel.prev': 'Evento anterior',
  'carousel.next': 'Evento siguiente',
  'carousel.goto': 'Ver el evento {n} de {total}: {title}',
  'carousel.slide': 'Evento {n} de {total}',
  'carousel.empty': 'Todavía no hay eventos próximos',
  'carousel.empty.body': 'Vuelve pronto. Agregamos eventos nuevos cada semana.',

  // time bands and vibes (the signature filter)
  'band.early': 'Temprano',
  'band.early.hint': 'antes de las 9 a. m.',
  'band.midday': 'Mediodía',
  'band.midday.hint': 'de 9 a. m. a 4 p. m.',
  'band.evening': 'Tarde y noche',
  'band.evening.hint': 'después de las 4 p. m.',
  'band.weekend': 'Fin de semana',
  'band.weekend.hint': 'sábado y domingo',
  'vibe.solo': 'Ven por tu cuenta',
  'vibe.small': 'Grupo pequeño',
  'vibe.big': 'Reunión grande',

  // events page
  'events.lede':
    'Elige los horarios que sí puedes y qué tan sociable quieres estar. Todos los eventos son de entrada libre, sin inscripción.',
  'events.filters': 'Filtrar eventos',
  'filter.when': 'Cuándo',
  'filter.vibe': 'Qué tan social',
  'filter.all': 'Todos',
  'events.count': '{n} eventos',
  'events.empty.title': 'Ningún evento coincide con esos filtros.',
  'events.empty.body': 'Prueba otro horario o un grupo de otro tamaño.',
  'events.clear': 'Quitar filtros',

  // rsvp
  'rsvp.go': 'Voy · {n}',
  'rsvp.going': 'Voy ✓ · {n}',
  'rsvp.undo': 'deshacer',
  'rsvp.go.aria': 'Voy a {title}. Hasta ahora van {n}.',
  'rsvp.undo.aria': 'Deshacer mi asistencia a {title}. Van {n}.',
  'rsvp.error': 'No pudimos guardar eso. Inténtalo de nuevo.',
}
