import { useCallback, useEffect, useRef, useState } from 'react'

interface ApiState<T> {
  data: T | undefined
  error: Error | undefined
  loading: boolean
}

/**
 * Run an async loader on mount (and whenever `deps` change). `reload` re-runs it.
 * Stale responses from an earlier run are ignored. Previous data stays visible
 * while a reload is in flight.
 */
export function useApi<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<ApiState<T>>({ data: undefined, error: undefined, loading: true })
  const [tick, setTick] = useState(0)
  const loaderRef = useRef(loader)
  loaderRef.current = loader

  useEffect(() => {
    let live = true
    setState((s) => ({ data: s.data, error: undefined, loading: true }))
    loaderRef.current().then(
      (data) => live && setState({ data, error: undefined, loading: false }),
      (error: Error) => live && setState({ data: undefined, error, loading: false }),
    )
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((n) => n + 1), [])
  return { ...state, reload }
}
