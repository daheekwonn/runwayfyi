'use client'

import { useState, useEffect, useRef } from 'react'

interface TrendItem {
  id: number
  rank: number
  name: string
  category: string
  season: string
  trend_score: number
  runway_score: number
  search_score: number
  social_score: number
  runway_count: number
  runway_show_count: number
  trend_delta: number
  is_rising: boolean
  last_scored_at: string | null
}

interface Props {
  leaderboard: TrendItem[]
  all: TrendItem[]
}

const CATEGORY_LABELS: Record<string, string> = {
  outerwear: 'Outerwear',
  dress: 'Dresses & Silhouettes',
  tailoring: 'Tailoring',
  footwear: 'Footwear',
  accessory: 'Accessories',
  material: 'Materials',
  color: 'Colours',
  aesthetic: 'Aesthetics',
}

const CATEGORY_ORDER = ['outerwear', 'tailoring', 'dress', 'footwear', 'material', 'color', 'accessory', 'aesthetic']

const CULTURAL_CONTEXTS = [
  {
    season: 'FW26',
    title: 'Recession dressing always brings the coat',
    body: `When economic anxiety spikes, outerwear scores rise. It happened in FW09 (shearling), FW15 (cocoon coat), and now FW26 — shearling is the #1 trend. A coat is armour. The data agrees.`,
    stat: '94.1',
    statLabel: 'Shearling score',
    color: '#2C2A27',
  },
  {
    season: 'FW26',
    title: 'The prairie dress is a generational reset',
    body: `Every 20 years, fashion returns to the countryside. The 70s had Laura Ashley. The 90s had babydoll. FW26 has Chloé. When the world feels unstable, the silhouette romanticises escape. The data caught it early.`,
    stat: '+340%',
    statLabel: 'Search growth YoY',
    color: '#4A3728',
  },
  {
    season: 'FW25',
    title: 'Quiet luxury was never about the clothes',
    body: `The quiet luxury cycle peaked in FW25 and is now correcting. Blazy's Chanel is the antidote — maximalism is returning, but as joy, not noise. The search data shifted before the shows did.`,
    stat: '−18%',
    statLabel: 'QT search delta',
    color: '#1C1C1A',
  },
]

// Simple bar chart using CSS only — no recharts dependency needed
function MiniBarChart({ items }: { items: TrendItem[] }) {
  const max = Math.max(...items.map(i => i.trend_score), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
      {items.slice(0, 10).map((item, i) => (
        <div key={item.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '100%',
            background: i === 0 ? 'var(--ink)' : 'var(--warm)',
            height: `${(item.trend_score / max) * 64}px`,
            minHeight: '4px',
            transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1)',
          }} />
          <span style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '7px', color: 'var(--light)', letterSpacing: '0.04em', writingMode: 'vertical-lr', transform: 'rotate(180deg)', maxHeight: '48px', overflow: 'hidden' }}>
            {item.name.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  )
}

// Score breakdown bar
function ScoreBreakdown({ item }: { item: TrendItem }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0 0', borderTop: '1px solid var(--bd)' }}>
      {[
        { label: 'R · Runway', value: item.runway_score, weight: '50%' },
        { label: 'S · Search', value: item.search_score, weight: '30%' },
        { label: 'V · Social', value: item.social_score, weight: '20%' },
      ].map(({ label, value, weight }) => (
        <div key={label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)' }}>
              {label} <span style={{ color: 'var(--bd)', margin: '0 4px' }}>·</span> {weight}
            </span>
            <span style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '9px', color: 'var(--ink)' }}>{value.toFixed(1)}</span>
          </div>
          <div style={{ height: '2px', background: 'var(--warm)' }}>
            <div style={{ height: '100%', width: `${value}%`, background: 'var(--ink)', transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function TrendRow({ item, rank }: { item: TrendItem; rank: number }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const badgeType = item.trend_delta > 2 ? 'up' : item.trend_delta < -2 ? 'dn' : 'new'

  return (
    <div
      onClick={() => setOpen(!open)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid var(--bd)',
        cursor: 'pointer',
        background: open ? 'var(--cream)' : hovered ? 'var(--warm)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: '14px' }}>
        <span style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '10px', color: 'var(--light)', minWidth: '22px' }}>
          {String(rank).padStart(2, '0')}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: `'Ranade', sans-serif`, fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1.15 }}>
            {item.name}
          </div>
          <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', marginTop: '3px' }}>
            {item.category} · {item.runway_show_count} shows
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '18px', fontWeight: 500, color: 'var(--ink)', lineHeight: 1 }}>
              {item.trend_score.toFixed(1)}
            </div>
          </div>
          <span style={{
            fontFamily: `'Geist Mono', monospace`,
            fontSize: '9px',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            flexShrink: 0,
            background: badgeType === 'up' ? 'rgba(30,107,60,0.18)' : badgeType === 'dn' ? 'rgba(160,50,40,0.16)' : 'rgba(12,11,9,0.08)',
            color: badgeType === 'up' ? '#16873d' : badgeType === 'dn' ? '#c0392b' : 'var(--ink)',
          }}>
            {badgeType === 'up' ? '↑' : badgeType === 'dn' ? '↓' : 'N'}
          </span>
          <span style={{ color: 'var(--light)', fontSize: '11px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 20px 16px', paddingLeft: '56px' }}>
          <ScoreBreakdown item={item} />
        </div>
      )}
    </div>
  )
}

function CategorySection({ category, items }: { category: string; items: TrendItem[] }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div style={{ marginBottom: '40px' }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--ink)', paddingBottom: '10px', marginBottom: 0, cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <h2 style={{ fontFamily: `'Ranade', sans-serif`, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>
            {CATEGORY_LABELS[category] || category}
          </h2>
          <span style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '10px', color: 'var(--light)' }}>{items.length}</span>
        </div>
        <span style={{ color: 'var(--light)', fontSize: '11px', transition: 'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : 'none' }}>▾</span>
      </div>
      {!collapsed && (
        <div style={{ border: '1px solid var(--bd)', borderTop: 'none' }}>
          {items.map((item, i) => <TrendRow key={item.id} item={item} rank={i + 1} />)}
        </div>
      )}
    </div>
  )
}

export default function TrendsClient({ leaderboard, all }: Props) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [navVisible, setNavVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    lastScrollY.current = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setNavVisible(y < 20)
        lastScrollY.current = y
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = all.filter(i => i.category === cat).sort((a, b) => b.trend_score - a.trend_score)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {} as Record<string, TrendItem[]>)

  const filters = ['all', ...CATEGORY_ORDER.filter(c => grouped[c])]
  const top3 = leaderboard.slice(0, 3)

  const TICKER_ITEMS = leaderboard.slice(0, 10).map(i => `${i.name}  ${i.trend_score.toFixed(1)}`).concat(['Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26'])

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Geist+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        :root {
          --ink: #0C0B09; --white: #FFFFFF; --cream: #F5F2ED;
          --warm: #EDE9E2; --mid: #5A5550; --light: #A09A94;
          --bd: rgba(12,11,9,0.1);
          --f-mono: 'Geist Mono', monospace;
          --f-display: 'Ranade', sans-serif;
          --f-body: 'Lora', Georgia, serif;
        }
        body { background:#fff; color:var(--ink); -webkit-font-smoothing:antialiased; }

        .site-header { position:fixed; top:0; left:0; right:0; z-index:1000; background:rgba(255,255,255,1); border-bottom:1px solid var(--bd); }
        .ticker { background:var(--ink); overflow:hidden; white-space:nowrap; padding:7px 0; }
        .ticker-inner { display:inline-flex; animation:tick 48s linear infinite; }
        .ticker-inner span { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.13em; color:rgba(255,255,255,0.9); padding:0 42px; }
        @keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .nav-title-row { height:56px; display:flex; align-items:center; justify-content:center; padding:0 52px; background:#fff; position:relative; }
        .nav-logo { font-family:var(--f-display); font-size:20px; font-weight:700; letter-spacing:0.08em; text-transform:lowercase; color:var(--ink); text-decoration:none; }
        .nav-menu-btn { position:absolute; left:24px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; display:flex; flex-direction:column; gap:5px; padding:6px; }
        .nav-menu-btn span { display:block; width:22px; height:1.5px; background:var(--ink); transition:transform .2s, opacity .2s; }
        .nav-menu-btn.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
        .nav-menu-btn.open span:nth-child(2) { opacity:0; }
        .nav-menu-btn.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }
        .nav-pill { position:absolute; right:52px; top:50%; transform:translateY(-50%); font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; border:1px solid var(--bd); color:var(--light); padding:5px 13px; }
        .nav-links-row { height:38px; display:flex; align-items:center; justify-content:center; gap:44px; background:#fff; border-top:1px solid var(--bd); list-style:none; padding:0; overflow:hidden; transition:height .3s cubic-bezier(.4,0,.2,1), opacity .3s ease, border-color .3s ease; }
        .nav-links-row.hidden { height:0; opacity:0; pointer-events:none; border-color:transparent; }
        .nav-links-row a { font-family:var(--f-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink); text-decoration:none; transition:color .15s; }
        .nav-links-row a:hover { color:var(--light); }
        .nav-drawer { position:fixed; top:0; left:0; bottom:0; width:260px; background:#fff; z-index:2000; transform:translateX(-100%); transition:transform .3s cubic-bezier(.4,0,.2,1); border-right:1px solid var(--bd); padding:88px 36px 40px; display:flex; flex-direction:column; gap:8px; }
        .nav-drawer.open { transform:translateX(0); }
        .nav-drawer a { font-family:var(--f-display); font-size:28px; font-weight:700; letter-spacing:-0.02em; text-transform:lowercase; color:var(--ink); text-decoration:none; line-height:1.25; opacity:.85; transition:opacity .15s; }
        .nav-drawer a:hover { opacity:1; }
        .nav-drawer-close { position:absolute; top:22px; right:22px; background:none; border:none; cursor:pointer; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .nav-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.18); z-index:1900; opacity:0; pointer-events:none; transition:opacity .3s; }
        .nav-overlay.open { opacity:1; pointer-events:all; }
        .header-spacer { height:118px; }
        .header-spacer.collapsed { height:80px; }

        footer { background:var(--ink); color:#fff; display:flex; align-items:center; justify-content:space-between; padding:24px 48px; border-top:1px solid var(--bd); }
        .f-logo { font-family:var(--f-display); font-size:15px; font-weight:700; letter-spacing:0.08em; text-transform:lowercase; }
        .f-links { display:flex; gap:32px; list-style:none; }
        .f-links a { font-family:var(--f-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.55); text-decoration:none; transition:color .15s; }
        .f-links a:hover { color:#fff; }
        .f-copy { font-family:var(--f-mono); font-size:10px; letter-spacing:0.08em; color:rgba(255,255,255,0.3); }
      `}</style>

      {/* ── Fixed header (identical to homepage) ── */}
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
          {[['/', 'Home'], ['/trends', 'Trends'], ['/shows', 'Shows'], ['/analysis', 'Analysis'], ['/archive', 'Archive']].map(([href, label]) => (
            <li key={href}><a href={href} style={href === '/trends' ? { borderBottom: '1px solid var(--ink)', paddingBottom: '2px' } : {}}>{label}</a></li>
          ))}
        </ul>
      </header>

      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>close ✕</button>
        {[['/', 'home'], ['/trends', 'trends'], ['/shows', 'shows'], ['/analysis', 'analysis'], ['/archive', 'archive'], ['/about', 'about']].map(([href, label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </nav>

      <div className={`header-spacer${navVisible ? '' : ' collapsed'}`} />

      {/* ── Page title ── */}
      <div style={{ borderBottom: '1px solid var(--bd)', padding: '40px 48px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '6px' }}>
          <h1 style={{ fontFamily: `'Ranade', sans-serif`, fontSize: 'clamp(36px,6vw,72px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0 }}>
            Trends
          </h1>
          <span style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '11px', color: 'var(--light)', letterSpacing: '0.1em' }}>
            FW26 · {all.length} signals
          </span>
        </div>
        <p style={{ fontFamily: `'Lora', Georgia, serif`, fontSize: '14px', fontWeight: 500, color: 'var(--mid)', maxWidth: '520px', lineHeight: 1.65, marginTop: '10px' }}>
          Composite scores from runway frequency, search velocity, and social engagement. Updated daily.
        </p>
      </div>

      {/* ── Top 3 hero + chart ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 340px', borderBottom: '1px solid var(--bd)' }}>
        {top3.map((item, i) => (
          <div key={item.id} style={{
            background: i === 0 ? 'var(--ink)' : 'var(--white)',
            borderRight: '1px solid var(--bd)',
            padding: '32px 28px',
            color: i === 0 ? 'var(--white)' : 'var(--ink)',
          }}>
            <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '8px' }}>
              #{item.rank} {item.category}
            </div>
            <div style={{ fontFamily: `'Ranade', sans-serif`, fontSize: 'clamp(16px,2vw,22px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '20px' }}>
              {item.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontFamily: `'Ranade', sans-serif`, fontSize: '42px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {item.trend_score.toFixed(1)}
              </span>
              <span style={{ fontSize: '11px', opacity: 0.4 }}>/100</span>
            </div>
            <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '10px', opacity: 0.55, letterSpacing: '0.08em' }}>
              {item.runway_show_count} shows · {item.is_rising ? '↑ rising' : '→ stable'}
            </div>
          </div>
        ))}

        {/* Chart panel */}
        <div style={{ background: 'var(--cream)', padding: '28px 24px', borderLeft: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '16px' }}>
              Top 10 · Score Distribution
            </div>
            <MiniBarChart items={leaderboard} />
          </div>
          <div style={{ borderTop: '1px solid var(--bd)', paddingTop: '14px', marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {[['R', '50%', 'Runway'], ['S', '30%', 'Search'], ['V', '20%', 'Social']].map(([k, w, l]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{w}</div>
                  <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '8px', letterSpacing: '0.1em', color: 'var(--light)', textTransform: 'uppercase', marginTop: '2px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ borderBottom: '1px solid var(--bd)', position: 'sticky', top: '0', background: 'var(--white)', zIndex: 10 }}>
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0 48px' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '13px 18px',
                border: 'none',
                borderBottom: activeFilter === f ? '2px solid var(--ink)' : '2px solid transparent',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: `'Geist Mono', monospace`,
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: activeFilter === f ? 'var(--ink)' : 'var(--light)',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s',
                marginBottom: '-1px',
              }}
            >
              {f === 'all' ? 'All' : CATEGORY_LABELS[f] || f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', borderBottom: '1px solid var(--bd)' }}>

        {/* Left: category sections */}
        <div style={{ borderRight: '1px solid var(--bd)', padding: '40px 48px 40px' }}>
          {(activeFilter === 'all' ? CATEGORY_ORDER : [activeFilter])
            .filter(cat => grouped[cat])
            .map(cat => <CategorySection key={cat} category={cat} items={grouped[cat]} />)
          }
        </div>

        {/* Right: sticky sidebar */}
        <div style={{ padding: '40px 32px' }}>
          <div style={{ position: 'sticky', top: '56px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* Methodology */}
            <div>
              <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '16px' }}>
                How scores work
              </div>
              {[
                { key: 'R', label: 'Runway', weight: '50%', desc: 'Show frequency across Paris, Milan, London, New York' },
                { key: 'S', label: 'Search', weight: '30%', desc: 'Google Trends velocity vs 6-week baseline' },
                { key: 'V', label: 'Social', weight: '20%', desc: 'Instagram & TikTok engagement signals' },
              ].map(({ key, label, weight, desc }) => (
                <div key={key} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', borderBottom: '1px solid var(--bd)', padding: '12px 0' }}>
                  <span style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '12px', fontWeight: 500, color: 'var(--ink)', minWidth: '16px' }}>{key}</span>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '3px' }}>
                      <span style={{ fontFamily: `'Ranade', sans-serif`, fontSize: '14px', fontWeight: 700 }}>{label}</span>
                      <span style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '11px', color: 'var(--mid)' }}>{weight}</span>
                    </div>
                    <p style={{ fontFamily: `'Lora', Georgia, serif`, fontSize: '12px', fontWeight: 500, color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Season stats */}
            <div>
              <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '16px' }}>
                FW26 Season Stats
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--bd)' }}>
                {[
                  { label: 'Trends tracked', num: String(all.length) },
                  { label: 'Cities', num: '4' },
                  { label: 'Top category', num: 'Outerwear' },
                  { label: 'Rising signals', num: String(all.filter(i => i.is_rising).length) },
                ].map(({ label, num }) => (
                  <div key={label} style={{ background: 'var(--cream)', padding: '16px 14px' }}>
                    <div style={{ fontFamily: `'Ranade', sans-serif`, fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1, marginBottom: '4px' }}>{num}</div>
                    <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Cultural & Historical Context ── */}
      <section style={{ borderBottom: '1px solid var(--bd)' }}>
        <div style={{ padding: '32px 48px 0', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <h2 style={{ fontFamily: `'Ranade', sans-serif`, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 20px' }}>
            Cultural Context
          </h2>
          <span style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '10px', color: 'var(--light)' }}>Fashion has always been a symptom</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid var(--bd)' }}>
          {CULTURAL_CONTEXTS.map((ctx, i) => (
            <div key={i} style={{ borderRight: i < 2 ? '1px solid var(--bd)' : 'none', display: 'flex', flexDirection: 'column' }}>
              {/* Black header */}
              <div style={{ background: ctx.color, padding: '28px 32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: '100px' }}>
                <div>
                  <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '6px' }}>{ctx.season}</div>
                  <div style={{ fontFamily: `'Ranade', sans-serif`, fontSize: 'clamp(14px,1.4vw,18px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.15 }}>{ctx.title}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '16px' }}>
                  <div style={{ fontFamily: `'Ranade', sans-serif`, fontSize: '28px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{ctx.stat}</div>
                  <div style={{ fontFamily: `'Geist Mono', monospace`, fontSize: '8px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', marginTop: '4px', textTransform: 'uppercase' }}>{ctx.statLabel}</div>
                </div>
              </div>
              {/* Body */}
              <div style={{ padding: '24px 32px', flex: 1, borderTop: '1px solid var(--bd)' }}>
                <p style={{ fontFamily: `'Lora', Georgia, serif`, fontSize: '13px', fontWeight: 500, lineHeight: 1.7, color: 'var(--mid)' }}>{ctx.body}</p>
                <a href="/analysis" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontFamily: `'Geist Mono', monospace`, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--bd)', paddingBottom: '2px' }}>
                  Read analysis <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <span className="f-logo">runway fyi</span>
        <ul className="f-links">
          <li><a href="https://instagram.com/runwayfyi" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://tiktok.com/@runwayfyi" target="_blank" rel="noopener noreferrer">TikTok</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <span className="f-copy">© 2026 runway.fyi</span>
      </footer>
    </>
  )
}
