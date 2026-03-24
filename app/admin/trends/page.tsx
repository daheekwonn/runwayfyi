'use client'

/**
 * runway.fyi — Manual Trend Tagging Admin
 * File: app/admin/trends/page.tsx
 *
 * Lets you manually set runway_count and runway_show_count
 * for each FW26 trend item directly from the browser.
 * No code, no terminal, no CSV.
 */

import { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'Runw3825!'
const SESSION_KEY = 'rwfyi_admin_auth'
const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

// All 120 FW26 shows for the show selector
const ALL_SHOWS = [
  '7 For All Mankind','Acne Studios','Alaia','Altuzarra','Andrej Gronau',
  'Anna Sui','Ann Demeulemeester','Area','Balenciaga','Balmain',
  'Baum und Pferdgarten','Blumarine','Boss','Bottega Veneta','Bronx Banco',
  'Burberry','Calvin Klein Collection','Carolina Herrera','Celine','Chanel',
  'Chet Lo','Chloe','Christian Dior','Christian Siriano','Coach',
  'Collina Strada','Comme des Garcons','Conner Ives','Courrèges','Diesel',
  'Di Petsa','Dolce & Gabbana','Dries Van Noten','Eckhaus Latta','Emporio Armani',
  'Enfants Riches Deprimés','Erdem','Etro','Fendi','Ferragamo',
  'Fetico','Gabriela Hearst','Giorgio Armani','Givenchy','Gucci',
  'Haderlump','Hermes','Hodakova','Holzweiler','Ioannes',
  'Isabel Marant','Issey Miyake','Jacquemus','Jean Paul Gaultier','Jil Sander',
  'Junya Watanabe','Kasia Kucharska','Kenneth Ize','Khaite','Kiko Kostadinov',
  'Kim Shui','Lacoste','Lanvin','Laura Gerte','Lemaire',
  'Loewe','Louis Vuitton','Marco Rambaldi','Marni','Masha Popova',
  'Max Mara','McQueen','Michael Kors','Missoni','Miu Miu',
  'MM6 Maison Margiela','Moschino','Mugler','Natasha Zinko','Nina Ricci',
  'No. 21','Noir Kei Ninomiya','Off-White','Orange Culture','Ottolinger',
  'Our Legacy','Patou','Pillings','Prabal Gurung','Prada',
  'Proenza Schouler','Rabanne','Ralph Lauren','Rave Review','Richard Quinn',
  'Richert Beil','Rick Owens','Roberto Cavalli','Saint Laurent','Sandy Liang',
  'Schiaparelli','SF1OG','Sia Arnika','Simone Rocha','Skall Studio',
  'Sportmax','Stella McCartney','Tod\'s','Tom Ford','Tory Burch',
  'Toteme','Ulla Johnson','Uma Wang','Undercover','Valentino',
  'Vaquera','Victoria Beckham','William Fan','Yohji Yamamoto','Zimmermann',
]

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

interface EditState {
  runway_count: string
  runway_show_count: string
  show_search: string
  selected_shows: string[]
}

export default function ManualTrendTagging() {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState(false)
  const [items, setItems] = useState<TrendItem[]>([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [edit, setEdit] = useState<EditState>({ runway_count: '', runway_show_count: '', show_search: '', selected_shows: [] })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [runningScore, setRunningScore] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true)
  }, [])

  useEffect(() => {
    if (unlocked) fetchItems()
  }, [unlocked])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const resp = await fetch(`${RAILWAY_API}/api/trends/items`)
      const data = await resp.json()
      setItems(data)
    } catch {
      // fallback — try leaderboard
      const resp = await fetch(`${RAILWAY_API}/api/trends/leaderboard?limit=50`)
      const data = await resp.json()
      setItems(data)
    }
    setLoading(false)
  }

  const openEdit = (item: TrendItem) => {
    setEditId(item.id)
    setEdit({
      runway_count: String(item.runway_count),
      runway_show_count: String(item.runway_show_count),
      show_search: '',
      selected_shows: [],
    })
    setSaveMsg('')
    setShowDropdown(false)
  }

  const saveEdit = async (item: TrendItem) => {
    setSaving(true)
    setSaveMsg('')
    try {
      const resp = await fetch(`${RAILWAY_API}/api/trends/manual-tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trend_name: item.name,
          runway_count: parseInt(edit.runway_count) || 0,
          runway_show_count: edit.selected_shows.length > 0
            ? edit.selected_shows.length
            : parseInt(edit.runway_show_count) || 0,
        }),
      })
      if (resp.ok) {
        setSaveMsg('✓ Saved')
        await fetchItems()
        setTimeout(() => { setEditId(null); setSaveMsg('') }, 1200)
      } else {
        setSaveMsg('✗ Error saving')
      }
    } catch {
      setSaveMsg('✗ Network error')
    }
    setSaving(false)
  }

  const runScoring = async () => {
    setRunningScore(true)
    await fetch(`${RAILWAY_API}/api/trends/run-scoring`, { method: 'POST' })
    setTimeout(() => {
      setRunningScore(false)
      fetchItems()
    }, 5000)
  }

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category))).sort()]
  const filtered = categoryFilter === 'all' ? items : items.filter(i => i.category === categoryFilter)
  const filteredShows = ALL_SHOWS.filter(s =>
    s.toLowerCase().includes(edit.show_search.toLowerCase()) &&
    !edit.selected_shows.includes(s)
  )

  const unlock = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setUnlocked(true)
    } else {
      setPwError(true)
      setPassword('')
    }
  }

  if (!unlocked) {
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
          <div style={{fontFamily:'var(--f-display)',fontSize:48,fontWeight:700,letterSpacing:'-0.03em'}}>Trend Tags</div>
          <div style={{display:'flex',flexDirection:'column',gap:8,width:280}}>
            <input type="password" placeholder="Password" value={password} autoFocus
              style={{border:pwError?'1px solid #c0392b':'1px solid var(--bd)',padding:'11px 14px',fontFamily:'var(--f-mono)',fontSize:13,outline:'none'}}
              onChange={e=>{setPassword(e.target.value);setPwError(false)}}
              onKeyDown={e=>e.key==='Enter'&&unlock()} />
            <button onClick={unlock} style={{background:'var(--ink)',color:'#fff',border:'none',padding:'11px 14px',fontFamily:'var(--f-mono)',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer'}}>
              Unlock →
            </button>
            {pwError && <div style={{fontFamily:'var(--f-mono)',fontSize:10,color:'#c0392b',textAlign:'center'}}>Incorrect password</div>}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@700,400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400&family=Geist+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#fff;color:#0C0B09;-webkit-font-smoothing:antialiased}
        :root{
          --ink:#0C0B09;--cream:#F5F2ED;--warm:#EDE9E2;--mid:#5A5550;--light:#A09A94;
          --bd:rgba(12,11,9,0.1);
          --f-mono:'Geist Mono',monospace;--f-display:'Ranade',sans-serif;--f-body:'Lora',Georgia,serif
        }
        .site-header{position:fixed;top:0;left:0;right:0;z-index:100;background:#fff;border-bottom:1px solid var(--bd)}
        .nav-row{height:56px;display:flex;align-items:center;justify-content:center;padding:0 52px;position:relative}
        .nav-logo{font-family:var(--f-display);font-size:20px;font-weight:700;letter-spacing:0.08em;text-transform:lowercase;color:var(--ink);text-decoration:none}
        .nav-back{position:absolute;left:52px;font-family:var(--f-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--light);text-decoration:none;transition:color .15s}
        .nav-back:hover{color:var(--ink)}
        .header-spacer{height:56px}
        .page-header{padding:40px 52px 0;border-bottom:1px solid var(--bd)}
        .page-kicker{font-family:var(--f-mono);font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:var(--light);margin-bottom:12px}
        .page-title{font-family:var(--f-display);font-size:clamp(48px,7vw,80px);font-weight:700;letter-spacing:-0.03em;line-height:0.9;color:var(--ink)}
        .toolbar{display:flex;align-items:center;gap:12px;padding:20px 52px;border-bottom:1px solid var(--bd);flex-wrap:wrap}
        .cat-btn{font-family:var(--f-mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;background:none;border:1px solid var(--bd);color:var(--light);padding:5px 12px;cursor:pointer;transition:all .15s}
        .cat-btn.active,.cat-btn:hover{color:var(--ink);border-color:rgba(12,11,9,0.4)}
        .run-btn{font-family:var(--f-mono);font-size:9px;letter-spacing:0.14em;text-transform:uppercase;background:var(--ink);color:#fff;border:none;padding:7px 16px;cursor:pointer;margin-left:auto;transition:opacity .15s}
        .run-btn:hover{opacity:.8}
        .run-btn:disabled{opacity:.4;cursor:not-allowed}
        .table{width:100%;border-collapse:collapse}
        .table th{font-family:var(--f-mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--light);padding:12px 52px;border-bottom:1px solid var(--bd);text-align:left;white-space:nowrap;background:#fff;position:sticky;top:56px;z-index:10}
        .table th:not(:first-child){text-align:right;padding-left:12px}
        .table td{padding:14px 52px;border-bottom:1px solid var(--bd);vertical-align:top}
        .table td:not(:first-child){text-align:right;padding-left:12px;font-family:var(--f-mono);font-size:12px;color:var(--mid)}
        .table tr:hover td{background:var(--cream)}
        .trend-name{font-family:var(--f-display);font-size:18px;font-weight:700;letter-spacing:-0.01em;color:var(--ink)}
        .trend-cat{font-family:var(--f-mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--light);margin-top:3px}
        .score-bar-wrap{width:80px;height:3px;background:var(--warm);display:inline-block;vertical-align:middle;margin-left:6px;border-radius:1px}
        .score-bar{height:100%;background:var(--ink);border-radius:1px}
        .edit-btn{font-family:var(--f-mono);font-size:8px;letter-spacing:0.12em;text-transform:uppercase;background:none;border:1px solid var(--bd);color:var(--light);padding:4px 10px;cursor:pointer;transition:all .15s}
        .edit-btn:hover{color:var(--ink);border-color:rgba(12,11,9,0.4)}
        /* Edit panel */
        .edit-panel{background:var(--cream);border-bottom:1px solid var(--bd);padding:24px 52px;display:grid;grid-template-columns:1fr 1fr 2fr auto;gap:20px;align-items:start}
        .field-label{font-family:var(--f-mono);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--light);margin-bottom:6px}
        .field-input{width:100%;border:1px solid var(--bd);background:#fff;padding:9px 12px;font-family:var(--f-mono);font-size:13px;color:var(--ink);outline:none;transition:border-color .15s}
        .field-input:focus{border-color:var(--ink)}
        .show-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
        .show-tag{font-family:var(--f-mono);font-size:9px;background:var(--ink);color:#fff;padding:3px 8px;border-radius:1px;display:flex;align-items:center;gap:5px}
        .show-tag-x{cursor:pointer;opacity:0.6;font-size:10px}
        .show-tag-x:hover{opacity:1}
        .show-dropdown{position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid var(--bd);border-top:none;max-height:180px;overflow-y:auto;z-index:50}
        .show-option{font-family:var(--f-mono);font-size:10px;padding:8px 12px;cursor:pointer;transition:background .1s}
        .show-option:hover{background:var(--cream)}
        .save-btn{font-family:var(--f-mono);font-size:9px;letter-spacing:0.14em;text-transform:uppercase;background:var(--ink);color:#fff;border:none;padding:9px 20px;cursor:pointer;transition:opacity .15s;white-space:nowrap;align-self:flex-end}
        .save-btn:hover{opacity:.8}
        .save-btn:disabled{opacity:.4;cursor:not-allowed}
        .cancel-btn{font-family:var(--f-mono);font-size:9px;letter-spacing:0.14em;text-transform:uppercase;background:none;border:1px solid var(--bd);color:var(--light);padding:9px 16px;cursor:pointer;white-space:nowrap;align-self:flex-end}
        .cancel-btn:hover{color:var(--ink);border-color:rgba(12,11,9,0.4)}
        .save-msg{font-family:var(--f-mono);font-size:10px;color:#16873d;align-self:flex-end}
        footer{border-top:1px solid var(--bd);padding:24px 52px;display:flex;align-items:center;justify-content:space-between}
        .f-logo{font-family:var(--f-display);font-size:16px;font-weight:700;letter-spacing:0.08em;text-transform:lowercase}
        .f-copy{font-family:var(--f-mono);font-size:10px;letter-spacing:0.1em;color:var(--light)}
      `}</style>

      <header className="site-header">
        <div className="nav-row">
          <a href="/admin" className="nav-back">← Admin</a>
          <a href="/" className="nav-logo">runway fyi</a>
        </div>
      </header>
      <div className="header-spacer" />

      <div className="page-header">
        <div className="page-kicker">Admin · Manual Tagging · FW26</div>
        <h1 className="page-title">Trend<br />Tags</h1>
        <div style={{paddingBottom:20,paddingTop:16,fontFamily:'var(--f-body)',fontSize:13,color:'var(--mid)',maxWidth:480}}>
          Set runway look counts and show counts manually for each FW26 trend.
          After editing, click Run Scoring to recompute all composite scores.
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        {categories.map(cat => (
          <button key={cat} className={`cat-btn${categoryFilter===cat?' active':''}`} onClick={()=>setCategoryFilter(cat)}>
            {cat}
          </button>
        ))}
        <button className="run-btn" disabled={runningScore} onClick={runScoring}>
          {runningScore ? 'Running...' : 'Run Scoring →'}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{padding:'60px 52px',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--light)'}}>
          Loading trends...
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Trend</th>
              <th>Runway Looks</th>
              <th>Shows</th>
              <th>Runway Score</th>
              <th>Search</th>
              <th>Social</th>
              <th>Composite</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <>
                <tr key={item.id}>
                  <td>
                    <div className="trend-name">{item.name}</div>
                    <div className="trend-cat">{item.category}</div>
                  </td>
                  <td style={{color: item.runway_count===0 ? '#c0392b' : 'var(--mid)'}}>
                    {item.runway_count.toLocaleString()}
                  </td>
                  <td style={{color: item.runway_show_count===0 ? '#c0392b' : 'var(--mid)'}}>
                    {item.runway_show_count}
                  </td>
                  <td>
                    <span>{item.runway_score.toFixed(1)}</span>
                    <span className="score-bar-wrap"><span className="score-bar" style={{width:`${item.runway_score}%`}} /></span>
                  </td>
                  <td>
                    <span>{item.search_score.toFixed(1)}</span>
                    <span className="score-bar-wrap"><span className="score-bar" style={{width:`${item.search_score}%`}} /></span>
                  </td>
                  <td>
                    <span>{item.social_score.toFixed(1)}</span>
                    <span className="score-bar-wrap"><span className="score-bar" style={{width:`${item.social_score}%`}} /></span>
                  </td>
                  <td style={{fontWeight:600,color:'var(--ink)'}}>
                    {item.trend_score.toFixed(1)}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => editId===item.id ? setEditId(null) : openEdit(item)}>
                      {editId===item.id ? 'Cancel' : 'Edit'}
                    </button>
                  </td>
                </tr>

                {/* Inline edit panel */}
                {editId===item.id && (
                  <tr key={`edit-${item.id}`}>
                    <td colSpan={8} style={{padding:0}}>
                      <div className="edit-panel">
                        {/* Runway look count */}
                        <div>
                          <div className="field-label">Runway look count</div>
                          <input className="field-input" type="number" min="0"
                            value={edit.runway_count}
                            onChange={e=>setEdit(p=>({...p,runway_count:e.target.value}))}
                            placeholder="e.g. 450" />
                          <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--light)',marginTop:5}}>
                            Total looks across all shows featuring this trend
                          </div>
                        </div>

                        {/* Show count */}
                        <div>
                          <div className="field-label">Show count</div>
                          <input className="field-input" type="number" min="0"
                            value={edit.selected_shows.length > 0 ? String(edit.selected_shows.length) : edit.runway_show_count}
                            onChange={e=>setEdit(p=>({...p,runway_show_count:e.target.value}))}
                            placeholder="e.g. 38" />
                          <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--light)',marginTop:5}}>
                            Auto-updates from show picker →
                          </div>
                        </div>

                        {/* Show picker */}
                        <div>
                          <div className="field-label">
                            Shows featuring this trend
                            {edit.selected_shows.length > 0 && <span style={{marginLeft:8,color:'var(--ink)'}}>({edit.selected_shows.length} selected)</span>}
                          </div>
                          <div style={{position:'relative'}}>
                            <input className="field-input" type="text"
                              placeholder="Search and select shows..."
                              value={edit.show_search}
                              onChange={e=>{setEdit(p=>({...p,show_search:e.target.value}));setShowDropdown(true)}}
                              onFocus={()=>setShowDropdown(true)}
                              onBlur={()=>setTimeout(()=>setShowDropdown(false),150)} />
                            {showDropdown && filteredShows.length > 0 && (
                              <div className="show-dropdown">
                                {filteredShows.slice(0,15).map(show => (
                                  <div key={show} className="show-option"
                                    onClick={()=>setEdit(p=>({...p,selected_shows:[...p.selected_shows,show],show_search:''}))}>
                                    {show}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {edit.selected_shows.length > 0 && (
                            <div className="show-tags">
                              {edit.selected_shows.map(show => (
                                <span key={show} className="show-tag">
                                  {show}
                                  <span className="show-tag-x"
                                    onClick={()=>setEdit(p=>({...p,selected_shows:p.selected_shows.filter(s=>s!==show)}))}>
                                    ✕
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Save / cancel */}
                        <div style={{display:'flex',flexDirection:'column',gap:8,justifyContent:'flex-end'}}>
                          {saveMsg && <div className="save-msg">{saveMsg}</div>}
                          <button className="save-btn" disabled={saving} onClick={()=>saveEdit(item)}>
                            {saving ? 'Saving...' : 'Save →'}
                          </button>
                          <button className="cancel-btn" onClick={()=>setEditId(null)}>Cancel</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}

      <footer>
        <span className="f-logo">runway fyi</span>
        <span className="f-copy">© 2026 runwayfyi.com</span>
      </footer>
    </>
  )
}
