import { useEffect, useRef } from 'react'

/**
 * Fade up on scroll. Attach the returned ref to a container; every `.reveal`
 * inside it (or the container itself) gets `.is-visible` once it scrolls into
 * view, staggered (i % 6) * 60ms, then stops being observed. `ready` re-runs the
 * scan when data-driven rows appear. Without IntersectionObserver, or under
 * reduced motion, everything is shown at once.
 */
export function useReveal<T extends HTMLElement>(ready: unknown = true) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = [...root.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')]
    if (root.matches('.reveal:not(.is-visible)')) targets.unshift(root)
    if (targets.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    targets.forEach((t, i) => {
      t.style.transitionDelay = `${(i % 6) * 60}ms`
      io.observe(t)
    })
    return () => io.disconnect()
  }, [ready])

  return ref
}
