'use client'

import { useState, useEffect } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Show {
  id: number
  brand: string
  slug: string
  season: string
  city: string
  show_score?: number
  runway_score?: number
  search_score?: number
  social_score?: number
  notes?: string
  coverImage?: string // fetched from first look
}

// ─── Static fallback (used if API is empty) ───────────────────────────────────

const FALLBACK_SHOWS: Show[] = [
  { id: 1, brand: 'Chanel', slug: 'chanel-fw26', season: 'FW26', city: 'Paris', show_score: 91.2 },
  { id: 2, brand: 'Dior', slug: 'dior-fw26', season: 'FW26', city: 'Paris', show_score: 88.7 },
  { id: 3, brand: 'Gucci', slug: 'gucci-fw26', season: 'FW26', city: 'Milan', show_score: 84.1 },
  { id: 4, brand: 'Prada', slug: 'prada-fw26', season: 'FW26', city: 'Milan', show_score: 82.6 },
  { id: 5, brand: 'Miu Miu', slug: 'miu-miu-fw26', season: 'FW26', city: 'Paris', show_score: 85.1 },
  { id: 6, brand: 'Chloe', slug: 'chloe-fw26', season: 'FW26', city: 'Paris', show_score: 79.4 },
]

const CITIES = ['All', 'Paris', 'Milan', 'London', 'New York', 'Copenhagen']

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShowsClient({ shows: initialShows }: { shows: Show[] }) {
  const [activeCity, setActiveCity] = useState('All')
  const [shows, setShows] = useState<Show[]>(
    initialShows.length > 0 ? initialShows : FALLBACK_SHOWS
  )

  // Fetch first look image for each show that doesn't have a coverImage yet
  useEffect(() => {
    const fetchCoverImages = async () => {
      const updated = await Promise.all(
        shows.map(async (show) => {
          if (show.coverImage) return show
          try {
            const res = await fetch(`${RAILWAY_API}/api/trends/shows/${show.id}/looks`)
            if (!res.ok) return show
            const looks = await res.json()
            // Use the first look's image_url as the cover
            const firstImage = looks?.[0]?.image_url || null
            return { ...show, coverImage: firstImage }
          } catch {
            return show
          }
        })
      )
      setShows(updated)
    }

    fetchCoverImages()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
                borderBottom: activeCity === city ? '2px solid var(--ink, #0C0B09)' : '2px solid transparent',
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
            href={`/shows/${show.slug}`}
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
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
    }}>
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
          // Placeholder while image loads
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
            Loading...
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
        </p>
        <h2 style={{
          fontFamily: 'var(--f-display, "Ranade", sans-serif)',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--ink, #0C0B09)',
          margin: '0 0 12px',
        }}>
          {show.brand}
        </h2>

        {/* Score bar */}
        {score > 0 && (
          <div>
            <div style={{
              height: 2,
              background: 'var(--bd, rgba(12,11,9,0.1))',
              borderRadius: 1,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${score}%`,
                background: 'var(--ink, #0C0B09)',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
