import { useEffect } from 'react'
import { useLang, type StringKey } from '../i18n'

/** Sets document.title from a UI string, and updates when the language changes. */
export function usePageTitle(key: StringKey) {
  const { t } = useLang()
  useEffect(() => {
    document.title = t(key)
  }, [t, key])
}
