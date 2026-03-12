'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/trends', label: 'Trends' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/fyi', label: 'FYI' },
  { href: '/shows', label: 'Shows' },
  { href: '/archive', label: 'Archive' },
]

// Replace with sanityFetch() once fyi schema is wired
const FALLBACK_FYIS = [
  {
    id: '1',
    type: 'SEARCH',
    stat: '+312%',
    label: 'Chanel ballet flat searches post-show',
    body: `matthieu blazy's chanel fw26 was the most anticipated collection of the season — and the numbers back it up.`,
    season: 'FW26',
    show: 'Chanel',
    image: null,
  },
  {
    id: '2',
    type: 'RUNWAY',
    stat: '38/52',
    label: 'Chanel looks featured tweed — highest in 6 seasons',
    body: `tweed is back and it never really left. blazy just made it feel like it belonged to a new generation.`,
    season: 'FW26',
    show: 'Chanel',
    image: null,
  },
  {
    id: '3',
    type: 'SEARCH',
    stat: '+245%',
    label: 'Dior bar jacket searches after Jonathan Anderson\'s debut',
    body: `jonathan anderson at dior is already rewriting what the house means. the bar jacket is having its moment.`,
    season: 'FW26',
    show: 'Dior',
    image: null,
  },
  {
    id: '4',
    type: 'SEARCH',
    stat: '5-year high',
    label: 'Prairie dress searches after Chloé FW26',
    body: `chemena kamali's chloé continues its cottagecore arc — and search data proves the customer is following.`,
    season: 'FW26',
    show: 'Chloé',
    image: null,
  },
  {
    id: '5',
    type: 'SEARCH',
    stat: '+200%',
    label: 'Leather bomber spike within 24hrs of Gucci Milan',
    body: `sabato de sarno is building a language for gucci that the internet understands. the bomber was the breakout piece.`,
    season: 'FW26',
    show: 'Gucci',
    image: null,
  },
  {
    id: '6',
    type: 'RUNWAY',
    stat: '41/56',
    label: 'Gucci looks showed loafer — dominant footwear signal',
    body: `when more than two-thirds of a show's looks share a single shoe, that's not a trend. that's a directive.`,
    season: 'FW26',
    show: 'Gucci',
    image: null,
  },
]

const TYPE_COLORS: Record<string, string> = {
  SEARCH: '#0C0B09',
  RUNWAY: '#5A5550',
  SOCIAL: '#A09A94',
}

export default function FYIClient({ fyis }: { fyis?: any[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeType, setActiveType] = useState('All')

  const data = fyis && fyis.length > 0 ? fyis : FALLBACK_FYIS
  const filtered = activeType === 'All' ? data : data.filter(f => f.type === activeType)

  return (
    <div style={{ fontFamily: 'var(--f-body, "Lora", Georgia, serif)', background: 'var(--white, #fff)', minHeight: '100vh', color: 'var(--ink, #0C0B09)' }}>

      {/* ── Ticker ── */}
      <div style={{ background: 'var(--ink, #0C0B09)', color: 'var(--cream, #F5F2ED)', fontSize: 11, fontFamily: 'var(--f-mono, "Geist Mono", monospace)', letterSpacing: '0.12em', padding: '7px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <span style={{ display: 'inline-block', animation: 'ticker 30s linear infinite' }}>
          {FALLBACK_FYIS.map(f => (
            <span key={f.id} style={{ marginRight: 64 }}>{f.stat} &nbsp; {f.label}</span>
          ))}
          {FALLBACK_FYIS.map(f => (
            <span key={f.id + '_dup'} style={{ marginRight: 64 }}>{f.stat} &nbsp; {f.label}</span>
          ))}
        </span>
        <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── Nav ── */}
      <nav style={{ borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, background: 'var(--white, #fff)', zIndex: 100 }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }} aria-label="Menu">
          <span style={{ display: 'block', width: 22, height: 1, background: 'var(--ink, #0C0B09)' }} />
          <span style={{ display: 'block', width: 22, height: 1, background: 'var(--ink, #0C0B09)' }} />
        </button>
        <Link href="/" style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 15, fontWeight: 500, letterSpacing: '0.04em', textDecoration: 'none', color: 'var(--ink, #0C0B09)', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          runway fyi
        </Link>
        <span style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--light, #A09A94)' }}>FW26</span>
      </nav>

      {/* ── Nav Drawer ── */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'var(--ink, #0C0B09)', color: 'var(--cream, #F5F2ED)', display: 'flex', flexDirection: 'column', padding: '32px 48px' }}>
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--cream, #F5F2ED)', fontSize: 24, cursor: 'pointer', alignSelf: 'flex-end', marginBottom: 48 }}>✕</button>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: 'var(--f-display, "Ranade", sans-serif)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, textDecoration: 'none', color: l.href === '/fyi' ? 'var(--light, #A09A94)' : 'var(--cream, #F5F2ED)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      {/* ── Nav Links Row ── */}
      <div style={{ borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))', padding: '0 48px', display: 'flex', gap: 0 }}>
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href}
            style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, letterSpacing: '0.14em', textDecoration: 'none', color: l.href === '/fyi' ? 'var(--light, #A09A94)' : 'var(--ink, #0C0B09)', textTransform: 'uppercase', padding: '14px 20px 14px 0', borderBottom: l.href === '/fyi' ? '1px solid var(--ink, #0C0B09)' : '1px solid transparent', marginBottom: -1 }}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* ── Page Header ── */}
      <div style={{ padding: '28px 48px 0' }}>
        <p style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light, #A09A94)', margin: '0 0 12px' }}>
          Season · FW26
        </p>
        <h1 style={{ fontFamily: 'var(--f-display, "Ranade", sans-serif)', fontSize: 'clamp(52px, 8vw, 96px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.9, margin: 0 }}>
          FYI
        </h1>
      </div>

      {/* ── Type Filter ── */}
      <div style={{ padding: '0 48px', borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))', display: 'flex', gap: 0, marginTop: 24 }}>
        {['All', 'SEARCH', 'RUNWAY', 'SOCIAL'].map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            style={{ background: 'none', border: 'none', borderBottom: activeType === t ? '1px solid var(--ink, #0C0B09)' : '1px solid transparent', marginBottom: -1, cursor: 'pointer', fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: activeType === t ? 'var(--ink, #0C0B09)' : 'var(--light, #A09A94)', padding: '14px 20px 14px 0' }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── FYI Takes Grid ── */}
      <div style={{ padding: '40px 48px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2 }}>
        {filtered.map(fyi => (
          <Link key={fyi.id} href={`/fyi/${fyi.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: 'var(--cream, #F5F2ED)', padding: '32px 28px', position: 'relative', minHeight: 280 }}>
            {/* Type tag */}
            <div style={{ display: 'inline-block', fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '4px 8px', background: TYPE_COLORS[fyi.type] || 'var(--ink, #0C0B09)', color: 'var(--white, #fff)', marginBottom: 24 }}>
              {fyi.type}
            </div>

            {/* Big stat */}
            <div style={{ fontFamily: 'var(--f-display, "Ranade", sans-serif)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.9, marginBottom: 12 }}>
              {fyi.stat}
            </div>

            {/* Label */}
            <p style={{ margin: '0 0 20px', fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--mid, #5A5550)', lineHeight: 1.5 }}>
              {fyi.label}
            </p>

            {/* Opinion body */}
            <p style={{ margin: 0, fontFamily: 'var(--f-body, "Lora", Georgia, serif)', fontSize: 14, fontStyle: 'italic', color: 'var(--mid, #5A5550)', lineHeight: 1.6 }}>
              {fyi.body}
            </p>

            {/* Show tag bottom right */}
            <div style={{ position: 'absolute', bottom: 20, right: 20, fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--light, #A09A94)' }}>
              {fyi.show} · {fyi.season}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--bd, rgba(12,11,9,0.1))', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, color: 'var(--light, #A09A94)', letterSpacing: '0.1em' }}>runway.fyi</span>
        <span style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, color: 'var(--light, #A09A94)', letterSpacing: '0.1em' }}>FW26 · @runwayfyi</span>
      </footer>
    </div>
  )
}
