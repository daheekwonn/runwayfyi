'use client'

import { useState, useEffect } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

interface LookData {
  id: number
  look_number: number
  image_url: string
  materials?: string[]
  color_names?: string[]
  silhouettes?: string[]
}

interface ShowData {
  id: number
  brand: string
  designer?: string
  slug?: string
  season: string
  city: string
  show_score?: number
  runway_score?: number
  search_score?: number
  social_score?: number
  notes?: string
}

const TICKER_ITEMS = [
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7',
  'Dior FW26  87.4', 'Prairie Silhouette  78.6', 'Wide-Leg Trouser  74.3',
  'Burgundy  +180%', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
]

export default function ShowPageClient({
  show,
  looks: initialLooks,
}: {
  show: ShowData
  looks: LookData[]
}) {
  const [looks, setLooks] = useState<LookData[]>(initialLooks)
  const [loading, setLoading] = useState(initialLooks.length === 0)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
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
    if (initialLooks.length > 0) return
    const fetchLooks = async () => {
      try {
        const res = await fetch(`${RAILWAY_API}/api/trends/shows/${show.id}/looks`)
        if (res.ok) {
          const data = await res.json()
          setLooks(data)
        }
      } catch (e) {
        console.error('Failed to fetch looks', e)
      } finally {
        setLoading(false)
      }
    }
    fetchLooks()
  }, [show.id, initialLooks.length])

  const score = show.show_score ?? 0
  const runwayScore = show.runway_score ?? 0
  const searchScore = show.search_score ?? 0
  const socialScore = show.social_score ?? 0

  const allMaterials = Array.from(
    new Set(looks.flatMap((l) => l.materials ?? []))
  ).slice(0, 6)

  const filteredLooks = activeFilter
    ? looks.filter((l) => l.materials?.includes(activeFilter))
    : looks

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
        <div style={{ padding: '28px 48px 0' }}>
          <p style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--light)',
            margin: '0 0 16px',
          }}>
            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
            {' / '}
            <a href="/shows" style={{ color: 'inherit', textDecoration: 'none' }}>Shows</a>
            {' / '}
            <span style={{ color: 'var(--ink)' }}>{show.brand}</span>
          </p>

          <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 9,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--light)',
                margin: '0 0 8px',
              }}>
                {show.city} · {show.season}
              </p>
              <h1 style={{
                fontFamily: 'var(--f-display)',
                fontSize: 'clamp(40px, 6vw, 80px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                color: 'var(--ink)',
                margin: '0 0 24px',
              }}>
                {show.brand}
              </h1>
              {show.notes && (
                <p style={{
                  fontFamily: 'var(--f-body)',
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: 'var(--mid)',
                  maxWidth: 520,
                  margin: '0 0 24px',
                }}>
                  {show.notes}
                </p>
              )}
            </div>

            {score > 0 && (
              <div style={{
                flex: '0 0 240px',
                background: 'var(--ink)',
                color: '#fff',
                padding: '24px',
              }}>
                <p style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: 9,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  opacity: 0.5,
                  margin: '0 0 8px',
                }}>
                  Trend Score
                </p>
                <p style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  margin: '0 0 20px',
                }}>
                  {score.toFixed(1)}
                </p>
                {[
                  { label: 'Runway 50%', value: runwayScore },
                  { label: 'Search 30%', value: searchScore },
                  { label: 'Social 20%', value: socialScore },
                ].map(({ label, value }) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>{label}</span>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10 }}>{value.toFixed(1)}</span>
                    </div>
                    <div style={{ height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 1 }}>
                      <div style={{ height: '100%', width: `${value}%`, background: '#fff', borderRadius: 1 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Looks Grid ── */}
        <div style={{ padding: '48px 48px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--bd)',
            paddingBottom: 16,
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', margin: '0 0 4px' }}>
                {looks.length} Looks
              </p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>
                The Collection
              </h2>
            </div>

            {allMaterials.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveFilter(null)}
                  style={{
                    padding: '6px 12px',
                    background: activeFilter === null ? 'var(--ink)' : 'none',
                    color: activeFilter === null ? '#fff' : 'var(--mid)',
                    border: '1px solid var(--bd)',
                    fontFamily: 'var(--f-mono)',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  All
                </button>
                {allMaterials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setActiveFilter(mat === activeFilter ? null : mat)}
                    style={{
                      padding: '6px 12px',
                      background: activeFilter === mat ? 'var(--ink)' : 'none',
                      color: activeFilter === mat ? '#fff' : 'var(--mid)',
                      border: '1px solid var(--bd)',
                      fontFamily: 'var(--f-mono)',
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading && (
            <div style={{ padding: '80px 0', textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)' }}>
              Loading looks...
            </div>
          )}

          {!loading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 1,
              background: 'var(--bd)',
              marginBottom: 1,
            }}>
              {filteredLooks.map((look) => (
                <LookCard key={look.id} look={look} brand={show.brand} />
              ))}
            </div>
          )}

          {!loading && filteredLooks.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--f-body)', color: 'var(--light)' }}>
              No looks found{activeFilter ? ` for "${activeFilter}"` : ''}.
            </div>
          )}
        </div>

        <div style={{ height: 80 }} />
      </div>
    </>
  )
}

function LookCard({ look, brand }: { look: LookData; brand: string }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div style={{ background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        width: '100%',
        paddingBottom: '150%',
        position: 'relative',
        background: 'var(--warm)',
        overflow: 'hidden',
      }}>
        {look.image_url && !imgError ? (
          <img
            src={look.image_url}
            referrerPolicy="no-referrer"
            alt={`${brand} Look ${look.look_number}`}
            onError={() => setImgError(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--f-mono)',
            fontSize: 9,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--light)',
          }}>
            Look {look.look_number}
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          background: 'rgba(12,11,9,0.7)',
          color: '#fff',
          fontFamily: 'var(--f-mono)',
          fontSize: 9,
          letterSpacing: '0.08em',
          padding: '3px 6px',
        }}>
          {String(look.look_number).padStart(2, '0')}
        </div>
      </div>

      {look.materials && look.materials.length > 0 && (
        <div style={{ padding: '8px 10px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {look.materials.slice(0, 2).map((mat) => (
            <span key={mat} style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 8,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--light)',
              background: 'var(--warm)',
              padding: '2px 5px',
            }}>
              {mat}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
