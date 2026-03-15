'use client'

import { useState, useEffect } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LookData {
  id: number
  look_number: number
  image_url: string
  materials?: string[]
  color_names?: string[]
  silhouettes?: string[]
}

interface ShowData {
  id: number
  brand: string
  designer?: string
  slug: string
  season: string
  city: string
  show_score?: number
  runway_score?: number
  search_score?: number
  social_score?: number
  notes?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShowPageClient({
  show,
  looks: initialLooks,
}: {
  show: ShowData
  looks: LookData[]
}) {
  const [looks, setLooks] = useState<LookData[]>(initialLooks)
  const [loading, setLoading] = useState(initialLooks.length === 0)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  // If no looks passed from server component, fetch client-side
  useEffect(() => {
    if (initialLooks.length > 0) return
    const fetchLooks = async () => {
      try {
        const res = await fetch(`${RAILWAY_API}/api/trends/shows/${show.id}/looks`)
        if (res.ok) {
          const data = await res.json()
          setLooks(data)
        }
      } catch (e) {
        console.error('Failed to fetch looks', e)
      } finally {
        setLoading(false)
      }
    }
    fetchLooks()
  }, [show.id, initialLooks.length])

  const score = show.show_score ?? 0
  const runwayScore = show.runway_score ?? 0
  const searchScore = show.search_score ?? 0
  const socialScore = show.social_score ?? 0

  // Collect all unique material tags for filter
  const allMaterials = Array.from(
    new Set(looks.flatMap((l) => l.materials ?? []))
  ).slice(0, 6)

  const filteredLooks = activeFilter
    ? looks.filter((l) => l.materials?.includes(activeFilter))
    : looks

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream, #F5F2ED)' }}>

      {/* ── Header / Hero ── */}
      <div style={{ padding: '28px 48px 0' }}>
        {/* Breadcrumb */}
        <p style={{
          fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--light, #A09A94)',
          margin: '0 0 16px',
        }}>
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
          {' / '}
          <a href="/shows" style={{ color: 'inherit', textDecoration: 'none' }}>Shows</a>
          {' / '}
          <span style={{ color: 'var(--ink, #0C0B09)' }}>{show.brand}</span>
        </p>

        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{
              fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
              fontSize: 9,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--light, #A09A94)',
              margin: '0 0 8px',
            }}>
              {show.city} · {show.season}
            </p>
            <h1 style={{
              fontFamily: 'var(--f-display, "Ranade", sans-serif)',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              color: 'var(--ink, #0C0B09)',
              margin: '0 0 24px',
            }}>
              {show.brand}
            </h1>

            {show.notes && (
              <p style={{
                fontFamily: 'var(--f-body, "Lora", serif)',
                fontSize: 16,
                lineHeight: 1.6,
                color: 'var(--mid, #5A5550)',
                maxWidth: 520,
                margin: '0 0 24px',
              }}>
                {show.notes}
              </p>
            )}
          </div>

          {/* Score breakdown sidebar */}
          {score > 0 && (
            <div style={{
              flex: '0 0 240px',
              background: 'var(--ink, #0C0B09)',
              color: '#fff',
              padding: '24px',
            }}>
              <p style={{
                fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
                fontSize: 9,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                opacity: 0.5,
                margin: '0 0 8px',
              }}>
                Trend Score
              </p>
              <p style={{
                fontFamily: 'var(--f-display, "Ranade", sans-serif)',
                fontSize: 48,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                margin: '0 0 20px',
              }}>
                {score.toFixed(1)}
              </p>

              {[
                { label: 'Runway 50%', value: runwayScore },
                { label: 'Search 30%', value: searchScore },
                { label: 'Social 20%', value: socialScore },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>{label}</span>
                    <span style={{ fontFamily: 'var(--f-mono, "Geist Mono", monospace)', fontSize: 10 }}>{value.toFixed(1)}</span>
                  </div>
                  <div style={{ height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 1 }}>
                    <div style={{ height: '100%', width: `${value}%`, background: '#fff', borderRadius: 1 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Looks Grid ── */}
      <div style={{ padding: '48px 48px 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--bd, rgba(12,11,9,0.1))',
          paddingBottom: 16,
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
              fontSize: 9,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--light, #A09A94)',
              margin: '0 0 4px',
            }}>
              {looks.length} Looks
            </p>
            <h2 style={{
              fontFamily: 'var(--f-display, "Ranade", sans-serif)',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--ink, #0C0B09)',
              margin: 0,
            }}>
              The Collection
            </h2>
          </div>

          {/* Material filter tags */}
          {allMaterials.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveFilter(null)}
                style={{
                  padding: '6px 12px',
                  background: activeFilter === null ? 'var(--ink, #0C0B09)' : 'none',
                  color: activeFilter === null ? '#fff' : 'var(--mid, #5A5550)',
                  border: '1px solid var(--bd, rgba(12,11,9,0.15))',
                  fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                All
              </button>
              {allMaterials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setActiveFilter(mat === activeFilter ? null : mat)}
                  style={{
                    padding: '6px 12px',
                    background: activeFilter === mat ? 'var(--ink, #0C0B09)' : 'none',
                    color: activeFilter === mat ? '#fff' : 'var(--mid, #5A5550)',
                    border: '1px solid var(--bd, rgba(12,11,9,0.15))',
                    fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {mat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{
            padding: '80px 0',
            textAlign: 'center',
            fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--light, #A09A94)',
          }}>
            Loading looks...
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 1,
            background: 'var(--bd, rgba(12,11,9,0.1))',
            marginBottom: 1,
          }}>
            {filteredLooks.map((look) => (
              <LookCard key={look.id} look={look} brand={show.brand} />
            ))}
          </div>
        )}

        {!loading && filteredLooks.length === 0 && (
          <div style={{
            padding: '60px 0',
            textAlign: 'center',
            fontFamily: 'var(--f-body, "Lora", serif)',
            color: 'var(--light, #A09A94)',
          }}>
            No looks found{activeFilter ? ` for "${activeFilter}"` : ''}.
          </div>
        )}
      </div>

      {/* bottom padding */}
      <div style={{ height: 80 }} />
    </div>
  )
}

// ─── Look Card ────────────────────────────────────────────────────────────────

function LookCard({ look, brand }: { look: LookData; brand: string }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div style={{
      background: 'var(--cream, #F5F2ED)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Image container — portrait ratio matching runway photos */}
      <div style={{
        width: '100%',
        paddingBottom: '150%', // 2:3 portrait
        position: 'relative',
        background: 'var(--warm, #EDE9E2)',
        overflow: 'hidden',
      }}>
        {look.image_url && !imgError ? (
          <img
            src={look.image_url}
            alt={`${brand} Look ${look.look_number}`}
            onError={() => setImgError(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
            fontSize: 9,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--light, #A09A94)',
          }}>
            Look {look.look_number}
          </div>
        )}

        {/* Look number badge */}
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          background: 'rgba(12,11,9,0.7)',
          color: '#fff',
          fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
          fontSize: 9,
          letterSpacing: '0.08em',
          padding: '3px 6px',
        }}>
          {String(look.look_number).padStart(2, '0')}
        </div>
      </div>

      {/* Tags (materials) */}
      {look.materials && look.materials.length > 0 && (
        <div style={{
          padding: '8px 10px',
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
        }}>
          {look.materials.slice(0, 2).map((mat) => (
            <span key={mat} style={{
              fontFamily: 'var(--f-mono, "Geist Mono", monospace)',
              fontSize: 8,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--light, #A09A94)',
              background: 'var(--warm, #EDE9E2)',
              padding: '2px 5px',
            }}>
              {mat}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
