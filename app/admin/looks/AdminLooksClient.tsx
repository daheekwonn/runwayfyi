'use client'

import { useState, useEffect, useCallback } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

interface ShowItem {
  id: number
  brand: string
  city: string
  season: string
  total_looks: number
}

interface LookItem {
  id: number
  look_number: number
  image_url: string
  materials?: string[]
}

export default function RunwayFYIAdminLooks() {
  const [shows, setShows] = useState<ShowItem[]>([])
  const [selectedShow, setSelectedShow] = useState<ShowItem | null>(null)
  const [looks, setLooks] = useState<LookItem[]>([])
  const [loadingShows, setLoadingShows] = useState(true)
  const [loadingLooks, setLoadingLooks] = useState(false)
  const [search, setSearch] = useState('')
  const [editingLook, setEditingLook] = useState<number | null>(null)
  const [editUrl, setEditUrl] = useState('')
  const [saving, setSaving] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [deletingAll, setDeletingAll] = useState(false)
  const [addingNew, setAddingNew] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkUrls, setBulkUrls] = useState('')
  const [bulkSaving, setBulkSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'ok' | 'err' } | null>(null)

  const showMsg = (text: string, type: 'ok' | 'err' = 'ok') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  useEffect(() => {
    fetch(`${RAILWAY_API}/api/trends/shows`)
      .then((r) => r.json())
      .then((data: ShowItem[]) => setShows(data.sort((a, b) => a.brand.localeCompare(b.brand))))
      .finally(() => setLoadingShows(false))
  }, [])

  const loadLooks = useCallback(async (show: ShowItem) => {
    setSelectedShow(show)
    setLooks([])
    setLoadingLooks(true)
    setEditingLook(null)
    setAddingNew(false)
    setBulkMode(false)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${show.id}/looks`)
      const data = await res.json()
      setLooks(Array.isArray(data) ? data.sort((a, b) => a.look_number - b.look_number) : [])
    } finally {
      setLoadingLooks(false)
    }
  }, [])

  const handleSaveEdit = async (lookId: number) => {
    if (!editUrl.trim() || !selectedShow) return
    setSaving(lookId)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${selectedShow.id}/looks/${lookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: editUrl.trim() }),
      })
      if (res.ok) {
        setLooks((prev) => prev.map((l) => l.id === lookId ? { ...l, image_url: editUrl.trim() } : l))
        setEditingLook(null)
        setEditUrl('')
        showMsg('Image updated!')
      } else {
        showMsg('Update failed', 'err')
      }
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = async (lookId: number) => {
    if (!selectedShow) return
    setDeleting(lookId)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${selectedShow.id}/looks/${lookId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setLooks((prev) => prev.filter((l) => l.id !== lookId))
        showMsg('Look deleted')
      } else {
        showMsg('Delete failed', 'err')
      }
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteAll = async () => {
    if (!selectedShow || looks.length === 0) return
    if (!confirm(`Delete ALL ${looks.length} looks for ${selectedShow.brand}? This cannot be undone.`)) return
    setDeletingAll(true)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${selectedShow.id}/looks`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setLooks([])
        showMsg(`Deleted all looks for ${selectedShow.brand}`)
      } else {
        showMsg('Delete all failed', 'err')
      }
    } finally {
      setDeletingAll(false)
    }
  }

  const handleAddLook = async () => {
    if (!newUrl.trim() || !selectedShow) return
    setSaving(-1)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${selectedShow.id}/looks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: newUrl.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setLooks((prev) => [...prev, { id: data.id, look_number: data.look_number, image_url: newUrl.trim() }])
        setNewUrl('')
        setAddingNew(false)
        showMsg('Look added!')
      } else {
        showMsg('Failed to add look', 'err')
      }
    } finally {
      setSaving(null)
    }
  }

  const handleBulkAdd = async () => {
    if (!bulkUrls.trim() || !selectedShow) return
    setBulkSaving(true)
    const urls = bulkUrls.split('\n').map((u) => u.trim()).filter(Boolean)
    let added = 0
    for (const url of urls) {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${selectedShow.id}/looks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url }),
      })
      if (res.ok) {
        const data = await res.json()
        setLooks((prev) => [...prev, { id: data.id, look_number: data.look_number, image_url: url }])
        added++
      }
      await new Promise((r) => setTimeout(r, 80))
    }
    setBulkUrls('')
    setBulkMode(false)
    setBulkSaving(false)
    showMsg(`Added ${added} looks!`)
  }

  const filteredShows = shows.filter((s) =>
    s.brand.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  )

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
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: var(--bd); }
      `}</style>

      {message && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: message.type === 'ok' ? '#1a7a4a' : '#c0392b', color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.08em', padding: '10px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          {message.type === 'ok' ? '✓ ' : '✗ '}{message.text}
        </div>
      )}

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* Sidebar */}
        <div style={{ width: 280, flexShrink: 0, background: 'var(--ink)', color: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 12px' }}>
            <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 4 }}>runwayfyi.com · admin</p>
            <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14 }}>Looks Editor</h1>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shows..."
              style={{ width: '100%', fontFamily: 'var(--f-mono)', fontSize: 10, padding: '7px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', letterSpacing: '0.04em' }}
            />
          </div>
          <div style={{ padding: '0 20px 12px', display: 'flex', gap: 12 }}>
            <a href="/admin/shows" style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Covers</a>
            <a href="/shows" style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Shows</a>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingShows ? (
              <div style={{ padding: '20px', fontFamily: 'var(--f-mono)', fontSize: 9, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading...</div>
            ) : filteredShows.map((show) => (
              <button key={show.id} onClick={() => loadLooks(show)} style={{ width: '100%', textAlign: 'left', padding: '10px 20px', background: selectedShow?.id === show.id ? 'rgba(255,255,255,0.12)' : 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', color: '#fff' }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{show.brand}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.4, marginTop: 2 }}>{show.city} · {show.total_looks} looks</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--cream)' }}>
          {!selectedShow ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--light)' }}>Select a show</p>
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', opacity: 0.6 }}>Choose from the list on the left</p>
            </div>
          ) : (
            <>
              {/* Top bar */}
              <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 10, background: '#fff', flexShrink: 0, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: 2 }}>{selectedShow.city} · {selectedShow.season} · {looks.length} looks</p>
                  <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{selectedShow.brand}</h2>
                </div>
                <button onClick={() => { setAddingNew(true); setBulkMode(false) }} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>+ Add Look</button>
                <button onClick={() => { setBulkMode(true); setAddingNew(false) }} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: 'none', color: 'var(--mid)', border: '1px solid var(--bd)', cursor: 'pointer' }}>Bulk Add</button>
                <button
                  onClick={handleDeleteAll}
                  disabled={deletingAll || looks.length === 0}
                  style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: 'none', color: '#c0392b', border: '1px solid #c0392b', cursor: looks.length === 0 ? 'not-allowed' : 'pointer', opacity: looks.length === 0 ? 0.4 : 1 }}
                >
                  {deletingAll ? 'Deleting...' : `Delete All (${looks.length})`}
                </button>
              </div>

              {/* Add single */}
              {addingNew && (
                <div style={{ padding: '12px 24px', background: 'var(--warm)', borderBottom: '1px solid var(--bd)', display: 'flex', gap: 8, flexShrink: 0 }}>
                  <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddLook()} placeholder="Paste Vogue image URL..." autoFocus style={{ flex: 1, fontFamily: 'var(--f-mono)', fontSize: 10, padding: '8px 12px', border: '1px solid var(--bd)', background: '#fff', outline: 'none', color: 'var(--ink)' }} />
                  <button onClick={handleAddLook} disabled={saving === -1} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 16px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>{saving === -1 ? 'Adding...' : 'Add'}</button>
                  <button onClick={() => setAddingNew(false)} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, padding: '8px 12px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', color: 'var(--light)' }}>✕</button>
                </div>
              )}

              {/* Bulk add */}
              {bulkMode && (
                <div style={{ padding: '12px 24px', background: 'var(--warm)', borderBottom: '1px solid var(--bd)', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: 8 }}>One URL per line — each becomes a new look</p>
                  <textarea value={bulkUrls} onChange={(e) => setBulkUrls(e.target.value)} placeholder={'https://assets.vogue.com/...\nhttps://assets.vogue.com/...'} rows={5} autoFocus style={{ width: '100%', fontFamily: 'var(--f-mono)', fontSize: 9, padding: '8px 12px', border: '1px solid var(--bd)', background: '#fff', outline: 'none', color: 'var(--ink)', resize: 'vertical', marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleBulkAdd} disabled={bulkSaving} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 16px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>{bulkSaving ? 'Adding...' : `Add ${bulkUrls.split('\n').filter((u) => u.trim()).length} Looks`}</button>
                    <button onClick={() => setBulkMode(false)} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, padding: '8px 12px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', color: 'var(--light)' }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Grid */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 1, background: 'var(--bd)' }}>
                {loadingLooks ? (
                  <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', background: 'var(--cream)' }}>Loading looks...</div>
                ) : looks.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center', background: 'var(--cream)' }}>
                    <p style={{ fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 700, color: 'var(--light)', marginBottom: 8 }}>No looks yet</p>
                    <p style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', opacity: 0.6 }}>Use "Add Look" or "Bulk Add" above</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 1 }}>
                    {looks.map((look) => {
                      const isEditing = editingLook === look.id
                      const isSaving = saving === look.id
                      const isDeleting = deleting === look.id
                      return (
                        <div key={look.id} style={{ background: 'var(--cream)', position: 'relative' }}>
                          <div style={{ width: '100%', paddingBottom: '150%', position: 'relative', background: 'var(--warm)', overflow: 'hidden' }}>
                            {look.image_url ? (
                              <img src={look.image_url} referrerPolicy="no-referrer" alt={`Look ${look.look_number}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} onError={(e) => { e.currentTarget.style.opacity = '0.15' }} />
                            ) : (
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: 'var(--light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No image</span>
                              </div>
                            )}
                            <div style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(12,11,9,0.75)', color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.06em', padding: '2px 6px' }}>{String(look.look_number).padStart(2, '0')}</div>
                            <button onClick={() => handleDelete(look.id)} disabled={!!isDeleting} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(192,57,43,0.85)', color: '#fff', border: 'none', cursor: 'pointer', width: 22, height: 22, fontFamily: 'var(--f-mono)', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {isDeleting ? '…' : '✕'}
                            </button>
                          </div>
                          <div style={{ padding: '6px 8px 8px' }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(look.id)} autoFocus style={{ fontFamily: 'var(--f-mono)', fontSize: 8, padding: '5px 7px', border: '1px solid var(--ink)', background: '#fff', outline: 'none', color: 'var(--ink)', width: '100%' }} />
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <button onClick={() => handleSaveEdit(look.id)} disabled={!!isSaving} style={{ flex: 1, fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>{isSaving ? '...' : 'Save'}</button>
                                  <button onClick={() => { setEditingLook(null); setEditUrl('') }} style={{ fontFamily: 'var(--f-mono)', fontSize: 8, padding: '5px 7px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', color: 'var(--light)' }}>✕</button>
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingLook(look.id); setEditUrl(look.image_url || '') }} style={{ width: '100%', fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px', background: 'none', color: 'var(--light)', border: '1px solid var(--bd)', cursor: 'pointer' }}>Edit URL</button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
