'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'
const PASSWORD = 'Runw3825!'

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

const CITIES = ['Paris', 'Milan', 'London', 'New York', 'Copenhagen', 'Berlin', 'Tokyo', 'Rome', 'Shanghai', 'Spain']

const TICKER_ITEMS = [
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7',
  'Dior FW26  87.4', 'Prairie Silhouette  78.6', 'Wide-Leg Trouser  74.3',
  'Burgundy  +180%', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
]

export default function RunwayFYIAdminLooks() {
  const [authed, setAuthed] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)

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
  const [deletingShow, setDeletingShow] = useState<number | null>(null)
  const [confirmDeleteShow, setConfirmDeleteShow] = useState<ShowItem | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkUrls, setBulkUrls] = useState('')
  const [bulkSaving, setBulkSaving] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)
  const [orderChanged, setOrderChanged] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'ok' | 'err' } | null>(null)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  // ── Add Show state ──────────────────────────────────────────────────────────
  const [showAddShow, setShowAddShow] = useState(false)
  const [newShowBrand, setNewShowBrand] = useState('')
  const [newShowCity, setNewShowCity] = useState('Paris')
  const [newShowSeason, setNewShowSeason] = useState('FW26')
  const [newShowUrls, setNewShowUrls] = useState('')
  const [creatingShow, setCreatingShow] = useState(false)
  const [addShowStep, setAddShowStep] = useState<'details' | 'looks'>('details')
  const [newlyCreatedShow, setNewlyCreatedShow] = useState<ShowItem | null>(null)

  const showMsg = (text: string, type: 'ok' | 'err' = 'ok') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3500)
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
      .finally(() => setLoadingShows(false))
  }, [authed])

  const loadLooks = useCallback(async (show: ShowItem) => {
    setSelectedShow(show)
    setLooks([])
    setLoadingLooks(true)
    setEditingLook(null)
    setAddingNew(false)
    setBulkMode(false)
    setOrderChanged(false)
    setShowAddShow(false)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${show.id}/looks`)
      const data = await res.json()
      setLooks(Array.isArray(data) ? data.sort((a, b) => a.look_number - b.look_number) : [])
    } finally {
      setLoadingLooks(false)
    }
  }, [])

  const handleDragStart = (index: number) => { dragItem.current = index }
  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
    if (dragItem.current === null || dragItem.current === index) return
    setLooks(prev => {
      const updated = [...prev]
      const dragged = updated.splice(dragItem.current!, 1)[0]
      updated.splice(index, 0, dragged)
      return updated.map((l, i) => ({ ...l, look_number: i + 1 }))
    })
    dragItem.current = index
  }
  const handleDragEnd = () => {
    dragItem.current = null
    dragOverItem.current = null
    setOrderChanged(true)
  }

  const handleSaveOrder = async () => {
    if (!selectedShow) return
    setSavingOrder(true)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${selectedShow.id}/looks/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ look_ids: looks.map(l => l.id) }),
      })
      if (res.ok) {
        setOrderChanged(false)
        setShows(prev => prev.map(s => s.id === selectedShow.id ? { ...s, total_looks: looks.length } : s))
        showMsg('Order saved!')
      } else {
        showMsg('Failed to save order', 'err')
      }
    } finally {
      setSavingOrder(false)
    }
  }

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
        setLooks(prev => prev.map(l => l.id === lookId ? { ...l, image_url: editUrl.trim() } : l))
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
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${selectedShow.id}/looks/${lookId}`, { method: 'DELETE' })
      if (res.ok) {
        setLooks(prev => {
          const updated = prev.filter(l => l.id !== lookId)
          return updated.map((l, i) => ({ ...l, look_number: i + 1 }))
        })
        setOrderChanged(true)
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
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${selectedShow.id}/looks`, { method: 'DELETE' })
      if (res.ok) {
        setLooks([])
        setOrderChanged(false)
        setShows(prev => prev.map(s => s.id === selectedShow.id ? { ...s, total_looks: 0 } : s))
        showMsg(`Deleted all looks for ${selectedShow.brand}`)
      } else {
        showMsg('Delete all failed', 'err')
      }
    } finally {
      setDeletingAll(false)
    }
  }

  const handleDeleteShow = async (show: ShowItem) => {
    setDeletingShow(show.id)
    try {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${show.id}`, { method: 'DELETE' })
      if (res.ok) {
        setShows(prev => prev.filter(s => s.id !== show.id))
        if (selectedShow?.id === show.id) {
          setSelectedShow(null)
          setLooks([])
        }
        showMsg(`${show.brand} deleted`)
      } else {
        showMsg('Delete failed', 'err')
      }
    } finally {
      setDeletingShow(null)
      setConfirmDeleteShow(null)
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
        setLooks(prev => {
          const updated = [...prev, { id: data.id, look_number: data.look_number, image_url: newUrl.trim() }]
          return updated.map((l, i) => ({ ...l, look_number: i + 1 }))
        })
        setShows(prev => prev.map(s => s.id === selectedShow.id ? { ...s, total_looks: looks.length + 1 } : s))
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
    const urls = bulkUrls.split('\n').map(u => u.trim()).filter(Boolean)
    let added = 0
    const newLooks: LookItem[] = []
    for (const url of urls) {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${selectedShow.id}/looks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url }),
      })
      if (res.ok) {
        const data = await res.json()
        newLooks.push({ id: data.id, look_number: data.look_number, image_url: url })
        added++
      }
      await new Promise(r => setTimeout(r, 80))
    }
    setLooks(prev => {
      const updated = [...prev, ...newLooks]
      return updated.map((l, i) => ({ ...l, look_number: i + 1 }))
    })
    setShows(prev => prev.map(s => s.id === selectedShow.id ? { ...s, total_looks: looks.length + added } : s))
    setBulkUrls('')
    setBulkMode(false)
    setBulkSaving(false)
    showMsg(`Added ${added} looks!`)
  }

  // ── Create Show ─────────────────────────────────────────────────────────────

  const handleCreateShow = async () => {
    if (!newShowBrand.trim()) return
    setCreatingShow(true)
    try {
      const slug = newShowBrand.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + newShowSeason.toLowerCase()
      const res = await fetch(`${RAILWAY_API}/api/trends/shows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: newShowBrand.trim(),
          city: newShowCity,
          season: newShowSeason,
          slug,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const newShow: ShowItem = {
          id: data.id,
          brand: newShowBrand.trim(),
          city: newShowCity,
          season: newShowSeason,
          total_looks: 0,
        }
        setShows(prev => [...prev, newShow].sort((a, b) => a.brand.localeCompare(b.brand)))
        setNewlyCreatedShow(newShow)

        // If URLs were pasted, go to look seeding step
        if (newShowUrls.trim()) {
          setAddShowStep('looks')
        } else {
          // No URLs — just select the show and close
          loadLooks(newShow)
          resetAddShow()
          showMsg(`${newShow.brand} created! Add looks below.`)
        }
      } else {
        showMsg('Failed to create show', 'err')
      }
    } finally {
      setCreatingShow(false)
    }
  }

  const handleSeedLooks = async () => {
    if (!newlyCreatedShow || !newShowUrls.trim()) return
    setBulkSaving(true)
    const urls = newShowUrls.split('\n').map(u => u.trim()).filter(Boolean)
    let added = 0
    for (const url of urls) {
      const res = await fetch(`${RAILWAY_API}/api/trends/shows/${newlyCreatedShow.id}/looks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url }),
      })
      if (res.ok) added++
      await new Promise(r => setTimeout(r, 80))
    }
    setShows(prev => prev.map(s => s.id === newlyCreatedShow.id ? { ...s, total_looks: added } : s))
    showMsg(`${newlyCreatedShow.brand} created with ${added} looks — live on /shows now!`)
    loadLooks({ ...newlyCreatedShow, total_looks: added })
    resetAddShow()
    setBulkSaving(false)
  }

  const resetAddShow = () => {
    setShowAddShow(false)
    setNewShowBrand('')
    setNewShowCity('Paris')
    setNewShowSeason('FW26')
    setNewShowUrls('')
    setAddShowStep('details')
    setNewlyCreatedShow(null)
  }

  const filteredShows = shows.filter(s =>
    s.brand.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  )

  // ── Password gate ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <style>{`
          @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Geist+Mono:wght@300;400;500&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root { --ink: #0C0B09; --cream: #F5F2ED; --warm: #EDE9E2; --mid: #5A5550; --light: #A09A94; --bd: rgba(12,11,9,0.1); --f-mono: 'Geist Mono', monospace; --f-display: 'Ranade', sans-serif; }
          body { background: var(--cream); -webkit-font-smoothing: antialiased; }
        `}</style>
        <a href="/" style={{ fontFamily: "'Ranade', sans-serif", fontSize: 26, fontWeight: 700, color: '#0C0B09', letterSpacing: '0.06em', textTransform: 'lowercase', textDecoration: 'none', marginBottom: 4 }}>runway fyi</a>
        <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A09A94', marginBottom: 20 }}>admin · looks editor</p>
        <input
          type="password"
          value={pwInput}
          onChange={e => setPwInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="password"
          autoFocus
          style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, padding: '12px 18px', background: '#fff', border: `1px solid ${pwError ? '#c0392b' : 'rgba(12,11,9,0.15)'}`, color: '#0C0B09', outline: 'none', width: 260, letterSpacing: '0.04em', transition: 'border-color 0.2s' }}
        />
        <button onClick={handleLogin} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 24px', background: '#0C0B09', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
          enter
        </button>
        {pwError && <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, color: '#c0392b', letterSpacing: '0.08em' }}>incorrect</p>}
      </div>
    )
  }

  // ── Main UI ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Geist+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --ink: #0C0B09; --cream: #F5F2ED; --warm: #EDE9E2; --mid: #5A5550; --light: #A09A94; --bd: rgba(12,11,9,0.1); --f-mono: 'Geist Mono', monospace; --f-display: 'Ranade', sans-serif; --f-body: 'Lora', Georgia, serif; }
        body { background: var(--cream); color: var(--ink); -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: var(--bd); }
        .look-card { cursor: grab; transition: opacity 0.15s, transform 0.15s; }
        .look-card:active { cursor: grabbing; }
        .add-show-overlay { position: fixed; inset: 0; background: rgba(12,11,9,0.6); z-index: 100; display: flex; align-items: flex-end; justify-content: flex-start; }
        .add-show-panel { width: 400px; height: 100vh; background: #fff; display: flex; flex-direction: column; overflow: hidden; animation: slideIn 0.22s ease; }
        @keyframes slideIn { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .city-btn { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 10px; border: 1px solid var(--bd); cursor: pointer; transition: all 0.15s; background: none; color: var(--mid); }
        .city-btn:hover { border-color: var(--ink); color: var(--ink); }
        .field-label { font-family: var(--f-mono); font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--light); margin-bottom: 5px; }
        .field-input { width: 100%; font-family: var(--f-mono); font-size: 11px; padding: 9px 12px; border: 1px solid var(--bd); background: var(--cream); outline: none; color: var(--ink); transition: border-color 0.15s; }
        .field-input:focus { border-color: var(--ink); }
        .ticker { background: var(--ink); overflow: hidden; white-space: nowrap; padding: 7px 0; }
        .ticker-inner { display: inline-flex; animation: tick 48s linear infinite; }
        .ticker-inner span { font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.13em; color: rgba(255,255,255,0.9); padding: 0 42px; }
        @keyframes tick { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>

      {/* Ticker — matches homepage exactly */}
      <div className="ticker" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 }}>
        <div className="ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
      <div style={{ height: 31 }} />

      {/* Toast */}
      {message && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: message.type === 'ok' ? '#1a7a4a' : '#c0392b', color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.08em', padding: '10px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          {message.type === 'ok' ? '✓ ' : '✗ '}{message.text}
        </div>
      )}

      {/* Confirm delete show dialog */}
      {confirmDeleteShow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(12,11,9,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 32, maxWidth: 380, width: '90%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)' }}>Confirm Delete</p>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{confirmDeleteShow.brand}</h3>
            <p style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--mid)', lineHeight: 1.6 }}>
              This will permanently delete the show and all {confirmDeleteShow.total_looks} looks. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleDeleteShow(confirmDeleteShow)}
                disabled={deletingShow === confirmDeleteShow.id}
                style={{ flex: 1, fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px', background: '#c0392b', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                {deletingShow === confirmDeleteShow.id ? 'Deleting...' : 'Delete Show'}
              </button>
              <button
                onClick={() => setConfirmDeleteShow(null)}
                style={{ fontFamily: 'var(--f-mono)', fontSize: 9, padding: '10px 16px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', color: 'var(--light)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Show overlay */}
      {showAddShow && (
        <div className="add-show-overlay" onClick={e => { if (e.target === e.currentTarget) resetAddShow() }}>
          <div className="add-show-panel">

            {/* Panel header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--bd)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)' }}>
                  {addShowStep === 'details' ? 'Step 1 of 2 · Show Details' : 'Step 2 of 2 · Add Looks'}
                </p>
                <button onClick={resetAddShow} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light)', fontSize: 18, lineHeight: 1 }}>×</button>
              </div>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {addShowStep === 'details' ? 'Add New Show' : newlyCreatedShow?.brand ?? 'Add Looks'}
              </h2>
              {addShowStep === 'looks' && (
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--light)', marginTop: 4 }}>
                  Show created ✓ — now paste image URLs below
                </p>
              )}
            </div>

            {/* Step 1 — Details */}
            {addShowStep === 'details' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Brand */}
                <div>
                  <p className="field-label">Brand / Designer</p>
                  <input
                    className="field-input"
                    value={newShowBrand}
                    onChange={e => setNewShowBrand(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateShow()}
                    placeholder="e.g. Rodarte"
                    autoFocus
                  />
                </div>

                {/* City */}
                <div>
                  <p className="field-label">City</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {CITIES.map(c => (
                      <button
                        key={c}
                        className="city-btn"
                        onClick={() => setNewShowCity(c)}
                        style={{
                          background: newShowCity === c ? 'var(--ink)' : 'none',
                          color: newShowCity === c ? '#fff' : 'var(--mid)',
                          borderColor: newShowCity === c ? 'var(--ink)' : 'var(--bd)',
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Season */}
                <div>
                  <p className="field-label">Season</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['FW26', 'SS26', 'FW25', 'SS25'].map(s => (
                      <button
                        key={s}
                        className="city-btn"
                        onClick={() => setNewShowSeason(s)}
                        style={{
                          background: newShowSeason === s ? 'var(--ink)' : 'none',
                          color: newShowSeason === s ? '#fff' : 'var(--mid)',
                          borderColor: newShowSeason === s ? 'var(--ink)' : 'var(--bd)',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image URLs (optional) */}
                <div>
                  <p className="field-label">Image URLs <span style={{ opacity: 0.5 }}>(optional — one per line)</span></p>
                  <textarea
                    className="field-input"
                    value={newShowUrls}
                    onChange={e => setNewShowUrls(e.target.value)}
                    placeholder={'https://assets.vogue.com/...\nhttps://assets.vogue.com/...'}
                    rows={6}
                    style={{ resize: 'vertical', fontFamily: 'var(--f-mono)', fontSize: 9 }}
                  />
                  {newShowUrls.trim() && (
                    <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: 'var(--light)', marginTop: 4 }}>
                      {newShowUrls.split('\n').filter(u => u.trim()).length} URLs ready to seed
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 — Seed looks */}
            {addShowStep === 'looks' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <p className="field-label">Image URLs — one per line</p>
                  <textarea
                    className="field-input"
                    value={newShowUrls}
                    onChange={e => setNewShowUrls(e.target.value)}
                    placeholder={'https://assets.vogue.com/...\nhttps://assets.vogue.com/...'}
                    rows={12}
                    autoFocus
                    style={{ resize: 'vertical', fontFamily: 'var(--f-mono)', fontSize: 9 }}
                  />
                  {newShowUrls.trim() && (
                    <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: 'var(--light)', marginTop: 4 }}>
                      {newShowUrls.split('\n').filter(u => u.trim()).length} looks to add
                    </p>
                  )}
                </div>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--light)', lineHeight: 1.6 }}>
                  You can also skip this and add looks later via the Bulk Add button after selecting the show.
                </p>
              </div>
            )}

            {/* Panel footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bd)', display: 'flex', gap: 8, flexShrink: 0 }}>
              {addShowStep === 'details' ? (
                <>
                  <button
                    onClick={handleCreateShow}
                    disabled={creatingShow || !newShowBrand.trim()}
                    style={{
                      flex: 1, fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.12em',
                      textTransform: 'uppercase', padding: '11px', background: newShowBrand.trim() ? 'var(--ink)' : 'var(--warm)',
                      color: newShowBrand.trim() ? '#fff' : 'var(--light)', border: 'none',
                      cursor: newShowBrand.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {creatingShow ? 'Creating...' : newShowUrls.trim() ? 'Create Show + Seed Looks →' : 'Create Show →'}
                  </button>
                  <button onClick={resetAddShow} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, padding: '11px 16px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', color: 'var(--light)' }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSeedLooks}
                    disabled={bulkSaving || !newShowUrls.trim()}
                    style={{
                      flex: 1, fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.12em',
                      textTransform: 'uppercase', padding: '11px', background: newShowUrls.trim() ? '#1a7a4a' : 'var(--warm)',
                      color: newShowUrls.trim() ? '#fff' : 'var(--light)', border: 'none',
                      cursor: newShowUrls.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {bulkSaving ? 'Seeding looks...' : `Add ${newShowUrls.split('\n').filter(u => u.trim()).length} Looks`}
                  </button>
                  <button
                    onClick={() => { loadLooks(newlyCreatedShow!); resetAddShow() }}
                    style={{ fontFamily: 'var(--f-mono)', fontSize: 9, padding: '11px 16px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', color: 'var(--light)' }}
                  >
                    Skip
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* Sidebar */}
        <div style={{ width: 280, flexShrink: 0, background: 'var(--ink)', color: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 12px' }}>
            <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 4 }}>runwayfyi.com · admin</p>
            <a href="/" style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'lowercase', color: '#fff', textDecoration: 'none', marginBottom: 4 }}>runway fyi</a>
            <h1 style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 14 }}>Looks Editor</h1>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search shows..." style={{ width: '100%', fontFamily: 'var(--f-mono)', fontSize: 10, padding: '7px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', letterSpacing: '0.04em' }} />
          </div>
          <div style={{ padding: '0 20px 12px', display: 'flex', gap: 12 }}>
            <a href="/admin/shows" style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Covers</a>
            <a href="/shows" style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Shows</a>
          </div>

          {/* Shows list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingShows ? (
              <div style={{ padding: '20px', fontFamily: 'var(--f-mono)', fontSize: 9, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading...</div>
            ) : filteredShows.map(show => (
              <div key={show.id} style={{ position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'stretch' }}
                onMouseEnter={e => { const btn = e.currentTarget.querySelector('.show-delete-btn') as HTMLElement; if (btn) btn.style.opacity = '1' }}
                onMouseLeave={e => { const btn = e.currentTarget.querySelector('.show-delete-btn') as HTMLElement; if (btn) btn.style.opacity = '0' }}
              >
                <button onClick={() => loadLooks(show)} style={{ flex: 1, textAlign: 'left', padding: '10px 16px 10px 20px', background: selectedShow?.id === show.id ? 'rgba(255,255,255,0.12)' : 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{show.brand}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.4, marginTop: 2 }}>{show.city} · {show.total_looks} looks</div>
                </button>
                <button
                  className="show-delete-btn"
                  onClick={e => { e.stopPropagation(); setConfirmDeleteShow(show) }}
                  title="Delete show"
                  style={{ opacity: 0, transition: 'opacity 0.15s', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(192,57,43,0.8)', padding: '0 14px', fontSize: 14, flexShrink: 0 }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add Show button — pinned to bottom of sidebar */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
            <button
              onClick={() => { setShowAddShow(true); setAddShowStep('details') }}
              style={{
                width: '100%', fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '10px', background: 'rgba(255,255,255,0.08)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              + Add Show
            </button>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--cream)' }}>
          {!selectedShow ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--light)' }}>Select a show</p>
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', opacity: 0.6 }}>Choose from the list on the left or add a new show</p>
            </div>
          ) : (
            <>
              {/* Top bar */}
              <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 10, background: '#fff', flexShrink: 0, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: 2 }}>{selectedShow.city} · {selectedShow.season} · {looks.length} looks</p>
                  <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{selectedShow.brand}</h2>
                </div>
                {orderChanged && (
                  <button onClick={handleSaveOrder} disabled={savingOrder} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: '#1a7a4a', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    {savingOrder ? 'Saving...' : '↑ Save Order'}
                  </button>
                )}
                <button onClick={() => { setAddingNew(true); setBulkMode(false) }} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>+ Add Look</button>
                <button onClick={() => { setBulkMode(true); setAddingNew(false) }} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: 'none', color: 'var(--mid)', border: '1px solid var(--bd)', cursor: 'pointer' }}>Bulk Add</button>
                <button onClick={handleDeleteAll} disabled={deletingAll || looks.length === 0} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', background: 'none', color: '#c0392b', border: '1px solid #c0392b', cursor: looks.length === 0 ? 'not-allowed' : 'pointer', opacity: looks.length === 0 ? 0.4 : 1 }}>
                  {deletingAll ? 'Deleting...' : `Delete All (${looks.length})`}
                </button>
              </div>

              {/* Drag hint */}
              {looks.length > 0 && !orderChanged && (
                <div style={{ padding: '8px 24px', background: 'var(--warm)', borderBottom: '1px solid var(--bd)', fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.08em', color: 'var(--light)', flexShrink: 0 }}>
                  ↕ Drag cards to reorder · Look numbers update automatically · Hit "Save Order" to persist
                </div>
              )}
              {orderChanged && (
                <div style={{ padding: '8px 24px', background: '#fff8e1', borderBottom: '1px solid #f0c040', fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.08em', color: '#7a5c00', flexShrink: 0 }}>
                  ⚠ Order changed — hit "Save Order" to persist to the database
                </div>
              )}

              {/* Add single */}
              {addingNew && (
                <div style={{ padding: '12px 24px', background: 'var(--warm)', borderBottom: '1px solid var(--bd)', display: 'flex', gap: 8, flexShrink: 0 }}>
                  <input value={newUrl} onChange={e => setNewUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddLook()} placeholder="Paste Vogue image URL..." autoFocus style={{ flex: 1, fontFamily: 'var(--f-mono)', fontSize: 10, padding: '8px 12px', border: '1px solid var(--bd)', background: '#fff', outline: 'none', color: 'var(--ink)' }} />
                  <button onClick={handleAddLook} disabled={saving === -1} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 16px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>{saving === -1 ? 'Adding...' : 'Add'}</button>
                  <button onClick={() => setAddingNew(false)} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, padding: '8px 12px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', color: 'var(--light)' }}>✕</button>
                </div>
              )}

              {/* Bulk add */}
              {bulkMode && (
                <div style={{ padding: '12px 24px', background: 'var(--warm)', borderBottom: '1px solid var(--bd)', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: 8 }}>One URL per line — each becomes a new look</p>
                  <textarea value={bulkUrls} onChange={e => setBulkUrls(e.target.value)} placeholder={'https://assets.vogue.com/...\nhttps://assets.vogue.com/...'} rows={5} autoFocus style={{ width: '100%', fontFamily: 'var(--f-mono)', fontSize: 9, padding: '8px 12px', border: '1px solid var(--bd)', background: '#fff', outline: 'none', color: 'var(--ink)', resize: 'vertical', marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleBulkAdd} disabled={bulkSaving} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 16px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>{bulkSaving ? 'Adding...' : `Add ${bulkUrls.split('\n').filter(u => u.trim()).length} Looks`}</button>
                    <button onClick={() => setBulkMode(false)} style={{ fontFamily: 'var(--f-mono)', fontSize: 9, padding: '8px 12px', background: 'none', border: '1px solid var(--bd)', cursor: 'pointer', color: 'var(--light)' }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Look grid */}
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
                    {looks.map((look, index) => {
                      const isEditing = editingLook === look.id
                      const isSaving = saving === look.id
                      const isDeleting = deleting === look.id
                      return (
                        <div key={look.id} className="look-card" draggable onDragStart={() => handleDragStart(index)} onDragEnter={() => handleDragEnter(index)} onDragEnd={handleDragEnd} onDragOver={e => e.preventDefault()} style={{ background: 'var(--cream)', position: 'relative' }}>
                          <div style={{ width: '100%', paddingBottom: '150%', position: 'relative', background: 'var(--warm)', overflow: 'hidden' }}>
                            {look.image_url ? (
                              <img src={look.image_url} referrerPolicy="no-referrer" alt={`Look ${look.look_number}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', pointerEvents: 'none' }} onError={e => { e.currentTarget.style.opacity = '0.15' }} />
                            ) : (
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 8, color: 'var(--light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No image</span>
                              </div>
                            )}
                            <div style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(12,11,9,0.75)', color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 8, letterSpacing: '0.06em', padding: '2px 6px' }}>{String(look.look_number).padStart(2, '0')}</div>
                            <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(12,11,9,0.5)', color: '#fff', fontFamily: 'var(--f-mono)', fontSize: 10, padding: '2px 5px' }}>⠿</div>
                            <button onClick={() => handleDelete(look.id)} disabled={!!isDeleting} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(192,57,43,0.85)', color: '#fff', border: 'none', cursor: 'pointer', width: 22, height: 22, fontFamily: 'var(--f-mono)', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {isDeleting ? '…' : '✕'}
                            </button>
                          </div>
                          <div style={{ padding: '6px 8px 8px' }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <input value={editUrl} onChange={e => setEditUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveEdit(look.id)} autoFocus style={{ fontFamily: 'var(--f-mono)', fontSize: 8, padding: '5px 7px', border: '1px solid var(--ink)', background: '#fff', outline: 'none', color: 'var(--ink)', width: '100%' }} />
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
