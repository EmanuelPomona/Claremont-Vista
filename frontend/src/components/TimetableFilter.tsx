import type { Band, Vibe } from '../api/types'
import { useLang, type StringKey } from '../i18n'

export const BAND_ORDER: Band[] = ['early', 'midday', 'evening', 'weekend']
export const VIBE_ORDER: Vibe[] = ['solo', 'small', 'big']

interface Props {
  band: Band | null
  vibe: Vibe | null
  onBand: (band: Band | null) => void
  onVibe: (vibe: Vibe | null) => void
}

function Chip({ pressed, onClick, label, hint }: { pressed: boolean; onClick: () => void; label: string; hint?: string }) {
  return (
    <button type="button" className="chip" aria-pressed={pressed} onClick={onClick}>
      {pressed && (
        <svg className="chip__check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )}
      <span>{label}</span>
      {hint && <span className="chip__hint">{hint}</span>}
    </button>
  )
}

/**
 * THE signature element: "When" (shift band) and "How social" (vibe).
 * Two rows of toggle chips. Pressing the active chip again goes back to "All".
 */
export function TimetableFilter({ band, vibe, onBand, onVibe }: Props) {
  const { t } = useLang()
  return (
    <div className="filter" role="group" aria-label={t('events.filters')}>
      <div className="filter__row" role="group" aria-labelledby="filter-when">
        <span className="filter__label" id="filter-when">
          {t('filter.when')}
        </span>
        <div className="filter__chips">
          <Chip pressed={band === null} onClick={() => onBand(null)} label={t('filter.all')} />
          {BAND_ORDER.map((b) => (
            <Chip
              key={b}
              pressed={band === b}
              onClick={() => onBand(band === b ? null : b)}
              label={t(`band.${b}` as StringKey)}
              hint={b === 'weekend' ? undefined : t(`band.${b}.hint` as StringKey)}
            />
          ))}
        </div>
      </div>

      <div className="filter__row" role="group" aria-labelledby="filter-vibe">
        <span className="filter__label" id="filter-vibe">
          {t('filter.vibe')}
        </span>
        <div className="filter__chips">
          <Chip pressed={vibe === null} onClick={() => onVibe(null)} label={t('filter.all')} />
          {VIBE_ORDER.map((v) => (
            <Chip
              key={v}
              pressed={vibe === v}
              onClick={() => onVibe(vibe === v ? null : v)}
              label={t(`vibe.${v}` as StringKey)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
