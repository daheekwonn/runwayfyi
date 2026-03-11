'use client'

import Link from 'next/link'
import { useState } from 'react'

// ── placeholder data ──────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Opinion', 'Data', 'Forecast', 'Cultural Context', 'Show Review']
const SEASONS    = ['All Seasons', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26', 'Copenhagen FW26']

type Article = {
  _id: string
  title: string
  slug: { current: string }
  category: string
  season: string
  excerpt: string
  publishedAt: string
  coverImage: string | null
  trendScore?: number
  featured?: boolean
}

const ARTICLES: Article[] = [
  {
    _id: '1',
    title: 'the leather jacket is not coming back. it never left.',
    slug: { current: 'leather-jacket-trend-fw26' },
    category: 'opinion',
    season: 'milan-fw26',
    excerpt: 'Six houses. Three different silhouettes. One material that showed up on more FW26 runways than any other single piece. The data is clear — but the story is more interesting than the numbers.',
    publishedAt: '2026-03-08T10:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    trendScore: 87,
    featured: true,
  },
  {
    _id: '2',
    title: 'what jonathan anderson did to dior in one season',
    slug: { current: 'jonathan-anderson-dior-fw26' },
    category: 'show-review',
    season: 'paris-fw26',
    excerpt: 'Search volume for "Christian Dior" spiked 340% in the 48 hours after the FW26 Paris show. I watched it twice, crying both times. Here is why the data backs up the feeling.',
    publishedAt: '2026-03-06T14:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    trendScore: 94,
  },
  {
    _id: '3',
    title: 'prairie dress search volume is up 280% and i have thoughts',
    slug: { current: 'prairie-dress-search-trend' },
    category: 'data',
    season: 'paris-fw26',
    excerpt: 'Chloé, Zimmermann, and Simone Rocha all sent some version of the romantic countryside silhouette down the runway. Google Trends noticed before anyone else did.',
    publishedAt: '2026-03-04T09:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    trendScore: 78,
  },
  {
    _id: '4',
    title: 'copenhagen is the most interesting fashion week and nobody is talking about it',
    slug: { current: 'copenhagen-fw26-analysis' },
    category: 'cultural-context',
    season: 'copenhagen-fw26',
    excerpt: 'Lower search volume. Smaller shows. But a higher concentration of pieces that actually end up in your wardrobe 18 months later. I ran the numbers across three seasons.',
    publishedAt: '2026-03-02T11:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    trendScore: 72,
  },
  {
    _id: '5',
    title: 'matthieu blazy at chanel: the numbers behind the feeling',
    slug: { current: 'blazy-chanel-fw26-data' },
    category: 'forecast',
    season: 'paris-fw26',
    excerpt: 'Every metric jumped. Social velocity, search signals, editorial coverage. But the most interesting thing was what the data said about the pieces nobody photographed.',
    publishedAt: '2026-02-28T16:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1536183922588-166604504d5e?w=800&q=80',
    trendScore: 91,
  },
  {
    _id: '6',
    title: 'the quiet coat: how outerwear became the most consistent fw26 signal',
    slug: { current: 'quiet-coat-outerwear-fw26' },
    category: 'forecast',
    season: 'fw26',
    excerpt: 'Across 47 shows this season, structured outerwear appeared in 68% of collections. That is the highest cross-show material consistency since the trench coat cycle of SS23.',
    publishedAt: '2026-02-25T13:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    trendScore: 83,
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  opinion: 'Opinion',
  data: 'Data',
  forecast: 'Forecast',
  'cultural-context': 'Cultural Context',
  'show-review': 'Show Review',
}

const SEASON_LABELS: Record<string, string> = {
  'paris-fw26': 'Paris FW26',
  'milan-fw26': 'Milan FW26',
  'london-fw26': 'London FW26',
  'newyork-fw26': 'New York FW26',
  'copenhagen-fw26': 'Copenhagen FW26',
  'fw26': 'FW26 Season',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function AnalysisPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSeason, setActiveSeason]     = useState('All Seasons')

  const filtered = ARTICLES.filter(a => {
    const catMatch = activeCategory === 'All' || CATEGORY_LABELS[a.category] === activeCategory
    const seasonLabel = SEASON_LABELS[a.season] || ''
    const seaMatch = activeSeason === 'All Seasons' || seasonLabel === activeSeason
    return catMatch && seaMatch
  })

  const featured = filtered.find(a => a.featured) || filtered[0]
  const rest = filtered.filter(a => a._id !== featured?._id)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink:   #0f0e0d;
          --cream: #F5F2ED;
          --warm:  #EDE8E1;
          --muted: #8a8480;
          --rule:  #d4cfc9;
          --accent:#C8391A;
        }

        .analysis-root {
          font-family: 'DM Mono', monospace;
          background: var(--cream);
          color: var(--ink);
          min-height: 100vh;
        }

        /* ── nav ──────────────────────────────────────────── */
        .anav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          height: 56px;
          border-bottom: 1px solid var(--rule);
          background: var(--cream);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .anav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: var(--ink);
          text-decoration: none;
        }
        .anav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        .anav-links a {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .anav-links a:hover { color: var(--ink); }
        .anav-links a.active { color: var(--ink); }

        /* ── page header ──────────────────────────────────── */
        .analysis-header {
          padding: 56px 48px 40px;
          border-bottom: 1px solid var(--rule);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 48px;
        }
        .analysis-header-left h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(48px, 6vw, 80px);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .analysis-header-left h1 em {
          font-style: italic;
          color: var(--accent);
        }
        .analysis-header-right {
          max-width: 320px;
          font-size: 11px;
          line-height: 1.7;
          color: var(--muted);
          letter-spacing: 0.04em;
          padding-bottom: 4px;
        }
        .analysis-count {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 16px;
        }

        /* ── filters ──────────────────────────────────────── */
        .filters-wrap {
          padding: 0 48px;
          border-bottom: 1px solid var(--rule);
          display: flex;
          align-items: stretch;
          gap: 0;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 16px 0;
          border-right: 1px solid var(--rule);
          padding-right: 32px;
          margin-right: 32px;
        }
        .filter-group:last-child {
          border-right: none;
          padding-right: 0;
          margin-right: 0;
        }
        .filter-label {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-right: 12px;
          white-space: nowrap;
        }
        .filter-btn {
          background: none;
          border: 1px solid transparent;
          padding: 4px 12px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .filter-btn:hover { color: var(--ink); }
        .filter-btn.active {
          color: var(--ink);
          border-color: var(--ink);
        }

        /* ── featured article ─────────────────────────────── */
        .featured-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid var(--rule);
        }
        .featured-image-col {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4/3;
        }
        .featured-image-col img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .featured-wrap:hover .featured-image-col img {
          transform: scale(1.03);
        }
        .featured-score-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          background: var(--ink);
          color: var(--cream);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          padding: 6px 12px;
        }
        .featured-content-col {
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: var(--warm);
        }
        .featured-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .cat-pill {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 3px 10px;
          border: 1px solid var(--ink);
          color: var(--ink);
          display: inline-block;
        }
        .cat-pill.opinion  { border-color: #6B4F3A; color: #6B4F3A; }
        .cat-pill.data     { border-color: #2A4A6B; color: #2A4A6B; }
        .cat-pill.forecast { border-color: #3A6B4A; color: #3A6B4A; }
        .cat-pill.cultural-context { border-color: #6B4A3A; color: #6B4A3A; }
        .cat-pill.show-review { border-color: var(--accent); color: var(--accent); }
        .season-tag {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .featured-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 20px;
        }
        .featured-excerpt {
          font-size: 12px;
          line-height: 1.8;
          color: var(--muted);
          letter-spacing: 0.03em;
          margin-bottom: 36px;
        }
        .featured-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .featured-date {
          font-size: 10px;
          letter-spacing: 0.08em;
          color: var(--muted);
          text-transform: uppercase;
        }
        .read-link {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--ink);
          padding-bottom: 2px;
          transition: color 0.15s, border-color 0.15s;
        }
        .read-link:hover {
          color: var(--accent);
          border-color: var(--accent);
        }

        /* ── grid ─────────────────────────────────────────── */
        .grid-wrap {
          padding: 0 48px 80px;
        }
        .grid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0 24px;
          border-bottom: 1px solid var(--rule);
          margin-bottom: 0;
        }
        .grid-header-label {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .grid-header-count {
          font-size: 9px;
          letter-spacing: 0.1em;
          color: var(--muted);
        }
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-left: 1px solid var(--rule);
        }
        .article-card {
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: background 0.2s;
        }
        .article-card:hover { background: var(--warm); }
        .card-image {
          aspect-ratio: 16/10;
          overflow: hidden;
          position: relative;
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .article-card:hover .card-image img {
          transform: scale(1.04);
        }
        .card-score {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(15,14,13,0.85);
          color: var(--cream);
          font-size: 10px;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          backdrop-filter: blur(4px);
        }
        .card-body {
          padding: 20px 24px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 12px;
          flex: 1;
        }
        .card-excerpt {
          font-size: 10px;
          line-height: 1.75;
          color: var(--muted);
          letter-spacing: 0.03em;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--rule);
        }
        .card-date {
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .card-arrow {
          font-size: 12px;
          color: var(--muted);
          transition: transform 0.2s, color 0.2s;
        }
        .article-card:hover .card-arrow {
          transform: translateX(4px);
          color: var(--ink);
        }

        /* ── empty state ──────────────────────────────────── */
        .empty {
          padding: 80px 0;
          text-align: center;
          color: var(--muted);
          font-size: 11px;
          letter-spacing: 0.08em;
          grid-column: 1 / -1;
        }

        /* ── footer ───────────────────────────────────────── */
        .analysis-footer {
          padding: 24px 48px;
          border-top: 1px solid var(--rule);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }

        @media (max-width: 900px) {
          .anav { padding: 0 24px; }
          .analysis-header { padding: 40px 24px 32px; flex-direction: column; align-items: flex-start; }
          .filters-wrap { padding: 0 24px; overflow-x: auto; }
          .featured-wrap { grid-template-columns: 1fr; }
          .featured-image-col { aspect-ratio: 16/9; }
          .featured-content-col { padding: 32px 24px; }
          .grid-wrap { padding: 0 24px 60px; }
          .articles-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .articles-grid { grid-template-columns: 1fr; }
          .analysis-header-left h1 { font-size: 40px; }
        }
      `}</style>

      <div className="analysis-root">
        {/* nav */}
        <nav className="anav">
          <Link href="/" className="anav-logo">runway fyi</Link>
          <ul className="anav-links">
            <li><Link href="/analysis" className="active">Analysis</Link></li>
            <li><Link href="/trends">Trends</Link></li>
            <li><Link href="/shows">Shows</Link></li>
            <li><Link href="/archive">Archive</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </nav>

        {/* header */}
        <header className="analysis-header">
          <div className="analysis-header-left">
            <h1>data-backed<br/><em>opinion.</em></h1>
            <p className="analysis-count">{ARTICLES.length} pieces published · FW26 season</p>
          </div>
          <p className="analysis-header-right">
            runway trend analysis informed by search data, social velocity, and editorial frequency.
            composite scores calculated across runway (50%), search (30%), and social signals (20%).
          </p>
        </header>

        {/* filters */}
        <div className="filters-wrap">
          <div className="filter-group">
            <span className="filter-label">Category</span>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`filter-btn${activeCategory === c ? ' active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >{c}</button>
            ))}
          </div>
          <div className="filter-group">
            <span className="filter-label">Season</span>
            {SEASONS.map(s => (
              <button
                key={s}
                className={`filter-btn${activeSeason === s ? ' active' : ''}`}
                onClick={() => setActiveSeason(s)}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* featured */}
        {featured && (
          <Link href={`/analysis/${featured.slug.current}`} style={{ textDecoration: 'none' }}>
            <div className="featured-wrap">
              <div className="featured-image-col">
                {featured.coverImage && (
                  <img src={featured.coverImage} alt={featured.title} />
                )}
                {featured.trendScore && (
                  <div className="featured-score-badge">
                    trend score {featured.trendScore}
                  </div>
                )}
              </div>
              <div className="featured-content-col">
                <div>
                  <div className="featured-meta">
                    <span className={`cat-pill ${featured.category}`}>
                      {CATEGORY_LABELS[featured.category]}
                    </span>
                    <span className="season-tag">
                      {SEASON_LABELS[featured.season]}
                    </span>
                  </div>
                  <h2 className="featured-title">{featured.title}</h2>
                  <p className="featured-excerpt">{featured.excerpt}</p>
                </div>
                <div className="featured-footer">
                  <span className="featured-date">{formatDate(featured.publishedAt)}</span>
                  <span className="read-link">Read analysis →</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* grid */}
        <div className="grid-wrap">
          <div className="grid-header">
            <span className="grid-header-label">All analysis</span>
            <span className="grid-header-count">{rest.length} pieces</span>
          </div>
          <div className="articles-grid">
            {rest.length === 0 ? (
              <div className="empty">no articles match these filters.</div>
            ) : rest.map(article => (
              <Link key={article._id} href={`/analysis/${article.slug.current}`} className="article-card">
                <div className="card-image">
                  {article.coverImage
                    ? <img src={article.coverImage} alt={article.title} />
                    : <div style={{ background: '#d4cfc9', height: '100%' }} />
                  }
                  {article.trendScore && (
                    <div className="card-score">score {article.trendScore}</div>
                  )}
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span className={`cat-pill ${article.category}`}>
                      {CATEGORY_LABELS[article.category]}
                    </span>
                    <span className="season-tag">{SEASON_LABELS[article.season]}</span>
                  </div>
                  <h3 className="card-title">{article.title}</h3>
                  <p className="card-excerpt">{article.excerpt}</p>
                  <div className="card-footer">
                    <span className="card-date">{formatDate(article.publishedAt)}</span>
                    <span className="card-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* footer */}
        <footer className="analysis-footer">
          <span>runway fyi · FW26</span>
          <span>composite score = 0.5×runway + 0.3×search + 0.2×social</span>
        </footer>
      </div>
    </>
  )
}
