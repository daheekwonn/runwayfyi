'use client'

import { useState, useEffect } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Show {
  id: number
  brand: string
  city: string
  season: string
  total_looks?: number
  show_score?: number
  coverImage?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Generate slug from brand name — matches the backend's by-slug endpoint logic
function brandToSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')   // replace non-alphanumeric with hyphen
    .replace(/^-|-$/g, '')          // trim leading/trailing hyphens
}

const CITIES = ['All', 'Paris', 'Milan', 'London', 'New York', 'Copenhagen']

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShowsClient({ shows: initialShows }: { shows: Show[] }) {
  const [activeCity, setActiveCity] = useState('All')
  const [shows, setShows] = useState<Show[]>(initialShows)

  // Fetch first look image for each show as cover
  useEffect(() => {
    if (initialShows.length === 0) return

    const fetchCoverImages = async () => {
      const updated = await Promise.all(
        initialShows.map(async (show) => {
          try {
            const res = await fetch(`${RAILWAY_API}/api/trends/shows/${show.id}/looks`)
            if (!res.ok) return show
            const looks = await res.json()
            const firstImage = Array.isArray(looks) && looks[0]?.image_url
              ? looks[0].image_url
              : null
            return { ...show, coverImage: firstImage }
          } catch {
            return show
          }
        })
      )
      setShows(updated)
    }

    fetchCoverImages()
  }, [initialShows.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered =
    activeCity === 'All' ? shows : shows.filter((s) => s.city === activeCity)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream, #F5F2ED)' }}>

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
                color: activeCity === city
                  ? 'var(--ink, #0C0B09)'
                  : 'var(--light, #A09A94)',
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

// ─── Show Card ────────────────────────────────────────────────────────────────

function ShowCard({ show }: { show: Show }) {
  const score = show.show_score ?? 0

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Cover image */}
      <div style={{
        height: 360,
        background: 'var(--warm, #EDE9E2)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {show.coverImage ? (
          <img
            src={show.coverImage}
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

        {/* Score badge */}
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

      {/* Card info */}
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
