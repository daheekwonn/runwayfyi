'use client'

/**
 * runway.fyi — Unified Admin Hub
 * File: app/admin/page.tsx
 *
 * Single password-gated page linking to all admin sections.
 * Password: Runw3825!
 */

import { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'Runw3825!'
const SESSION_KEY = 'rwfyi_admin_auth'
const RAILWAY_API = 'https://fashion-backend-production-6880.up.railway.app'

// ─── Admin sections ────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'shows',
    label: 'Shows',
    kicker: 'Runway · FW26',
    description: 'Manage runway shows, cover images, city tags, and show scores.',
    href: '/admin/shows',
    external: false,
    color: '#C8A882',
    stat: null,
  },
  {
    id: 'looks',
    label: 'Looks',
    kicker: 'Images · Vision',
    description: 'Add, reorder, delete, and bulk-upload look images per show.',
    href: '/admin/looks',
    external: false,
    color: '#8CA89C',
    stat: null,
  },
  {
    id: 'vision',
    label: 'Vision Lab',
    kicker: 'Detection · API',
    description: 'Upload runway images and get Google Vision garment detection boxes.',
    href: '/admin/vision',
    external: false,
    color: '#B07070',
    stat: null,
  },
  {
    id: 'trends',
    label: 'Trends',
    kicker: 'Scoring · Pipeline',
    description: 'View leaderboard, trigger scoring pipeline, check composite scores.',
    href: `${RAILWAY_API}/api/trends/leaderboard`,
    external: true,
    color: '#7090B0',
    stat: null,
  },
  {
    id: 'analysis',
    label: 'Analysis',
    kicker: 'CMS · Sanity',
    description: 'Write and publish analysis articles, opinion pieces, and data takes.',
    href: 'https://runwayfyi.sanity.studio',
    external: true,
    color: '#90A870',
    stat: null,
  },
  {
    id: 'fyi',
    label: 'FYI',
    kicker: 'CMS · Sanity',
    description: 'Manage short FYI data takes that appear on the homepage strip.',
    href: 'https://runwayfyi.sanity.studio',
    external: true,
    color: '#A870A0',
    stat: null,
  },
  {
    id: 'homepage',
    label: 'Homepage',
    kicker: 'Live · runwayfyi.com',
    description: 'View the live homepage. Leaderboard pulls from Railway every hour.',
    href: '/',
    external: false,
    color: '#C8B060',
    stat: null,
  },
  {
    id: 'archive',
    label: 'Archive',
    kicker: 'Static · Seasons',
    description: 'Season archive with Pantone swatches. Edit in app/archive/page.tsx.',
    href: '/archive',
    external: false,
    color: '#709080',
    stat: null,
  },
  {
    id: 'about',
    label: 'About',
    kicker: 'Static · Methodology',
    description: 'Scoring methodology explainer and personal intro. Edit in app/about/page.tsx.',
    href: '/about',
    external: false,
    color: '#C87060',
    stat: null,
  },
]

// ─── Quick actions ──────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    label: 'Run scoring pipeline',
    description: 'Recompute all composite trend scores',
    method: 'POST',
    endpoint: '/api/trends/run-scoring',
  },
  {
    label: 'Refresh look counts',
    description: 'Fix stale look counts per show',
    method: 'POST',
    endpoint: '/api/trends/shows/refresh-counts',
  },
  {
    label: 'Seed trend items',
    description: 'Re-seed FW26 parent trend items',
    method: 'POST',
    endpoint: '/api/trends/seed/items',
  },
  {
    label: 'Seed trend sub-items',
    description: 'Re-seed FW26 sub-items',
    method: 'POST',
    endpoint: '/api/trends/seed/subitems',
  },
]

// ─── Password gate ──────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const attempt = () => {
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setValue('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0C0B09',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 32,
      padding: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: '"Geist Mono", monospace',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#5A5550',
          marginBottom: 16,
        }}>
          runway.fyi · Admin
        </div>
        <div style={{
          fontFamily: '"Ranade", sans-serif',
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 0.9,
          color: '#F5F2ED',
        }}>
          Command<br />Centre
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
        maxWidth: 320,
        animation: shake ? 'shake 0.4s ease' : 'none',
      }}>
        <input
          type="password"
          placeholder="Password"
          value={value}
          autoFocus
          onChange={e => { setValue(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{
            background: '#1A1916',
            border: error ? '1px solid #B07070' : '1px solid #2A2926',
            borderRadius: 2,
            color: '#F5F2ED',
            fontFamily: '"Geist Mono", monospace',
            fontSize: 13,
            padding: '12px 16px',
            outline: 'none',
            letterSpacing: '0.1em',
          }}
        />
        <button
          onClick={attempt}
          style={{
            background: '#F5F2ED',
            border: 'none',
            borderRadius: 2,
            color: '#0C0B09',
            fontFamily: '"Geist Mono", monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '12px 16px',
            cursor: 'pointer',
          }}
        >
          Unlock →
        </button>
        {error && (
          <div style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: 10,
            color: '#B07070',
            textAlign: 'center',
            letterSpacing: '0.1em',
          }}>
            Incorrect password
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0) }
          20% { transform: translateX(-8px) }
          40% { transform: translateX(8px) }
          60% { transform: translateX(-6px) }
          80% { transform: translateX(6px) }
        }
      `}</style>
    </div>
  )
}

// ─── Main admin hub ────────────────────────────────────────────────────────

export default function AdminHub() {
  const [unlocked, setUnlocked] = useState(false)
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
      const resp = await fetch(`${RAILWAY_API}${action.endpoint}`, { method: action.method })
      const data = await resp.json()
      setActionResults(p => ({ ...p, [key]: resp.ok ? '✓ Done' : `✗ ${data.detail || 'Error'}` }))
    } catch (e) {
      setActionResults(p => ({ ...p, [key]: '✗ Network error' }))
    }
    setActionLoading(p => ({ ...p, [key]: false }))
  }

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0C0B09',
      color: '#F5F2ED',
      fontFamily: '"Lora", Georgia, serif',
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(245,242,237,0.08)',
        padding: '32px 48px 28px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#5A5550',
            marginBottom: 10,
          }}>
            runway.fyi · Admin · FW26
          </div>
          <h1 style={{
            fontFamily: '"Ranade", sans-serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            margin: 0,
            color: '#F5F2ED',
          }}>
            Command<br />Centre
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#5A5550',
            textDecoration: 'none',
          }}>
            ← Site
          </a>
          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setUnlocked(false) }}
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#5A5550',
              background: 'none',
              border: '1px solid #2A2926',
              borderRadius: 2,
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            Lock
          </button>
        </div>
      </div>

      <div style={{ padding: '40px 48px', maxWidth: 1200 }}>

        {/* Section grid */}
        <div style={{
          fontFamily: '"Geist Mono", monospace',
          fontSize: 9,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#5A5550',
          marginBottom: 20,
        }}>
          Pages & Tools
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 2,
          marginBottom: 48,
        }}>
          {SECTIONS.map(section => (
            <a
              key={section.id}
              href={section.href}
              target={section.external ? '_blank' : '_self'}
              rel={section.external ? 'noopener noreferrer' : undefined}
              style={{
                display: 'block',
                background: '#111010',
                border: '1px solid #1A1916',
                borderRadius: 2,
                padding: '20px 22px',
                textDecoration: 'none',
                color: '#F5F2ED',
                transition: 'background 0.15s, border-color 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#1A1916'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2926'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#111010'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#1A1916'
              }}
            >
              {/* Colour bar */}
              <div style={{
                width: 24,
                height: 3,
                background: section.color,
                borderRadius: 1,
                marginBottom: 14,
              }} />

              <div style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: 8,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#5A5550',
                marginBottom: 6,
              }}>
                {section.kicker}
                {section.external && <span style={{ marginLeft: 6, opacity: 0.5 }}>↗</span>}
              </div>

              <div style={{
                fontFamily: '"Ranade", sans-serif',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 8,
                color: '#F5F2ED',
              }}>
                {section.label}
              </div>

              <div style={{
                fontFamily: '"Lora", Georgia, serif',
                fontSize: 12,
                color: '#5A5550',
                lineHeight: 1.5,
              }}>
                {section.description}
              </div>
            </a>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{
          fontFamily: '"Geist Mono", monospace',
          fontSize: 9,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#5A5550',
          marginBottom: 20,
        }}>
          Quick Actions · Railway API
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 2,
          marginBottom: 48,
        }}>
          {QUICK_ACTIONS.map(action => (
            <div
              key={action.label}
              style={{
                background: '#111010',
                border: '1px solid #1A1916',
                borderRadius: 2,
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div>
                <div style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: 8,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#5A5550',
                  marginBottom: 5,
                }}>
                  {action.method} {action.endpoint}
                </div>
                <div style={{
                  fontFamily: '"Ranade", sans-serif',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#F5F2ED',
                  marginBottom: 4,
                }}>
                  {action.label}
                </div>
                <div style={{
                  fontFamily: '"Lora", Georgia, serif',
                  fontSize: 12,
                  color: '#5A5550',
                }}>
                  {action.description}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => runAction(action)}
                  disabled={actionLoading[action.label]}
                  style={{
                    background: actionLoading[action.label] ? '#2A2926' : '#F5F2ED',
                    border: 'none',
                    borderRadius: 2,
                    color: '#0C0B09',
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '8px 14px',
                    cursor: actionLoading[action.label] ? 'not-allowed' : 'pointer',
                    opacity: actionLoading[action.label] ? 0.5 : 1,
                  }}
                >
                  {actionLoading[action.label] ? 'Running...' : 'Run →'}
                </button>
                {actionResults[action.label] && (
                  <span style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: 10,
                    color: actionResults[action.label].startsWith('✓') ? '#90A870' : '#B07070',
                    letterSpacing: '0.08em',
                  }}>
                    {actionResults[action.label]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* System status */}
        <div style={{
          fontFamily: '"Geist Mono", monospace',
          fontSize: 9,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#5A5550',
          marginBottom: 20,
        }}>
          System · Links
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {[
            { label: 'Railway Dashboard', href: 'https://railway.app' },
            { label: 'Vercel Dashboard', href: 'https://vercel.com' },
            { label: 'Sanity Studio', href: 'https://runwayfyi.sanity.studio' },
            { label: 'GitHub Frontend', href: 'https://github.com/daheekwonn/runwayfyi' },
            { label: 'GitHub Backend', href: 'https://github.com/daheekwonn/fashion-backend' },
            { label: 'API Health', href: `${RAILWAY_API}/health` },
            { label: 'Leaderboard JSON', href: `${RAILWAY_API}/api/trends/leaderboard` },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#5A5550',
                textDecoration: 'none',
                border: '1px solid #2A2926',
                borderRadius: 2,
                padding: '6px 12px',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#F5F2ED'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#5A5550'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = '#5A5550'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2926'
              }}
            >
              {link.label} ↗
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}
