'use client'

import { useState, useEffect } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'
const PASSWORD = 'Runw3825!'

interface ShowItem {
  id: number
  brand: string
  city: string
  season: string
  total_looks: number
  cover_image?: string
}

export default function RunwayFYIAdminCovers() {
  const [authed, setAuthed] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)

  const [shows, setShows] = useState<ShowItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'missing' | 'broken'>('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editUrl, setEditUrl] = useState('')
  const [saving, setSaving] = useState<number | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'ok' | 'err' } | null>(null)
  const [brokenIds, setBrokenIds] = useState<Set<number>>(new Set())

  const showMsg = (text: string, type: 'ok' | 'err' = 'ok') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('rfy_admin_auth')
    if (saved === PASSWORD) setAuthed(true)
  }, [])

  const handleLogin = () => {
    if (pwInput === PASSWORD) {
      setAuthed(true)
      sessionStorage.setItem('rfy_admin_auth', PASSWORD)
    } else {
      setPwError(true)
      setTimeout(() => setPwError(false), 1500)
    }
  }

  useEffect(() => {
    if (!authed) return
    fetch(`${RAILWAY_API}/api/trends/shows`)
      .then(r => r.json())
      .then((data: ShowItem[]) => setShows(data.sort((a, b) => a.brand.localeCompare(b.brand))))
      .finally(() => setLoading(false))
  }, [authed])

  const handleSave = async (show: ShowItem) => {
    if (!editUrl.trim()) return
    setSaving(show.id)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${show.id}/cover-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: editUrl.trim() }),
      })
      if (res.ok) {
        setShows(prev => prev.map(s => s.id === show.id ? { ...s, cover_image: editUrl.trim() } : s))
        setEditingId(null)
        setEditUrl('')
        showMsg('Cover saved!')
      } else {
        showMsg('Save failed', 'err')
      }
    } finally {
      setSaving(null)
    }
  }

  const handleRefreshCounts = async () => {
    setRefreshing(true)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/refresh-counts`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        // Reload shows to get updated counts
        const showsRes = await fetch(`${RAILWAY_API}/api/trends/shows`)
        const showsData = await showsRes.json()
        setShows(showsData.sort((a: ShowItem, b: ShowItem) => a.brand.localeCompare(b.brand)))
        showMsg(`Updated ${data.shows_updated} shows!`)
      } else {
        showMsg('Refresh failed', 'err')
      }
    } finally {
      setRefreshing(false)
    }
  }

  const markBroken = (id: number) => setBrokenIds(prev => new Set([...prev, id]))

  const filtered = shows.filter(s => {
    const matchSearch = s.brand.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())
    if (filter === 'missing') return matchSearch && !s.cover_image
    if (filter === 'broken') return matchSearch && brokenIds.has(s.id)
    return matchSearch
  })

  const missing = shows.filter(s => !s.cover_image).length
  const broken = brokenIds.size

  // Password gate
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0B09', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <style>{`@import url('https://api.fontshare.com/v2/css?f[]=ranade@700,400&display=swap'); @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap');`}</style>
        <p style={{ fontFamily: "'Ranade', sans-serif", fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>runway.fyi</p>
        <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Admin — Covers</p>
        <input
          type="password"
          value={pwInput}
          onChange={e => setPwInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Password"
          autoFocus
          style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, padding: '12px 18px', background: pwError ? 'rgba(192,57,43,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${pwError ? '#c0392b' : 'rgba(255,255,255,0.12)'}`, color: '#fff', outline: 'none', width: 260, letterSpacing: '0.04em', transition: 'border-color 0.2s' }}
        />
        <button onClick={handleLogin} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 24px', background: '#fff', color: '#0C0B09', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
          Enter
        </button>
        {pwError && <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, color: '#c0392b', letterSpacing: '0.08em' }}>Incorrect password</p>}
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@700,400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --ink: #0C0B09; --cream: #F5F2ED; --warm: #EDE9E2; --mid: #5A5550; --light: #A09A94; --bd: rgba(12,11,9,0.1); --f-mono: 'Geist Mono', monospace; --f-display: 'Ranade', sans-serif; }
        body { background: var(--cream); color: var(--ink); -webkit-font-smoothing: antialiased; }
      `}</style>

      {message && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: message.type === 'ok' ? '#1a7a4a' : '#c0392b', color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.08em', padding: '10px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          {message.type === 'ok' ? '✓ ' : '✗ '}{message.text}
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'var(--ink)', color: '#fff', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 4 }}>runwayfyi.com · admin</p>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>Cover Images</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleRefreshCounts} disabled={refreshing} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: refreshing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
            {refreshing ? 'Refreshing...' : '↻ Refresh Look Counts'}
          </button>
          <a href="/admin/looks" style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: 'none', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none' }}>Looks Editor →</a>
          <a href="/shows" style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: 'none', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none' }}>Shows →</a>
        </div>
      </div>

      {/* Stats + filters */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', background: '#fff' }}>
        <div style={{ display: 'flex', gap: 24, flex: 1 }}>
          {[{ label: 'Total', val: shows.length, key: 'all' }, { label: 'Missing', val: missing, key: 'missing' }, { label: 'Broken', val: broken, key: 'broken' }].map(({ label, val, key }) => (
            <button key={key} onClick={() => setFilter(key as any)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 700, color: filter === key ? 'var(--ink)' : 'var(--light)' }}>{val}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: filter === key ? 'var(--ink)' : 'var(--light)' }}>{label}</div>
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search shows..." style={{ fontFamily: 'var(--f-mono)', fontSize: 10, padding: '7px 12px', border: '1px solid var(--bd)', background: 'var(--cream)', outline: 'none', color: 'var(--ink)', width: 220 }} />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1, padding: 1, background: 'var(--bd)' }}>
          {filtered.map(show => {
            const isEditing = editingId === show.id
            const isSaving = saving === show.id
            return (
              <div key={show.id} style={{ background: 'var(--cream)', padding: '0 0 12px' }}>
                <div style={{ width: '100%', paddingBottom: '133%', position: 'relative', background: 'var(--warm)', overflow: 'hidden' }}>
                  {show.cover_image ? (
                    <img src={show.cover_image} referrerPolicy="no-referrer" alt={show.brand} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} onError={() => markBroken(show.id)} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 20, opacity: 0.2 }}>○</span>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: 'var(--light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No cover</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(12,11,9,0.7)', color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 8, padding: '2px 6px', letterSpacing: '0.06em' }}>
                    {show.total_looks} looks
                  </div>
                  <a href={`https://www.vogue.com/fashion-shows/fall-2026-ready-to-wear/${show.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(12,11,9,0.7)', color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 8, padding: '2px 6px', textDecoration: 'none', letterSpacing: '0.06em' }}>
                    Vogue ↗
                  </a>
                </div>
                <div style={{ padding: '8px 10px 0' }}>
                  <p style={{ fontFamily: 'var(--f-display)', fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 2 }}>{show.brand}</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: 8 }}>{show.city}</p>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <input value={editUrl} onChange={e => setEditUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave(show)} autoFocus placeholder="Paste image URL..." style={{ fontFamily: 'var(--f-mono)', fontSize: 9, padding: '6px 8px', border: '1px solid var(--ink)', background: '#fff', outline: 'none', color: 'var(--ink)', width: '100%' }} />
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => handleSave(show)} disabled={!!isSaving} style={{ flex: 1, fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>{isSaving ? '...' : 'Save'}</button>
                        <button onClick={() => { setEditingId(null); setEditUrl('') }} style={{ fontFamily: 'var(--f-mono)', fontSize: 8, padding: '6px 8px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', color: 'var(--light)' }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingId(show.id); setEditUrl(show.cover_image || '') }} style={{ width: '100%', fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px', background: 'none', color: 'var(--light)', border: '1px solid var(--bd)', cursor: 'pointer' }}>
                      {show.cover_image ? 'Edit Cover' : '+ Set Cover'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
