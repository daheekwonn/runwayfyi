'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const FYI_DATA = [
  {
    id: '1',
    slug: 'chanel-ballet-flat',
    type: 'SEARCH',
    stat: '+312%',
    label: 'Chanel ballet flat searches post-show',
    body: "matthieu blazy's chanel fw26 was the most anticipated collection of the season",
    show: 'Chanel',
    season: 'FW26',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    id: '2',
    slug: 'chanel-tweed',
    type: 'RUNWAY',
    stat: '38/52',
    label: 'Chanel looks featured tweed — highest in 6 seasons',
    body: 'tweed is back and it never really left. blazy just made it feel new',
    show: 'Chanel',
    season: 'FW26',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    id: '3',
    slug: 'dior-bar-jacket',
    type: 'SEARCH',
    stat: '+245%',
    label: "Dior bar jacket searches after Jonathan Anderson's debut",
    body: 'jonathan anderson at dior is already rewriting what the house means',
    show: 'Dior',
    season: 'FW26',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  },
  {
    id: '4',
    slug: 'chloe-prairie-dress',
    type: 'SEARCH',
    stat: '5-year high',
    label: 'Prairie dress searches after Chloé FW26',
    body: "chemena kamali's chloé continues its cottagecore arc — and search data proves the customer is following",
    show: 'Chloé',
    season: 'FW26',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  },
  {
    id: '5',
    slug: 'gucci-leather-bomber',
    type: 'SEARCH',
    stat: '+200%',
    label: 'Leather bomber spike within 24hrs of Gucci Milan',
    body: 'sabato de sarno is building a language for gucci that the internet understands',
    show: 'Gucci',
    season: 'FW26',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
  },
  {
    id: '6',
    slug: 'gucci-loafer',
    type: 'RUNWAY',
    stat: '41/56',
    label: 'Gucci looks showed loafer — dominant footwear signal',
    body: "when more than two thirds of a show shares one shoe, that's not a trend. that's a directive",
    show: 'Gucci',
    season: 'FW26',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
  },
]

const TICKER_ITEMS = FYI_DATA.map(f => `${f.stat}  ${f.label}`).concat(['Paris FW26','Milan FW26','London FW26','New York FW26'])

export default function FYIPage() {
  const [activeFilter, setActiveFilter] = useState('All')
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

  const filtered = activeFilter === 'All' ? FYI_DATA : FYI_DATA.filter(f => f.type === activeFilter)

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
            <li key={href}><a href={href} style={href==='/fyi' ? {borderBottom:'1px solid var(--ink)',paddingBottom:'2px'} : {}}>{label}</a></li>
          ))}
        </ul>
      </header>
      <div className={`nav-overlay${menuOpen?' open':''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`nav-drawer${menuOpen?' open':''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>close ✕</button>
        {[['/trends','trends'],['/analysis','analysis'],['/fyi','fyi'],['/shows','shows'],['/archive','archive'],['/about','about']].map(([href,label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </nav>
      <div className={`header-spacer${navVisible?'':' collapsed'}`} />

      {/* ── Page Header ── */}
      <div style={{ padding:'28px 48px 0' }}>
        <div style={{ fontFamily:"'Geist Mono', monospace", fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'8px' }}>
          Season · FW26
        </div>
        <h1 style={{ fontFamily:"'Ranade', sans-serif", fontSize:'clamp(52px,8vw,96px)', fontWeight:700, letterSpacing:'-0.03em', lineHeight:0.9, margin:'0 0 28px' }}>
          FYI
        </h1>
      </div>

      {/* ── Filter Bar ── */}
      <div style={{ borderBottom:'1px solid var(--bd)', position:'sticky', top:0, background:'var(--white)', zIndex:10 }}>
        <div style={{ display:'flex', overflowX:'auto', padding:'0 48px', borderBottom:'1px solid var(--bd)' }}>
          {['All','SEARCH','RUNWAY','SOCIAL'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding:'13px 16px', border:'none',
              borderBottom: activeFilter===f ? '2px solid var(--ink)' : '2px solid transparent',
              background:'transparent', cursor:'pointer',
              fontFamily:"'Geist Mono', monospace", fontSize:'10px',
              letterSpacing:'0.12em', textTransform:'uppercase',
              color: activeFilter===f ? 'var(--ink)' : 'var(--light)',
              whiteSpace:'nowrap', transition:'color 0.15s', marginBottom:'-1px',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards Grid ── */}
      <div style={{ padding:'40px 48px 80px', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:'2px' }}>
        {filtered.map(fyi => (
          <Link key={fyi.id} href={`/analysis/${fyi.slug}`} style={{ textDecoration:'none', color:'inherit' }}>
            <div style={{
              background:`linear-gradient(rgba(12,11,9,0.45), rgba(12,11,9,0.45)), url(${fyi.image})`,
              backgroundColor:'var(--ink)',
              backgroundSize:'cover',
              backgroundPosition:'center',
              padding:'32px 28px',
              position:'relative',
              minHeight:300,
              display:'flex',
              flexDirection:'column',
            }}>
              {/* Type badge */}
              <div style={{
                display:'inline-block',
                alignSelf:'flex-start',
                fontFamily:"'Geist Mono', monospace",
                fontSize:'9px',
                letterSpacing:'0.18em',
                textTransform:'uppercase',
                padding:'4px 10px',
                background:'rgba(255,255,255,0.15)',
                color:'#fff',
                marginBottom:'24px',
                borderRadius:'1px',
                border:'1px solid rgba(255,255,255,0.25)',
              }}>
                {fyi.type}
              </div>

              {/* Big stat */}
              <div style={{
                fontFamily:"'Ranade', sans-serif",
                fontSize:'clamp(36px,5vw,64px)',
                fontWeight:700,
                letterSpacing:'-0.03em',
                lineHeight:0.9,
                marginBottom:'14px',
                color:'#fff',
              }}>
                {fyi.stat}
              </div>

              {/* Label in mono */}
              <p style={{
                margin:'0 0 20px',
                fontFamily:"'Geist Mono', monospace",
                fontSize:'11px',
                letterSpacing:'0.08em',
                color:'rgba(255,255,255,0.8)',
                lineHeight:1.5,
              }}>
                {fyi.label}
              </p>

              {/* Opinion in body font, italic */}
              <p style={{
                margin:0,
                fontFamily:"'Lora', Georgia, serif",
                fontSize:'14px',
                fontStyle:'italic',
                color:'rgba(255,255,255,0.75)',
                lineHeight:1.6,
                flex:1,
              }}>
                {fyi.body}
              </p>

              {/* Show + season bottom right */}
              <div style={{
                position:'absolute',
                bottom:20,
                right:20,
                fontFamily:"'Geist Mono', monospace",
                fontSize:'9px',
                letterSpacing:'0.14em',
                textTransform:'uppercase',
                color:'rgba(255,255,255,0.55)',
              }}>
                {fyi.show} · {fyi.season}
              </div>
            </div>
          </Link>
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
