import type { Lang } from '../i18n'

// All event times are America/Los_Angeles, whatever timezone the browser is in:
const TZ = 'America/Los_Angeles'

// Plain "es" would give 24-hour times (Spain). US Spanish keeps "5:30 a. m.",
// matching the Spanish UI copy and what these readers see on their phones.
const LOCALE: Record<Lang, string> = { en: 'en-US', es: 'es-US' }

/** "Tue 5:30 AM" in English, "mar 5:30 a. m." in Spanish. */
export function formatWhen(iso: string, lang: Lang): string {
  const d = new Date(iso)
  const day = new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'short', timeZone: TZ }).format(d)
  return `${day.replace('.', '')} ${formatTime(iso, lang)}`
}

/** "Tue" / "mar" */
export function formatWeekday(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'short', timeZone: TZ }).format(new Date(iso)).replace('.', '')
}

/** "5:30 AM" / "5:30 a. m." */
export function formatTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { hour: 'numeric', minute: '2-digit', timeZone: TZ }).format(new Date(iso))
}

/** "Tuesday, November 10" / "martes 10 de noviembre" */
export function formatDay(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'long', month: 'long', day: 'numeric', timeZone: TZ }).format(
    new Date(iso),
  )
}

/** "5:30 to 6:15 AM" style range, using each language's own time format. */
export function formatRange(startIso: string, endIso: string, lang: Lang): string {
  const sep = lang === 'es' ? ' a ' : ' to '
  return `${formatTime(startIso, lang)}${sep}${formatTime(endIso, lang)}`
}

export function formatMoney(n: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-US' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}
