import { useLang, type Lang } from '../i18n'

const OPTIONS: { code: Lang; label: string; name: 'lang.en' | 'lang.es' }[] = [
  { code: 'en', label: 'EN', name: 'lang.en' },
  { code: 'es', label: 'ES', name: 'lang.es' },
]

/** "EN | ES": switches the whole site with no reload. */
export function LanguageToggle() {
  const { lang, setLang, t } = useLang()
  return (
    <div className="lang-toggle" role="group" aria-label={t('lang.label')}>
      {OPTIONS.map((o, i) => (
        <span key={o.code} className="lang-toggle__item">
          {i > 0 && (
            <span className="lang-toggle__bar" aria-hidden="true">
              |
            </span>
          )}
          <button
            type="button"
            className="lang-toggle__btn"
            lang={o.code}
            aria-label={t(o.name)}
            aria-pressed={lang === o.code}
            onClick={() => setLang(o.code)}
          >
            {o.label}
          </button>
        </span>
      ))}
    </div>
  )
}
