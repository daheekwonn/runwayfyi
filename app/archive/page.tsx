'use client'

import { useState, useEffect, useRef } from 'react'

const TICKER_ITEMS = [
  'FW26 Now Live','FW25 · Mocha Mousse','FW24 · Peach Fuzz',
  'FW23 · Viva Magenta','FW22 · Very Peri','Season Archive · runway.fyi',
]

const SEASONS = [
  {
    season: 'FW26', year: '2026',
    pantone: 'Mocha Mousse', pantoneCode: '17-1230', hex: '#A07050',
    status: 'current',
    highlights: ['Leather Outerwear', 'Prairie Dress', 'Shearling Coat', 'Ballet Flat'],
    score: 91.2, slug: 'fw26',
  },
  {
    season: 'FW25', year: '2025',
    pantone: 'Mocha Mousse', pantoneCode: '17-1230', hex: '#A07050',
    status: 'archive',
    highlights: ['Quiet Luxury', 'Boho Revival', 'Sheer Layers'],
    score: 88.4, slug: 'fw25',
  },
  {
    season: 'FW24', year: '2024',
    pantone: 'Peach Fuzz', pantoneCode: '13-1023', hex: '#FFBE98',
    status: 'archive',
    highlights: ['Quiet Luxury', 'Ballet Core', 'Stealth Wealth', 'Loafer'],
    score: 85.1, slug: 'fw24',
  },
  {
    season: 'FW23', year: '2023',
    pantone: 'Viva Magenta', pantoneCode: '18-1750', hex: '#BB2649',
    status: 'archive',
    highlights: ['Barbiecore', 'Maximalism', 'Feather Trim'],
    score: 86.7, slug: 'fw23',
  },
  {
    season: 'FW22', year: '2022',
    pantone: 'Very Peri', pantoneCode: '17-3938', hex: '#6667AB',
    status: 'archive',
    highlights: ['Cottagecore', 'Y2K Revival', 'Oversized Blazer', 'Chunky Sneaker'],
    score: 83.9, slug: 'fw22',
  },
]

export default function ArchivePage() {
  const [navVisible, setNavVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

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
        footer{background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:24px 48px;border-top:1px solid var(--bd)}
        .f-logo{font-family:var(--f-display);font-size:15px;font-weight:700;letter-spacing:0.08em;text-transform:lowercase}
        .f-links{display:flex;gap:32px;list-style:none}
        .f-links a{font-family:var(--f-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.55);text-decoration:none;transition:color .15s}
        .f-links a:hover{color:#fff}
        .f-copy{font-family:var(--f-mono);font-size:10px;letter-spacing:0.08em;color:rgba(255,255,255,0.3)}
        .archive-row{transition:background .15s}
        .archive-row:hover{background:var(--warm)}
      `}</style>

      {/* ── Nav ── */}
      <header className="site-header">
        <div className="ticker">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
        <div className="nav-title-row">
          <button className={`nav-menu-btn${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <a href="/" className="nav-logo">runway fyi</a>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className={`nav-links-row${navVisible ? '' : ' hidden'}`}>
          {[['/trends', 'Trends'], ['/analysis', 'Analysis'], ['/fyi', 'FYI'], ['/shows', 'Shows'], ['/archive', 'Archive']].map(([href, label]) => (
            <li key={href}><a href={href} style={href === '/archive' ? { borderBottom: '1px solid var(--ink)', paddingBottom: '2px' } : {}}>{label}</a></li>
          ))}
        </ul>
      </header>
      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>close ✕</button>
        {[['/trends', 'trends'], ['/analysis', 'analysis'], ['/fyi', 'fyi'], ['/shows', 'shows'], ['/archive', 'archive'], ['/about', 'about']].map(([href, label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </nav>
      <div className={`header-spacer${navVisible ? '' : ' collapsed'}`} />

      {/* ── Page Header ── */}
      <div style={{ padding: '28px 48px 0' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '8px' }}>
          Season · FW26
        </div>
        <h1 style={{ fontFamily: "'Ranade', sans-serif", fontSize: 'clamp(52px,8vw,96px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.9, margin: '0 0 28px' }}>
          Archive
        </h1>
      </div>

      {/* ── Season Rows ── */}
      <div style={{ borderTop: '1px solid var(--bd)' }}>
        {SEASONS.map((s) => (
          <a
            key={s.slug}
            href={`/trends?season=${s.slug}`}
            className="archive-row"
            style={{
              display: 'grid', gridTemplateColumns: '1fr auto',
              alignItems: 'start', gap: '48px',
              padding: '36px 48px',
              borderBottom: '1px solid var(--bd)',
              textDecoration: 'none', color: 'inherit', cursor: 'pointer',
            }}
          >
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              {/* Pantone swatch */}
              <div style={{ width: '52px', height: '68px', background: s.hex, flexShrink: 0, position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.92)', padding: '3px 5px' }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '6.5px', letterSpacing: '0.08em', color: '#333', lineHeight: 1.3 }}>
                    {s.pantoneCode}<br />PANTONE
                  </div>
                </div>
              </div>

              <div>
                {/* Season heading */}
                <h2 style={{ fontFamily: "'Ranade', sans-serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 0.95, margin: 0 }}>
                  {s.season}
                </h2>
                {/* Pantone name */}
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: 'var(--mid)', letterSpacing: '0.06em', marginTop: '6px' }}>
                  {s.pantone}
                </div>
                {/* Trend pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
                  {s.highlights.map(h => (
                    <span key={h} style={{
                      fontFamily: "'Geist Mono', monospace", fontSize: '9px',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '4px 10px', border: '1px solid var(--bd)',
                      color: 'var(--mid)',
                    }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: score + link */}
            <div style={{ textAlign: 'right', flexShrink: 0, paddingTop: '4px' }}>
              <div style={{ fontFamily: "'Ranade', sans-serif", fontSize: 'clamp(32px,3.5vw,52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {s.score}
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginTop: '4px' }}>
                top score
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginTop: '16px' }}>
                View season →
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* ── Footer ── */}
      <footer>
        <span className="f-logo">runway fyi</span>
        <ul className="f-links">
          <li><a href="https://instagram.com/runwayfyi" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://tiktok.com/@runwayfyi" target="_blank" rel="noopener noreferrer">TikTok</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <span className="f-copy">&copy; 2026 runwayfyi.com</span>
      </footer>
    </>
  )
}
