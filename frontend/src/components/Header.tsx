import { Link, NavLink } from 'react-router-dom'
import { useLang, type StringKey } from '../i18n'
import { LanguageToggle } from './LanguageToggle'
import { Wordmark } from './Wordmark'

// Order follows the owner's sketch.
const NAV: { to: string; key: StringKey }[] = [
  { to: '/facilities', key: 'nav.facilities' },
  { to: '/events', key: 'nav.events' },
  { to: '/clubs', key: 'nav.clubs' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/apply', key: 'nav.apply' },
]

export function Header() {
  const { t } = useLang()
  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header__top">
          <LanguageToggle />
        </div>

        <Link to="/" className="site-header__brand" aria-label={t('brand.home')}>
          <Wordmark className="wordmark" />
        </Link>

        <nav className="site-nav" aria-label={t('nav.label')}>
          <ul>
            {NAV.map((item) => (
              <li key={item.to}>
                {/* NavLink sets aria-current="page" on the active route */}
                <NavLink to={item.to}>{t(item.key)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* the hand-ruled line under the nav, as in the sketch */}
        <svg
          className="nav-rule"
          viewBox="0 0 1200 16"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path vectorEffect="non-scaling-stroke" d="M2 9 C140 5 280 11 430 8 S720 5 880 9 S1110 12 1198 7" />
        </svg>
      </div>
    </header>
  )
}
