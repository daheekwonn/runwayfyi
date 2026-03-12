'use client'

import { useState } from 'react'

interface TrendItem {
  id: number
  rank: number
  name: string
  category: string
  season: string
  trend_score: number
  runway_score: number
  search_score: number
  social_score: number
  runway_count: number
  runway_show_count: number
  trend_delta: number
  is_rising: boolean
  last_scored_at: string | null
}

interface Props {
  leaderboard: TrendItem[]
  all: TrendItem[]
}

const CATEGORY_LABELS: Record<string, string> = {
  outerwear: 'Outerwear',
  dress: 'Dresses & Silhouettes',
  tailoring: 'Tailoring',
  footwear: 'Footwear',
  accessory: 'Accessories',
  material: 'Materials',
  color: 'Colours',
  aesthetic: 'Aesthetics',
}

const CATEGORY_ORDER = ['outerwear', 'tailoring', 'dress', 'footwear', 'material', 'color', 'accessory', 'aesthetic']

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--mid)' }}>{label}</span>
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ height: '2px', background: 'var(--warm)', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '1px', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
    </div>
  )
}

function TrendCard({ item, rank }: { item: TrendItem; rank: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        padding: '20px',
        borderBottom: '1px solid var(--bd)',
        cursor: 'pointer',
        transition: 'background 0.2s',
        background: expanded ? 'var(--cream)' : 'transparent',
      }}
      onMouseEnter={e => { if (!expanded) (e.currentTarget as HTMLElement).style.background = 'var(--warm)' }}
      onMouseLeave={e => { if (!expanded) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Rank */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--light)',
          minWidth: '24px',
          paddingTop: '2px',
        }}>
          {String(rank).padStart(2, '0')}
        </span>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 500, color: 'var(--ink)' }}>
              {item.name}
            </span>
            {item.is_rising && (
              <span style={{
                fontSize: '9px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'var(--ink)',
                color: 'var(--white)',
                padding: '2px 6px',
                borderRadius: '2px',
              }}>Rising</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>
              {item.runway_show_count} shows
            </span>
            {item.trend_delta > 0 && (
              <span style={{ fontSize: '11px', color: '#2d6a4f', fontFamily: 'var(--font-mono)' }}>
                +{item.trend_delta.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1 }}>
            {item.trend_score.toFixed(1)}
          </div>
          <div style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--light)', marginTop: '2px' }}>
            Score
          </div>
        </div>

        {/* Expand toggle */}
        <span style={{
          color: 'var(--light)',
          fontSize: '14px',
          flexShrink: 0,
          paddingTop: '2px',
          transition: 'transform 0.2s',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>▾</span>
      </div>

      {/* Expanded breakdown */}
      {expanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--bd)', paddingLeft: '40px' }}>
          <ScoreBar label="Runway" value={item.runway_score} color="var(--ink)" />
          <ScoreBar label="Search" value={item.search_score} color="#8B7355" />
          <ScoreBar label="Social" value={item.social_score} color="#A09A94" />
          <p style={{ fontSize: '11px', color: 'var(--light)', marginTop: '12px', fontStyle: 'italic' }}>
            Formula: 50% runway · 30% search · 20% social
          </p>
        </div>
      )}
    </div>
  )
}

function CategorySection({ category, items }: { category: string; items: TrendItem[] }) {
  const [collapsed, setCollapsed] = useState(false)
  const label = CATEGORY_LABELS[category] || category

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Category header */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '2px solid var(--ink)',
          marginBottom: '0',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            {label}
          </h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--light)' }}>
            {items.length} trends
          </span>
        </div>
        <span style={{ color: 'var(--light)', fontSize: '12px', transition: 'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
      </div>

      {!collapsed && (
        <div style={{ border: '1px solid var(--bd)', borderTop: 'none' }}>
          {items.map((item, i) => (
            <TrendCard key={item.id} item={item} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function TrendsClient({ leaderboard, all }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Group all items by category
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = all.filter(i => i.category === cat).sort((a, b) => b.trend_score - a.trend_score)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {} as Record<string, TrendItem[]>)

  const filters = ['all', ...CATEGORY_ORDER.filter(c => grouped[c])]

  const topThree = leaderboard.slice(0, 3)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>

      {/* Hero — editorial top section */}
      <div style={{ borderBottom: '1px solid var(--bd)', padding: '48px 0 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

          {/* Page title */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '8px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 400, margin: 0, lineHeight: 0.95 }}>
              Trend Index
            </h1>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--light)', letterSpacing: '0.1em' }}>
              FW26 · {all.length} signals
            </span>
          </div>
          <p style={{ color: 'var(--mid)', fontSize: '14px', maxWidth: '480px', marginBottom: '40px', lineHeight: 1.6 }}>
            Composite scores from runway frequency, search velocity, and social engagement. Updated daily.
          </p>

          {/* Top 3 hero cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--bd)', marginBottom: '-1px' }}>
            {topThree.map((item, i) => (
              <div key={item.id} style={{
                background: i === 0 ? 'var(--ink)' : 'var(--white)',
                padding: '32px 24px',
                color: i === 0 ? 'var(--white)' : 'var(--ink)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', opacity: 0.5, marginBottom: '8px', letterSpacing: '0.1em' }}>
                  #{item.rank} {item.category.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '16px' }}>
                  {item.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>
                    {item.trend_score.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '0.08em' }}>/ 100</span>
                </div>
                <div style={{ marginTop: '16px', fontSize: '11px', opacity: 0.6, fontFamily: 'var(--font-mono)' }}>
                  {item.runway_show_count} runway shows · {item.is_rising ? '↑ rising' : '→ stable'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ borderBottom: '1px solid var(--bd)', position: 'sticky', top: '0', background: 'var(--white)', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '14px 20px',
                  border: 'none',
                  borderBottom: activeFilter === f ? '2px solid var(--ink)' : '2px solid transparent',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: activeFilter === f ? 'var(--ink)' : 'var(--light)',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                  marginBottom: '-1px',
                }}
              >
                {f === 'all' ? 'All' : CATEGORY_LABELS[f] || f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category sections */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Methodology note */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'var(--bd)',
          marginBottom: '48px',
          border: '1px solid var(--bd)',
        }}>
          {[
            { label: 'Runway', weight: '50%', desc: 'Show frequency across Paris, Milan, London, New York' },
            { label: 'Search', weight: '30%', desc: 'Google Trends velocity vs 6-week baseline' },
            { label: 'Social', weight: '20%', desc: 'Instagram & TikTok engagement signals' },
          ].map(({ label, weight, desc }) => (
            <div key={label} style={{ background: 'var(--cream)', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 500 }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700 }}>{weight}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--mid)', margin: 0, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Filtered categories */}
        {(activeFilter === 'all' ? CATEGORY_ORDER : [activeFilter])
          .filter(cat => grouped[cat])
          .map(cat => (
            <CategorySection key={cat} category={cat} items={grouped[cat]} />
          ))
        }
      </div>

      {/* Footer note */}
      <div style={{ borderTop: '1px solid var(--bd)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: 'var(--light)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', margin: 0 }}>
          SCORES UPDATED DAILY · FW26 SEASON · RUNWAY.FYI
        </p>
      </div>
    </div>
  )
}
