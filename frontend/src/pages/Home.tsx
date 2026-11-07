import { useLang } from '../i18n'
import { usePageTitle } from '../hooks/usePageTitle'

// Filled in by TASK-004: carousel, "Living here on your terms", this week.
export default function Home() {
  const { t } = useLang()
  usePageTitle('title.home')
  return (
    <div className="container page">
      <h1>{t('home.h1')}</h1>
    </div>
  )
}
