'use client'

import { useState, useEffect, useRef } from 'react'

interface TrendItem {
  id: number; rank: number; name: string; category: string; season: string
  trend_score: number; runway_score: number; search_score: number; social_score: number
  runway_count: number; runway_show_count: number; trend_delta: number
  is_rising: boolean; last_scored_at: string | null
}
interface Props { leaderboard: TrendItem[]; all: TrendItem[] }

const CATEGORY_LABELS: Record<string,string> = {
  outerwear:'Outerwear', dress:'Dresses & Silhouettes', tailoring:'Tailoring',
  footwear:'Footwear', accessory:'Accessories', material:'Materials',
  color:'Colours', aesthetic:'Aesthetics',
}
const CATEGORY_ORDER = ['outerwear','tailoring','dress','footwear','material','color','accessory','aesthetic']

// 12 months of simulated trend velocity data
const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']
const VELOCITY_DATA = {
  runway:   [61,64,69,73,67,71,80,85,89,76,82,91],
  search:   [55,58,60,74,79,71,69,67,75,82,88,94],
  seasonal: [40,42,55,67,65,64,50,45,58,69,75,80],
}

const CULTURAL_CONTEXTS = [
  { season:'FW26', title:'Recession dressing always brings the coat', body:`When economic anxiety spikes, outerwear scores rise. It happened in FW09 (shearling), FW15 (cocoon coat), and now FW26. A coat is armour. The data agrees.`, stat:'#1', statLabel:'Outerwear rank', color:'#2C2A27' },
  { season:'FW26', title:'The prairie dress is a generational reset', body:`Every 20 years, fashion returns to the countryside. The 70s had Laura Ashley. The 90s had babydoll. FW26 has Chloé. When the world feels unstable, the silhouette romanticises escape.`, stat:'+340%', statLabel:'Search growth YoY', color:'#4A3728' },
  { season:'FW25', title:'Quiet luxury was never about the clothes', body:`The quiet luxury cycle peaked in FW25 and is now correcting. Blazy's Chanel is the antidote — maximalism is returning, but as joy, not noise. The search data shifted before the shows did.`, stat:'−18%', statLabel:'QT search delta', color:'#1C1C1A' },
]

// ── SVG Line Chart ─────────────────────────────────────────────────────────────
function VelocityChart() {
  const [activeFilter, setActiveFilter] = useState<'all'|'runway'|'search'|'seasonal'>('all')
  const W = 800, H = 200, PAD = { t:20, r:20, b:36, l:36 }
  const cW = W - PAD.l - PAD.r
  const cH = H - PAD.t - PAD.b
  const minV = 30, maxV = 100

  function toX(i: number) { return PAD.l + (i / (MONTHS.length - 1)) * cW }
  function toY(v: number) { return PAD.t + cH - ((v - minV) / (maxV - minV)) * cH }

  function makePath(vals: number[]) {
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ')
  }
  function makeArea(vals: number[]) {
    const top = makePath(vals)
    const bot = `L ${toX(vals.length-1).toFixed(1)} ${(PAD.t+cH).toFixed(1)} L ${PAD.l.toFixed(1)} ${(PAD.t+cH).toFixed(1)} Z`
    return top + ' ' + bot
  }

  const lines = [
    { key:'runway',   label:'RUNWAY',     color:'#0C0B09', width:2.5 },
    { key:'search',   label:'SEARCH',     color:'#6B8F71', width:1.5 },
    { key:'seasonal', label:'SEASONAL',   color:'#8B9DC3', width:1.5 },
  ] as const

  const gridVals = [40, 60, 80, 100]

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'6px' }}>Search Volume Index</div>
          <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'22px', fontWeight:700, letterSpacing:'-0.02em' }}>Trend Velocity — Last 12 Months</div>
        </div>
        <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
          {(['all','runway','search','seasonal'] as const).map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding:'5px 12px', border:'1px solid var(--bd)', background: activeFilter===f ? 'var(--ink)' : 'transparent',
              color: activeFilter===f ? '#fff' : 'var(--mid)', cursor:'pointer',
              fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase',
            }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ overflowX:'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', minWidth:'500px', height:'auto', display:'block' }}>
          <defs>
            {lines.map(l => (
              <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={l.color} stopOpacity="0.12" />
                <stop offset="100%" stopColor={l.color} stopOpacity="0.01" />
              </linearGradient>
            ))}
          </defs>
          {/* Grid */}
          {gridVals.map(v => (
            <g key={v}>
              <line x1={PAD.l} y1={toY(v)} x2={W-PAD.r} y2={toY(v)} stroke="var(--bd)" strokeWidth="1" />
              <text x={PAD.l-6} y={toY(v)+4} textAnchor="end" fill="var(--light)" fontFamily="'Geist Mono',monospace" fontSize="9">{v}</text>
            </g>
          ))}
          {/* Month labels */}
          {MONTHS.map((m, i) => (
            <text key={m} x={toX(i)} y={H-6} textAnchor="middle" fill="var(--light)" fontFamily="'Geist Mono',monospace" fontSize="9">{m}</text>
          ))}
          {/* Area fills */}
          {lines.filter(l => activeFilter === 'all' || activeFilter === l.key).map(l => (
            <path key={`area-${l.key}`} d={makeArea(VELOCITY_DATA[l.key])} fill={`url(#grad-${l.key})`} />
          ))}
          {/* Lines */}
          {lines.filter(l => activeFilter === 'all' || activeFilter === l.key).map(l => (
            <path key={`line-${l.key}`} d={makePath(VELOCITY_DATA[l.key])} fill="none" stroke={l.color} strokeWidth={l.width} strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {/* Dots */}
          {lines.filter(l => activeFilter === 'all' || activeFilter === l.key).map(l =>
            VELOCITY_DATA[l.key].map((v, i) => (
              <circle key={`${l.key}-${i}`} cx={toX(i)} cy={toY(v)} r="3" fill={l.color} />
            ))
          )}
        </svg>
      </div>
      <div style={{ display:'flex', gap:'20px', marginTop:'8px' }}>
        {lines.map(l => (
          <div key={l.key} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'20px', height:'2px', background:l.color }} />
            <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.1em', color:'var(--mid)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Material bar chart ─────────────────────────────────────────────────────────
function MaterialChart({ data }: { data: { name: string; pct: number; color: string }[] }) {
  return (
    <div>
      <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'6px' }}>Material Trends</div>
      <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'22px', fontWeight:700, letterSpacing:'-0.02em', marginBottom:'20px' }}>Top Fabrics FW26</div>
      {data.map(m => (
        <div key={m.name} style={{ display:'grid', gridTemplateColumns:'80px 1fr 40px', gap:'12px', alignItems:'center', marginBottom:'14px' }}>
          <span style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'14px', fontWeight:500 }}>{m.name}</span>
          <div style={{ height:'8px', background:'var(--warm)', borderRadius:'1px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${m.pct}%`, background:m.color, borderRadius:'1px' }} />
          </div>
          <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'11px', color:'var(--mid)', textAlign:'right' }}>{m.pct}%</span>
        </div>
      ))}
    </div>
  )
}

// ── Keywords table ─────────────────────────────────────────────────────────────
function KeywordsChart({ data }: { data: { name: string; tag: string; bar: number; delta: string; up: boolean }[] }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'6px' }}>
        <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)' }}>Trending Keywords</div>
        <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.12em', color:'var(--light)' }}>↑ WEEKLY</div>
      </div>
      <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'22px', fontWeight:700, letterSpacing:'-0.02em', marginBottom:'20px' }}>Top Tags</div>
      {data.map((k, i) => (
        <div key={k.name} style={{ display:'grid', gridTemplateColumns:'28px 1fr 70px 1fr 48px', gap:'10px', alignItems:'center', borderBottom:'1px solid var(--bd)', padding:'10px 0' }}>
          <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', color:'var(--light)' }}>{String(i+1).padStart(2,'0')}</span>
          <span style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'15px', fontWeight:500 }}>{k.name}</span>
          <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'8px', letterSpacing:'0.1em', border:'1px solid var(--bd)', padding:'3px 6px', color:'var(--mid)', whiteSpace:'nowrap' }}>{k.tag}</span>
          <div style={{ height:'6px', background:'var(--warm)', borderRadius:'1px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${k.bar}%`, background: k.tag==='RUNWAY' ? 'var(--ink)' : k.tag==='MATERIAL' ? '#8B7355' : '#6B8F71', borderRadius:'1px' }} />
          </div>
          <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', color: k.up ? '#16873d' : '#c0392b', textAlign:'right', fontWeight:500 }}>{k.delta}</span>
        </div>
      ))}
    </div>
  )
}

// ── Score breakdown bars ───────────────────────────────────────────────────────
function ScoreBreakdown({ item }: { item: TrendItem }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'8px', padding:'14px 0 0', borderTop:'1px solid var(--bd)' }}>
      {[
        { label:'R · Runway', value:item.runway_score, weight:'50%' },
        { label:'S · Search', value:item.search_score, weight:'30%' },
        { label:'V · Social', value:item.social_score, weight:'20%' },
      ].map(({ label, value, weight }) => (
        <div key={label}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
            <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--light)' }}>
              {label} <span style={{ opacity:0.4, margin:'0 4px' }}>·</span> {weight}
            </span>
            <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', color:'var(--ink)' }}>{value.toFixed(1)}</span>
          </div>
          <div style={{ height:'2px', background:'var(--warm)' }}>
            <div style={{ height:'100%', width:`${Math.min(value,100)}%`, background:'var(--ink)', transition:'width 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Trend row ──────────────────────────────────────────────────────────────────
function TrendRow({ item, rank }: { item: TrendItem; rank: number }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const badgeType = item.trend_delta > 2 ? 'up' : item.trend_delta < -2 ? 'dn' : 'new'
  return (
    <div
      onClick={() => setOpen(!open)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom:'1px solid var(--bd)', cursor:'pointer', background: open ? 'var(--cream)' : hovered ? 'var(--warm)' : 'transparent', transition:'background 0.15s' }}
    >
      <div style={{ display:'flex', alignItems:'center', padding:'12px 24px', gap:'14px' }}>
        <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', color:'var(--light)', minWidth:'22px', flexShrink:0 }}>
          {String(rank).padStart(2,'0')}
        </span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'15px', fontWeight:700, letterSpacing:'-0.01em', color:'var(--ink)', lineHeight:1.15 }}>{item.name}</div>
          <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--light)', marginTop:'2px' }}>
            {item.category} · {item.runway_show_count} shows
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
          <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'18px', fontWeight:500, color:'var(--ink)' }}>{item.trend_score.toFixed(1)}</span>
          <span style={{
            fontFamily:`'Geist Mono', monospace`, fontSize:'9px', fontWeight:500,
            display:'inline-flex', alignItems:'center', justifyContent:'center', width:'20px', height:'20px', flexShrink:0,
            background: badgeType==='up' ? 'rgba(30,107,60,0.18)' : badgeType==='dn' ? 'rgba(160,50,40,0.16)' : 'rgba(12,11,9,0.08)',
            color: badgeType==='up' ? '#16873d' : badgeType==='dn' ? '#c0392b' : 'var(--ink)',
          }}>{badgeType==='up' ? '↑' : badgeType==='dn' ? '↓' : 'N'}</span>
          <span style={{ color:'var(--light)', fontSize:'11px', transition:'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
        </div>
      </div>
      {open && (
        <div style={{ padding:'0 24px 16px', paddingLeft:'60px' }}>
          <ScoreBreakdown item={item} />
        </div>
      )}
    </div>
  )
}

// ── Category section ───────────────────────────────────────────────────────────
function CategorySection({ category, items }: { category:string; items:TrendItem[] }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div style={{ marginBottom:'36px' }}>
      <div onClick={() => setCollapsed(!collapsed)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'2px solid var(--ink)', paddingBottom:'10px', cursor:'pointer' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:'10px' }}>
          <h2 style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'11px', letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:600, margin:0 }}>
            {CATEGORY_LABELS[category] || category}
          </h2>
          <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', color:'var(--light)' }}>{items.length}</span>
        </div>
        <span style={{ color:'var(--light)', fontSize:'11px', transition:'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : 'none' }}>▾</span>
      </div>
      {!collapsed && (
        <div style={{ border:'1px solid var(--bd)', borderTop:'none' }}>
          {items.map((item, i) => <TrendRow key={item.id} item={item} rank={i+1} />)}
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function TrendsClient({ leaderboard, all }: Props) {
  const [activeFilter, setActiveFilter] = useState('all')
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
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = all.filter(i => i.category === cat).sort((a,b) => b.trend_score - a.trend_score)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {} as Record<string,TrendItem[]>)

  const filters = ['all', ...CATEGORY_ORDER.filter(c => grouped[c])]
  const top3 = leaderboard.slice(0, 3)
  const TICKER_ITEMS = leaderboard.slice(0,10).map(i => `${i.name}  ${i.trend_score.toFixed(1)}`).concat(['Paris FW26','Milan FW26','London FW26','New York FW26'])

// Derive material data from API
const MATERIAL_DATA = all
  .filter(t => t.category === 'material')
  .sort((a, b) => b.trend_score - a.trend_score)
  .slice(0, 6)
  .map(t => ({
    name: t.name,
    pct: Math.round(t.trend_score),
    color: '#1a1816',
  }))

// Derive keyword data from API
const KEYWORD_DATA = [...all]
  .sort((a, b) => b.trend_score - a.trend_score)
  .slice(0, 10)
  .map(t => ({
    name: t.name,
    tag: t.category.toUpperCase(),
    bar: Math.round(t.trend_score),
    delta: t.trend_delta > 0 ? `+${t.trend_delta.toFixed(1)}%` : `${t.trend_delta.toFixed(1)}%`,
    up: t.trend_delta >= 0,
  }))

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
            <li key={href}><a href={href} style={href==='/trends' ? {borderBottom:'1px solid var(--ink)',paddingBottom:'2px'} : {}}>{label}</a></li>
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

      {/* ── Season label ── */}
      <div style={{ padding:'28px 48px 0', borderBottom:'none' }}>
        <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'8px' }}>
          Season · FW26
        </div>
        <h1 style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'clamp(52px,8vw,96px)', fontWeight:700, letterSpacing:'-0.03em', lineHeight:0.9, margin:'0 0 28px' }}>
          Trends
        </h1>
      </div>

      {/* ── Top 3 hero cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 300px', borderTop:'1px solid var(--bd)', borderBottom:'1px solid var(--bd)' }}>
        {top3.map((item, i) => (
          <div key={item.id} style={{
            background: i===0 ? 'var(--ink)' : 'var(--white)',
            borderRight:'1px solid var(--bd)',
            padding:'28px 28px 24px',
            color: i===0 ? 'var(--white)' : 'var(--ink)',
          }}>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', opacity:0.45, marginBottom:'10px' }}>
              #{item.rank} {item.category}
            </div>
            <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'clamp(16px,1.8vw,22px)', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.1, marginBottom:'20px' }}>
              {item.name}
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'10px' }}>
              <span style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'44px', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1 }}>
                {item.trend_score.toFixed(1)}
              </span>
              <span style={{ fontSize:'11px', opacity:0.4 }}>/100</span>
            </div>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', opacity:0.5, letterSpacing:'0.08em' }}>
              {item.runway_show_count} shows · {item.is_rising ? '↑ rising' : '→ stable'}
            </div>
          </div>
        ))}
        {/* Season stats panel */}
        <div style={{ background:'var(--cream)', padding:'28px 24px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'16px' }}>FW26 at a glance</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0', flex:1 }}>
            {[
              { num: String(all.length),                           label:'Trends tracked' },
              { num: String(all.filter(i => i.is_rising).length), label:'Rising signals' },
              { num: '4',                                          label:'Cities indexed' },
              { num: top3[0]?.trend_score.toFixed(1) ?? '—',      label:'Top score' },
            ].map(({ num, label }, i) => (
              <div key={label} style={{ borderBottom: i < 3 ? '1px solid var(--bd)' : 'none', padding:'10px 0', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'24px', fontWeight:700, letterSpacing:'-0.02em' }}>{num}</span>
                <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'8px', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--light)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', borderBottom:'1px solid var(--bd)' }}>
        {/* Velocity line chart */}
        <div style={{ padding:'40px 48px', borderRight:'1px solid var(--bd)' }}>
          <VelocityChart />
        </div>
        {/* Stats column */}
        <div style={{ display:'flex', flexDirection:'column' }}>
          {/* Big stat 1 */}
          <div style={{ padding:'36px 32px', borderBottom:'1px solid var(--bd)', flex:1 }}>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'12px' }}>
              Runway Looks Indexed
            </div>
            <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'52px', fontWeight:700, letterSpacing:'-0.04em', lineHeight:1, marginBottom:'8px' }}>5,659</div>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', color:'#16873d', letterSpacing:'0.08em' }}></div>
          </div>
          {/* Big stat 2 */}
          <div style={{ padding:'36px 32px', flex:1 }}>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'12px' }}>
              Trending Keywords
            </div>
            <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'52px', fontWeight:700, letterSpacing:'-0.04em', lineHeight:1, marginBottom:'8px' }}>89</div>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', color:'#16873d', letterSpacing:'0.08em' }}>↑ 32 new this week</div>
          </div>
        </div>
      </div>

      {/* ── Material + Keywords charts ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:'1px solid var(--bd)' }}>
        <div style={{ padding:'40px 48px', borderRight:'1px solid var(--bd)' }}>
          <MaterialChart data={MATERIAL_DATA} />
        </div>
        <div style={{ padding:'40px 40px' }}>
          <KeywordsChart data={KEYWORD_DATA} />
        </div>
      </div>

      {/* ── Filter bar + main grid ── */}
      <div style={{ borderBottom:'1px solid var(--bd)', position:'sticky', top:0, background:'var(--white)', zIndex:10 }}>
        <div style={{ display:'flex', overflowX:'auto', padding:'0 48px', borderBottom:'1px solid var(--bd)' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding:'13px 16px', border:'none',
              borderBottom: activeFilter===f ? '2px solid var(--ink)' : '2px solid transparent',
              background:'transparent', cursor:'pointer',
              fontFamily:`'Geist Mono', monospace`, fontSize:'10px',
              letterSpacing:'0.12em', textTransform:'uppercase',
              color: activeFilter===f ? 'var(--ink)' : 'var(--light)',
              whiteSpace:'nowrap', transition:'color 0.15s', marginBottom:'-1px',
            }}>
              {f==='all' ? 'All' : CATEGORY_LABELS[f]||f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', borderBottom:'1px solid var(--bd)' }}>
        {/* Left: trend categories */}
        <div style={{ borderRight:'1px solid var(--bd)', padding:'40px 48px' }}>
          {(activeFilter==='all' ? CATEGORY_ORDER : [activeFilter])
            .filter(cat => grouped[cat])
            .map(cat => <CategorySection key={cat} category={cat} items={grouped[cat]} />)
          }
        </div>

        {/* Sidebar */}
        <div style={{ padding:'40px 32px' }}>
          <div style={{ position:'sticky', top:'56px', display:'flex', flexDirection:'column', gap:'36px' }}>
            {/* Methodology */}
            <div>
              <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'14px' }}>How scores work</div>
              {[
                { key:'R', label:'Runway', weight:'50%', desc:'Show frequency across Paris, Milan, London, New York' },
                { key:'S', label:'Search', weight:'30%', desc:'Google Trends velocity vs 6-week baseline' },
                { key:'V', label:'Social', weight:'20%', desc:'Instagram & TikTok engagement signals' },
              ].map(({ key, label, weight, desc }) => (
                <div key={key} style={{ display:'flex', gap:'12px', alignItems:'flex-start', borderBottom:'1px solid var(--bd)', padding:'12px 0' }}>
                  <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'12px', fontWeight:500, color:'var(--ink)', minWidth:'14px' }}>{key}</span>
                  <div>
                    <div style={{ display:'flex', gap:'8px', alignItems:'baseline', marginBottom:'3px' }}>
                      <span style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'14px', fontWeight:700 }}>{label}</span>
                      <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'11px', color:'var(--mid)' }}>{weight}</span>
                    </div>
                    <p style={{ fontFamily:`'Lora', Georgia, serif`, fontSize:'12px', fontWeight:500, color:'var(--mid)', lineHeight:1.55 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Cities */}
            <div>
              <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'14px' }}>FW26 Cities</div>
              {['Paris','Milan','London','New York'].map((city, i) => (
                <div key={city} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom: i<3 ? '1px solid var(--bd)' : 'none', padding:'10px 0' }}>
                  <span style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'15px', fontWeight:500 }}>{city}</span>
                  <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', color:'var(--light)', letterSpacing:'0.1em' }}>
                    {['ACTIVE','ACTIVE','ACTIVE','COMPLETE'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Cultural Context ── */}
      <section style={{ borderBottom:'1px solid var(--bd)' }}>
        <div style={{ padding:'32px 48px', borderBottom:'1px solid var(--bd)', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <h2 style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'11px', letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:600, margin:0 }}>Cultural Context</h2>
          <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', color:'var(--light)' }}>Fashion has always been a symptom</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)' }}>
          {CULTURAL_CONTEXTS.map((ctx, i) => (
            <div key={i} style={{ borderRight: i<2 ? '1px solid var(--bd)' : 'none', display:'flex', flexDirection:'column' }}>
              <div style={{ background:ctx.color, padding:'32px 32px 28px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'140px' }}>
                <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'8px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:'10px' }}>{ctx.season}</div>
                <div>
                  <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'clamp(14px,1.4vw,18px)', fontWeight:700, color:'#fff', letterSpacing:'-0.01em', lineHeight:1.15, marginBottom:'16px' }}>{ctx.title}</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}>
                    <span style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'32px', fontWeight:700, color:'#fff', lineHeight:1 }}>{ctx.stat}</span>
                    <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'8px', letterSpacing:'0.08em', color:'rgba(255,255,255,0.45)', textTransform:'uppercase' }}>{ctx.statLabel}</span>
                  </div>
                </div>
              </div>
              <div style={{ padding:'24px 32px', flex:1, borderTop:'1px solid var(--bd)' }}>
                <p style={{ fontFamily:`'Lora', Georgia, serif`, fontSize:'13px', fontWeight:500, lineHeight:1.7, color:'var(--mid)' }}>{ctx.body}</p>
                <a href="/analysis" style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginTop:'16px', fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink)', textDecoration:'none', borderBottom:'1px solid var(--bd)', paddingBottom:'2px' }}>
                  Read analysis <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Methodology ── */}
      <section id="methodology" style={{ borderBottom:'1px solid var(--bd)', background:'#fff' }}>
        <div style={{ padding:'48px 48px 32px', borderBottom:'1px solid var(--bd)', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'10px' }}>How it works</div>
            <h2 style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'clamp(32px,4vw,52px)', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1, margin:0 }}>Scoring Methodology</h2>
          </div>
          <span style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', color:'var(--light)', letterSpacing:'0.1em' }}>FW26 · Updated daily</span>
        </div>

        {/* Three pillars */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderBottom:'1px solid var(--bd)' }}>
          {[
            {
              key: 'R', label: 'Runway Frequency', weight: '50%',
              desc: 'The backbone of the score. We count how many looks and how many shows featured a given garment, silhouette, or material signal across Paris, Milan, London, and New York. A trend that appeared in 40 looks across 8 shows scores far higher than one spotted in 3 looks at a single designer.',
              stat: '5,659', statLabel: 'looks indexed FW26',
            },
            {
              key: 'S', label: 'Search Velocity', weight: '30%',
              desc: 'We track Google Trends data for each trend keyword over a 90-day window and calculate velocity — the rate of change in search interest in the two weeks following each show versus the prior six-week baseline. A +200% velocity spike signals real consumer intent, not just editorial coverage.',
              stat: '+180%', statLabel: 'avg velocity top 10',
            },
            {
              key: 'V', label: 'Social Signal', weight: '20%',
              desc: 'Instagram and TikTok engagement velocity measured per trend hashtag and brand handle post-show. We weight recency heavily — a spike in the 72 hours after a show matters more than aggregate likes. This component is currently being wired; scores reflect runway and search only until live.',
              stat: 'Pending', statLabel: 'Instagram API wiring',
            },
          ].map(({ key, label, weight, desc, stat, statLabel }, i) => (
            <div key={key} style={{ borderRight: i < 2 ? '1px solid var(--bd)' : 'none', padding:'40px 40px 36px', display:'flex', flexDirection:'column', gap:'24px' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:'12px' }}>
                <span style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'52px', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1, color:'var(--ink)' }}>{key}</span>
                <div>
                  <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'18px', fontWeight:700, letterSpacing:'-0.01em', color:'var(--ink)' }}>{label}</div>
                  <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'11px', color:'var(--light)', letterSpacing:'0.08em' }}>{weight} of composite score</div>
                </div>
              </div>
              <p style={{ fontFamily:`'Lora', Georgia, serif`, fontSize:'13px', fontWeight:500, lineHeight:1.75, color:'var(--mid)', flex:1 }}>{desc}</p>
              <div style={{ borderTop:'1px solid var(--bd)', paddingTop:'20px' }}>
                <div style={{ fontFamily:`'Ranade', sans-serif`, fontSize:'28px', fontWeight:700, letterSpacing:'-0.02em', color:'var(--ink)', lineHeight:1 }}>{stat}</div>
                <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--light)', marginTop:'4px' }}>{statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Formula + notes row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:'1px solid var(--bd)' }}>
          <div style={{ padding:'36px 40px', borderRight:'1px solid var(--bd)' }}>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'16px' }}>The formula</div>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'clamp(14px,1.6vw,20px)', fontWeight:500, letterSpacing:'0.04em', color:'var(--ink)', lineHeight:1.8, background:'#fff', padding:'24px 28px', border:'1px solid var(--bd)' }}>
  {'score = 0.5 \u00d7 runway'}<br />
  {'      + 0.3 \u00d7 search'}<br />
  {'      + 0.2 \u00d7 social'}
            </div>
            <p style={{ fontFamily:`'Lora', Georgia, serif`, fontSize:'13px', fontWeight:500, lineHeight:1.7, color:'var(--mid)', marginTop:'20px' }}>
              Each component is normalised to a 0–100 scale before weighting. The composite score therefore also sits between 0 and 100. A score above 80 indicates a confirmed macro trend for the season.
            </p>
          </div>
          <div style={{ padding:'36px 40px' }}>
            <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--light)', marginBottom:'16px' }}>Notes on the data</div>
            {[
              { label: 'Season scope', note: 'FW26 covers shows from January–March 2026 across Paris, Milan, London, and New York. Copenhagen is tracked separately as an emerging signal market.' },
              { label: 'Search baseline', note: 'Google Trends scores are relative (0–100 within the query window), not absolute search volumes. We use 90-day windows with a 2-week recency weight.' },
              { label: 'Social pending', note: 'The social velocity component (20%) is currently 0 on all items while Instagram Basic Display API access is being finalised. Scores reflect R + S only.' },
              { label: 'Manual seed data', note: 'Initial runway counts are manually seeded from show notes. Google Vision API integration for automated look tagging is in progress.' },
            ].map(({ label, note }) => (
              <div key={label} style={{ borderBottom:'1px solid var(--bd)', padding:'14px 0' }}>
                <div style={{ fontFamily:`'Geist Mono', monospace`, fontSize:'10px', fontWeight:500, letterSpacing:'0.08em', color:'var(--ink)', marginBottom:'4px' }}>{label}</div>
                <p style={{ fontFamily:`'Lora', Georgia, serif`, fontSize:'12px', fontWeight:500, lineHeight:1.6, color:'var(--mid)', margin:0 }}>{note}</p>
              </div>
            ))}
          </div>
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
        <span className="f-copy">© 2026 runwayfyi.com</span>
      </footer>
    </>
  )
}
