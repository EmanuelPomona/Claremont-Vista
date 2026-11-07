import { useEffect, useRef, useState } from 'react'
import { rsvp, unrsvp } from '../api/client'
import type { Event } from '../api/types'
import { useRsvps } from '../hooks/useRsvps'
import { useLang } from '../i18n'

/**
 * "I'm going · 12" then "Going ✓ · 13 (undo)". The count always comes from the
 * server response. While a request is in flight the button is disabled, so a
 * double tap cannot double count. On failure the count is left alone.
 */
export function RsvpButton({ event }: { event: Event }) {
  const { t, pick } = useLang()
  const { going, add, remove } = useRsvps()
  const [count, setCount] = useState(event.going_count)
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [bump, setBump] = useState(0) // restarts the count pop after a confirmed change
  const inflight = useRef(false)
  const isGoing = going.has(event.id)

  // a refetch of the events list brings a fresher server count
  useEffect(() => setCount(event.going_count), [event.going_count])

  async function toggle() {
    if (inflight.current) return
    inflight.current = true
    setPending(true)
    setFailed(false)
    try {
      const res = isGoing ? await unrsvp(event.id) : await rsvp(event.id)
      setCount(res.going_count)
      setBump((n) => n + 1)
      if (isGoing) remove(event.id)
      else add(event.id)
    } catch {
      setFailed(true)
    } finally {
      inflight.current = false
      setPending(false)
    }
  }

  const title = pick(event.title)
  return (
    <div className="rsvp">
      <button
        type="button"
        className={isGoing ? 'btn btn--going' : 'btn'}
        disabled={pending}
        aria-busy={pending}
        aria-label={isGoing ? t('rsvp.undo.aria', { title, n: count }) : t('rsvp.go.aria', { title, n: count })}
        onClick={toggle}
      >
        <span key={bump} className={bump > 0 ? 'rsvp__label is-bumped' : 'rsvp__label'}>
          {isGoing ? (
            <>
              <span>{t('rsvp.going', { n: count })}</span>
              <span className="rsvp__undo">({t('rsvp.undo')})</span>
            </>
          ) : (
            t('rsvp.go', { n: count })
          )}
        </span>
      </button>
      {failed && (
        <p className="rsvp__error" role="alert">
          {t('rsvp.error')}
        </p>
      )}
    </div>
  )
}
