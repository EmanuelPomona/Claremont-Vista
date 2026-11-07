import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Site-wide scroll motion, after Artifact and The New Work Project:
 * 1. headings, paragraphs, tables and forms fade up as they enter the viewport;
 * 2. below-the-fold media (the site map) grows from 92% to full size as it scrolls in.
 * Skips anything already under a `.reveal` (pages that animate their own rows).
 * Off entirely under prefers-reduced-motion; the grow effect is desktop only.
 */
export function ScrollMotion() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -8% 0px' },
    )

    const scan = () => {
      const els = document.querySelectorAll<HTMLElement>(
        'main h2, main section > p, main table, main form, main dl, main ol',
      )
      els.forEach((el, i) => {
        if (el.dataset.sm || el.closest('.reveal')) return
        el.dataset.sm = '1'
        el.classList.add('reveal')
        el.style.transitionDelay = `${(i % 4) * 50}ms`
        io.observe(el)
      })
    }
    const t1 = window.setTimeout(scan, 50)
    const t2 = window.setTimeout(scan, 900) // catch content that arrives with API data

    let raf = 0
    const desktop = window.matchMedia('(min-width: 900px)').matches
    const grow = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('main [data-scroll-grow]').forEach((el) => {
          const top = el.getBoundingClientRect().top
          const p = Math.min(1, Math.max(0, (window.innerHeight - top) / (window.innerHeight * 0.6)))
          el.style.transform = `scale(${(0.92 + 0.08 * p).toFixed(4)})`
        })
      })
    }
    if (desktop) {
      window.addEventListener('scroll', grow, { passive: true })
      grow()
    }

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      io.disconnect()
      window.removeEventListener('scroll', grow)
      cancelAnimationFrame(raf)
    }
  }, [pathname])

  return null
}
