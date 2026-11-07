import { useLang } from '../i18n'
import { usePageTitle } from '../hooks/usePageTitle'

// Filled in by TASK-005.
export default function Contact() {
  const { t } = useLang()
  usePageTitle('title.contact')
  return (
    <div className="container page">
      <h1>{t('contact.h1')}</h1>
    </div>
  )
}
