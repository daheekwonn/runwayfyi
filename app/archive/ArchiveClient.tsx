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

const SEASONS = [
  {
    season: 'FW26',
    year: '2026',
    pantone: 'Mocha Mousse',
    pantoneCode: '17-1230',
    hex: '#A07050',
    status: 'current',
    highlights: ['Leather Outerwear', 'Prairie Dress', 'Shearling Coat', 'Ballet Flat'],
    topShow: 'Chanel FW26',
    score: 91.2,
    slug: 'fw26',
  },
  {
    season: 'FW25',
    year: '2025',
    pantone: 'Mocha Mousse',
    pantoneCode: '17-1230',
    hex: '#A07050',
    status: 'archive',
    highlights: ['Quiet Luxury', 'Boho Revival', 'Sheer Layers', 'Platform Boots'],
    topShow: 'Bottega Veneta FW25',
    score: 88.4,
    slug: 'fw25',
  },
  {
    season: 'FW24',
    year: '2024',
    pantone: 'Peach Fuzz',
    pantoneCode: '13-1023',
    hex: '#FFBE98',
    status: 'archive',
    highlights: ['Quiet Luxury', 'Ballet Core', 'Stealth Wealth', 'Loafer'],
    topShow: 'The Row FW24',
    score: 85.1,
    slug: 'fw24',
  },
  {
    season: 'FW23',
    year: '2023',
    pantone: 'Viva Magenta',
    pantoneCode: '18-1750',
    hex: '#BB2649',
    status: 'archive',
    highlights: ['Barbiecore', 'Maximalism', 'Feather Trim', 'Micro Bag'],
    topShow: 'Valentino FW23',
    score: 86.7,
    slug: 'fw23',
  },
  {
    season: 'FW22',
    year: '2022',
    pantone: 'Very Peri',
    pantoneCode: '17-3938',
    hex: '#6667AB',
    status: 'archive',
    highlights: ['Cottagecore', 'Y2K Revival', 'Oversized Blazer', 'Chunky Sneaker'],
    topShow: 'Balenciaga FW22',
    score: 83.9,
    slug: 'fw22',
  },
]

export default function ArchivePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: 'var(--f-body, "Lora", Georgia, serif)', background: 'var(--white, #fff)', minHeight: '100vh', color: 'var(--ink, #0C0B09)' }}>

      {/* ── Ticker ── */}
      <div style={{ background: 'var(--ink, #0C0B09)', color: 'var(--cream, #F5F2ED)', fontSize: 11, fontFamily: 'var(--f-mono, "Geist Mono", monospace)', letterSpacing: '0.12em', padding: '7px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <span style={{ display: 'inline-block', animation: 'ticker 30s linear infinite' }}>
          {['FW26 Now Live', 'FW25 · Mocha Mousse', 'FW24 · Peach Fuzz', 'FW23 · Viva Magenta', 'FW22 · Very Peri', 'Season Archive · runway.fyi'].map(t => (
            <span key={t} style={{ marginRight: 64 }}>{t}</span>
          ))}
          {['FW26 Now Live', 'FW25 · Mocha Mousse', 'FW24 · Peach Fuzz', 'FW23 · Viva Magenta', 'FW22 · Very Peri', 'Season Archive · runway.fyi'].map(t => (
            <span key={t + '_dup'} style={{ marginRight: 64 }}>{t}</span>
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
              style={{ fontFamily: 'var(--f-display, "Ranade", sans-serif)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, textDecoration: 'none', color: l.href === '/archive' ? 'var(--light, #A09A94)' : 'var(--cream, #F5F2ED)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      {/* ── Nav Links Row ── */}
      <div style={{ borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))', padding: '0 48px', display: 'flex', gap: 0 }}>
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href}
            style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, letterSpacing: '0.14em', textDecoration: 'none', color: l.href === '/archive' ? 'var(--light, #A09A94)' : 'var(--ink, #0C0B09)', textTransform: 'uppercase', padding: '14px 20px 14px 0', borderBottom: l.href === '/archive' ? '1px solid var(--ink, #0C0B09)' : '1px solid transparent', marginBottom: -1 }}>
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
          Archive
        </h1>
      </div>

      {/* ── Season Cards ── */}
      <div style={{ padding: '48px 48px 80px' }}>
        {SEASONS.map((s, i) => (
          <Link key={s.slug} href={`/analysis?season=${s.slug}`}
            style={{ textDecoration: 'none', color: 'inherit', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: 48, padding: '40px 0', borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))', cursor: 'pointer' }}
            className="archive-row">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                {/* Pantone swatch */}
                <div style={{ width: 48, height: 64, background: s.hex, flexShrink: 0, position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.9)', padding: '3px 4px' }}>
                    <p style={{ margin: 0, fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 7, letterSpacing: '0.1em', color: '#333', lineHeight: 1.3 }}>
                      {s.pantoneCode}<br />PANTONE®
                    </p>
                  </div>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light, #A09A94)' }}>
                    {s.status === 'current' ? '● CURRENT SEASON' : `${s.season} · ${s.year}`}
                  </p>
                  <h2 style={{ margin: 0, fontFamily: 'var(--f-display, "Ranade", sans-serif)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 0.95 }}>
                    {s.season}
                  </h2>
                  <p style={{ margin: '6px 0 0', fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 11, color: 'var(--mid, #5A5550)', letterSpacing: '0.06em' }}>
                    Color of the Year: {s.pantone}
                  </p>
                </div>
              </div>

              {/* Trend highlights */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {s.highlights.map(h => (
                  <span key={h} style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', border: '1px solid var(--bd, rgba(12,11,9,0.15))', color: 'var(--mid, #5A5550)' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: score + show */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {s.score}
              </div>
              <p style={{ margin: '4px 0 0', fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light, #A09A94)' }}>
                top score
              </p>
              <p style={{ margin: '12px 0 0', fontFamily: 'var(--f-body, "Lora", Georgia, serif)', fontSize: 12, fontStyle: 'italic', color: 'var(--mid, #5A5550)' }}>
                {s.topShow}
              </p>
              <p style={{ margin: '8px 0 0', fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink, #0C0B09)' }}>
                View season →
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
