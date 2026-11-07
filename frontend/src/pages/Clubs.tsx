import { useLang } from '../i18n'
import { usePageTitle } from '../hooks/usePageTitle'

// Filled in by TASK-005.
export default function Clubs() {
  const { t } = useLang()
  usePageTitle('title.clubs')
  return (
    <div className="container page">
      <h1>{t('clubs.h1')}</h1>
    </div>
  )
}
