import { getMetrics } from '../api/client'
import type { Metrics } from '../api/types'
import { useApi } from '../hooks/useApi'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLang, type StringKey } from '../i18n'

const HEARD: StringKey[] = ['about.heard.1', 'about.heard.2', 'about.heard.3', 'about.heard.4']
const PRINCIPLES: { lead: StringKey; body: StringKey }[] = [
  { lead: 'about.p.1', body: 'about.p.1.body' },
  { lead: 'about.p.2', body: 'about.p.2.body' },
  { lead: 'about.p.3', body: 'about.p.3.body' },
]

export default function About() {
  const { t } = useLang()
  usePageTitle('title.about')
  // live demo numbers; if the request fails the targets still show, just without numbers
  const { data: metrics } = useApi<Metrics>(() => getMetrics(), [])

  // each target, with the live figure that speaks to it (when there is one)
  const targets: { text: StringKey; value: string | null }[] = [
    { text: 'about.m.t1', value: metrics ? t('about.m.apps', { n: metrics.applications }) : null },
    { text: 'about.m.t2', value: t('about.m.after') },
    { text: 'about.m.t3', value: metrics ? t('about.m.rsvps', { n: metrics.rsvps }) : null },
    {
      text: 'about.m.t4',
      value: metrics
        ? metrics.feedback_count > 0 && metrics.average_rating !== null
          ? t('about.m.feedback', { n: metrics.feedback_count, avg: metrics.average_rating.toFixed(1) })
          : t('about.m.feedback.none')
        : null,
    },
  ]

  return (
    <div className="container page about">
      <header className="page__head">
        <h1>{t('about.h1')}</h1>
      </header>

      <section className="about__section" aria-labelledby="who-h">
        <div className="section-head">
          <h2 id="who-h">{t('about.who.h2')}</h2>
        </div>
        <p className="about__body">{t('about.who.body')}</p>
      </section>

      <section className="about__section" aria-labelledby="heard-h">
        <div className="section-head">
          <h2 id="heard-h">{t('about.heard.h2')}</h2>
        </div>
        <ul>
          {HEARD.map((k) => (
            <li key={k} className="plain-row">
              <p>{t(k)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about__section" aria-labelledby="problem-h">
        <div className="section-head">
          <h2 id="problem-h">{t('about.problem.h2')}</h2>
        </div>
        <p className="about__question">{t('about.problem.body')}</p>
      </section>

      <section className="about__section" aria-labelledby="principles-h">
        <div className="section-head">
          <h2 id="principles-h">{t('about.principles.h2')}</h2>
        </div>
        <ul>
          {PRINCIPLES.map((p) => (
            <li key={p.lead} className="strip__item">
              <span className="strip__lead">{t(p.lead)}</span>
              <p>{t(p.body)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about__section" aria-labelledby="working-h">
        <div className="section-head">
          <h2 id="working-h">{t('about.m.h2')}</h2>
        </div>
        <p className="about__lede">{t('about.m.lede')}</p>
        <ul>
          {targets.map((m) => (
            <li key={m.text} className="target">
              <p className="target__text">{t(m.text)}</p>
              {m.value && <p className="target__value">{m.value}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
