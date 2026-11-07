import { useMemo, useSyncExternalStore } from 'react'

// Which events THIS browser has RSVP'd to. Anonymous: only event ids, never a name.
const KEY = 'cv-rsvps'

function load(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

let ids: string[] = load()
const listeners = new Set<() => void>()

function commit(next: string[]) {
  ids = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids))
  } catch {
    /* storage unavailable: state still works for this session */
  }
  listeners.forEach((l) => l())
}

export function addRsvp(id: string) {
  if (!ids.includes(id)) commit([...ids, id])
}

export function removeRsvp(id: string) {
  if (ids.includes(id)) commit(ids.filter((x) => x !== id))
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Shared across every RsvpButton on the page, and across reloads. */
export function useRsvps() {
  const snapshot = useSyncExternalStore(subscribe, () => ids)
  const going = useMemo(() => new Set(snapshot), [snapshot])
  return { going, add: addRsvp, remove: removeRsvp }
}
