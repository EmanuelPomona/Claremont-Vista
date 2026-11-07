"""Bilingual demo data (docs/API.md "Seed data").

Event dates are computed relative to ``today`` (America/Los_Angeles): each event
lands on the next occurrence of its weekday, 1 to 7 days after ``today``, so the
carousel never shows past events. Run ``python -m app.seed --reset`` from
``backend/`` to drop, recreate and reseed.
"""

from __future__ import annotations

import sqlite3
import sys
from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from app.db import drop_all, get_conn, init_schema

LA = ZoneInfo("America/Los_Angeles")

MON, TUE, WED, THU, FRI, SAT, SUN = range(7)

# (id, (title_en, title_es), (description_en, description_es),
#  (location_en, location_es), weekday, (start h, m), (end h, m), vibe, audience,
#  recurrence (en, es) or None, going_count)
EVENTS = [
    (
        "sunrise-yoga",
        ("Sunrise yoga before your shift", "Yoga al amanecer antes de tu turno"),
        (
            "A gentle 45-minute stretch to wake up before an early shift. No sign-up needed and mats are provided; this class is for adults.",
            "Una sesión suave de 45 minutos para despertar el cuerpo antes de un turno temprano. No necesitas inscribirte y prestamos los tapetes; esta clase es para adultos.",
        ),
        ("Movement Studio", "Estudio de movimiento"),
        TUE, (5, 30), (6, 15), "solo", "adults",
        ("Tuesdays and Thursdays", "Martes y jueves"), 6,
    ),
    (
        "early-coffee",
        ("Coffee and pan dulce at the shuttle stop", "Café y pan dulce en la parada del shuttle"),
        (
            "Coffee and pan dulce are on us where the 5C shuttle picks up, so the day starts with a little company. No sign-up needed; everyone is welcome, kids included.",
            "El café y el pan dulce van por nuestra cuenta, justo donde recoge el shuttle de las 5C, para empezar el día con algo de compañía. No necesitas inscribirte; todos son bienvenidos, también los niños.",
        ),
        ("Shuttle Stop", "Parada del shuttle"),
        THU, (6, 0), (7, 0), "solo", "everyone",
        ("Every Thursday", "Todos los jueves"), 9,
    ),
    (
        "pickleball-open-play",
        ("Lunch-hour open pickleball", "Pickleball libre a la hora del almuerzo"),
        (
            "Drop in for casual games on your lunch break; paddles are at the front desk. No sign-up needed, and this hour is for adults.",
            "Pasa a jugar partidos informales en tu hora de almuerzo; las paletas están en la recepción. No necesitas inscribirte y esta hora es para adultos.",
        ),
        ("Pickleball Courts", "Canchas de pickleball"),
        WED, (12, 0), (13, 0), "small", "adults",
        ("Every Wednesday", "Todos los miércoles"), 8,
    ),
    (
        "lunch-crafting",
        ("Quiet crafting hour", "Hora tranquila de manualidades"),
        (
            "Bring a knitting, sewing, or drawing project and work beside neighbors with no pressure to chat. No sign-up needed; kids are welcome with an adult.",
            "Trae un proyecto de tejido, costura o dibujo y trabaja junto a tus vecinos, sin presión de conversar. No necesitas inscribirte; los niños son bienvenidos con un adulto.",
        ),
        ("Commons Hall (craft room)", "Salón comunitario (sala de manualidades)"),
        THU, (12, 30), (13, 15), "solo", "everyone",
        ("Every Thursday", "Todos los jueves"), 4,
    ),
    (
        "kids-playgroup",
        ("Kids' playgroup with 5C student volunteers", "Juegos para niños con estudiantes voluntarios de las 5C"),
        (
            "Student volunteers lead games and crafts while parents rest or stay and join in. No sign-up needed; children of all ages are welcome.",
            "Estudiantes voluntarios dirigen juegos y manualidades mientras los padres descansan o se quedan a participar. No necesitas inscribirte; los niños de todas las edades son bienvenidos.",
        ),
        ("Childcare Room", "Sala de cuidado infantil"),
        THU, (16, 30), (18, 0), "small", "families",
        ("Every Thursday", "Todos los jueves"), 11,
    ),
    (
        "walking-loop",
        ("Evening walk on the shaded loop", "Caminata vespertina por el circuito con sombra"),
        (
            "An easy, unhurried walk after dinner on the lit loop; walk alone or with whoever shows up. No sign-up needed, and kids and strollers are welcome.",
            "Una caminata tranquila después de cenar por el circuito iluminado; camina solo o con quien se una. No necesitas inscribirte, y los niños y los cochecitos son bienvenidos.",
        ),
        ("Shaded Walking Loop", "Circuito para caminar con sombra"),
        MON, (18, 30), (19, 15), "solo", "everyone",
        ("Every Monday", "Todos los lunes"), 7,
    ),
    (
        "family-movie-night",
        ("Family movie night on the lawn", "Noche de cine familiar en el césped"),
        (
            "A family-friendly movie under the stars; bring a blanket and a chair. No sign-up needed, and kids are very welcome.",
            "Una película para toda la familia bajo las estrellas; trae una cobija y una silla. No necesitas inscribirte y los niños son muy bienvenidos.",
        ),
        ("Central Lawn", "Césped central"),
        FRI, (19, 0), (21, 0), "big", "families",
        None, 23,
    ),
    (
        "late-shift-games",
        ("Late-shift coffee and board games", "Café y juegos de mesa después del turno de noche"),
        (
            "For anyone finishing a late shift: coffee, board games, and easy company. No sign-up needed; this one is for adults because of the late hour.",
            "Para quienes terminan un turno tarde: café, juegos de mesa y buena compañía. No necesitas inscribirte; es para adultos por lo avanzado de la hora.",
        ),
        ("Commons Hall", "Salón comunitario"),
        WED, (22, 30), (23, 30), "small", "adults",
        ("Every Wednesday", "Todos los miércoles"), 5,
    ),
    (
        "garden-workday",
        ("Community garden workday", "Jornada de trabajo en el huerto comunitario"),
        (
            "Help water, weed, and harvest; gloves and tools are provided. No sign-up needed, and kids are welcome to dig in.",
            "Ayuda a regar, deshierbar y cosechar; proporcionamos guantes y herramientas. No necesitas inscribirte y los niños son bienvenidos a ayudar.",
        ),
        ("Community Garden", "Huerto comunitario"),
        SAT, (8, 0), (10, 0), "small", "everyone",
        ("Every Saturday", "Todos los sábados"), 12,
    ),
    (
        "potluck-birthdays",
        ("Monthly potluck and birthday celebration", "Comida compartida mensual y celebración de cumpleaños"),
        (
            "Bring a dish to share, or just come hungry, as we celebrate the month's birthdays. No sign-up needed; the whole family is welcome.",
            "Trae un platillo para compartir, o ven con hambre, mientras celebramos los cumpleaños del mes. No necesitas inscribirte; toda la familia es bienvenida.",
        ),
        ("Commons Hall", "Salón comunitario"),
        SUN, (13, 0), (15, 0), "big", "everyone",
        ("First Sunday of the month", "El primer domingo de cada mes"), 18,
    ),
]

# (id, (name_en, name_es), (description_en, description_es), (meets_en, meets_es),
#  vibe, audience, (how_to_join_en, how_to_join_es))
CLUBS = [
    (
        "garden-club",
        ("Garden Club", "Club de jardinería"),
        (
            "Neighbors who tend the community garden and fruit trees together and share the harvest.",
            "Vecinos que cuidan juntos el huerto comunitario y los árboles frutales, y comparten la cosecha.",
        ),
        ("Saturdays 8am, Community Garden", "Sábados a las 8 a. m., Huerto comunitario"),
        "small", "everyone",
        ("Just show up. Gloves provided.", "Solo preséntate. Prestamos guantes."),
    ),
    (
        "pickleball-club",
        ("Pickleball Regulars", "Jugadores regulares de pickleball"),
        (
            "A friendly group of adults who play twice a week. All skill levels are welcome.",
            "Un grupo amistoso de adultos que juega dos veces por semana. Todos los niveles son bienvenidos.",
        ),
        (
            "Wednesdays at noon and Sundays at 5pm",
            "Miércoles al mediodía y domingos a las 5 p. m.",
        ),
        "small", "adults",
        ("Paddles at the front desk.", "Las paletas están en la recepción."),
    ),
    (
        "parents-circle",
        ("Parents' Circle", "Círculo de padres"),
        (
            "Parents swap tips and catch their breath while student volunteers play with the kids.",
            "Padres que comparten consejos y toman un respiro mientras estudiantes voluntarios juegan con los niños.",
        ),
        ("Thursdays 4:30pm, Childcare Room", "Jueves a las 4:30 p. m., Sala de cuidado infantil"),
        "small", "families",
        (
            "Bring the kids. Student volunteers watch them.",
            "Trae a los niños. Estudiantes voluntarios los cuidan.",
        ),
    ),
    (
        "trail-walkers",
        ("Trail Walkers", "Caminantes de senderos"),
        (
            "A relaxed Sunday-morning hike for everyone, from strollers to seasoned walkers.",
            "Una caminata dominical relajada para todos, desde cochecitos hasta caminantes con experiencia.",
        ),
        (
            "Sundays 7am, Claremont Hills Wilderness Park",
            "Domingos a las 7 a. m., Claremont Hills Wilderness Park",
        ),
        "small", "everyone",
        ("Meet at the shuttle stop.", "Reúnete en la parada del shuttle."),
    ),
    (
        "makers-circle",
        ("Makers' Circle", "Círculo de creadores"),
        (
            "Knit, sew, draw, or fix things alongside neighbors, with no pressure to talk.",
            "Teje, cose, dibuja o repara cosas junto a tus vecinos, sin presión de conversar.",
        ),
        ("Thursdays 12:30pm, Commons Hall", "Jueves a las 12:30 p. m., Salón comunitario"),
        "solo", "everyone",
        ("Drop in with any project.", "Pasa con cualquier proyecto."),
    ),
    (
        "carpool-board",
        ("Shift Carpool Board", "Tablero de viajes compartidos para turnos"),
        (
            "A board in the mailroom where neighbors post their shift times and share rides to campus.",
            "Un tablero en el cuarto de correo donde los vecinos publican sus horarios de turno y comparten viajes al campus.",
        ),
        ("Board in the mailroom, any time", "Tablero en el cuarto de correo, a cualquier hora"),
        "solo", "adults",
        (
            "Post your shift times and find a ride. No group chats required.",
            "Publica tus horarios de turno y encuentra con quién viajar. No hace falta ningún grupo de chat.",
        ),
    ),
]

# (id, (name_en, name_es), (description_en, description_es), (hours_en, hours_es),
#  (accessibility_en, accessibility_es), category)
FACILITIES = [
    (
        "fitness-center",
        ("Fitness Center", "Gimnasio"),
        (
            "Cardio machines, free weights, and a stretching corner, right on site.",
            "Máquinas de cardio, pesas libres y un rincón de estiramiento, dentro de la comunidad.",
        ),
        ("Open 24 hours with your key fob", "Abierto las 24 horas con tu llave electrónica"),
        (
            "Step-free entrance, wide aisles, and an accessible restroom nearby.",
            "Entrada sin escalones, pasillos amplios y baño accesible cerca.",
        ),
        "fitness",
    ),
    (
        "movement-studio",
        ("Movement Studio (yoga, stretching)", "Estudio de movimiento (yoga y estiramiento)"),
        (
            "A bright studio for yoga and stretching classes, with mats provided.",
            "Un estudio luminoso para clases de yoga y estiramiento, con tapetes incluidos.",
        ),
        (
            "Free classes at 5:30am, 12pm, and 7pm",
            "Clases gratuitas a las 5:30 a. m., 12 p. m. y 7 p. m.",
        ),
        (
            "Step-free entrance, chairs available for seated options, accessible restroom.",
            "Entrada sin escalones, sillas disponibles para ejercicios sentados y baño accesible.",
        ),
        "fitness",
    ),
    (
        "pickleball-courts",
        ("Pickleball Courts", "Canchas de pickleball"),
        (
            "Lit courts for casual games, with paddles at the front desk.",
            "Canchas iluminadas para partidos informales, con paletas en la recepción.",
        ),
        ("6am to 10pm, first come first served", "De 6 a. m. a 10 p. m., por orden de llegada"),
        (
            "Level, paved path from the main walkway; benches courtside.",
            "Camino pavimentado y nivelado desde el andador principal; bancas junto a las canchas.",
        ),
        "fitness",
    ),
    (
        "childcare-room",
        ("Childcare Room", "Sala de cuidado infantil"),
        (
            "A safe, supervised room where children play while parents run errands or rest.",
            "Una sala segura y supervisada donde los niños juegan mientras los padres hacen sus pendientes o descansan.",
        ),
        (
            "Weekdays 6am to 8pm, staffed by trained 5C student volunteers (proposed, via Pomona's Draper Center)",
            "De lunes a viernes, de 6 a. m. a 8 p. m., con estudiantes voluntarios capacitados de las 5C (propuesta, a través del Draper Center de Pomona)",
        ),
        (
            "Step-free entrance, changing table, and an accessible family restroom.",
            "Entrada sin escalones, cambiador y baño familiar accesible.",
        ),
        "family",
    ),
    (
        "park-playground",
        (
            "Park, Playground and Shaded Walking Loop",
            "Parque, área de juegos y circuito para caminar con sombra",
        ),
        (
            "A green park with a playground for children and a shaded loop for walking.",
            "Un parque con área de juegos para niños y un circuito con sombra para caminar.",
        ),
        (
            "Dawn to dusk; the loop is lit until 11pm",
            "Del amanecer al anochecer; el circuito está iluminado hasta las 11 p. m.",
        ),
        (
            "Paved loop that works for strollers and wheelchairs, with benches along the way.",
            "Circuito pavimentado apto para cochecitos y sillas de ruedas, con bancas a lo largo del recorrido.",
        ),
        "outdoor",
    ),
    (
        "community-garden",
        ("Community Garden and Fruit Trees", "Huerto comunitario y árboles frutales"),
        (
            "Raised beds and fruit trees tended by residents; anyone can pick what is ripe.",
            "Camas elevadas y árboles frutales cuidados por los residentes; cualquiera puede cortar lo que esté maduro.",
        ),
        (
            "Dawn to dusk; plots by request",
            "Del amanecer al anochecer; parcelas por solicitud",
        ),
        (
            "Raised beds at wheelchair height and a smooth, wide path.",
            "Camas elevadas a la altura de una silla de ruedas y un camino liso y ancho.",
        ),
        "outdoor",
    ),
    (
        "commons-hall",
        (
            "Commons Hall (reservable for family gatherings)",
            "Salón comunitario (se puede reservar para reuniones familiares)",
        ),
        (
            "A big hall with a kitchen for community events, classes, and family gatherings.",
            "Un salón amplio con cocina para eventos comunitarios, clases y reuniones familiares.",
        ),
        (
            "7am to 11pm; reserve at the front desk",
            "De 7 a. m. a 11 p. m.; reserva en la recepción",
        ),
        (
            "Step-free entrance, elevator to the second floor, accessible restroom.",
            "Entrada sin escalones, elevador al segundo piso y baño accesible.",
        ),
        "community",
    ),
    (
        "shuttle-stop",
        ("5C Shuttle Stop", "Parada del shuttle de las 5C"),
        (
            "A covered stop with benches where the shuttle to the Claremont Colleges picks up.",
            "Una parada techada con bancas donde recoge el shuttle hacia las Claremont Colleges.",
        ),
        (
            "Shuttles at shift changes: 5:15am, 1:45pm, 9:45pm (proposed)",
            "Shuttles en los cambios de turno: 5:15 a. m., 1:45 p. m. y 9:45 p. m. (propuesto)",
        ),
        (
            "Level boarding area, covered bench seating, and good lighting at night.",
            "Zona de abordaje nivelada, bancas techadas y buena iluminación por la noche.",
        ),
        "transport",
    ),
    (
        "mailroom",
        (
            "Mailroom and Private Package Lockers",
            "Cuarto de correo y casilleros privados para paquetes",
        ),
        (
            "Secure mailboxes and package lockers, so deliveries stay safe while you are at work.",
            "Buzones seguros y casilleros para paquetes, para que tus entregas estén a salvo mientras trabajas.",
        ),
        ("Open 24 hours", "Abierto las 24 horas"),
        (
            "Step-free entrance and lockers at reachable heights, including low rows.",
            "Entrada sin escalones y casilleros a alturas alcanzables, incluidas filas bajas.",
        ),
        "community",
    ),
]


def today_la() -> date:
    return datetime.now(LA).date()


def next_occurrence(today: date, weekday: int) -> date:
    """The next date with this weekday, 1 to 7 days after ``today``."""
    return today + timedelta(days=(weekday - today.weekday() - 1) % 7 + 1)


def _stamp(day: date, hm: tuple[int, int]) -> str:
    return datetime.combine(day, time(*hm), tzinfo=LA).isoformat()


def seed(conn: sqlite3.Connection, today: date) -> None:
    """Insert the 10 events, 6 clubs and 9 facilities."""
    for (eid, title, desc, loc, weekday, start, end, vibe, audience, rec, going) in EVENTS:
        day = next_occurrence(today, weekday)
        conn.execute(
            """INSERT INTO events (id, title_en, title_es, description_en, description_es,
                   location_en, location_es, starts_at, ends_at, vibe, audience, image,
                   recurrence_en, recurrence_es, going_count)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                eid, title[0], title[1], desc[0], desc[1], loc[0], loc[1],
                _stamp(day, start), _stamp(day, end), vibe, audience,
                f"/images/events/{eid}.jpg",
                rec[0] if rec else None, rec[1] if rec else None, going,
            ),
        )
    for order, (cid, name, desc, meets, vibe, audience, join) in enumerate(CLUBS):
        conn.execute(
            """INSERT INTO clubs (id, name_en, name_es, description_en, description_es,
                   meets_en, meets_es, vibe, audience, how_to_join_en, how_to_join_es, sort_order)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
            (cid, name[0], name[1], desc[0], desc[1], meets[0], meets[1],
             vibe, audience, join[0], join[1], order),
        )
    for order, (fid, name, desc, hours, access, category) in enumerate(FACILITIES):
        conn.execute(
            """INSERT INTO facilities (id, name_en, name_es, description_en, description_es,
                   hours_en, hours_es, accessibility_en, accessibility_es, category, sort_order)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
            (fid, name[0], name[1], desc[0], desc[1], hours[0], hours[1],
             access[0], access[1], category, order),
        )
    conn.commit()


def _has_events(conn: sqlite3.Connection) -> bool:
    return conn.execute("SELECT COUNT(*) FROM events").fetchone()[0] > 0


def ensure_seeded(conn: sqlite3.Connection) -> None:
    """Create tables, and seed when there are no events yet."""
    init_schema(conn)
    if not _has_events(conn):
        seed(conn, today_la())


def main(argv: list[str]) -> None:
    reset = "--reset" in argv
    conn = get_conn()
    try:
        if reset:
            drop_all(conn)
        init_schema(conn)
        if _has_events(conn):
            print("events already present; use --reset to reseed")
        else:
            seed(conn, today_la())
            print("seeded 10 events, 6 clubs, 9 facilities")
    finally:
        conn.close()


if __name__ == "__main__":
    main(sys.argv[1:])
