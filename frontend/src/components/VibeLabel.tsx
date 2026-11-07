import { useLang, type StringKey } from '../i18n'
import type { Band, Vibe } from '../api/types'

// Bands and vibes are told apart by icon plus words, never by colour (brief).

const VIBE_ICON: Record<Vibe, JSX.Element> = {
  // one person
  solo: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20c.6-4 3.2-6 6.5-6s5.9 2 6.5 6" />
    </>
  ),
  // a few people close together
  small: (
    <>
      <circle cx="12" cy="7" r="2.6" />
      <circle cx="5.5" cy="11" r="2.1" />
      <circle cx="18.5" cy="11" r="2.1" />
      <path d="M7.5 20c.4-3.4 2.2-5 4.5-5s4.1 1.6 4.5 5" />
    </>
  ),
  // a crowd along an arc
  big: (
    <>
      <circle cx="4.5" cy="15" r="1.9" />
      <circle cx="8" cy="9.5" r="1.9" />
      <circle cx="12" cy="6.5" r="1.9" />
      <circle cx="16" cy="9.5" r="1.9" />
      <circle cx="19.5" cy="15" r="1.9" />
      <path d="M3 21h18" />
    </>
  ),
}

const BAND_ICON: Record<Band, JSX.Element> = {
  early: (
    <>
      <path d="M3.5 18h17" />
      <path d="M7 18a5 5 0 0 1 10 0" />
      <path d="M12 6.5v3M5.4 9.6l1.9 1.9M18.6 9.6l-1.9 1.9" />
    </>
  ),
  midday: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </>
  ),
  evening: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
  weekend: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
}

function Icon({ children }: { children: JSX.Element }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** "Drop in solo" / "Small group" / "Big gathering", with its icon. */
export function VibeLabel({ vibe }: { vibe: Vibe }) {
  const { t } = useLang()
  return (
    <span className="label">
      <Icon>{VIBE_ICON[vibe]}</Icon>
      {t(`vibe.${vibe}` as StringKey)}
    </span>
  )
}

/** "Early" / "Midday" / "Evening" / "Weekend", with its icon. `hint` adds "before 9am" etc. */
export function BandLabel({ band, hint = false }: { band: Band; hint?: boolean }) {
  const { t } = useLang()
  return (
    <span className="label">
      <Icon>{BAND_ICON[band]}</Icon>
      <span>
        {t(`band.${band}` as StringKey)}
        {hint && <span className="label__hint"> {t(`band.${band}.hint` as StringKey)}</span>}
      </span>
    </span>
  )
}
