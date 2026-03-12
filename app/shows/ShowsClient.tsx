'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const CITIES = ['All', 'Paris', 'Milan', 'London', 'New York', 'Copenhagen']

const FALLBACK_SHOWS = [
  { _id: '1', designer: 'Chanel', slug: { current: 'chanel-fw26' }, city: 'Paris', season: 'FW26', showScore: 91, coverImage: null },
  { _id: '2', designer: 'Dior', slug: { current: 'dior-fw26' }, city: 'Paris', season: 'FW26', showScore: 89, coverImage: null },
  { _id: '3', designer: 'Gucci', slug: { current: 'gucci-fw26' }, city: 'Milan', season: 'FW26', showScore: 88, coverImage: null },
  { _id: '4', designer: 'Prada', slug: { current: 'prada-fw26' }, city: 'Milan', season: 'FW26', showScore: 86, coverImage: null },
  { _id: '5', designer: 'Burberry', slug: { current: 'burberry-fw26' }, city: 'London', season: 'FW26', showScore: 84, coverImage: null },
  { _id: '6', designer: 'Chloé', slug: { current: 'chloe-fw26' }, city: 'Paris', season: 'FW26', showScore: 82, coverImage: null },
  { _id: '7', designer: 'Bottega Veneta', slug: { current: 'bottega-veneta-fw26' }, city: 'Milan', season: 'FW26', showScore: 85, coverImage: null },
  { _id: '8', designer: 'Saint Laurent', slug: { current: 'saint-laurent-fw26' }, city: 'Paris', season: 'FW26', showScore: 83, coverImage: null },
]

const TICKER_ITEMS = [
  'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7', 'Dior FW26  89.4',
]

export default function ShowsClient({ shows }: { shows: any[] }) {
  const [activeCity, setActiveCity] = useState('All')
  const [navVisible, setNavVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

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

  const data = shows?.length > 0 ? shows : FALLBACK_SHOWS
  const filtered = activeCity === 'All'
    ? data
    : data.filter(s => s.city?.toLowerCase() === activeCity.toLowerCase())

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Geist+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        :root{
          --ink:#0C0B09;--white:#FFFFFF;--cream:#F5F2ED;
          --warm:#EDE9E2;--mid:#5A5550;--light:#A09A94;
          --bd:rgba(12,11,9,0.1);
          --f-mono:'Geist Mono',monospace;
          --f-display:'Ranade',sans-serif;
          --f-body:'Lora',Georgia,serif;
        }
        body{background:#fff;color:var(--ink);-webkit-font-smoothing:antialiased}
        .site-header{position:fixed;top:0;left:0;right:0;z-index:1000;background:#fff;border-bottom:1px solid var(--bd)}
        .ticker{background:var(--ink);overflow:hidden;white-space:nowrap;padding:7px 0}
        .ticker-inner{display:inline-flex;animation:tick 48s linear infinite}
        .ticker-inner span{font-family:var(--f-mono);font-size:9.5px;letter-spacing:0.13em;color:rgba(255,255,255,0.9);padding:0 42px}
        @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .nav-title-row{height:56px;display:flex;align-items:center;justify-content:center;padding:0 52px;background:#fff;position:relative}
        .nav-logo{font-family:var(--f-display);font-size:20px;font-weight:700;letter-spacing:0.08em;text-transform:lowercase;color:var(--ink);text-decoration:none}
        .nav-menu-btn{position:absolute;left:24px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;display:flex;flex-direction:column;gap:5px;padding:6px}
        .nav-menu-btn span{display:block;width:22px;height:1.5px;background:var(--ink);transition:transform .2s,opacity .2s}
        .nav-menu-btn.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
        .nav-menu-btn.open span:nth-child(2){opacity:0}
        .nav-menu-btn.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
        .nav-pill{position:absolute;right:52px;top:50%;transform:translateY(-50%);font-family:var(--f-mono);font-size:9px;letter-spacing:0.13em;text-transform:uppercase;border:1px solid var(--bd);color:var(--light);padding:5px 13px}
        .nav-links-row{height:38px;display:flex;align-items:center;justify-content:center;gap:44px;background:#fff;border-top:1px solid var(--bd);list-style:none;padding:0;overflow:hidden;transition:height .3s cubic-bezier(.4,0,.2,1),opacity .3s ease,border-color .3s ease}
        .nav-links-row.hidden{height:0;opacity:0;pointer-events:none;border-color:transparent}
        .nav-links-row a{font-family:var(--f-mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink);text-decoration:none;transition:color .15s}
        .nav-links-row a:hover{color:var(--light)}
        .nav-drawer{position:fixed;top:0;left:0;bottom:0;width:260px;background:#fff;z-index:2000;transform:translateX(-100%);transition:transform .3s cubic-bezier(.4,0,.2,1);border-right:1px solid var(--bd);padding:88px 36px 40px;display:flex;flex-direction:column;gap:8px}
        .nav-drawer.open{transform:translateX(0)}
        .nav-drawer a{font-family:var(--f-display);font-size:28px;font-weight:700;letter-spacing:-0.02em;text-transform:lowercase;color:var(--ink);text-decoration:none;line-height:1.25;opacity:.85;transition:opacity .15s}
        .nav-drawer a:hover{opacity:1}
        .nav-drawer-close{position:absolute;top:22px;right:22px;background:none;border:none;cursor:pointer;font-family:var(--f-mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--light)}
        .nav-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.18);z-index:1900;opacity:0;pointer-events:none;transition:opacity .3s}
        .nav-overlay.open{opacity:1;pointer-events:all}
        .header-spacer{height:118px}
        .header-spacer.collapsed{height:80px}
      `}</style>

      {/* ── Nav ── */}
      <header className="site-header">
        <div className="ticker">
          <div className="ticker-inner">
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i) => <span key={i}>{t}</span>)}
          </div>
        </div>
        <div className="nav-title-row">
          <button className={`nav-menu-btn${menuOpen?' open':''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span/><span/><span/>
          </button>
          <a href="/" className="nav-logo">runway fyi</a>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className={`nav-links-row${navVisible?'':' hidden'}`}>
          {[['/trends','Trends'],['/analysis','Analysis'],['/fyi','FYI'],['/shows','Shows'],['/archive','Archive']].map(([href,label]) => (
            <li key={href}><a href={href} style={href==='/shows' ? {borderBottom:'1px solid var(--ink)',paddingBottom:'2px'} : {}}>{label}</a></li>
          ))}
        </ul>
      </header>
      <div className={`nav-overlay${menuOpen?' open':''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`nav-drawer${menuOpen?' open':''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>close ✕</button>
        {[['/trends','trends'],['/analysis','analysis'],['/fyi','fyi'],['/shows','shows'],['/archive','archive']].map(([href,label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
        <Link href="/about" onClick={() => setMenuOpen(false)}>about</Link>
      </nav>
      <div className={`header-spacer${navVisible?'':' collapsed'}`} />

      {/* ── Page Header ── */}
      <div style={{ padding: '28px 48px 0' }}>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', margin: '0 0 12px' }}>
          Season · FW26
        </p>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(52px, 8vw, 96px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.9, margin: 0 }}>
          FW26 Shows
        </h1>
      </div>

      {/* ── City Filter ── */}
      <div style={{ padding: '0 48px', borderBottom: '1px solid var(--bd)', display: 'flex', gap: 0, marginTop: 24 }}>
        {CITIES.map(city => (
          <button key={city} onClick={() => setActiveCity(city)}
            style={{ background: 'none', border: 'none', borderBottom: activeCity === city ? '1px solid var(--ink)' : '1px solid transparent', marginBottom: -1, cursor: 'pointer', fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: activeCity === city ? 'var(--ink)' : 'var(--light)', padding: '14px 20px 14px 0' }}>
            {city}
          </button>
        ))}
      </div>

      {/* ── Shows Grid ── */}
      <div style={{ padding: '40px 48px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
        {filtered.map(show => (
          <Link key={show._id} href={`/shows/${show.slug?.current || show._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', position: 'relative', overflow: 'hidden', background: 'var(--warm)', aspectRatio: '2/3' }}>
            {show.coverImage ? (
              <img src={show.coverImage} alt={show.designer} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--light)', letterSpacing: '0.1em' }}>NO IMAGE</span>
              </div>
            )}
            {/* Score badge */}
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--ink)', color: 'var(--white)', fontFamily: 'var(--f-mono)', fontSize: 12, fontWeight: 600, padding: '4px 8px', letterSpacing: '0.02em' }}>
              {show.showScore || show.runwayScore || '—'}
            </div>
            {/* City tag */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(12,11,9,0.8))', padding: '40px 16px 16px' }}>
              <p style={{ margin: 0, fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,242,237,0.7)', marginBottom: 4 }}>
                {show.city} · {show.season}
              </p>
              <p style={{ margin: 0, fontFamily: 'var(--f-display)', fontSize: 18, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                {show.designer}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--bd)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--light)', letterSpacing: '0.1em' }}>runway.fyi</span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--light)', letterSpacing: '0.1em' }}>FW26 · @runwayfyi</span>
      </footer>
    </>
  )
}
