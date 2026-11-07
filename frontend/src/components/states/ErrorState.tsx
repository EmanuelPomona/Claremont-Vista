import { useLang } from '../../i18n'

interface Props {
  title?: string
  message?: string
  onRetry: () => void
}

/** A failed request: say what happened, offer the retry. */
export function ErrorState({ title, message, onRetry }: Props) {
  const { t } = useLang()
  return (
    <div className="state state--error" role="alert">
      <p className="state__title">{title ?? t('state.error.title')}</p>
      <p className="state__body">{message ?? t('state.error.body')}</p>
      <button type="button" className="btn btn--ghost" onClick={onRetry}>
        {t('state.retry')}
      </button>
    </div>
  )
}
