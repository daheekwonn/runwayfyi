'use client'

// app/admin/page.tsx
// Unified admin hub — matches runway fyi design system exactly.
// Password: Runw3825!

import { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'Runw3825!'
const SESSION_KEY = 'rwfyi_admin_auth'
const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

const NAV_LINKS = [
  { label: 'Trends',   href: '/trends' },
  { label: 'Analysis', href: '/analysis' },
  { label: 'FYI',      href: '/fyi' },
  { label: 'Shows',    href: '/shows' },
  { label: 'Archive',  href: '/archive' },
]

const SECTIONS = [
  {
    id: 'shows',
    kicker: 'Runway · FW26',
    label: 'Shows',
    description: 'Manage runway shows, cover images, city tags, and show scores.',
    href: '/admin/shows',
    external: false,
  },
  {
    id: 'looks',
    kicker: 'Images · Vision',
    label: 'Looks',
    description: 'Add, reorder, delete, and bulk-upload look images per show.',
    href: '/admin/looks',
    external: false,
  },
  {
    id: 'vision',
    kicker: 'Detection · API',
    label: 'Vision Lab',
    description: 'Upload runway images and get Google Vision garment detection boxes.',
    href: '/admin/vision',
    external: false,
  },
  {
    id: 'analysis',
    kicker: 'CMS · Sanity',
    label: 'Analysis',
    description: 'Write and publish analysis articles, opinion pieces, and data takes.',
    href: 'https://runwayfyi.sanity.studio',
    external: true,
  },
  {
    id: 'fyi',
    kicker: 'CMS · Sanity',
    label: 'FYI',
    description: 'Manage short FYI data takes shown on the homepage strip.',
    href: 'https://runwayfyi.sanity.studio',
    external: true,
  },
  {
    id: 'archive',
    kicker: 'Static · Seasons',
    label: 'Archive',
    description: 'Season archive with Pantone swatches. Edit in app/archive/page.tsx.',
    href: '/archive',
    external: false,
  },
  {
    id: 'about',
    kicker: 'Static · Methodology',
    label: 'About',
    description: 'Scoring methodology and personal intro. Edit in app/about/page.tsx.',
    href: '/about',
    external: false,
  },
  {
    id: 'trends',
    kicker: 'Live · runway fyi',
    label: 'Trends Page',
    description: 'View the live trends dashboard. Pulls from Railway every hour.',
    href: '/trends',
    external: false,
  },
]

const QUICK_ACTIONS = [
  {
    label: 'Run scoring pipeline',
    kicker: 'POST · /api/trends/run-scoring',
    description: 'Recompute all composite trend scores (50% runway + 30% search + 20% social).',
    endpoint: '/api/trends/run-scoring',
  },
  {
    label: 'Refresh look counts',
    kicker: 'POST · /api/trends/shows/refresh-counts',
    description: 'Fix stale look counts per show in the database.',
    endpoint: '/api/trends/shows/refresh-counts',
  },
  {
    label: 'Seed trend items',
    kicker: 'POST · /api/trends/seed/items',
    description: 'Re-seed all FW26 parent trend items into the database.',
    endpoint: '/api/trends/seed/items',
  },
  {
    label: 'Seed sub-items',
    kicker: 'POST · /api/trends/seed/subitems',
    description: 'Re-seed all FW26 trend sub-items with runway show counts.',
    endpoint: '/api/trends/seed/subitems',
  },
]

const SYSTEM_LINKS = [
  { label: 'Railway',          href: 'https://railway.app' },
  { label: 'Vercel',           href: 'https://vercel.com' },
  { label: 'Sanity Studio',    href: 'https://runwayfyi.sanity.studio' },
  { label: 'GitHub Frontend',  href: 'https://github.com/daheekwonn/runwayfyi' },
  { label: 'GitHub Backend',   href: 'https://github.com/daheekwonn/fashion-backend' },
  { label: 'API Health',       href: `${RAILWAY_API}/health` },
  { label: 'Leaderboard JSON', href: `${RAILWAY_API}/api/trends/leaderboard` },
]

// ─── Password gate ─────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError]  = useState(false)

  const attempt = () => {
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onUnlock()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Geist+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #0C0B09; --white: #FFFFFF; --cream: #F5F2ED;
          --warm: #EDE9E2; --mid: #5A5550; --light: #A09A94;
          --bd: rgba(12,11,9,0.1);
          --f-mono: 'Geist Mono', monospace;
          --f-display: 'Ranade', sans-serif;
          --f-body: 'Lora', Georgia, serif;
        }
        body { background: #fff; color: var(--ink); -webkit-font-smoothing: antialiased; }
        .gate-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 40px; padding: 24px; }
        .gate-logo { font-family: var(--f-display); font-size: 22px; font-weight: 700; letter-spacing: 0.08em; text-transform: lowercase; color: var(--ink); text-decoration: none; }
        .gate-kicker { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--light); text-align: center; margin-bottom: 8px; }
        .gate-title { font-family: var(--f-display); font-size: clamp(48px, 10vw, 80px); font-weight: 700; letter-spacing: -0.03em; line-height: 0.9; color: var(--ink); text-align: center; }
        .gate-form { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 300px; }
        .gate-input { border: 1px solid var(--bd); background: #fff; color: var(--ink); font-family: var(--f-mono); font-size: 13px; letter-spacing: 0.08em; padding: 12px 16px; outline: none; transition: border-color .15s; }
        .gate-input:focus { border-color: var(--ink); }
        .gate-input.err { border-color: #c0392b; }
        .gate-btn { background: var(--ink); color: #fff; border: none; font-family: var(--f-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; padding: 12px 16px; cursor: pointer; transition: opacity .15s; }
        .gate-btn:hover { opacity: .8; }
        .gate-error { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em; color: #c0392b; text-align: center; }
      `}</style>
      <div className="gate-wrap">
        <div style={{ textAlign: 'center' }}>
          <a href="/" className="gate-logo">runway fyi</a>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="gate-kicker">Admin · Command Centre</div>
          <div className="gate-title">Admin</div>
        </div>
        <div className="gate-form">
          <input
            className={`gate-input${error ? ' err' : ''}`}
            type="password"
            placeholder="Password"
            value={value}
            autoFocus
            onChange={e => { setValue(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
          />
          <button className="gate-btn" onClick={attempt}>Unlock →</button>
          {error && <div className="gate-error">Incorrect password</div>}
        </div>
      </div>
    </>
  )
}

// ─── Main hub ─────────────────────────────────────────────────────────────────

export default function AdminHub() {
  const [unlocked, setUnlocked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [actionResults, setActionResults] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true)
  }, [])

  const runAction = async (action: typeof QUICK_ACTIONS[0]) => {
    const key = action.label
    setActionLoading(p => ({ ...p, [key]: true }))
    setActionResults(p => ({ ...p, [key]: '' }))
    try {
      const resp = await fetch(`${RAILWAY_API}${action.endpoint}`, { method: 'POST' })
      const data = await resp.json()
      setActionResults(p => ({ ...p, [key]: resp.ok ? '✓ Done' : `✗ ${data.detail || 'Error'}` }))
    } catch {
      setActionResults(p => ({ ...p, [key]: '✗ Network error' }))
    }
    setActionLoading(p => ({ ...p, [key]: false }))
  }

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Geist+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #0C0B09; --white: #FFFFFF; --cream: #F5F2ED;
          --warm: #EDE9E2; --mid: #5A5550; --light: #A09A94;
          --bd: rgba(12,11,9,0.1);
          --f-mono: 'Geist Mono', monospace;
          --f-display: 'Ranade', sans-serif;
          --f-body: 'Lora', Georgia, serif;
        }
        body { background: #fff; color: var(--ink); -webkit-font-smoothing: antialiased; }

        /* ── Header (matches HomeClient exactly) ── */
        .site-header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(255,255,255,1); border-bottom: 1px solid var(--bd); }
        .nav-title-row { height: 56px; display: flex; align-items: center; justify-content: center; padding: 0 52px; background: #fff; position: relative; }
        .nav-logo { font-family: var(--f-display); font-size: 20px; font-weight: 700; letter-spacing: 0.08em; text-transform: lowercase; color: var(--ink); text-decoration: none; }
        .nav-menu-btn { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; flex-direction: column; gap: 5px; padding: 6px; }
        .nav-menu-btn span { display: block; width: 22px; height: 1.5px; background: var(--ink); transition: transform .2s, opacity .2s; }
        .nav-menu-btn.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-menu-btn.open span:nth-child(2) { opacity: 0; }
        .nav-menu-btn.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
        .nav-pill { position: absolute; right: 52px; top: 50%; transform: translateY(-50%); font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.13em; text-transform: uppercase; border: 1px solid var(--bd); color: var(--light); padding: 5px 13px; }
        .nav-links-row { height: 38px; display: flex; align-items: center; justify-content: center; gap: 44px; background: #fff; border-top: 1px solid var(--bd); list-style: none; padding: 0; }
        .nav-links-row a { font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink); text-decoration: none; transition: color .15s; }
        .nav-links-row a:hover { color: var(--light); }
        .nav-links-row a.curr { color: var(--light); }
        .header-spacer { height: 118px; }

        /* ── Drawer ── */
        .nav-overlay { position: fixed; inset: 0; background: rgba(12,11,9,0.3); z-index: 1999; opacity: 0; pointer-events: none; transition: opacity .3s; }
        .nav-overlay.open { opacity: 1; pointer-events: all; }
        .nav-drawer { position: fixed; top: 0; left: 0; bottom: 0; width: 300px; background: #fff; z-index: 2000; transform: translateX(-100%); transition: transform .3s cubic-bezier(.4,0,.2,1); border-right: 1px solid var(--bd); display: flex; flex-direction: column; padding: 32px 28px; gap: 0; }
        .nav-drawer.open { transform: translateX(0); }
        .nav-drawer-close { position: absolute; top: 18px; right: 20px; background: none; border: none; cursor: pointer; font-family: var(--f-mono); font-size: 18px; color: var(--mid); }
        .nav-drawer-logo { font-family: var(--f-display); font-size: 18px; font-weight: 700; letter-spacing: 0.08em; text-transform: lowercase; color: var(--ink); text-decoration: none; margin-bottom: 36px; display: block; }
        .nav-drawer-link { font-family: var(--f-mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink); text-decoration: none; padding: 16px 0; border-bottom: 1px solid var(--bd); display: block; transition: color .15s; }
        .nav-drawer-link:hover, .nav-drawer-link.curr { color: var(--light); }

        /* ── Page header ── */
        .page-header { padding: 40px 52px 0; border-bottom: 1px solid var(--bd); }
        .page-kicker { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--light); margin-bottom: 12px; }
        .page-title { font-family: var(--f-display); font-size: clamp(52px, 8vw, 88px); font-weight: 700; letter-spacing: -0.03em; line-height: 0.9; color: var(--ink); }
        .page-header-meta { display: flex; align-items: center; gap: 12px; padding: 20px 0; }
        .meta-pill { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.13em; text-transform: uppercase; border: 1px solid var(--bd); color: var(--light); padding: 5px 13px; }
        .lock-btn { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.13em; text-transform: uppercase; background: none; border: 1px solid var(--bd); color: var(--light); padding: 5px 13px; cursor: pointer; transition: color .15s, border-color .15s; }
        .lock-btn:hover { color: var(--ink); border-color: rgba(12,11,9,0.4); }

        /* ── Section label (matches .section-head pattern) ── */
        .section-divider { display: flex; align-items: baseline; justify-content: space-between; padding: 28px 52px 14px; border-bottom: 1px solid var(--bd); }
        .section-divider-title { font-family: var(--f-display); font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; color: var(--ink); }
        .section-divider-note { font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--light); }

        /* ── Pages grid ── */
        .pages-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--bd); }
        .page-card { padding: 28px 28px 24px; border-right: 1px solid var(--bd); border-bottom: 1px solid var(--bd); text-decoration: none; color: inherit; display: block; transition: background .15s; }
        .page-card:nth-child(4n) { border-right: none; }
        .page-card:nth-last-child(-n+4) { border-bottom: none; }
        .page-card:hover { background: var(--cream); }
        .page-card-kicker { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--light); margin-bottom: 8px; }
        .page-card-label { font-family: var(--f-display); font-size: 28px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; color: var(--ink); margin-bottom: 10px; }
        .page-card-ext { font-family: var(--f-mono); font-size: 10px; color: var(--light); margin-left: 5px; }
        .page-card-desc { font-family: var(--f-body); font-size: 12px; color: var(--mid); line-height: 1.6; }
        .page-card-arrow { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--light); margin-top: 14px; display: block; transition: color .15s; }
        .page-card:hover .page-card-arrow { color: var(--ink); }

        /* ── Quick actions grid ── */
        .actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--bd); }
        .action-card { padding: 28px 28px 24px; border-right: 1px solid var(--bd); display: flex; flex-direction: column; gap: 16px; }
        .action-card:last-child { border-right: none; }
        .action-kicker { font-family: var(--f-mono); font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--light); margin-bottom: 4px; }
        .action-label { font-family: var(--f-display); font-size: 22px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; color: var(--ink); }
        .action-desc { font-family: var(--f-body); font-size: 12px; color: var(--mid); line-height: 1.55; }
        .action-btn { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; background: var(--ink); color: #fff; border: none; padding: 9px 16px; cursor: pointer; transition: opacity .15s; display: inline-block; }
        .action-btn:hover { opacity: .75; }
        .action-btn:disabled { opacity: .35; cursor: not-allowed; }
        .action-result { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.08em; }
        .action-result.ok  { color: #16873d; }
        .action-result.err { color: #c0392b; }

        /* ── System links ── */
        .system-links { padding: 24px 52px 40px; display: flex; flex-wrap: wrap; gap: 8px; }
        .sys-link { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--light); text-decoration: none; border: 1px solid var(--bd); padding: 6px 14px; transition: color .15s, border-color .15s; }
        .sys-link:hover { color: var(--ink); border-color: rgba(12,11,9,0.35); }

        /* ── Footer ── */
        footer { border-top: 1px solid var(--bd); padding: 24px 52px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .f-logo { font-family: var(--f-display); font-size: 16px; font-weight: 700; letter-spacing: 0.08em; text-transform: lowercase; color: var(--ink); }
        .f-copy { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--light); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .pages-grid { grid-template-columns: repeat(3, 1fr); }
          .page-card:nth-child(4n) { border-right: 1px solid var(--bd); }
          .page-card:nth-child(3n) { border-right: none; }
        }
        @media (max-width: 768px) {
          .pages-grid, .actions-grid { grid-template-columns: repeat(2, 1fr); }
          .page-card:nth-child(n) { border-right: 1px solid var(--bd); }
          .page-card:nth-child(2n) { border-right: none; }
          .action-card:nth-child(n) { border-right: 1px solid var(--bd); }
          .action-card:nth-child(2n) { border-right: none; border-bottom: 1px solid var(--bd); }
          .action-card:last-child { border-bottom: none; }
          .page-header { padding: 32px 24px 0; }
          .section-divider { padding: 24px 24px 12px; }
          .system-links { padding: 20px 24px 32px; }
          footer { padding: 20px 24px; }
          .nav-links-row { gap: 24px; }
        }
        @media (max-width: 480px) {
          .pages-grid, .actions-grid { grid-template-columns: 1fr; }
          .page-card:nth-child(n) { border-right: none; border-bottom: 1px solid var(--bd); }
          .action-card:nth-child(n) { border-right: none; border-bottom: 1px solid var(--bd); }
        }
      `}</style>

      {/* Overlay */}
      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Drawer */}
      <nav className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
        <a href="/" className="nav-drawer-logo">runway fyi</a>
        {NAV_LINKS.map(l => (
          <a key={l.href} href={l.href} className="nav-drawer-link">{l.label}</a>
        ))}
        <a href="/admin" className="nav-drawer-link curr">Admin</a>
        <a href="/about" className="nav-drawer-link">About</a>
      </nav>

      {/* Fixed header */}
      <header className="site-header">
        <div className="nav-title-row">
          <button
            className={`nav-menu-btn${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
          <a href="/" className="nav-logo">runway fyi</a>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className="nav-links-row">
          {NAV_LINKS.map(l => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
          <li><a href="/admin" className="curr">Admin</a></li>
        </ul>
      </header>

      <div className="header-spacer" />

      {/* Page header */}
      <div className="page-header">
        <div className="page-kicker">Admin · FW26 · runway fyi</div>
        <h1 className="page-title">Command<br />Centre</h1>
        <div className="page-header-meta">
          <span className="meta-pill">Season · FW26</span>
          <button
            className="lock-btn"
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setUnlocked(false) }}
          >
            Lock session
          </button>
        </div>
      </div>

      {/* Pages & Tools */}
      <div className="section-divider">
        <span className="section-divider-title">Pages</span>
        <span className="section-divider-note">All sections</span>
      </div>
      <div className="pages-grid">
        {SECTIONS.map(s => (
          <a
            key={s.id}
            href={s.href}
            target={s.external ? '_blank' : '_self'}
            rel={s.external ? 'noopener noreferrer' : undefined}
            className="page-card"
          >
            <div className="page-card-kicker">{s.kicker}</div>
            <div className="page-card-label">
              {s.label}
              {s.external && <span className="page-card-ext">↗</span>}
            </div>
            <div className="page-card-desc">{s.description}</div>
            <span className="page-card-arrow">Open →</span>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="section-divider">
        <span className="section-divider-title">Actions</span>
        <span className="section-divider-note">Railway API · one-click</span>
      </div>
      <div className="actions-grid">
        {QUICK_ACTIONS.map(action => (
          <div key={action.label} className="action-card">
            <div>
              <div className="action-kicker">{action.kicker}</div>
              <div className="action-label">{action.label}</div>
              <div className="action-desc">{action.description}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="action-btn"
                disabled={!!actionLoading[action.label]}
                onClick={() => runAction(action)}
              >
                {actionLoading[action.label] ? 'Running...' : 'Run →'}
              </button>
              {actionResults[action.label] && (
                <span className={`action-result${actionResults[action.label].startsWith('✓') ? ' ok' : ' err'}`}>
                  {actionResults[action.label]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* System links */}
      <div className="section-divider">
        <span className="section-divider-title">System</span>
        <span className="section-divider-note">External dashboards</span>
      </div>
      <div className="system-links">
        {SYSTEM_LINKS.map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="sys-link">
            {l.label} ↗
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer>
        <span className="f-logo">runway fyi</span>
        <span className="f-copy">© 2026 runwayfyi.com</span>
      </footer>
    </>
  )
}
