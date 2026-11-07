import { Link } from 'react-router-dom'
import { getEvents } from '../api/client'
import { Carousel } from '../components/Carousel'
import { EventRow } from '../components/EventRow'
import { EmptyState } from '../components/states/EmptyState'
import { ErrorState } from '../components/states/ErrorState'
import { Loading } from '../components/states/Loading'
import { useApi } from '../hooks/useApi'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLang, type StringKey } from '../i18n'

const STRIP: { lead: StringKey; body: StringKey }[] = [
  { lead: 'home.strip.1.lead', body: 'home.strip.1' },
  { lead: 'home.strip.2.lead', body: 'home.strip.2' },
  { lead: 'home.strip.3.lead', body: 'home.strip.3' },
]

export default function Home() {
  const { t } = useLang()
  usePageTitle('title.home')
  const { data, error, loading, reload } = useApi(() => getEvents(), [])
  const events = data ?? []
  const waiting = loading && !data

  return (
    <div className="container page home">
      <header className="home__intro">
        <h1>{t('home.h1')}</h1>
        <p className="page__lede">{t('home.sub')}</p>
      </header>

      {waiting ? (
        <Loading rows={1} tall />
      ) : error ? (
        <ErrorState onRetry={reload} />
      ) : events.length === 0 ? (
        <EmptyState title={t('carousel.empty')} message={t('carousel.empty.body')} />
      ) : (
        <Carousel events={events.slice(0, 6)} />
      )}

      <section className="home__strip" aria-labelledby="strip-h">
        <div className="section-head">
          <h2 id="strip-h">{t('home.strip.h2')}</h2>
        </div>
        <ul>
          {STRIP.map((s) => (
            <li key={s.lead} className="strip__item">
              <span className="strip__lead">{t(s.lead)}</span>
              <p>{t(s.body)}</p>
            </li>
          ))}
        </ul>
      </section>

      {!error && (waiting || events.length > 0) && (
        <section className="home__week" aria-labelledby="week-h">
          <div className="section-head">
            <h2 id="week-h">{t('home.week.h2')}</h2>
            <Link to="/events">{t('home.week.all')}</Link>
          </div>
          {waiting ? (
            <Loading rows={4} />
          ) : (
            <ol className="timetable">
              {events.slice(0, 4).map((e) => (
                <EventRow key={e.id} event={e} compact />
              ))}
            </ol>
          )}
        </section>
      )}
    </div>
  )
}
