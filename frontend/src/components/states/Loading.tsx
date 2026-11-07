import { useLang } from '../../i18n'

/** Skeleton rows that hold the layout still while data loads. */
export function Loading({ rows = 4, tall = false }: { rows?: number; tall?: boolean }) {
  const { t } = useLang()
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <span className="visually-hidden">{t('state.loading')}</span>
      <div className="skeleton" aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={tall ? 'skeleton__row skeleton__row--tall' : 'skeleton__row'} />
        ))}
      </div>
    </div>
  )
}
