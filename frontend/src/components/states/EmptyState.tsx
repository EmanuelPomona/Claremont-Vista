import { useLang } from '../../i18n'

interface Props {
  title?: string
  message?: string
  action?: { label: string; onClick: () => void }
}

/** Nothing to show: say so, and offer the one next step if there is one. */
export function EmptyState({ title, message, action }: Props) {
  const { t } = useLang()
  return (
    <div className="state state--empty">
      <p className="state__title">{title ?? t('state.empty.title')}</p>
      {message && <p className="state__body">{message}</p>}
      {action && (
        <button type="button" className="btn btn--ghost" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
