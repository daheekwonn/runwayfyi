'use client'
// app/admin/tag-looks/page.tsx
// Place this file at: app/admin/tag-looks/page.tsx
// Also create: app/admin/tag-looks/TagLooksClient.tsx (the client component below)
// Backend required: PATCH /api/trends/shows/{show_id}/looks/{look_id}/manual-tags
//                   POST  /api/trends/shows/{show_id}/looks/{look_id}/manual-tags (same endpoint)
//                   GET   /api/trends/shows (existing)
//                   GET   /api/trends/shows/{show_id}/looks (existing)

import { useState, useEffect, useRef } from 'react'

const API = 'https://fashion-backend-production-6880.up.railway.app'
const PASSWORD = 'Runw3825!'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Show {
  id: number
  designer: string
  city: string
  season: string
  total_looks: number
  slug: string
}

interface Look {
  id: number
  look_number: number
  image_url: string
  materials: string[]
  color_names: string[]
  silhouettes: string[]
  manual_tags: string | null
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TagLooksPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') setAuthed(true)
  }, [])

  const handleLogin = () => {
    if (pw === PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthed(true)
    } else {
      alert('Wrong password')
    }
  }

  if (!authed) {
    return (
      <div style={{ background: '#0C0B09', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#fff', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.1em', fontSize: 11, marginBottom: 24 }}>runway fyi · ADMIN — LOOK TAGGER</div>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '12px 20px', width: 260, fontFamily: 'Geist Mono, monospace', fontSize: 13, outline: 'none', marginBottom: 12, display: 'block' }}
          />
          <button onClick={handleLogin} style={{ background: '#fff', color: '#0C0B09', border: 'none', padding: '12px 32px', fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer', width: '100%' }}>
            ENTER
          </button>
        </div>
      </div>
    )
  }

  return <TagLooksClient />
}

// ─── Tag Looks Client ─────────────────────────────────────────────────────────

function TagLooksClient() {
  const [shows, setShows] = useState<Show[]>([])
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)
  const [looks, setLooks] = useState<Look[]>([])
  const [loadingShows, setLoadingShows] = useState(true)
  const [loadingLooks, setLoadingLooks] = useState(false)
  const [saving, setSaving] = useState<number | null>(null)
  const [saved, setSaved] = useState<Record<number, boolean>>({})
  const [tags, setTags] = useState<Record<number, string>>({})
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('All')
  const [scoringStatus, setScoringStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState({ tagged: 0, total: 0 })

  // Load shows
  useEffect(() => {
    fetch(`${API}/api/trends/shows`)
      .then(r => r.json())
      .then(data => {
        const sorted = (data.shows || data || []).sort((a: Show, b: Show) =>
          a.designer.localeCompare(b.designer)
        )
        setShows(sorted)
        setLoadingShows(false)
      })
      .catch(() => setLoadingShows(false))
  }, [])

  // Load looks for selected show
  useEffect(() => {
    if (!selectedShow) return
    setLoadingLooks(true)
    setLooks([])
    setTags({})
    setSaved({})
    fetch(`${API}/api/trends/shows/${selectedShow.id}/looks`)
      .then(r => r.json())
      .then(data => {
        const looksData: Look[] = data.looks || data || []
        setLooks(looksData)
        // Pre-populate tag inputs with existing manual_tags
        const existing: Record<number, string> = {}
        looksData.forEach(l => {
          if (l.manual_tags) existing[l.id] = l.manual_tags
        })
        setTags(existing)
        setLoadingLooks(false)
        // Update progress
        const tagged = looksData.filter(l => l.manual_tags).length
        setProgress({ tagged, total: looksData.length })
      })
      .catch(() => setLoadingLooks(false))
  }, [selectedShow])

  // Save tags for a single look
  const saveTag = async (look: Look) => {
    const tagValue = tags[look.id] || ''
    setSaving(look.id)
    try {
      const res = await fetch(
        `${API}/api/trends/shows/${selectedShow!.id}/looks/${look.id}/manual-tags`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ manual_tags: tagValue })
        }
      )
      if (res.ok) {
        setSaved(prev => ({ ...prev, [look.id]: true }))
        // Update progress count
        setProgress(prev => {
          const wasTagged = looks.find(l => l.id === look.id)?.manual_tags
          const isNowTagged = tagValue.trim().length > 0
          if (!wasTagged && isNowTagged) return { ...prev, tagged: prev.tagged + 1 }
          if (wasTagged && !isNowTagged) return { ...prev, tagged: prev.tagged - 1 }
          return prev
        })
        // Update the look in state
        setLooks(prev => prev.map(l => l.id === look.id ? { ...l, manual_tags: tagValue } : l))
        setTimeout(() => setSaved(prev => ({ ...prev, [look.id]: false })), 2000)
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(null)
  }

  // Save all looks at once
  const saveAll = async () => {
    const dirtyLooks = looks.filter(l => tags[l.id] !== undefined)
    for (const look of dirtyLooks) {
      await saveTag(look)
    }
  }

  // Rerun scoring
  const runScoring = async () => {
    setScoringStatus('running')
    try {
      const res = await fetch(`${API}/api/trends/run-scoring`, { method: 'POST' })
      if (res.ok) {
        setScoringStatus('done')
        setTimeout(() => setScoringStatus('idle'), 5000)
      } else {
        setScoringStatus('error')
        setTimeout(() => setScoringStatus('idle'), 5000)
      }
    } catch {
      setScoringStatus('error')
      setTimeout(() => setScoringStatus('idle'), 5000)
    }
  }

  // Filtered shows
  const cities = ['All', ...Array.from(new Set(shows.map(s => s.city))).sort()]
  const filteredShows = shows.filter(s => {
    const matchesCity = cityFilter === 'All' || s.city === cityFilter
    const matchesSearch = s.designer.toLowerCase().includes(search.toLowerCase())
    return matchesCity && matchesSearch
  })

  // ── Styles ──────────────────────────────────────────────────────────────────

  const mono: React.CSSProperties = { fontFamily: 'Geist Mono, monospace' }
  const serif: React.CSSProperties = { fontFamily: 'Lora, Georgia, serif' }

  return (
    <div style={{ background: '#F5F2ED', minHeight: '100vh', ...mono }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(12,11,9,0.12)', padding: '20px 40px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.16em', color: '#A09A94', marginBottom: 4 }}>ADMIN · LOOK TAGGER</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', ...serif }}>Manual Tag Looks</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {selectedShow && looks.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: '#5A5550' }}>
                {progress.tagged}/{progress.total} tagged
              </div>
              <div style={{ width: 120, height: 4, background: '#EDE9E2', borderRadius: 2 }}>
                <div style={{ width: `${progress.total > 0 ? (progress.tagged / progress.total) * 100 : 0}%`, height: '100%', background: '#0C0B09', borderRadius: 2, transition: 'width 0.3s' }} />
              </div>
              <button onClick={saveAll} style={{ background: '#0C0B09', color: '#fff', border: 'none', padding: '8px 16px', fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer' }}>
                SAVE ALL
              </button>
            </>
          )}
          <button
            onClick={runScoring}
            disabled={scoringStatus === 'running'}
            style={{
              background: scoringStatus === 'done' ? '#22c55e' : scoringStatus === 'error' ? '#ef4444' : '#0C0B09',
              color: '#fff', border: 'none', padding: '8px 16px', fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer'
            }}
          >
            {scoringStatus === 'idle' ? 'RUN SCORING' : scoringStatus === 'running' ? 'RUNNING...' : scoringStatus === 'done' ? 'DONE ✓' : 'ERROR'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 73px)' }}>
        {/* Left panel — show list */}
        <div style={{ width: 280, borderRight: '1px solid rgba(12,11,9,0.1)', background: '#fff', overflow: 'auto', flexShrink: 0 }}>
          {/* Search + filter */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(12,11,9,0.08)' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search designer..."
              style={{ width: '100%', border: '1px solid #EDE9E2', padding: '8px 12px', fontSize: 12, ...mono, outline: 'none', background: '#F5F2ED', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {cities.map(c => (
                <button key={c} onClick={() => setCityFilter(c)} style={{
                  fontSize: 10, padding: '3px 8px', border: '1px solid rgba(12,11,9,0.15)',
                  background: cityFilter === c ? '#0C0B09' : 'transparent',
                  color: cityFilter === c ? '#fff' : '#5A5550',
                  cursor: 'pointer', letterSpacing: '0.08em', ...mono
                }}>{c}</button>
              ))}
            </div>
          </div>

          {loadingShows ? (
            <div style={{ padding: 20, fontSize: 11, color: '#A09A94' }}>Loading shows...</div>
          ) : (
            filteredShows.map(show => (
              <div
                key={show.id}
                onClick={() => setSelectedShow(show)}
                style={{
                  padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid rgba(12,11,9,0.06)',
                  background: selectedShow?.id === show.id ? '#F5F2ED' : '#fff',
                  borderLeft: selectedShow?.id === show.id ? '2px solid #0C0B09' : '2px solid transparent'
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0C0B09', marginBottom: 2 }}>{show.designer}</div>
                <div style={{ fontSize: 10, color: '#A09A94', letterSpacing: '0.08em' }}>{show.city} · {show.total_looks || 0} looks</div>
              </div>
            ))
          )}
        </div>

        {/* Right panel — looks grid */}
        <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
          {!selectedShow ? (
            <div style={{ textAlign: 'center', paddingTop: 80, color: '#A09A94', fontSize: 13 }}>
              Select a show to start tagging
            </div>
          ) : loadingLooks ? (
            <div style={{ textAlign: 'center', paddingTop: 80, color: '#A09A94', fontSize: 13 }}>
              Loading looks...
            </div>
          ) : looks.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80, color: '#A09A94', fontSize: 13 }}>
              No looks found for {selectedShow.designer}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24, display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', ...serif }}>{selectedShow.designer}</div>
                <div style={{ fontSize: 11, color: '#A09A94', letterSpacing: '0.1em' }}>{selectedShow.city} FW26 · {looks.length} looks</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {looks.map(look => {
                  const hasVisionTags = (look.materials?.length > 0 || look.silhouettes?.length > 0 || look.color_names?.length > 0)
                  const hasManualTags = look.manual_tags || (tags[look.id] && tags[look.id].trim().length > 0)
                  const isSaving = saving === look.id
                  const justSaved = saved[look.id]

                  return (
                    <div key={look.id} style={{ background: '#fff', border: `1px solid ${justSaved ? '#22c55e' : hasManualTags ? 'rgba(12,11,9,0.15)' : '#EDE9E2'}`, transition: 'border-color 0.3s' }}>
                      {/* Look image */}
                      <div style={{ aspectRatio: '2/3', overflow: 'hidden', position: 'relative', background: '#F5F2ED' }}>
                        {look.image_url ? (
                          <img src={look.image_url} alt={`Look ${look.look_number}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A09A94', fontSize: 11 }}>No image</div>
                        )}
                        <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(12,11,9,0.7)', color: '#fff', fontSize: 10, padding: '2px 6px', letterSpacing: '0.08em' }}>
                          #{look.look_number}
                        </div>
                        {hasManualTags && (
                          <div style={{ position: 'absolute', top: 8, right: 8, background: '#0C0B09', color: '#fff', fontSize: 9, padding: '2px 6px', letterSpacing: '0.08em' }}>
                            TAGGED
                          </div>
                        )}
                      </div>

                      {/* Vision tags (small, read-only) */}
                      {hasVisionTags && (
                        <div style={{ padding: '6px 10px', borderTop: '1px solid #F5F2ED', background: '#FAFAF9' }}>
                          <div style={{ fontSize: 9, color: '#A09A94', letterSpacing: '0.08em', marginBottom: 3 }}>VISION</div>
                          <div style={{ fontSize: 10, color: '#5A5550', lineHeight: 1.4 }}>
                            {[...(look.materials || []), ...(look.silhouettes || []), ...(look.color_names || [])].slice(0, 4).join(', ')}
                          </div>
                        </div>
                      )}

                      {/* Manual tag input */}
                      <div style={{ padding: 10 }}>
                        <div style={{ fontSize: 9, color: '#A09A94', letterSpacing: '0.08em', marginBottom: 4 }}>MANUAL TAGS</div>
                        <textarea
                          value={tags[look.id] || ''}
                          onChange={e => setTags(prev => ({ ...prev, [look.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) saveTag(look) }}
                          placeholder="leather, black, oversized jacket..."
                          rows={2}
                          style={{
                            width: '100%', border: '1px solid #EDE9E2', padding: '6px 8px',
                            fontSize: 11, ...mono, outline: 'none', resize: 'none',
                            background: '#F5F2ED', color: '#0C0B09', boxSizing: 'border-box',
                            lineHeight: 1.5
                          }}
                        />
                        <button
                          onClick={() => saveTag(look)}
                          disabled={isSaving}
                          style={{
                            width: '100%', marginTop: 6, padding: '6px 0',
                            background: justSaved ? '#22c55e' : '#0C0B09',
                            color: '#fff', border: 'none', fontSize: 10,
                            letterSpacing: '0.1em', cursor: 'pointer', transition: 'background 0.3s', ...mono
                          }}
                        >
                          {isSaving ? 'SAVING...' : justSaved ? 'SAVED ✓' : 'SAVE  ⌘↵'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
