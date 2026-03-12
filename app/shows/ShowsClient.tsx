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

export default function ShowsClient({ shows }: { shows: any[] }) {
  const [activeCity, setActiveCity] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)

  const data = shows?.length > 0 ? shows : FALLBACK_SHOWS
  const filtered = activeCity === 'All'
    ? data
    : data.filter(s => s.city?.toLowerCase() === activeCity.toLowerCase())

  return (
    <div style={{ fontFamily: 'var(--f-body, "Lora", Georgia, serif)', background: 'var(--white, #fff)', minHeight: '100vh', color: 'var(--ink, #0C0B09)' }}>

      {/* ── Ticker ── */}
      <div style={{ background: 'var(--ink, #0C0B09)', color: 'var(--cream, #F5F2ED)', fontSize: 11, fontFamily: 'var(--f-mono, "Geist Mono", monospace)', letterSpacing: '0.12em', padding: '7px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <span style={{ display: 'inline-block', animation: 'ticker 30s linear infinite' }}>
          {['Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26', 'Shearling Coat 94.1', 'Chanel FW26 91.2', 'Leather Bomber 88.7', 'Dior FW26 89.4'].map(t => (
            <span key={t} style={{ marginRight: 64 }}>+{Math.floor(Math.random() * 200 + 50)}% &nbsp; {t}</span>
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
              style={{ fontFamily: 'var(--f-display, "Ranade", sans-serif)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, textDecoration: 'none', color: l.href === '/shows' ? 'var(--light, #A09A94)' : 'var(--cream, #F5F2ED)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      {/* ── Nav Links Row ── */}
      <div style={{ borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))', padding: '0 48px', display: 'flex', gap: 40 }}>
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href}
            style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, letterSpacing: '0.14em', textDecoration: 'none', color: l.href === '/shows' ? 'var(--light, #A09A94)' : 'var(--ink, #0C0B09)', textTransform: 'uppercase', padding: '14px 0', borderBottom: l.href === '/shows' ? '1px solid var(--ink, #0C0B09)' : '1px solid transparent', marginBottom: -1 }}>
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
          FW26 Shows
        </h1>
      </div>

      {/* ── City Filter ── */}
      <div style={{ padding: '0 48px', borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))', display: 'flex', gap: 0, marginTop: 24 }}>
        {CITIES.map(city => (
          <button key={city} onClick={() => setActiveCity(city)}
            style={{ background: 'none', border: 'none', borderBottom: activeCity === city ? '1px solid var(--ink, #0C0B09)' : '1px solid transparent', marginBottom: -1, cursor: 'pointer', fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: activeCity === city ? 'var(--ink, #0C0B09)' : 'var(--light, #A09A94)', padding: '14px 20px 14px 0' }}>
            {city}
          </button>
        ))}
      </div>

      {/* ── Shows Grid ── */}
      <div style={{ padding: '40px 48px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
        {filtered.map(show => (
          <Link key={show._id} href={`/shows/${show.slug?.current || show._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', position: 'relative', overflow: 'hidden', background: 'var(--warm, #EDE9E2)', aspectRatio: '2/3' }}>
            {show.coverImage ? (
              <img src={show.coverImage} alt={show.designer} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--warm, #EDE9E2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 10, color: 'var(--light, #A09A94)', letterSpacing: '0.1em' }}>NO IMAGE</span>
              </div>
            )}
            {/* Score badge */}
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--ink, #0C0B09)', color: 'var(--white, #fff)', fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 12, fontWeight: 600, padding: '4px 8px', letterSpacing: '0.02em' }}>
              {show.showScore || show.runwayScore || '—'}
            </div>
            {/* City tag */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(12,11,9,0.8))', padding: '40px 16px 16px' }}>
              <p style={{ margin: 0, fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,242,237,0.7)', marginBottom: 4 }}>
                {show.city} · {show.season}
              </p>
              <p style={{ margin: 0, fontFamily: 'var(--f-display, "Ranade", sans-serif)', fontSize: 18, fontWeight: 700, color: 'var(--white, #fff)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                {show.designer}
              </p>
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
