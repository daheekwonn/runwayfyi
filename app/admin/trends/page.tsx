'use client'

/**
 * runway.fyi — Full Trend Management Admin
 * File: app/admin/trends/page.tsx
 *
 * Features:
 * - View all FW26 trends grouped by category
 * - Edit runway counts and show counts per trend
 * - Rename any trend or change its category
 * - Add new trends under any category
 * - Add new categories
 * - Delete trends
 * - Run scoring pipeline
 */

import { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'Runw3825!'
const SESSION_KEY = 'rwfyi_admin_auth'
const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

interface TrendItem {
  id: number
  name: string
  category: string
  runway_count: number
  runway_show_count: number
  runway_score: number
  search_score: number
  social_score: number
  trend_score: number
}

type ModalType =
  | { type: 'rename'; item: TrendItem }
  | { type: 'delete'; item: TrendItem }
  | { type: 'add-trend'; category: string }
  | { type: 'add-category' }
  | { type: 'rename-category'; category: string }
  | null

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const attempt = () => {
    if (value === ADMIN_PASSWORD) { sessionStorage.setItem(SESSION_KEY, '1'); onUnlock() }
    else { setError(true); setValue('') }
  }
  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#fff;-webkit-font-smoothing:antialiased}
        :root{--ink:#0C0B09;--bd:rgba(12,11,9,0.1);--light:#A09A94;--f-mono:'Geist Mono',monospace;--f-display:'Ranade',sans-serif}
      `}</style>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:32}}>
        <div style={{fontFamily:'var(--f-display)',fontSize:48,fontWeight:700,letterSpacing:'-0.03em'}}>Trend Manager</div>
        <div style={{display:'flex',flexDirection:'column',gap:8,width:280}}>
          <input type="password" placeholder="Password" value={value} autoFocus
            style={{border:error?'1px solid #c0392b':'1px solid var(--bd)',padding:'11px 14px',fontFamily:'var(--f-mono)',fontSize:13,outline:'none'}}
            onChange={e=>{setValue(e.target.value);setError(false)}}
            onKeyDown={e=>e.key==='Enter'&&attempt()} />
          <button onClick={attempt} style={{background:'#0C0B09',color:'#fff',border:'none',padding:'11px 14px',fontFamily:'var(--f-mono)',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer'}}>
            Unlock →
          </button>
          {error&&<div style={{fontFamily:'var(--f-mono)',fontSize:10,color:'#c0392b',textAlign:'center'}}>Incorrect password</div>}
        </div>
      </div>
    </>
  )
}

function ModalWrap({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(12,11,9,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',padding:32,width:'100%',maxWidth:440,borderRadius:2,boxShadow:'0 8px 40px rgba(0,0,0,0.15)'}}>
        {children}
      </div>
    </div>
  )
}

const CSS = `
  @import url('https://api.fontshare.com/v2/css?f[]=ranade@700,400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400&family=Geist+Mono:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:#fff;color:#0C0B09;-webkit-font-smoothing:antialiased}
  :root{--ink:#0C0B09;--cream:#F5F2ED;--warm:#EDE9E2;--mid:#5A5550;--light:#A09A94;--bd:rgba(12,11,9,0.1);--f-mono:'Geist Mono',monospace;--f-display:'Ranade',sans-serif;--f-body:'Lora',Georgia,serif}
  .site-header{position:fixed;top:0;left:0;right:0;z-index:100;background:#fff;border-bottom:1px solid var(--bd)}
  .nav-row{height:56px;display:flex;align-items:center;justify-content:center;padding:0 52px;position:relative}
  .nav-logo{font-family:var(--f-display);font-size:20px;font-weight:700;letter-spacing:0.08em;text-transform:lowercase;color:var(--ink);text-decoration:none}
  .nav-back{position:absolute;left:52px;font-family:var(--f-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--light);text-decoration:none}
  .nav-back:hover{color:var(--ink)}
  .page-header{padding:40px 52px 24px;border-bottom:1px solid var(--bd)}
  .page-kicker{font-family:var(--f-mono);font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:var(--light);margin-bottom:10px}
  .page-title{font-family:var(--f-display);font-size:clamp(48px,7vw,80px);font-weight:700;letter-spacing:-0.03em;line-height:0.9}
  .toolbar{display:flex;align-items:center;gap:10px;padding:16px 52px;border-bottom:1px solid var(--bd);flex-wrap:wrap}
  .btn{font-family:var(--f-mono);font-size:9px;letter-spacing:0.13em;text-transform:uppercase;padding:7px 14px;cursor:pointer;transition:all .15s;border-radius:1px}
  .btn-primary{background:var(--ink);color:#fff;border:none}
  .btn-primary:hover{opacity:.8}
  .btn-primary:disabled{opacity:.4;cursor:not-allowed}
  .btn-outline{background:none;border:1px solid var(--bd);color:var(--light)}
  .btn-outline:hover{color:var(--ink);border-color:rgba(12,11,9,0.35)}
  .score-msg{font-family:var(--f-mono);font-size:10px;color:#16873d;margin-left:8px}
  .th-row{display:grid;grid-template-columns:1fr 90px 70px 70px 70px 70px 80px 120px;padding:8px 52px;gap:8px;background:var(--cream);border-bottom:1px solid var(--bd)}
  .th{font-family:var(--f-mono);font-size:8px;letter-spacing:0.13em;text-transform:uppercase;color:var(--light);text-align:right}
  .th:first-child{text-align:left}
  .cat-section{border-bottom:2px solid var(--bd)}
  .cat-header{display:flex;align-items:center;gap:12px;padding:0 52px;height:52px;cursor:pointer;user-select:none;transition:background .1s}
  .cat-header:hover{background:var(--cream)}
  .cat-chevron{font-family:var(--f-mono);font-size:9px;color:var(--light);transition:transform .2s;flex-shrink:0}
  .cat-chevron.open{transform:rotate(90deg)}
  .cat-name{font-family:var(--f-display);font-size:22px;font-weight:700;letter-spacing:-0.02em;flex:1}
  .cat-count{font-family:var(--f-mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--light)}
  .cat-actions{display:flex;gap:6px;opacity:0;transition:opacity .15s}
  .cat-header:hover .cat-actions{opacity:1}
  .trend-row{display:grid;grid-template-columns:1fr 90px 70px 70px 70px 70px 80px 120px;align-items:center;padding:0 52px;border-bottom:1px solid rgba(12,11,9,0.05);min-height:48px;gap:8px;transition:background .1s}
  .trend-row:hover{background:var(--cream)}
  .trend-name{font-family:var(--f-display);font-size:16px;font-weight:700;letter-spacing:-0.01em}
  .trend-val{font-family:var(--f-mono);font-size:11px;color:var(--mid);text-align:right}
  .trend-val.zero{color:#c0392b}
  .trend-actions{display:flex;gap:4px;justify-content:flex-end;opacity:0;transition:opacity .15s}
  .trend-row:hover .trend-actions{opacity:1}
  .ibtn{background:none;border:1px solid var(--bd);color:var(--light);font-family:var(--f-mono);font-size:8px;letter-spacing:0.1em;text-transform:uppercase;padding:3px 7px;cursor:pointer;transition:all .15s}
  .ibtn:hover{color:var(--ink);border-color:rgba(12,11,9,0.35)}
  .ibtn.del:hover{color:#c0392b;border-color:rgba(192,57,43,0.4)}
  .edit-panel{padding:16px 52px;background:var(--cream);border-bottom:1px solid var(--bd);display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap}
  .ef{display:flex;flex-direction:column;gap:5px}
  .el{font-family:var(--f-mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--light)}
  .ei{border:1px solid var(--bd);background:#fff;padding:8px 12px;font-family:var(--f-mono);font-size:12px;color:var(--ink);outline:none}
  .ei:focus{border-color:var(--ink)}
  .ei.wide{min-width:340px}
  .add-row{padding:10px 52px;border-bottom:1px solid rgba(12,11,9,0.05)}
  .modal-title{font-family:var(--f-display);font-size:26px;font-weight:700;letter-spacing:-0.02em;margin-bottom:20px}
  .modal-label{font-family:var(--f-mono);font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:var(--light);margin-bottom:6px;display:block}
  .modal-input{width:100%;border:1px solid var(--bd);padding:10px 14px;font-family:var(--f-mono);font-size:13px;color:var(--ink);outline:none;margin-bottom:14px}
  .modal-input:focus{border-color:var(--ink)}
  .modal-select{width:100%;border:1px solid var(--bd);padding:10px 14px;font-family:var(--f-mono);font-size:13px;color:var(--ink);outline:none;margin-bottom:14px;background:#fff;appearance:none;cursor:pointer}
  .modal-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}
  .modal-error{font-family:var(--f-mono);font-size:10px;color:#c0392b;margin-bottom:12px}
  .modal-warn{font-family:var(--f-body);font-size:13px;color:var(--mid);margin-bottom:20px;line-height:1.55}
  footer{border-top:1px solid var(--bd);padding:24px 52px;display:flex;align-items:center;justify-content:space-between;margin-top:40px}
  .f-logo{font-family:var(--f-display);font-size:16px;font-weight:700;letter-spacing:0.08em;text-transform:lowercase}
  .f-copy{font-family:var(--f-mono);font-size:10px;letter-spacing:0.1em;color:var(--light)}
`

export default function TrendManager() {
  const [unlocked, setUnlocked] = useState(false)
  const [items, setItems] = useState<TrendItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)
  const [mIn1, setMIn1] = useState('')
  const [mIn2, setMIn2] = useState('')
  const [mErr, setMErr] = useState('')
  const [mLoading, setMLoading] = useState(false)
  const [editId, setEditId] = useState<number|null>(null)
  const [editCount, setEditCount] = useState('')
  const [editShows, setEditShows] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{id:number,msg:string}|null>(null)
  const [runningScore, setRunningScore] = useState(false)
  const [scoreMsg, setScoreMsg] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => { if (sessionStorage.getItem(SESSION_KEY)==='1') setUnlocked(true) }, [])
  useEffect(() => { if (unlocked) load() }, [unlocked])

  const load = async () => {
    setLoading(true)
    try { const r = await fetch(`${RAILWAY_API}/api/trends/items`); setItems(await r.json()) }
    catch { setItems([]) }
    setLoading(false)
  }

  const categories = Array.from(new Set(items.map(i=>i.category))).sort()
  const byCat = (c: string) => items.filter(i=>i.category===c).sort((a,b)=>b.trend_score-a.trend_score)
  const toggle = (c: string) => setExpanded(p=>{ const n=new Set(p); n.has(c)?n.delete(c):n.add(c); return n })

  const openModal = (m: ModalType) => {
    setModal(m)
    setMIn1(m?.type==='rename'?m.item.name:m?.type==='rename-category'?m.category:'')
    setMIn2(m?.type==='rename'?m.item.category:'')
    setMErr('')
  }

  const saveTag = async (item: TrendItem) => {
    setSaving(true)
    // If editShows contains commas, treat as show list and count them
    const showCount = editShows.includes(',')
      ? editShows.split(',').map(s=>s.trim()).filter(Boolean).length
      : parseInt(editShows)||0
    const r = await fetch(`${RAILWAY_API}/api/trends/manual-tag`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ trend_name:item.name, runway_count:parseInt(editCount)||0, runway_show_count:showCount })
    })
    setSaving(false)
    if (r.ok) { setSaveMsg({id:item.id,msg:'✓ Saved'}); await load(); setTimeout(()=>{setEditId(null);setSaveMsg(null)},1200) }
    else setSaveMsg({id:item.id,msg:'✗ Error'})
  }

  const doRename = async () => {
    if (!modal||modal.type!=='rename') return
    setMLoading(true); setMErr('')
    const r = await fetch(`${RAILWAY_API}/api/trends/items/${modal.item.id}`, {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:mIn1.trim(), category:mIn2||modal.item.category })
    })
    setMLoading(false)
    r.ok ? (setModal(null), await load()) : setMErr('Failed to rename')
  }

  const doDelete = async () => {
    if (!modal||modal.type!=='delete') return
    setMLoading(true)
    const r = await fetch(`${RAILWAY_API}/api/trends/items/${modal.item.id}`, { method:'DELETE' })
    setMLoading(false)
    r.ok ? (setModal(null), await load()) : setMErr('Failed to delete')
  }

  const doAddTrend = async () => {
    if (!modal||modal.type!=='add-trend') return
    setMLoading(true); setMErr('')
    const r = await fetch(`${RAILWAY_API}/api/trends/items/create`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:mIn1.trim(), category:modal.category })
    })
    setMLoading(false)
    if (r.ok) { setModal(null); setMIn1(''); await load() }
    else { const d=await r.json(); setMErr(d.detail||'Failed') }
  }

  const doAddCategory = async () => {
    if (!modal||modal.type!=='add-category') return
    setMLoading(true); setMErr('')
    const r = await fetch(`${RAILWAY_API}/api/trends/items/create`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:mIn2.trim(), category:mIn1.trim() })
    })
    setMLoading(false)
    if (r.ok) { setExpanded(p=>new Set([...p,mIn1])); setModal(null); setMIn1(''); setMIn2(''); await load() }
    else { const d=await r.json(); setMErr(d.detail||'Failed') }
  }

  const doRenameCategory = async () => {
    if (!modal||modal.type!=='rename-category') return
    setMLoading(true); setMErr('')
    const toRename = items.filter(i=>i.category===modal.category)
    let ok = true
    for (const item of toRename) {
      const r = await fetch(`${RAILWAY_API}/api/trends/items/${item.id}`, {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ category:mIn1.trim() })
      })
      if (!r.ok) { ok=false; break }
    }
    setMLoading(false)
    ok ? (setModal(null), setMIn1(''), await load()) : setMErr('Failed to rename category')
  }

  const runScoring = async () => {
    setRunningScore(true); setScoreMsg('')
    await fetch(`${RAILWAY_API}/api/trends/run-scoring`, { method:'POST' })
    setTimeout(async()=>{ await load(); setRunningScore(false); setScoreMsg('✓ Scoring complete'); setTimeout(()=>setScoreMsg(''),3000) }, 5000)
  }

  if (!unlocked) return <PasswordGate onUnlock={()=>setUnlocked(true)} />

  return (
    <>
      <style>{CSS}</style>

      {/* Rename trend modal */}
      {modal?.type==='rename' && (
        <ModalWrap onClose={()=>setModal(null)}>
          <div className="modal-title">Rename trend</div>
          <label className="modal-label">Name</label>
          <input className="modal-input" value={mIn1} autoFocus onChange={e=>setMIn1(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doRename()} />
          <label className="modal-label">Category</label>
          <select className="modal-select" value={mIn2} onChange={e=>setMIn2(e.target.value)}>
            {categories.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          {mErr&&<div className="modal-error">{mErr}</div>}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" disabled={mLoading||!mIn1.trim()} onClick={doRename}>{mLoading?'Saving...':'Save →'}</button>
          </div>
        </ModalWrap>
      )}

      {/* Delete trend modal */}
      {modal?.type==='delete' && (
        <ModalWrap onClose={()=>setModal(null)}>
          <div className="modal-title">Delete trend</div>
          <div className="modal-warn">Delete <strong>{modal.item.name}</strong>? This removes all score history and cannot be undone.</div>
          {mErr&&<div className="modal-error">{mErr}</div>}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
            <button style={{fontFamily:'var(--f-mono)',fontSize:9,letterSpacing:'0.13em',textTransform:'uppercase',background:'#c0392b',color:'#fff',border:'none',padding:'7px 14px',cursor:'pointer'}}
              disabled={mLoading} onClick={doDelete}>{mLoading?'Deleting...':'Delete'}</button>
          </div>
        </ModalWrap>
      )}

      {/* Add trend modal */}
      {modal?.type==='add-trend' && (
        <ModalWrap onClose={()=>setModal(null)}>
          <div className="modal-title">Add trend to {modal.category}</div>
          <label className="modal-label">Trend name</label>
          <input className="modal-input" placeholder="e.g. Sheer Layers" value={mIn1} autoFocus
            onChange={e=>setMIn1(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doAddTrend()} />
          {mErr&&<div className="modal-error">{mErr}</div>}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" disabled={mLoading||!mIn1.trim()} onClick={doAddTrend}>{mLoading?'Creating...':'Add →'}</button>
          </div>
        </ModalWrap>
      )}

      {/* Add category modal */}
      {modal?.type==='add-category' && (
        <ModalWrap onClose={()=>setModal(null)}>
          <div className="modal-title">New category</div>
          <label className="modal-label">Category name</label>
          <input className="modal-input" placeholder="e.g. jewellery" value={mIn1} autoFocus onChange={e=>setMIn1(e.target.value)} />
          <label className="modal-label">First trend in this category</label>
          <input className="modal-input" placeholder="e.g. Statement Earring" value={mIn2}
            onChange={e=>setMIn2(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doAddCategory()} />
          {mErr&&<div className="modal-error">{mErr}</div>}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" disabled={mLoading||!mIn1.trim()||!mIn2.trim()} onClick={doAddCategory}>{mLoading?'Creating...':'Create →'}</button>
          </div>
        </ModalWrap>
      )}

      {/* Rename category modal */}
      {modal?.type==='rename-category' && (
        <ModalWrap onClose={()=>setModal(null)}>
          <div className="modal-title">Rename category</div>
          <div className="modal-warn">Renaming <strong>{modal.category}</strong> across {byCat(modal.category).length} trends.</div>
          <label className="modal-label">New name</label>
          <input className="modal-input" value={mIn1} autoFocus onChange={e=>setMIn1(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doRenameCategory()} />
          {mErr&&<div className="modal-error">{mErr}</div>}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" disabled={mLoading||!mIn1.trim()} onClick={doRenameCategory}>{mLoading?'Renaming...':'Rename →'}</button>
          </div>
        </ModalWrap>
      )}

      {/* Header */}
      <header className="site-header">
        <div className="nav-row">
          <a href="/admin" className="nav-back">← Admin</a>
          <a href="/" className="nav-logo">runway fyi</a>
        </div>
      </header>
      <div style={{height:56}} />

      {/* Page header */}
      <div className="page-header">
        <div className="page-kicker">Admin · Trend Manager · FW26</div>
        <h1 className="page-title">Trend<br />Manager</h1>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <button className="btn btn-primary" disabled={runningScore} onClick={runScoring}>
          {runningScore?'Running...':'Run Scoring →'}
        </button>
        <button className="btn btn-outline" onClick={()=>openModal({type:'add-category'})}>+ New category</button>
        <button className="btn btn-outline" onClick={load}>↻ Refresh</button>
        {scoreMsg&&<span className="score-msg">{scoreMsg}</span>}
      </div>

      {/* Column headers */}
      <div className="th-row">
        <div className="th" style={{textAlign:'left'}}>Trend</div>
        <div className="th">Looks</div>
        <div className="th">Shows</div>
        <div className="th">Runway</div>
        <div className="th">Search</div>
        <div className="th">Social</div>
        <div className="th">Score</div>
        <div className="th">Actions</div>
      </div>

      {loading ? (
        <div style={{padding:'60px 52px',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--light)'}}>Loading...</div>
      ) : (
        categories.map(cat => (
          <div key={cat} className="cat-section">
            <div className="cat-header" onClick={()=>toggle(cat)}>
              <span className={`cat-chevron${expanded.has(cat)?' open':''}`}>▶</span>
              <span className="cat-name">{cat}</span>
              <span className="cat-count">{byCat(cat).length} trends</span>
              <div className="cat-actions" onClick={e=>e.stopPropagation()}>
                <button className="ibtn" onClick={()=>openModal({type:'add-trend',category:cat})}>+ trend</button>
                <button className="ibtn" onClick={()=>openModal({type:'rename-category',category:cat})}>rename</button>
              </div>
            </div>

            {expanded.has(cat) && (
              <>
                {byCat(cat).map(item => (
                  <div key={item.id}>
                    <div className="trend-row">
                      <div className="trend-name">{item.name}</div>
                      <div className={`trend-val${item.runway_count===0?' zero':''}`}>{item.runway_count.toLocaleString()}</div>
                      <div className={`trend-val${item.runway_show_count===0?' zero':''}`}>{item.runway_show_count}</div>
                      <div className="trend-val">{item.runway_score.toFixed(1)}</div>
                      <div className="trend-val">{item.search_score.toFixed(1)}</div>
                      <div className="trend-val">{item.social_score.toFixed(1)}</div>
                      <div className="trend-val" style={{fontWeight:600,color:'var(--ink)'}}>{item.trend_score.toFixed(1)}</div>
                      <div className="trend-actions">
                        <button className="ibtn" onClick={()=>{setEditId(editId===item.id?null:item.id);setEditCount(String(item.runway_count));setEditShows(String(item.runway_show_count));setSaveMsg(null)}}>
                          {editId===item.id?'close':'edit'}
                        </button>
                        <button className="ibtn" onClick={()=>openModal({type:'rename',item})}>rename</button>
                        <button className="ibtn del" onClick={()=>openModal({type:'delete',item})}>delete</button>
                      </div>
                    </div>
                    {editId===item.id && (
                      <div className="edit-panel">
                        <div className="ef">
                          <div className="el">Runway looks</div>
                          <input className="ei" type="number" min="0" value={editCount} onChange={e=>setEditCount(e.target.value)} placeholder="0" style={{width:100}} />
                        </div>
                        <div className="ef">
                          <div className="el">Shows (number, or list: Gucci, Prada...)</div>
                          <input className="ei wide" value={editShows} onChange={e=>setEditShows(e.target.value)} placeholder="e.g. 12  or  Gucci, Saint Laurent, Prada" />
                        </div>
                        <div className="ef" style={{justifyContent:'flex-end',gap:8,flexDirection:'row',alignItems:'center'}}>
                          {saveMsg?.id===item.id&&<span style={{fontFamily:'var(--f-mono)',fontSize:10,color:'#16873d'}}>{saveMsg.msg}</span>}
                          <button className="btn btn-primary" disabled={saving} onClick={()=>saveTag(item)}>{saving?'Saving...':'Save →'}</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="add-row">
                  <button className="btn btn-outline" style={{fontSize:8}} onClick={()=>openModal({type:'add-trend',category:cat})}>+ Add trend to {cat}</button>
                </div>
              </>
            )}
          </div>
        ))
      )}

      <footer>
        <span className="f-logo">runway fyi</span>
        <span className="f-copy">© 2026 runwayfyi.com</span>
      </footer>
    </>
  )
}
