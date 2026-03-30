'use client'

import { useState, useEffect } from 'react'

interface FYIItem {
  _id: string
  title: string
  slug: { current: string } | string
  category?: string
  season?: string
  excerpt?: string
  publishedAt?: string
  coverImage?: string
}

export default function FYIClient({ items }: { items: FYIItem[] }) {
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

  const TICKER_ITEMS = [
    'Shearling Coat 94.1', 'Chanel FW26 91.2', 'Leather Bomber 88.7',
    'Dior FW26 87.4', 'Prairie Silhouette 78.6', 'Burgundy +180%',
    'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
  ]

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Geist+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
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
        .nav-links-row{height:38px;display:flex;align-items:center;justify-content:center;gap:44px;background:#fff;border-top:1px solid var(--bd);list-style:none;padding:0;overflow:hidden;transition:height .3s cubic-bezier(.4,0,.2,1),opacity .3s ease}
        .nav-links-row.hidden{height:0;opacity:0;pointer-events:none}
        .nav-links-row a{font-family:var(--f-mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink);text-decoration:none;transition:color .15s}
        .nav-links-row a:hover{color:var(--light)}
        .nav-links-row a.curr{color:var(--light)}
        .nav-drawer{position:fixed;top:0;left:0;bottom:0;width:260px;background:#fff;z-index:2000;transform:translateX(-100%);transition:transform .3s cubic-bezier(.4,0,.2,1);border-right:1px solid var(--bd);padding:88px 36px 40px;display:flex;flex-direction:column;gap:8px}
        .nav-drawer.open{transform:translateX(0)}
        .nav-drawer a{font-family:var(--f-display);font-size:28px;font-weight:700;letter-spacing:-0.02em;text-transform:lowercase;color:var(--ink);text-decoration:none;line-height:1.25;opacity:.85;transition:opacity .15s}
        .nav-drawer a:hover{opacity:1}
        .nav-drawer-close{position:absolute;top:22px;right:22px;background:none;border:none;cursor:pointer;font-family:var(--f-mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--light)}
        .nav-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.18);z-index:1900;opacity:0;pointer-events:none;transition:opacity .3s}
        .nav-overlay.open{opacity:1;pointer-events:all}
        .header-spacer{height:118px}
        .header-spacer.collapsed{height:80px}
        .fyi-grid{padding:40px 48px 80px;display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1px;background:var(--bd)}
        .fyi-card{background:#fff;padding:36px 32px;display:flex;flex-direction:column;gap:16px;text-decoration:none;color:inherit;transition:background .15s}
        .fyi-card:hover{background:var(--cream)}
        .fyi-tag{font-family:var(--f-mono);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:var(--light)}
        .fyi-title{font-family:var(--f-display);font-size:clamp(20px,2.2vw,28px);font-weight:700;letter-spacing:-0.02em;line-height:1.05;text-transform:lowercase;color:var(--ink)}
        .fyi-excerpt{font-family:var(--f-body);font-size:13px;line-height:1.7;color:var(--mid)}
        .fyi-cta{font-family:var(--f-mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--light);margin-top:auto}
        .empty{padding:80px 48px;font-family:var(--f-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--light)}
        footer{background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:24px 48px}
        .f-logo{font-family:var(--f-display);font-size:15px;font-weight:700;letter-spacing:0.08em;text-transform:lowercase}
        .f-links{display:flex;gap:32px;list-style:none}
        .f-links a{font-family:var(--f-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.55);text-decoration:none;transition:color .15s}
        .f-links a:hover{color:#fff}
        .f-copy{font-family:var(--f-mono);font-size:10px;letter-spacing:0.08em;color:rgba(255,255,255,0.3)}
      `}</style>

      <header className="site-header">
        <div className="ticker">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
        <div className="nav-title-row">
          <button className={`nav-menu-btn${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span/><span/><span/>
          </button>
          <a href="/" className="nav-logo">runway fyi</a>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className={`nav-links-row${navVisible ? '' : ' hidden'}`}>
          {[['/trends','Trends'],['/analysis','Analysis'],['/fyi','FYI'],['/shows','Shows'],['/archive','Archive']].map(([href, label]) => (
            <li key={href}><a href={href} className={href === '/fyi' ? 'curr' : ''}>{label}</a></li>
          ))}
        </ul>
      </header>
      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>close ✕</button>
        {[['/trends','trends'],['/analysis','analysis'],['/fyi','fyi'],['/shows','shows'],['/archive','archive'],['/about','about']].map(([href, label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </nav>
      <div className={`header-spacer${navVisible ? '' : ' collapsed'}`} />

      <div style={{ padding: '28px 48px 0' }}>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '8px' }}>Season · FW26</p>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(52px,8vw,96px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.9, margin: '0 0 28px' }}>FYI</h1>
      </div>

      {items.length === 0 ? (
        <div className="empty">No takes yet.</div>
      ) : (
        <div className="fyi-grid">
          {items.map(item => {
            const slug = typeof item.slug === 'string' ? item.slug : item.slug?.current ?? ''
            const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
            return (
              <a key={item._id} href={`/analysis/${slug}`} className="fyi-card">
                {item.coverImage && (
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                    <img src={item.coverImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                  </div>
                )}
                <div className="fyi-tag">{item.category ?? 'Opinion'} · {item.season ?? 'FW26'}</div>
                <div className="fyi-title">{item.title}</div>
                {item.excerpt && <p className="fyi-excerpt">{item.excerpt}</p>}
                <div className="fyi-cta">{date} · Read →</div>
              </a>
            )
          })}
        </div>
      )}

      <footer>
        <span className="f-logo">runway fyi</span>
        <ul className="f-links">
          <li><a href="https://instagram.com/runwayfyi" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://tiktok.com/@runwayfyi" target="_blank" rel="noopener noreferrer">TikTok</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <span className="f-copy">© 2026 runwayfyi.com</span>
      </footer>
    </>
  )
}