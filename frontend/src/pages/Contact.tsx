import { FeedbackForm } from '../components/FeedbackForm'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLang } from '../i18n'

export default function Contact() {
  const { t } = useLang()
  usePageTitle('title.contact')

  return (
    <div className="container page">
      <header className="page__head">
        <h1>{t('contact.h1')}</h1>
      </header>

      <div className="contact">
        <section aria-labelledby="desk-h">
          <div className="section-head">
            <h2 id="desk-h">{t('contact.desk.h2')}</h2>
          </div>
          <dl className="desk">
            <div>
              <dt>{t('contact.label.address')}</dt>
              <dd>
                <strong>{t('contact.desk.name')}</strong>
                <br />
                {t('contact.desk.addr')}
              </dd>
            </div>
            <div>
              <dt>{t('contact.label.phone')}</dt>
              <dd>
                <a href="tel:+19095550142">(909) 555-0142</a>
              </dd>
            </div>
            <div>
              <dt>{t('contact.label.hours')}</dt>
              <dd>
                {t('contact.hours')}
                <br />
                <span lang="es">{t('footer.spanish')}</span>
              </dd>
            </div>
          </dl>
          <p className="contact__board">{t('contact.board')}</p>
        </section>

        <section aria-labelledby="feedback-h">
          <div className="section-head">
            <h2 id="feedback-h">{t('feedback.h2')}</h2>
          </div>
          <p className="contact__lede">{t('feedback.lede')}</p>
          <FeedbackForm />
        </section>
      </div>
    </div>
  )
}
