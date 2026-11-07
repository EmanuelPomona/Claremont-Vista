import { useCallback, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Event } from '../api/types'
import { useLang } from '../i18n'
import { formatWhen } from '../lib/format'
import { BandLabel, VibeLabel } from './VibeLabel'

/** Event photo, or the designed fallback (jacaranda-tint panel + band label). Never a broken image icon. */
function Photo({ event }: { event: Event }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="photo-fallback">
        <BandLabel band={event.band} />
      </div>
    )
  }
  return (
    <img
      className="slide__img"
      src={event.image}
      alt=""
      loading="eager"
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}

/**
 * Full-width carousel of upcoming events (the owner's sketch).
 * Prev/next buttons, dots, left/right arrow keys and touch swipe. It does not
 * auto-advance, so there is nothing to pause and reduced-motion users get no
 * surprise movement; the slide transition itself is disabled by the global
 * prefers-reduced-motion rule in base.css.
 */
export function Carousel({ events }: { events: Event[] }) {
  const { t, pick, lang } = useLang()
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const total = events.length

  const go = useCallback((next: number) => setIndex(((next % total) + total) % total), [total])

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index + 1)
    }
  }

  function onTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
  }

  const current = events[index]

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label={t('carousel.label')}
      onKeyDown={onKeyDown}
    >
      <div
        className="carousel__viewport"
        tabIndex={0}
        role="group"
        aria-label={t('carousel.label')}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <ul className="carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {events.map((event, i) => (
            <li
              key={event.id}
              className="slide"
              role="group"
              aria-roledescription="slide"
              aria-label={t('carousel.slide', { n: i + 1, total })}
              aria-hidden={i !== index}
            >
              <div className="slide__media">
                <Photo event={event} />
              </div>
              <div className="slide__caption">
                <time className="slide__when" dateTime={event.starts_at}>
                  {formatWhen(event.starts_at, lang)}
                </time>
                <div className="slide__body">
                  <Link to="/events" className="slide__title" tabIndex={i === index ? 0 : -1}>
                    {pick(event.title)}
                  </Link>
                  <p className="slide__where">{pick(event.location)}</p>
                  <div className="slide__labels">
                    <BandLabel band={event.band} />
                    <VibeLabel vibe={event.vibe} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {total > 1 && (
        <div className="carousel__arrows">
          <button type="button" className="carousel__arrow" aria-label={t('carousel.prev')} onClick={() => go(index - 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" className="carousel__arrow" aria-label={t('carousel.next')} onClick={() => go(index + 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <div className="carousel__dots">
        {events.map((event, i) => (
          <button
            key={event.id}
            type="button"
            className="dot"
            aria-current={i === index ? 'true' : undefined}
            aria-label={t('carousel.goto', { n: i + 1, total, title: pick(event.title) })}
            onClick={() => go(i)}
          >
            <span />
          </button>
        ))}
      </div>

      {/* announce the new slide to screen readers */}
      <p className="visually-hidden" aria-live="polite">
        {t('carousel.slide', { n: index + 1, total })}: {pick(current.title)}
      </p>
    </section>
  )
}
