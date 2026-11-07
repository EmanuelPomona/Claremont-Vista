import { getClubs } from '../api/client'
import { EmptyState } from '../components/states/EmptyState'
import { ErrorState } from '../components/states/ErrorState'
import { Loading } from '../components/states/Loading'
import { VibeLabel } from '../components/VibeLabel'
import { useApi } from '../hooks/useApi'
import { useReveal } from '../hooks/useReveal'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLang } from '../i18n'

export default function Clubs() {
  const { t, pick } = useLang()
  usePageTitle('title.clubs')
  const { data, error, loading, reload } = useApi(() => getClubs(), [])
  const waiting = loading && !data
  const rootRef = useReveal<HTMLDivElement>(data)

  return (
    <div className="container page" ref={rootRef}>
      <header className="page__head">
        <h1>{t('clubs.h1')}</h1>
        <p className="page__lede">{t('clubs.lede')}</p>
      </header>

      {waiting ? (
        <Loading rows={5} />
      ) : error ? (
        <ErrorState onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState title={t('clubs.empty')} />
      ) : (
        <ul className="rows-top">
          {data.map((c) => (
            <li key={c.id} className="row reveal">
              <div className="row__main">
                <h2 className="row__title">{pick(c.name)}</h2>
                <p>{pick(c.description)}</p>
                <div className="row__label">
                  <VibeLabel vibe={c.vibe} />
                </div>
              </div>
              <dl className="row__facts">
                <div>
                  <dt>{t('clubs.meets')}</dt>
                  <dd>{pick(c.meets)}</dd>
                </div>
                <div>
                  <dt>{t('clubs.join')}</dt>
                  <dd>{pick(c.how_to_join)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
