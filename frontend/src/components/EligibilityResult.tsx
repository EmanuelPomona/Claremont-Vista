import { useEffect, useRef } from 'react'
import type { ApplicationResponse, EligibilityStatus } from '../api/types'
import { useLang, type StringKey } from '../i18n'
import { formatMoney } from '../lib/format'
import { RENTS, UNIT_ORDER } from './RentTable'

const STATUS_KEY: Record<EligibilityStatus, StringKey> = {
  priority: 'result.priority',
  eligible: 'result.eligible',
  over_income: 'result.over_income',
  needs_review: 'result.needs_review',
}

interface Props {
  result: ApplicationResponse
  householdSize: number
  onReset: () => void
}

/** The estimate, in plain words, plus which proposed homes fit under the comfortable rent. */
export function EligibilityResult({ result, householdSize, onReset }: Props) {
  const { t, lang } = useLang()
  const heading = useRef<HTMLHeadingElement>(null)
  const { status, income_limit_50, income_limit_80, max_comfortable_rent } = result.eligibility
  const fits = UNIT_ORDER.filter((u) => RENTS[u] <= max_comfortable_rent)

  // move the reader to the result when the form is replaced
  useEffect(() => {
    heading.current?.focus()
    heading.current?.scrollIntoView({ block: 'start' })
  }, [])

  return (
    <section className="result" aria-labelledby="result-h">
      <h2 id="result-h" className="result__received" tabIndex={-1} ref={heading}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        {t('result.heading')}
      </h2>
      <p className="result__id">{t('result.id', { id: result.application_id })}</p>

      <p className="result__status">{t(STATUS_KEY[status])}</p>

      <dl className="result__facts">
        <div>
          <dt>{t('result.rent')}</dt>
          <dd className="result__rent">
            {formatMoney(max_comfortable_rent, lang)}
            <span className="rent__per">/{t('rent.mo')}</span>
          </dd>
        </div>
        <div>
          <dt>{t('result.fits')}</dt>
          <dd>
            {fits.length > 0 ? (
              <ul className="result__fits">
                {fits.map((u) => (
                  <li key={u}>
                    <span>{t(`unit.${u}` as StringKey)}</span>
                    <span>
                      {formatMoney(RENTS[u], lang)}/{t('rent.mo')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              t('result.fits.none')
            )}
          </dd>
        </div>
      </dl>

      <p className="result__limits">
        {t('result.limits', {
          size: householdSize,
          l50: formatMoney(income_limit_50, lang),
          l80: formatMoney(income_limit_80, lang),
        })}
      </p>

      <button type="button" className="btn btn--ghost" onClick={onReset}>
        {t('result.again')}
      </button>
    </section>
  )
}
