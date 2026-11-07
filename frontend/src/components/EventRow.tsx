import type { Event } from '../api/types'
import { useLang } from '../i18n'
import { formatTime, formatWeekday } from '../lib/format'
import { RsvpButton } from './RsvpButton'
import { VibeLabel } from './VibeLabel'

/**
 * One row of the timetable: when, what, where, how social, I'm going.
 * `compact` drops the description (used for the homepage preview).
 */
export function EventRow({ event, compact = false }: { event: Event; compact?: boolean }) {
  const { lang, pick } = useLang()
  return (
    <li className="event-row">
      <div className="event-row__when">
        <span className="event-row__day">{formatWeekday(event.starts_at, lang)}</span>
        <time className="event-row__time" dateTime={event.starts_at}>
          {formatTime(event.starts_at, lang)}
        </time>
      </div>

      <div className="event-row__main">
        <h3 className="event-row__title">{pick(event.title)}</h3>
        {!compact && <p className="event-row__desc">{pick(event.description)}</p>}
      </div>

      <div className="event-row__where">
        <span>{pick(event.location)}</span>
        {event.recurrence && <span className="event-row__rec">{pick(event.recurrence)}</span>}
      </div>

      <div className="event-row__vibe">
        <VibeLabel vibe={event.vibe} />
      </div>

      <div className="event-row__rsvp">
        <RsvpButton event={event} />
      </div>
    </li>
  )
}
