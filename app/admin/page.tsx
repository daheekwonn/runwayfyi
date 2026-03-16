'use client'

import { useState, useEffect } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

interface Show {
  id: number
  brand: string
  city: string
  season: string
  total_looks: number
}

interface Cover {
  show_id: number
  brand: string
  cover_image: string
}

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([])
  const [covers, setCovers] = useState<Record<number, string>>({})
  const [editing, setEditing] = useState<number | null>(null)
  const [inputVal, setInputVal] = useState('')
  const [saving, setSaving] = useState<number | null>(null)
  const [saved, setSaved] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'missing' | 'broken'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      const [showsRes, coversRes] = await Promise.all([
        fetch(`${RAILWAY_API}/api/trends/shows`),
        fetch(`${RAILWAY_API}/api/trends/shows/covers`),
      ])
      const showsData: Show[] = await showsRes.json()
      const coversData: Cover[] = await coversRes.json()
      setShows(showsData)
      const coverMap: Record<number, string> = {}
      coversData.forEach((c) => { coverMap[c.show_id] = c.cover_image })
      setCovers(coverMap)
    }
    load()
  }, [])

  const isBroken = (url: string) =>
    !url || url.includes('VogueError') || url.includes('format=original') || url.includes('.gif')

  const filteredShows = shows.filter((s) => {
    const matchesSearch = s.brand.toLowerCase().includes(search.toLowerCase())
    const cover = covers[s.id]
    if (filter === 'missing') return matchesSearch && !cover
    if (filter === 'broken') return matchesSearch && cover && isBroken(cover)
    return matchesSearch
  })

  const handleSave = async (showId: number) => {
    if (!inputVal.trim()) return
    setSaving(showId)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${showId}/cover-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: inputVal.trim() }),
      })
      if (res.ok) {
        setCovers((prev) => ({ ...prev, [showId]: inputVal.trim() }))
        setSaved(showId)
        setEditing(null)
        setInputVal('')
        setTimeout(() => setSaved(null), 2000)
      }
    } finally {
      setSaving(null)
    }
  }

  const missingCount = shows.filter((s) => !covers[s.id]).length
  const brokenCount = shows.filter((s) => covers[s.id] && isBroken(covers[s.id])).length

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #0C0B09; --cream: #F5F2ED; --warm: #EDE9E2;
          --mid: #5A5550; --light: #A09A94; --bd: rgba(12,11,9,0.1);
          --green: #1a7a4a; --red: #c0392b;
          --f-mono: 'Geist Mono', monospace;
          --f-display: 'Ranade', sans-serif;
        }
        body { background: var(--cream); color: var(--ink); -webkit-font-smoothing: antialiased; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

        {/* Header */}
        <div style={{
          background: 'var(--ink)', color: '#fff',
          padding: '24px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 6 }}>
              runway.fyi · admin
            </p>
            <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Show Cover Images
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 24, fontFamily: 'var(--f-mono)', fontSize: 11 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--f-display)' }}>{shows.length}</div>
              <div style={{ opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--f-display)', color: '#f59e0b' }}>{missingCount}</div>
              <div style={{ opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Missing</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--f-display)', color: '#ef4444' }}>{brokenCount}</div>
              <div style={{ opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Broken</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{
          padding: '16px 48px',
          borderBottom: '1px solid var(--bd)',
          display: 'flex', gap: 12, alignItems: 'center',
          background: '#fff',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shows..."
            style={{
              fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.06em',
              padding: '8px 14px', border: '1px solid var(--bd)',
              background: 'var(--cream)', color: 'var(--ink)',
              outline: 'none', width: 220,
            }}
          />
          {(['all', 'missing', 'broken'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '8px 16px',
                background: filter === f ? 'var(--ink)' : 'none',
                color: filter === f ? '#fff' : 'var(--light)',
                border: '1px solid var(--bd)', cursor: 'pointer',
              }}
            >
              {f} {f === 'missing' ? `(${missingCount})` : f === 'broken' ? `(${brokenCount})` : `(${shows.length})`}
            </button>
          ))}
          <a
            href="/shows"
            style={{
              marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--light)', textDecoration: 'none',
            }}
          >
            ← Back to Shows
          </a>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 1, padding: 1,
          background: 'var(--bd)',
        }}>
          {filteredShows.map((show) => {
            const cover = covers[show.id]
            const broken = cover && isBroken(cover)
            const missing = !cover
            const isEditing = editing === show.id
            const isSaved = saved === show.id
            const isSaving = saving === show.id

            return (
              <div key={show.id} style={{ background: 'var(--cream)', position: 'relative' }}>

                {/* Status badge */}
                {(broken || missing) && (
                  <div style={{
                    position: 'absolute', top: 10, left: 10, zIndex: 10,
                    background: missing ? '#f59e0b' : '#ef4444',
                    color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 8,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '3px 7px',
                  }}>
                    {missing ? 'No image' : 'Broken'}
                  </div>
                )}

                {isSaved && (
                  <div style={{
                    position: 'absolute', top: 10, left: 10, zIndex: 10,
                    background: '#1a7a4a', color: '#fff',
                    fontFamily: 'var(--f-mono)', fontSize: 8,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '3px 7px',
                  }}>
                    ✓ Saved
                  </div>
                )}

                {/* Image */}
                <div style={{
                  width: '100%', paddingBottom: '130%',
                  position: 'relative', background: 'var(--warm)', overflow: 'hidden',
                }}>
                  {cover && !broken ? (
                    <img
                      src={cover}
                      referrerPolicy="no-referrer"
                      alt={show.brand}
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'top center',
                      }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                      {broken && cover && (
                        <img
                          src={cover}
                          referrerPolicy="no-referrer"
                          alt=""
                          style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover', opacity: 0.3,
                          }}
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      )}
                      <span style={{
                        fontFamily: 'var(--f-mono)', fontSize: 9,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: 'var(--light)', position: 'relative', zIndex: 1,
                      }}>
                        {missing ? 'No cover image' : 'Broken image'}
                      </span>
                    </div>
                  )}

                  {/* Vogue link overlay */}
                  <a
                    href={`https://www.vogue.com/fashion-shows/fall-2026-ready-to-wear/${show.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      position: 'absolute', bottom: 8, right: 8,
                      background: 'rgba(12,11,9,0.75)', color: '#fff',
                      fontFamily: 'var(--f-mono)', fontSize: 8,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '4px 8px', textDecoration: 'none',
                    }}
                  >
                    Vogue ↗
                  </a>
                </div>

                {/* Info */}
                <div style={{ padding: '12px 16px 16px' }}>
                  <p style={{
                    fontFamily: 'var(--f-mono)', fontSize: 8,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'var(--light)', margin: '0 0 4px',
                  }}>
                    {show.city} · {show.season} · ID {show.id}
                  </p>
                  <p style={{
                    fontFamily: 'var(--f-display)', fontSize: 18,
                    fontWeight: 700, letterSpacing: '-0.02em',
                    color: 'var(--ink)', margin: '0 0 12px',
                  }}>
                    {show.brand}
                  </p>

                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave(show.id)}
                        placeholder="Paste Vogue image URL..."
                        autoFocus
                        style={{
                          fontFamily: 'var(--f-mono)', fontSize: 9,
                          padding: '8px 10px', border: '1px solid var(--ink)',
                          background: '#fff', color: 'var(--ink)',
                          outline: 'none', width: '100%',
                        }}
                      />
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleSave(show.id)}
                          disabled={!!isSaving}
                          style={{
                            flex: 1, padding: '8px',
                            background: 'var(--ink)', color: '#fff',
                            border: 'none', cursor: 'pointer',
                            fontFamily: 'var(--f-mono)', fontSize: 9,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                          }}
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => { setEditing(null); setInputVal('') }}
                          style={{
                            padding: '8px 12px', background: 'none',
                            border: '1px solid var(--bd)', cursor: 'pointer',
                            fontFamily: 'var(--f-mono)', fontSize: 9,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--light)',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditing(show.id)
                        setInputVal(cover && !broken ? cover : '')
                      }}
                      style={{
                        width: '100%', padding: '8px',
                        background: broken || missing ? 'var(--ink)' : 'none',
                        color: broken || missing ? '#fff' : 'var(--light)',
                        border: broken || missing ? 'none' : '1px solid var(--bd)',
                        cursor: 'pointer', fontFamily: 'var(--f-mono)',
                        fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                      }}
                    >
                      {broken || missing ? 'Fix Cover Image' : 'Edit Cover Image'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredShows.length === 0 && (
          <div style={{
            padding: '80px 48px', textAlign: 'center',
            fontFamily: 'var(--f-mono)', fontSize: 11,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)',
          }}>
            No shows found
          </div>
        )}
      </div>
    </>
  )
}
