// Dev-only data for VITE_USE_FIXTURES=1. Mirrors the seed tables in docs/API.md
// so the UI can be built before the backend is reachable. Event dates are
// computed relative to today (America/Los_Angeles), like the real seed.
import { ApiError } from './client'
import type {
  ApplicationRequest,
  ApplicationResponse,
  Audience,
  Band,
  Club,
  Event,
  EventQuery,
  Facility,
  FeedbackRequest,
  Localized,
  Metrics,
  RsvpCount,
  Vibe,
} from './types'

const L = (en: string, es: string): Localized => ({ en, es })
const TZ = 'America/Los_Angeles'
const wait = (ms = 220) => new Promise((r) => setTimeout(r, ms))

/* events ------------------------------------------------------------- */

function laToday() {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((a, x) => ((a[x.type] = x.value), a), {})
  return { y: Number(p.year), m: Number(p.month), d: Number(p.day) }
}

/** ISO string with the correct Pacific offset for the given local date/time. */
function laIso(y: number, m: number, d: number, hh: number, mm: number): string {
  const probe = new Date(Date.UTC(y, m - 1, d, 20))
  const off =
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'longOffset' })
      .formatToParts(probe)
      .find((p) => p.type === 'timeZoneName')
      ?.value.replace('GMT', '') || '-08:00'
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00${off}`
}

function bandOf(weekday: number, hour: number): Band {
  if (weekday === 0 || weekday === 6) return 'weekend'
  return hour < 9 ? 'early' : hour < 16 ? 'midday' : 'evening'
}

interface Seed {
  id: string
  title: Localized
  desc: Localized
  place: Localized
  wd: number // 0 = Sunday
  start: [number, number]
  end: [number, number]
  vibe: Vibe
  audience: Audience
  rec: Localized | null
  going: number
}

const SEEDS: Seed[] = [
  {
    id: 'sunrise-yoga',
    title: L('Sunrise yoga before your shift', 'Yoga al amanecer antes de tu turno'),
    desc: L(
      'Gentle stretching before the early shuttle. Mats are provided. No sign-up needed, and this one is for adults.',
      'Estiramientos suaves antes del transporte de la mañana. Prestamos las colchonetas. No necesitas inscribirte, y esta es para adultos.',
    ),
    place: L('Movement Studio', 'Estudio de movimiento'),
    wd: 2, start: [5, 30], end: [6, 15], vibe: 'solo', audience: 'adults',
    rec: L('Tuesdays and Thursdays', 'Martes y jueves'), going: 6,
  },
  {
    id: 'early-coffee',
    title: L('Coffee and pan dulce at the shuttle stop', 'Café y pan dulce en la parada del transporte'),
    desc: L(
      'Grab a coffee and a pan dulce on your way out. No sign-up needed, and kids are welcome.',
      'Llévate un café y un pan dulce antes de salir. No necesitas inscribirte, y los niños son bienvenidos.',
    ),
    place: L('Shuttle Stop', 'Parada del transporte'),
    wd: 4, start: [6, 0], end: [7, 0], vibe: 'solo', audience: 'everyone',
    rec: L('Every Thursday', 'Todos los jueves'), going: 9,
  },
  {
    id: 'pickleball-open-play',
    title: L('Lunch-hour open pickleball', 'Pickleball libre a la hora del almuerzo'),
    desc: L(
      'Paddles at the front desk, and beginners are welcome. No sign-up needed. Adults only.',
      'Hay paletas en la recepción, y los principiantes son bienvenidos. No necesitas inscribirte. Solo adultos.',
    ),
    place: L('Pickleball Courts', 'Canchas de pickleball'),
    wd: 3, start: [12, 0], end: [13, 0], vibe: 'small', audience: 'adults',
    rec: L('Every Wednesday', 'Todos los miércoles'), going: 8,
  },
  {
    id: 'lunch-crafting',
    title: L('Quiet crafting hour', 'Hora tranquila de manualidades'),
    desc: L(
      'Bring a project or use ours. Nobody will ask you to chat. No sign-up needed, and kids are welcome.',
      'Trae un proyecto o usa los nuestros. Nadie te va a pedir que converses. No necesitas inscribirte, y los niños son bienvenidos.',
    ),
    place: L('Commons Hall (craft room)', 'Salón comunitario (sala de manualidades)'),
    wd: 4, start: [12, 30], end: [13, 15], vibe: 'solo', audience: 'everyone',
    rec: L('Every Thursday', 'Todos los jueves'), going: 4,
  },
  {
    id: 'kids-playgroup',
    title: L("Kids' playgroup with 5C student volunteers", 'Juego para niños con voluntarios universitarios de las 5C'),
    desc: L(
      'Trained student volunteers run games and snacks while you stay close or step away. No sign-up needed. Kids welcome.',
      'Voluntarios universitarios capacitados dirigen juegos y refrigerios mientras tú te quedas cerca o te tomas un respiro. No necesitas inscribirte. Niños bienvenidos.',
    ),
    place: L('Childcare Room', 'Sala de cuidado infantil'),
    wd: 4, start: [16, 30], end: [18, 0], vibe: 'small', audience: 'families',
    rec: L('Every Thursday', 'Todos los jueves'), going: 11,
  },
  {
    id: 'walking-loop',
    title: L('Evening walk on the shaded loop', 'Caminata nocturna en el circuito con sombra'),
    desc: L(
      'Walk at your own pace, alone or beside someone. The loop is lit. No sign-up needed, and kids are welcome.',
      'Camina a tu ritmo, solo o acompañado. El circuito tiene luz. No necesitas inscribirte, y los niños son bienvenidos.',
    ),
    place: L('Shaded Walking Loop', 'Circuito de caminata con sombra'),
    wd: 1, start: [18, 30], end: [19, 15], vibe: 'solo', audience: 'everyone',
    rec: L('Every Monday', 'Todos los lunes'), going: 7,
  },
  {
    id: 'family-movie-night',
    title: L('Family movie night on the lawn', 'Noche de cine familiar en el césped'),
    desc: L(
      'A family film on a big screen. Bring a blanket. No sign-up needed, and kids are welcome.',
      'Una película familiar en pantalla grande. Trae una manta. No necesitas inscribirte, y los niños son bienvenidos.',
    ),
    place: L('Central Lawn', 'Césped central'),
    wd: 5, start: [19, 0], end: [21, 0], vibe: 'big', audience: 'families',
    rec: null, going: 23,
  },
  {
    id: 'late-shift-games',
    title: L('Late-shift coffee and board games', 'Café y juegos de mesa para el turno tarde'),
    desc: L(
      'For people who finish late. Games, decaf, and quiet company. No sign-up needed. Adults only.',
      'Para quienes terminan tarde. Juegos, café descafeinado y compañía tranquila. No necesitas inscribirte. Solo adultos.',
    ),
    place: L('Commons Hall', 'Salón comunitario'),
    wd: 3, start: [22, 30], end: [23, 30], vibe: 'small', audience: 'adults',
    rec: L('Every Wednesday', 'Todos los miércoles'), going: 5,
  },
  {
    id: 'garden-workday',
    title: L('Community garden workday', 'Jornada en el huerto comunitario'),
    desc: L(
      'Weed, water, and pick fruit. Gloves provided. No sign-up needed, and kids are welcome with an adult.',
      'Deshierba, riega y cosecha fruta. Prestamos guantes. No necesitas inscribirte, y los niños son bienvenidos con un adulto.',
    ),
    place: L('Community Garden', 'Huerto comunitario'),
    wd: 6, start: [8, 0], end: [10, 0], vibe: 'small', audience: 'everyone',
    rec: L('Every Saturday', 'Todos los sábados'), going: 12,
  },
  {
    id: 'potluck-birthdays',
    title: L('Monthly potluck and birthday celebration', 'Convivio mensual y celebración de cumpleaños'),
    desc: L(
      'Bring a dish if you like, or just come and eat. We celebrate the month’s birthdays. No sign-up needed. Kids welcome.',
      'Trae un platillo si quieres, o solo ven a comer. Celebramos los cumpleaños del mes. No necesitas inscribirte. Niños bienvenidos.',
    ),
    place: L('Commons Hall', 'Salón comunitario'),
    wd: 0, start: [13, 0], end: [15, 0], vibe: 'big', audience: 'everyone',
    rec: L('First Sunday of the month', 'El primer domingo de cada mes'), going: 18,
  },
]

function buildEvents(): Event[] {
  const { y, m, d } = laToday()
  const todayDow = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return SEEDS.map((s) => {
    const ahead = ((s.wd - todayDow + 7) % 7) || 7 // 1 to 7 days from today
    const day = new Date(Date.UTC(y, m - 1, d + ahead))
    const [Y, M, D] = [day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate()]
    return {
      id: s.id,
      title: s.title,
      description: s.desc,
      location: s.place,
      starts_at: laIso(Y, M, D, s.start[0], s.start[1]),
      ends_at: laIso(Y, M, D, s.end[0], s.end[1]),
      band: bandOf(s.wd, s.start[0]),
      vibe: s.vibe,
      audience: s.audience,
      image: `/images/events/${s.id}.jpg`,
      recurrence: s.rec,
      going_count: s.going,
    }
  }).sort((a, b) => a.starts_at.localeCompare(b.starts_at))
}

const state = { events: buildEvents(), applications: 0, feedback: [] as number[] }

export async function events(q: EventQuery = {}): Promise<Event[]> {
  await wait()
  return state.events
    .filter((e) => (!q.band || e.band === q.band) && (!q.vibe || e.vibe === q.vibe))
    .slice(0, q.limit ?? 50)
    .map((e) => ({ ...e }))
}

export async function rsvp(id: string, delta: 1 | -1): Promise<RsvpCount> {
  await wait(160)
  const e = state.events.find((x) => x.id === id)
  if (!e) throw new ApiError(404, { error: 'event_not_found', message: `No event with id '${id}'` })
  e.going_count = Math.max(0, e.going_count + delta)
  return { event_id: id, going_count: e.going_count }
}

/* clubs -------------------------------------------------------------- */

const CLUBS: Club[] = [
  {
    id: 'garden-club', vibe: 'small', audience: 'everyone',
    name: L('Garden Club', 'Club de jardinería'),
    description: L(
      'We grow tomatoes, chiles, and herbs in shared beds, and share what we pick.',
      'Cultivamos tomates, chiles y hierbas en camas compartidas, y repartimos lo que cosechamos.',
    ),
    meets: L('Saturdays 8am, Community Garden', 'Sábados 8 a. m., huerto comunitario'),
    how_to_join: L('Just show up. Gloves provided.', 'Solo llega. Prestamos guantes.'),
  },
  {
    id: 'pickleball-club', vibe: 'small', audience: 'adults',
    name: L('Pickleball Regulars', 'Los de siempre del pickleball'),
    description: L(
      'Friendly games, all levels. We rotate partners so nobody waits.',
      'Partidos amistosos, de todos los niveles. Rotamos parejas para que nadie espere.',
    ),
    meets: L('Wednesdays at noon and Sundays at 5pm', 'Miércoles al mediodía y domingos a las 5 p. m.'),
    how_to_join: L('Paddles at the front desk.', 'Hay paletas en la recepción.'),
  },
  {
    id: 'parents-circle', vibe: 'small', audience: 'families',
    name: L("Parents' Circle", 'Círculo de padres'),
    description: L(
      'Parents swap tips and a snack while student volunteers play with the kids.',
      'Los padres comparten consejos y un refrigerio mientras voluntarios universitarios juegan con los niños.',
    ),
    meets: L('Thursdays 4:30pm, Childcare Room', 'Jueves 4:30 p. m., sala de cuidado infantil'),
    how_to_join: L('Bring the kids. Student volunteers watch them.', 'Trae a los niños. Voluntarios universitarios los cuidan.'),
  },
  {
    id: 'trail-walkers', vibe: 'small', audience: 'everyone',
    name: L('Trail Walkers', 'Caminantes del sendero'),
    description: L(
      'A morning hike at an easy pace. We wait for everyone.',
      'Una caminata matutina a paso tranquilo. Esperamos a todos.',
    ),
    meets: L('Sundays 7am, Claremont Hills Wilderness Park', 'Domingos 7 a. m., Parque Natural Claremont Hills'),
    how_to_join: L('Meet at the shuttle stop.', 'Nos vemos en la parada del transporte.'),
  },
  {
    id: 'makers-circle', vibe: 'solo', audience: 'everyone',
    name: L("Makers' Circle", 'Círculo de manualidades'),
    description: L(
      'Knit, sew, draw, or mend. Everyone works on their own thing.',
      'Tejer, coser, dibujar o remendar. Cada quien trabaja en lo suyo.',
    ),
    meets: L('Thursdays 12:30pm, Commons Hall', 'Jueves 12:30 p. m., salón comunitario'),
    how_to_join: L('Drop in with any project.', 'Llega con cualquier proyecto.'),
  },
  {
    id: 'carpool-board', vibe: 'solo', audience: 'adults',
    name: L('Shift Carpool Board', 'Tablero de viajes compartidos'),
    description: L(
      'A paper board for matching rides around odd shifts.',
      'Un tablero de papel para compartir viaje según tu turno.',
    ),
    meets: L('Board in the mailroom, any time', 'Tablero en el cuarto de correo, a cualquier hora'),
    how_to_join: L(
      'Post your shift times and find a ride. No group chats required.',
      'Anota tus horarios y encuentra quién te lleve. No hacen falta chats de grupo.',
    ),
  },
]

export async function clubs(): Promise<Club[]> {
  await wait()
  return CLUBS
}

/* facilities --------------------------------------------------------- */

const FACILITIES: Facility[] = [
  {
    id: 'fitness-center', category: 'fitness',
    name: L('Fitness Center', 'Gimnasio'),
    description: L('Cardio machines, free weights, and stretching space. Quiet at 5am.', 'Máquinas de cardio, pesas libres y espacio para estirar. Tranquilo a las 5 a. m.'),
    hours: L('Open 24 hours with your key fob', 'Abierto las 24 horas con tu llavero de acceso'),
    accessibility: L('Step-free entrance, wide aisles, and adjustable benches.', 'Entrada sin escalones, pasillos amplios y bancas ajustables.'),
  },
  {
    id: 'movement-studio', category: 'fitness',
    name: L('Movement Studio (yoga, stretching)', 'Estudio de movimiento (yoga, estiramientos)'),
    description: L('A bright room with mats provided. Classes are free and optional.', 'Un salón luminoso con colchonetas incluidas. Las clases son gratis y opcionales.'),
    hours: L('Free classes at 5:30am, 12pm, and 7pm', 'Clases gratis a las 5:30 a. m., 12 p. m. y 7 p. m.'),
    accessibility: L('Step-free entrance, accessible restroom, and chairs for seated practice.', 'Entrada sin escalones, baño accesible y sillas para practicar sentado.'),
  },
  {
    id: 'pickleball-courts', category: 'fitness',
    name: L('Pickleball Courts', 'Canchas de pickleball'),
    description: L('Two lit courts. Borrow paddles at the front desk.', 'Dos canchas con iluminación. Pide paletas prestadas en la recepción.'),
    hours: L('6am to 10pm, first come first served', 'De 6 a. m. a 10 p. m., por orden de llegada'),
    accessibility: L('Level paved path from the parking area, with a bench courtside.', 'Camino pavimentado y plano desde el estacionamiento, con una banca junto a la cancha.'),
  },
  {
    id: 'childcare-room', category: 'family',
    name: L('Childcare Room', 'Sala de cuidado infantil'),
    description: L('A safe room near the Commons for kids while you do laundry, rest, or take a class.', 'Un salón seguro cerca del salón comunitario para los niños mientras lavas ropa, descansas o tomas una clase.'),
    hours: L(
      "Weekdays 6am to 8pm, staffed by trained 5C student volunteers (proposed, via Pomona's Draper Center)",
      'De lunes a viernes de 6 a. m. a 8 p. m., con voluntarios universitarios de las 5C capacitados (propuesta, a través del Centro Draper de Pomona)',
    ),
    accessibility: L('Step-free entrance, changing table, and an accessible restroom.', 'Entrada sin escalones, cambiador y baño accesible.'),
  },
  {
    id: 'park-playground', category: 'outdoor',
    name: L('Park, Playground and Shaded Walking Loop', 'Parque, juegos infantiles y circuito de caminata con sombra'),
    description: L('Swings, a climbing structure, and a loop with benches every hundred steps.', 'Columpios, una estructura para trepar y un circuito con bancas cada cien pasos.'),
    hours: L('Dawn to dusk; the loop is lit until 11pm', 'De amanecer a anochecer; el circuito tiene luz hasta las 11 p. m.'),
    accessibility: L('Paved, level loop with benches and a ramp to the playground.', 'Circuito pavimentado y plano con bancas y una rampa al área de juegos.'),
  },
  {
    id: 'community-garden', category: 'outdoor',
    name: L('Community Garden and Fruit Trees', 'Huerto comunitario y árboles frutales'),
    description: L('Shared beds, a few private plots, and lemon, fig, and loquat trees.', 'Camas compartidas, algunas parcelas privadas y árboles de limón, higo y níspero.'),
    hours: L('Dawn to dusk; plots by request', 'De amanecer a anochecer; parcelas por solicitud'),
    accessibility: L('Raised beds at wheelchair height and a smooth gravel path.', 'Camas elevadas a la altura de una silla de ruedas y un sendero de grava compacta.'),
  },
  {
    id: 'commons-hall', category: 'community',
    name: L('Commons Hall (reservable for family gatherings)', 'Salón comunitario (se puede reservar para reuniones familiares)'),
    description: L('A big room with a kitchen, long tables, and space for a birthday or a quinceañera.', 'Un salón grande con cocina, mesas largas y espacio para un cumpleaños o una quinceañera.'),
    hours: L('7am to 11pm; reserve at the front desk', 'De 7 a. m. a 11 p. m.; reserva en la recepción'),
    accessibility: L('Step-free entrance, elevator to the second floor, accessible restroom.', 'Entrada sin escalones, elevador al segundo piso y baño accesible.'),
  },
  {
    id: 'shuttle-stop', category: 'transport',
    name: L('5C Shuttle Stop', 'Parada del transporte de las 5C'),
    description: L('A covered stop with a bench, lighting, and a schedule board.', 'Una parada techada con banca, iluminación y tablero de horarios.'),
    hours: L('Shuttles at shift changes: 5:15am, 1:45pm, 9:45pm (proposed)', 'Transporte en los cambios de turno: 5:15 a. m., 1:45 p. m., 9:45 p. m. (propuesta)'),
    accessibility: L('Curb-cut access and a covered bench with space beside it for a wheelchair.', 'Acceso con rampa de banqueta y una banca techada con espacio al lado para una silla de ruedas.'),
  },
  {
    id: 'mailroom', category: 'community',
    name: L('Mailroom and Private Package Lockers', 'Cuarto de correo y casilleros privados para paquetes'),
    description: L('Lockers for packages, and a cork board for notices, rides, and printed event lists.', 'Casilleros para paquetes y un tablero para avisos, viajes compartidos y la lista impresa de eventos.'),
    hours: L('Open 24 hours', 'Abierto las 24 horas'),
    accessibility: L('Automatic door, lockers at three heights, and large-print labels.', 'Puerta automática, casilleros a tres alturas y etiquetas en letra grande.'),
  },
]

export async function facilities(): Promise<Facility[]> {
  await wait()
  return FACILITIES
}

/* applications, feedback, metrics ----------------------------------- */

// 2026 LA County HOME 50% AMI limits; 80% tier is 1.6x rounded to $50 (docs/API.md)
const LIMITS: Record<number, [number, number]> = {
  1: [58300, 93300], 2: [66650, 106650], 3: [74950, 119900], 4: [83300, 133300],
  5: [89950, 143900], 6: [96650, 154650], 7: [103300, 165300], 8: [109950, 175900],
}

export async function application(b: ApplicationRequest): Promise<ApplicationResponse> {
  await wait(500)
  if (!b.email && !b.phone) {
    throw new ApiError(400, { error: 'contact_required', message: 'Provide an email or a phone number.', field: 'email' })
  }
  const [l50, l80] = LIMITS[b.household_size] ?? LIMITS[8]
  const status =
    b.employer === 'other' ? 'needs_review'
    : b.annual_income <= l50 ? 'priority'
    : b.annual_income <= l80 ? 'eligible'
    : 'over_income'
  state.applications += 1
  return {
    application_id: `CV-${String(state.applications).padStart(4, '0')}`,
    submitted_at: new Date().toISOString(),
    eligibility: {
      status,
      income_limit_50: l50,
      income_limit_80: l80,
      max_comfortable_rent: Math.floor((b.annual_income * 0.3) / 12),
    },
  }
}

export async function feedback(b: FeedbackRequest): Promise<{ feedback_id: string }> {
  await wait(300)
  state.feedback.push(b.rating)
  return { feedback_id: `FB-${String(state.feedback.length).padStart(4, '0')}` }
}

export async function metrics(): Promise<Metrics> {
  await wait(180)
  const n = state.feedback.length
  return {
    applications: state.applications,
    rsvps: state.events.reduce((s, e) => s + e.going_count, 0),
    feedback_count: n,
    average_rating: n ? Math.round((state.feedback.reduce((a, b) => a + b, 0) / n) * 10) / 10 : null,
  }
}
