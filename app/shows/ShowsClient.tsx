'use client'

import { useState, useEffect } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

function proxyImage(url: string): string {
  return `${RAILWAY_API}/api/trends/image-proxy?url=${encodeURIComponent(url)}`
}

interface Show {
  id: number
  brand: string
  city: string
  season: string
  total_looks?: number
  show_score?: number
  coverImage?: string
}

function brandToSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const CITIES = ['All', 'Paris', 'Milan', 'London', 'New York', 'Copenhagen']

const NAV_LINKS = [
  { label: 'Trends', href: '/trends' },
  { label: 'Analysis', href: '/analysis' },
  { label: 'FYI', href: '/fyi' },
  { label: 'Shows', href: '/shows' },
  { label: 'Archive', href: '/archive' },
]

export default function ShowsClient({ shows: initialShows }: { shows: Show[] }) {
  const [activeCity, setActiveCity] = useState('All')
  const [shows, setShows] = useState<Show[]>(initialShows)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (initialShows.length === 0) return

    const fetchCoverImages = async () => {
    for (const show of initialShows) {
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${show.id}/looks`)
      if (!res.ok) continue
      const looks = await res.json()
      if (!Array.isArray(looks) || looks.length === 0) continue
      const candidates = [looks[2], looks[1], looks[0]].filter(Boolean)
      const firstImage = candidates.find((l) => l?.image_url)?.image_url ?? null
      if (firstImage) {
        setShows((prev) =>
          prev.map((s) => (s.id === show.id ? { ...s, coverImage: firstImage } : s))
        )
      }
    } catch {
      continue
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

    fetchCoverImages()
  }, [initialShows.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered =
    activeCity === 'All' ? shows : shows.filter((s) => s.city === activeCity)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream, #F5F2ED)', color: 'var(--ink, #0C0B09)' }}>

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        height: 56,
        borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))',
        position: 'sticky',
        top: 0,
        background: 'var(--cream, #F5F2ED)',
        zIndex: 100,
      }}>
        <a href="/" style={{
          fontFamily: 'var(--f-display, "Ranade", sans-serif)',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--ink, #0C0B09)',
          textDecoration: 'none',
        }}>
          runway.fyi
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} style={{
              fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: href === '/shows' ? 'var(--light, #A09A94)' : 'var(--ink, #0C0B09)',
              textDecoration: 'none',
            }}>
              {label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: 'var(--ink, #0C0B09)',
          }}
          aria-label="Menu"
        >
          ☰
        </button>
      </nav>

      {/* ── Header ── */}
      <div style={{ padding: '28px 48px 0', borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))' }}>
        <p style={{
          fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--light, #A09A94)',
          marginBottom: 12,
        }}>
          Season · FW26
        </p>
        <h1 style={{
          fontFamily: 'var(--f-display, "Ranade", sans-serif)',
          fontSize: 'clamp(52px, 8vw, 96px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 0.9,
          color: 'var(--ink, #0C0B09)',
          margin: '0 0 24px',
        }}>
          Shows
        </h1>

        {/* City filter */}
        <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--bd, rgba(12,11,9,0.1))' }}>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              style={{
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeCity === city
                  ? '2px solid var(--ink, #0C0B09)'
                  : '2px solid transparent',
                fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeCity === city ? 'var(--ink, #0C0B09)' : 'var(--light, #A09A94)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* ── Show Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 1,
        padding: 1,
        background: 'var(--bd, rgba(12,11,9,0.1))',
      }}>
        {filtered.map((show) => (
          <a
            key={show.id}
            href={`/shows/${brandToSlug(show.brand)}`}
            style={{ textDecoration: 'none', display: 'block', background: 'var(--cream, #F5F2ED)' }}
          >
            <ShowCard show={show} />
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          padding: '80px 48px',
          textAlign: 'center',
          fontFamily: 'var(--f-body, "Lora", serif)',
          color: 'var(--light, #A09A94)',
        }}>
          No shows found for {activeCity}.
        </div>
      )}
    </div>
  )
}

function ShowCard({ show }: { show: Show }) {
  const score = show.show_score ?? 0

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        height: 360,
        background: 'var(--warm, #EDE9E2)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {show.coverImage ? (
          <img
            src={show.coverImage}
            referrerPolicy="no-referrer"
            alt={`${show.brand} FW26`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--light, #A09A94)',
          }}>
            {show.total_looks ? `${show.total_looks} looks` : '—'}
          </div>
        )}

        {score > 0 && (
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'var(--ink, #0C0B09)',
            color: '#fff',
            fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
            fontSize: 10,
            letterSpacing: '0.08em',
            padding: '4px 8px',
          }}>
            {score.toFixed(1)}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 20px 20px' }}>
        <p style={{
          fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--light, #A09A94)',
          margin: '0 0 6px',
        }}>
          {show.city} · {show.season}
          {show.total_looks ? ` · ${show.total_looks} looks` : ''}
        </p>
        <h2 style={{
          fontFamily: 'var(--f-display, "Ranade", sans-serif)',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--ink, #0C0B09)',
          margin: 0,
        }}>
          {show.brand}
        </h2>
      </div>
    </div>
  )
}
