import { useLang } from '../i18n'
import { usePageTitle } from '../hooks/usePageTitle'

// Filled in by TASK-005.
export default function Facilities() {
  const { t } = useLang()
  usePageTitle('title.facilities')
  return (
    <div className="container page">
      <h1>{t('facilities.h1')}</h1>
    </div>
  )
}
