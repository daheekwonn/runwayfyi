'use client'

import { useState, useEffect } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

interface ShowItem {
  id: number
  brand: string
  city: string
  season: string
  total_looks: number
}

interface CoverItem {
  show_id: number
  brand: string
  cover_image: string
}

function isBrokenUrl(url: string) {
  return !url || url.includes('VogueError') || url.includes('format=original') || url.includes('.gif')
}

function brandToVogueSlug(brand: string) {
  return brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function RunwayFYIAdminCovers() {
  const [shows, setShows] = useState<ShowItem[]>([])
  const [covers, setCovers] = useState<Record<number, string>>({})
  const [editing, setEditing] = useState<number | null>(null)
  const [inputVal, setInputVal] = useState('')
  const [saving, setSaving] = useState<number | null>(null)
  const [saved, setSaved] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'missing' | 'broken'>('all')
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [showsRes, coversRes] = await Promise.all([
          fetch(`${RAILWAY_API}/api/trends/shows`),
          fetch(`${RAILWAY_API}/api/trends/shows/covers`),
        ])
        const showsData: ShowItem[] = await showsRes.json()
        const coversData: CoverItem[] = await coversRes.json()
        setShows(showsData)
        const map: Record<number, string> = {}
        coversData.forEach((c) => { map[c.show_id] = c.cover_image })
        setCovers(map)
      } finally {
        setLoaded(true)
      }
    }
    load()
  }, [])

  const missingCount = shows.filter((s) => !covers[s.id]).length
  const brokenCount = shows.filter((s) => covers[s.id] && isBrokenUrl(covers[s.id])).length

  const filtered = shows.filter((s) => {
    const matchSearch = s.brand.toLowerCase().includes(search.toLowerCase())
    const cover = covers[s.id]
    if (filter === 'missing') return matchSearch && !cover
    if (filter === 'broken') return matchSearch && cover && isBrokenUrl(cover)
    return matchSearch
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
        setTimeout(() => setSaved(null), 2500)
      }
    } finally {
      setSaving(null)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@700,400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #0C0B09; --cream: #F5F2ED; --warm: #EDE9E2;
          --mid: #5A5550; --light: #A09A94; --bd: rgba(12,11,9,0.1);
          --f-mono: 'Geist Mono', monospace; --f-display: 'Ranade', sans-serif;
        }
        body { background: var(--cream); color: var(--ink); -webkit-font-smoothing: antialiased; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

        {/* Header */}
        <div style={{ background: 'var(--ink)', color: '#fff', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 6 }}>
              runwayfyi.com · admin
            </p>
            <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Cover Image Manager
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { label: 'Total', val: shows.length, color: '#fff' },
              { label: 'Missing', val: missingCount, color: '#f59e0b' },
              { label: 'Broken', val: brokenCount, color: '#ef4444' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 700, color }}>{val}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ padding: '14px 48px', borderBottom: '1px solid var(--bd)', display: 'flex', gap: 10, alignItems: 'center', background: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shows..."
            style={{ fontFamily: 'var(--f-mono)', fontSize: 11, padding: '7px 12px', border: '1px solid var(--bd)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none', width: 200 }}
          />
          {(['all', 'missing', 'broken'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '7px 14px', background: filter === f ? 'var(--ink)' : 'none',
              color: filter === f ? '#fff' : 'var(--light)', border: '1px solid var(--bd)', cursor: 'pointer',
            }}>
              {f} ({f === 'missing' ? missingCount : f === 'broken' ? brokenCount : shows.length})
            </button>
          ))}
          <a href="/shows" style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', textDecoration: 'none' }}>
            ← Shows
          </a>
        </div>

        {/* Loading */}
        {!loaded && (
          <div style={{ padding: '80px 48px', textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)' }}>
            Loading shows...
          </div>
        )}

        {/* Grid */}
        {loaded && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, padding: 1, background: 'var(--bd)' }}>
            {filtered.map((show) => {
              const cover = covers[show.id]
              const broken = cover ? isBrokenUrl(cover) : false
              const missing = !cover
              const isEditing = editing === show.id
              const isSaved = saved === show.id
              const isSaving = saving === show.id
              const needsFix = broken || missing

              return (
                <div key={show.id} style={{ background: 'var(--cream)', position: 'relative' }}>

                  {/* Badge */}
                  <div style={{
                    position: 'absolute', top: 8, left: 8, zIndex: 10,
                    background: isSaved ? '#1a7a4a' : missing ? '#f59e0b' : broken ? '#ef4444' : 'transparent',
                    color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 8,
                    letterSpacing: '0.1em', textTransform: 'uppercase', padding: needsFix || isSaved ? '3px 6px' : 0,
                  }}>
                    {isSaved ? '✓ saved' : missing ? 'no image' : broken ? 'broken' : ''}
                  </div>

                  {/* Image */}
                  <div style={{ width: '100%', paddingBottom: '130%', position: 'relative', background: 'var(--warm)', overflow: 'hidden' }}>
                    {cover && !broken ? (
                      <img
                        src={cover}
                        referrerPolicy="no-referrer"
                        alt={show.brand}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)' }}>
                          {missing ? 'no image' : 'broken'}
                        </span>
                      </div>
                    )}

                    {/* Vogue link */}
                    <a
                      href={`https://www.vogue.com/fashion-shows/fall-2026-ready-to-wear/${brandToVogueSlug(show.brand)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(12,11,9,0.75)', color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 7px', textDecoration: 'none' }}
                    >
                      Vogue ↗
                    </a>
                  </div>

                  {/* Info + edit */}
                  <div style={{ padding: '10px 14px 14px' }}>
                    <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--light)', margin: '0 0 3px' }}>
                      {show.city} · ID {show.id}
                    </p>
                    <p style={{ fontFamily: 'var(--f-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
                      {show.brand}
                    </p>

                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <input
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSave(show.id)}
                          placeholder="Paste Vogue image URL..."
                          autoFocus
                          style={{ fontFamily: 'var(--f-mono)', fontSize: 9, padding: '7px 9px', border: '1px solid var(--ink)', background: '#fff', color: 'var(--ink)', outline: 'none', width: '100%' }}
                        />
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button onClick={() => handleSave(show.id)} disabled={!!isSaving} style={{ flex: 1, padding: '7px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                          <button onClick={() => { setEditing(null); setInputVal('') }} style={{ padding: '7px 11px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--light)' }}>
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditing(show.id); setInputVal(cover && !broken ? cover : '') }}
                        style={{ width: '100%', padding: '7px', background: needsFix ? 'var(--ink)' : 'none', color: needsFix ? '#fff' : 'var(--light)', border: needsFix ? 'none' : '1px solid var(--bd)', cursor: 'pointer', fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                      >
                        {needsFix ? 'Fix Image' : 'Edit Image'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {loaded && filtered.length === 0 && (
          <div style={{ padding: '80px 48px', textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)' }}>
            No shows match your filter
          </div>
        )}
      </div>
    </>
  )
}
