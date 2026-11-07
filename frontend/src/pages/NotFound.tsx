import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFound() {
  const { t } = useLang()
  usePageTitle('title.notfound')
  return (
    <div className="container page">
      <div className="page__head">
        <h1>{t('notfound.h1')}</h1>
        <p className="page__lede">{t('notfound.body')}</p>
        <p>
          <Link to="/">{t('notfound.home')}</Link>
        </p>
      </div>
    </div>
  )
}
