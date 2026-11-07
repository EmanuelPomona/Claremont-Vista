import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ScrollMotion } from './components/ScrollMotion'
import { useLang } from './i18n'
import About from './pages/About'
import Apply from './pages/Apply'
import Clubs from './pages/Clubs'
import Contact from './pages/Contact'
import Events from './pages/Events'
import Facilities from './pages/Facilities'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

/** New page: back to the top, and move focus to <main> so screen readers announce it. */
function RouteChange() {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])
  return null
}

export default function App() {
  const { t } = useLang()
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteChange />
      <ScrollMotion />
      <a className="skip-link" href="#main">
        {t('skip.main')}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
