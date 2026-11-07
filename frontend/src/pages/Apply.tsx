import { useState } from 'react'
import type { ApplicationResponse } from '../api/types'
import { ApplicationForm } from '../components/ApplicationForm'
import { EligibilityResult } from '../components/EligibilityResult'
import { RentTable } from '../components/RentTable'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLang } from '../i18n'

export default function Apply() {
  const { t } = useLang()
  usePageTitle('title.apply')
  const [outcome, setOutcome] = useState<{ result: ApplicationResponse; size: number } | null>(null)

  return (
    <div className="container page apply">
      <header className="page__head">
        <h1>{t('apply.h1')}</h1>
        <p className="page__lede">{t('apply.lede')}</p>
      </header>

      <section className="apply__section" aria-labelledby="who-h">
        <div className="section-head">
          <h2 id="who-h">{t('apply.who.h2')}</h2>
        </div>
        {/* a real sequence, so numbers are information here */}
        <ol className="steps">
          <li>{t('apply.who.1')}</li>
          <li>{t('apply.who.2')}</li>
          <li>{t('apply.who.3')}</li>
        </ol>
      </section>

      <section className="apply__section" aria-labelledby="rent-h">
        <div className="section-head">
          <h2 id="rent-h">{t('apply.rent.h2')}</h2>
        </div>
        <RentTable />
      </section>

      <section className="apply__section" aria-labelledby="form-h">
        <div className="section-head">
          <h2 id="form-h">{t('apply.form.h2')}</h2>
        </div>
        {outcome ? (
          <EligibilityResult result={outcome.result} householdSize={outcome.size} onReset={() => setOutcome(null)} />
        ) : (
          <ApplicationForm onResult={(result, size) => setOutcome({ result, size })} />
        )}
      </section>
    </div>
  )
}
