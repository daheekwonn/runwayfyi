'use client'

import { useState, useEffect } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

interface Show {
  id: number
  brand: string
  city: string
  season: string
  total_looks?: number
  show_score?: number
  coverImage?: string
}

function brandToSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const CITIES = ['All', 'Paris', 'Milan', 'London', 'New York', 'Copenhagen']

const TICKER_ITEMS = [
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7',
  'Dior FW26  87.4', 'Prairie Silhouette  78.6', 'Wide-Leg Trouser  74.3',
  'Burgundy  +180%', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
]

export default function ShowsClient({ shows: initialShows }: { shows: Show[] }) {
  const [activeCity, setActiveCity] = useState('All')
  const [shows, setShows] = useState<Show[]>(initialShows)
  const [menuOpen, setMenuOpen] = useState(false)
  const [navVisible, setNavVisible] = useState(true)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setNavVisible(window.scrollY < 20)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
  if (initialShows.length === 0) return
  const fetchCovers = async () => {
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/covers`)
      if (!res.ok) return
      const covers: { show_id: number; brand: string; cover_image: string }[] = await res.json()
      setShows((prev) =>
        prev.map((s) => {
          const cover = covers.find((c) => c.show_id === s.id)
          return cover ? { ...s, coverImage: cover.cover_image } : s
        })
      )
    } catch {
      // silently fail
    }
  }
  fetchCovers()
}, [initialShows.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered =
    activeCity === 'All' ? shows : shows.filter((s) => s.city === activeCity)

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Geist+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #0C0B09; --white: #FFFFFF; --cream: #F5F2ED; --warm: #EDE9E2;
          --mid: #5A5550; --light: #A09A94; --bd: rgba(12,11,9,0.1);
          --f-mono: 'Geist Mono', monospace;
          --f-display: 'Ranade', sans-serif;
          --f-body: 'Lora', Georgia, serif;
        }
        body { background: var(--cream); color: var(--ink); -webkit-font-smoothing: antialiased; }
        .site-header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(245,242,237,1); border-bottom: 1px solid var(--bd); }
        .nav-links-row { height: 38px; display: flex; align-items: center; justify-content: center; gap: 44px; background: var(--cream); border-top: 1px solid var(--bd); list-style: none; padding: 0; overflow: hidden; transition: height .3s cubic-bezier(.4,0,.2,1), opacity .3s ease, border-color .3s ease; }
        .nav-links-row.hidden { height: 0; opacity: 0; pointer-events: none; border-color: transparent; }
        .nav-links-row a { font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink); text-decoration: none; transition: color .15s; }
        .nav-links-row a:hover { color: var(--light); }
        .nav-links-row a.curr { color: var(--light); }
        .ticker { background: var(--ink); overflow: hidden; white-space: nowrap; padding: 7px 0; }
        .ticker-inner { display: inline-flex; animation: tick 48s linear infinite; }
        .ticker-inner span { font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.13em; color: rgba(255,255,255,0.9); padding: 0 42px; }
        @keyframes tick { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .nav-title-row { height: 56px; display: flex; align-items: center; justify-content: center; padding: 0 52px; background: var(--cream); position: relative; }
        .nav-logo { font-family: var(--f-display); font-size: 20px; font-weight: 700; letter-spacing: 0.08em; text-transform: lowercase; color: var(--ink); text-decoration: none; }
        .nav-menu-btn { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; flex-direction: column; gap: 5px; padding: 6px; }
        .nav-menu-btn span { display: block; width: 22px; height: 1.5px; background: var(--ink); transition: transform .2s, opacity .2s; }
        .nav-menu-btn.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-menu-btn.open span:nth-child(2) { opacity: 0; }
        .nav-menu-btn.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
        .nav-pill { position: absolute; right: 52px; top: 50%; transform: translateY(-50%); font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.13em; text-transform: uppercase; border: 1px solid var(--bd); color: var(--light); padding: 5px 13px; }
        .header-spacer { height: 118px; }
        .header-spacer.collapsed { height: 80px; }
        .nav-drawer { position: fixed; top: 0; left: 0; bottom: 0; width: 260px; background: var(--cream); z-index: 2000; transform: translateX(-100%); transition: transform .3s cubic-bezier(.4,0,.2,1); border-right: 1px solid var(--bd); padding: 88px 36px 40px; display: flex; flex-direction: column; gap: 8px; }
        .nav-drawer.open { transform: translateX(0); }
        .nav-drawer a { font-family: var(--f-display); font-size: 28px; font-weight: 700; letter-spacing: -0.02em; text-transform: lowercase; color: var(--ink); text-decoration: none; line-height: 1.25; opacity: .85; transition: opacity .15s; }
        .nav-drawer a:hover { opacity: 1; }
        .nav-drawer-close { position: absolute; top: 22px; right: 22px; background: none; border: none; cursor: pointer; font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--light); }
        .nav-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.18); z-index: 1900; opacity: 0; pointer-events: none; transition: opacity .3s; }
        .nav-overlay.open { opacity: 1; pointer-events: all; }
      `}</style>

      {/* ── Drawer ── */}
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>✕ close</button>
        <a href="/trends" onClick={() => setMenuOpen(false)}>Trends</a>
        <a href="/analysis" onClick={() => setMenuOpen(false)}>Analysis</a>
        <a href="/fyi" onClick={() => setMenuOpen(false)}>FYI</a>
        <a href="/shows" onClick={() => setMenuOpen(false)}>Shows</a>
        <a href="/archive" onClick={() => setMenuOpen(false)}>Archive</a>
        <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
      </div>
      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* ── Site header ── */}
      <header className="site-header">
        <div className="ticker">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
        <div className="nav-title-row">
          <button
            className={`nav-menu-btn${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
          <a href="/" className="nav-logo">runway fyi</a>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className={`nav-links-row${navVisible ? '' : ' hidden'}`}>
          <li><a href="/trends">Trends</a></li>
          <li><a href="/analysis">Analysis</a></li>
          <li><a href="/fyi">FYI</a></li>
          <li><a href="/shows" className="curr">Shows</a></li>
          <li><a href="/archive">Archive</a></li>
        </ul>
      </header>
      <div className={`header-spacer${navVisible ? '' : ' collapsed'}`} />

      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

        {/* ── Page header ── */}
        <div style={{ padding: '28px 48px 0', borderBottom: '1px solid var(--bd)' }}>
          <p style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--light)',
            marginBottom: 12,
          }}>
            Season · FW26
          </p>
          <h1 style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(52px, 8vw, 96px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            color: 'var(--ink)',
            margin: '0 0 24px',
          }}>
            Shows
          </h1>

          {/* City filter */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--bd)' }}>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                style={{
                  padding: '12px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeCity === city ? '2px solid var(--ink)' : '2px solid transparent',
                  fontFamily: 'var(--f-mono)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: activeCity === city ? 'var(--ink)' : 'var(--light)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* ── Show Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 1,
          padding: 1,
          background: 'var(--bd)',
        }}>
          {filtered.map((show) => (
            <a
              key={show.id}
              href={`/shows/${brandToSlug(show.brand)}`}
              style={{ textDecoration: 'none', display: 'block', background: 'var(--cream)' }}
            >
              <ShowCard show={show} />
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            padding: '80px 48px',
            textAlign: 'center',
            fontFamily: 'var(--f-body)',
            color: 'var(--light)',
          }}>
            No shows found for {activeCity}.
          </div>
        )}
      </div>
    </>
  )
}

function ShowCard({ show }: { show: Show }) {
  const score = show.show_score ?? 0

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        width: '100%',
        paddingBottom: '150%',
        position: 'relative',
        background: 'var(--warm)',
        overflow: 'hidden',
      }}>
        {show.coverImage ? (
          <img
            src={show.coverImage}
            referrerPolicy="no-referrer"
            alt={`${show.brand} FW26`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--light)',
          }}>
            {show.total_looks ? `${show.total_looks} looks` : '—'}
          </div>
        )}

        {score > 0 && (
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'var(--ink)',
            color: '#fff',
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.08em',
            padding: '4px 8px',
          }}>
            {score.toFixed(1)}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 20px 20px' }}>
        <p style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--light)',
          margin: '0 0 6px',
        }}>
          {show.city} · {show.season}
          {show.total_looks ? ` · ${show.total_looks} looks` : ''}
        </p>
        <h2 style={{
          fontFamily: 'var(--f-display)',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          margin: 0,
        }}>
          {show.brand}
        </h2>
      </div>
    </div>
  )
}
