import { useLang } from '../i18n'
import { usePageTitle } from '../hooks/usePageTitle'

// Filled in by TASK-005.
export default function About() {
  const { t } = useLang()
  usePageTitle('title.about')
  return (
    <div className="container page">
      <h1>{t('about.h1')}</h1>
    </div>
  )
}
