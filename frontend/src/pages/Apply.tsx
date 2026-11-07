import { useLang } from '../i18n'
import { usePageTitle } from '../hooks/usePageTitle'

// Filled in by TASK-005.
export default function Apply() {
  const { t } = useLang()
  usePageTitle('title.apply')
  return (
    <div className="container page">
      <h1>{t('apply.h1')}</h1>
    </div>
  )
}
