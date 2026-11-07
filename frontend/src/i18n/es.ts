import type { en } from './en'

// Neutral Latin American Spanish. Same keys as en.ts (enforced by the type).
// Layouts tolerate roughly 25% longer copy.
export const es: typeof en = {
  // chrome
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
}
