import { getFacilities } from '../api/client'
import type { FacilityCategory } from '../api/types'
import { EmptyState } from '../components/states/EmptyState'
import { ErrorState } from '../components/states/ErrorState'
import { Loading } from '../components/states/Loading'
import { useApi } from '../hooks/useApi'
import { useReveal } from '../hooks/useReveal'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLang, type StringKey } from '../i18n'

const CATEGORY_ORDER: FacilityCategory[] = ['fitness', 'outdoor', 'family', 'community', 'transport']

/** Universal-access figure, so the access line is findable at a glance. */
function AccessIcon() {
  return (
    <svg className="access-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="4.5" r="1.9" />
      <path d="M5 8.5h14M12 8.5v5M12 13.5l-3.5 6M12 13.5l3.5 6" />
    </svg>
  )
}

export default function Facilities() {
  const { t, pick } = useLang()
  usePageTitle('title.facilities')
  const { data, error, loading, reload } = useApi(() => getFacilities(), [])
  const waiting = loading && !data
  const rootRef = useReveal<HTMLDivElement>(data)
  const groups = CATEGORY_ORDER.map((c) => ({ category: c, items: (data ?? []).filter((f) => f.category === c) })).filter(
    (g) => g.items.length > 0,
  )

  return (
    <div className="container page" ref={rootRef}>
      <header className="page__head">
        <h1>{t('facilities.h1')}</h1>
        <p className="page__lede">{t('facilities.lede')}</p>
      </header>

      {waiting ? (
        <Loading rows={5} />
      ) : error ? (
        <ErrorState onRetry={reload} />
      ) : groups.length === 0 ? (
        <EmptyState title={t('facilities.empty')} />
      ) : (
        groups.map((g) => (
          <section key={g.category} className="group" aria-labelledby={`cat-${g.category}`}>
            <div className="section-head">
              <h2 id={`cat-${g.category}`}>{t(`cat.${g.category}` as StringKey)}</h2>
            </div>
            <ul>
              {g.items.map((f) => (
                <li key={f.id} className="row reveal">
                  <div className="row__main">
                    <h3>{pick(f.name)}</h3>
                    <p>{pick(f.description)}</p>
                  </div>
                  <dl className="row__facts">
                    <div>
                      <dt>{t('facilities.hours')}</dt>
                      <dd>{pick(f.hours)}</dd>
                    </div>
                    <div>
                      <dt>{t('facilities.access')}</dt>
                      <dd className="access">
                        <AccessIcon />
                        <span>{pick(f.accessibility)}</span>
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
