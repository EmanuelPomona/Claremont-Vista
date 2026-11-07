import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { useLang } from '../i18n'

// Proposed site: north of Foothill Blvd, near CST, the TCCS golf course and CGU.
const CENTER: L.LatLngTuple = [34.1062, -117.7105]

// A jacaranda map pin. The fill is set with `style` so the CSS variable resolves.
const PIN =
  '<svg viewBox="0 0 24 32" width="32" height="42" aria-hidden="true" focusable="false">' +
  '<path style="fill:var(--cv-accent)" d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0z"/>' +
  '<circle style="fill:var(--cv-canvas)" cx="12" cy="11.5" r="4.5"/></svg>'

/** One grayscale OpenStreetMap with one pin. Plain Leaflet; the wheel never hijacks page scroll. */
export function SiteMap() {
  const { t } = useLang()
  const el = useRef<HTMLDivElement>(null)
  const marker = useRef<L.Marker | null>(null)
  const title = t('map.title')

  useEffect(() => {
    if (!el.current) return
    const map = L.map(el.current, {
      center: CENTER,
      zoom: 15,
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile, // on phones one finger scrolls the page
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    marker.current = L.marker(CENTER, {
      icon: L.divIcon({ className: 'site-pin', html: PIN, iconSize: [32, 42], iconAnchor: [16, 42] }),
      title,
      alt: title,
    }).addTo(map)
    return () => {
      map.remove()
      marker.current = null
    }
    // the map is created once; the pin label follows the language in the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const node = marker.current?.getElement()
    node?.setAttribute('title', title)
    node?.setAttribute('aria-label', title)
  }, [title])

  return <div className="site-map" ref={el} role="region" aria-label={t('map.aria')} />
}
