import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en } from './en'
import { es } from './es'
import type { Localized } from '../api/types'

export type Lang = 'en' | 'es'
export type StringKey = keyof typeof en

const DICTS: Record<Lang, Record<StringKey, string>> = { en, es }
const STORAGE_KEY = 'cv-lang'

function readStoredLang(): Lang {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'es') return v
  } catch {
    /* storage unavailable: fall through to default */
  }
  return 'en'
}

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Look up a UI string, replacing `{name}` placeholders from `vars`. */
  t: (key: StringKey, vars?: Record<string, string | number>) => string
  /** Pick the current language from an API `{en, es}` object. */
  pick: (obj: Localized) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  // keep <html lang> in step so screen readers and hyphenation use the right language
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore: the choice just won't persist */
    }
  }, [])

  const value = useMemo<LangContextValue>(() => {
    const dict = DICTS[lang]
    return {
      lang,
      setLang,
      t: (key, vars) => {
        let s = dict[key] ?? en[key]
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
        return s
      },
      pick: (obj) => obj[lang],
    }
  }, [lang, setLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
