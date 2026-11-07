import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getEvents } from '../api/client'
import type { Band, Vibe } from '../api/types'
import { EventRow } from '../components/EventRow'
import { EmptyState } from '../components/states/EmptyState'
import { ErrorState } from '../components/states/ErrorState'
import { Loading } from '../components/states/Loading'
import { BAND_ORDER, TimetableFilter, VIBE_ORDER } from '../components/TimetableFilter'
import { BandLabel } from '../components/VibeLabel'
import { useApi } from '../hooks/useApi'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLang } from '../i18n'

// The filter lives in the URL: /events?band=evening&vibe=solo. Unknown values are ignored.
const parseBand = (v: string | null): Band | null => (BAND_ORDER as string[]).includes(v ?? '') ? (v as Band) : null
const parseVibe = (v: string | null): Vibe | null => (VIBE_ORDER as string[]).includes(v ?? '') ? (v as Vibe) : null

export default function Events() {
  const { t } = useLang()
  usePageTitle('title.events')
  const [params, setParams] = useSearchParams()
  const band = parseBand(params.get('band'))
  const vibe = parseVibe(params.get('vibe'))

  // one fetch; filtering is client-side so chips respond instantly
  const { data, error, loading, reload } = useApi(() => getEvents(), [])

  function setFilter(key: 'band' | 'vibe', value: string | null) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(
    () => (data ?? []).filter((e) => (!band || e.band === band) && (!vibe || e.vibe === vibe)),
    [data, band, vibe],
  )
  const groups = BAND_ORDER.map((b) => ({ band: b, items: filtered.filter((e) => e.band === b) })).filter(
    (g) => g.items.length > 0,
  )
  const waiting = loading && !data

  return (
    <div className="container page">
      <header className="page__head">
        <h1>{t('events.h1')}</h1>
        <p className="page__lede">{t('events.lede')}</p>
      </header>

      <TimetableFilter
        band={band}
        vibe={vibe}
        onBand={(b) => setFilter('band', b)}
        onVibe={(v) => setFilter('vibe', v)}
      />

      {waiting ? (
        <Loading rows={5} />
      ) : error ? (
        <ErrorState onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('events.empty.title')}
          message={t('events.empty.body')}
          action={{
            label: t('events.clear'),
            onClick: () => setParams(new URLSearchParams(), { replace: true }),
          }}
        />
      ) : (
        <>
          <p className="visually-hidden" role="status">
            {t('events.count', { n: filtered.length })}
          </p>
          {groups.map((g) => (
            <section key={g.band} className="band" aria-labelledby={`band-${g.band}`}>
              <div className="band__head">
                <h2 id={`band-${g.band}`} className="band__title">
                  <BandLabel band={g.band} />
                </h2>
                <span className="band__hint">{t(`band.${g.band}.hint`)}</span>
              </div>
              <ol className="timetable">
                {g.items.map((e) => (
                  <EventRow key={e.id} event={e} />
                ))}
              </ol>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
