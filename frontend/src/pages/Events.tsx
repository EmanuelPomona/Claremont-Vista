import { useLang } from '../i18n'
import { usePageTitle } from '../hooks/usePageTitle'

// Filled in by TASK-004: the When / How social timetable.
export default function Events() {
  const { t } = useLang()
  usePageTitle('title.events')
  return (
    <div className="container page">
      <h1>{t('events.h1')}</h1>
    </div>
  )
}
