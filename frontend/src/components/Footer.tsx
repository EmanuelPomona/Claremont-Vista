import { useLang } from '../i18n'

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__desk">{t('footer.desk')}</p>
        <p className="site-footer__spanish" lang="es">
          {t('footer.spanish')}
        </p>
        <p className="site-footer__note">{t('footer.note')}</p>
      </div>
    </footer>
  )
}
