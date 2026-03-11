'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = ['All', 'Opinion', 'Data', 'Forecast', 'Cultural Context', 'Show Review']
const SEASONS    = ['All Seasons', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26', 'Copenhagen FW26']

const TICKER_ITEMS = [
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7',
  'Dior FW26  87.4', 'Prairie Silhouette  78.6', 'Wide-Leg Trouser  74.3',
  'Burgundy  +180%', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
]

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
    title: 'The leather jacket is not coming back. it never left.',
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
    title: 'What jonathan anderson did to dior in one season',
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
    title: 'Prairie dress search volume is up 280% and i have thoughts',
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
    title: 'Copenhagen is the most interesting fashion week and nobody is talking about it',
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
    title: 'Matthieu blazy at chanel: the numbers behind the feeling',
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
    title: 'The quiet coat: how outerwear became the most consistent fw26 signal',
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
  opinion: 'Opinion', data: 'Data', forecast: 'Forecast',
  'cultural-context': 'Cultural Context', 'show-review': 'Show Review',
}
const SEASON_LABELS: Record<string, string> = {
  'paris-fw26': 'Paris FW26', 'milan-fw26': 'Milan FW26', 'london-fw26': 'London FW26',
  'newyork-fw26': 'New York FW26', 'copenhagen-fw26': 'Copenhagen FW26', 'fw26': 'FW26 Season',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AnalysisPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSeason,   setActiveSeason]   = useState('All Seasons')
  const [menuOpen,       setMenuOpen]       = useState(false)
  const [navVisible]                        = useState(true)

  const filtered = ARTICLES.filter(a => {
    const catMatch = activeCategory === 'All' || CATEGORY_LABELS[a.category] === activeCategory
    const seaMatch = activeSeason === 'All Seasons' || (SEASON_LABELS[a.season] || '') === activeSeason
    return catMatch && seaMatch
  })
  const featured = filtered.find(a => a.featured) || filtered[0]
  const rest      = filtered.filter(a => a._id !== featured?._id)

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Geist+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        :root {
          --ink:#0C0B09; --white:#FFFFFF; --cream:#F5F2ED; --warm:#EDE9E2;
          --mid:#5A5550; --light:#A09A94; --bd:rgba(12,11,9,0.1);
          --f-mono:'Geist Mono',monospace; --f-display:'Ranade',sans-serif; --f-body:'Lora',Georgia,serif;
        }
        body { background:#fff; color:var(--ink); -webkit-font-smoothing:antialiased; }

        /* header */
        .site-header { position:fixed; top:0; left:0; right:0; z-index:100; background:#fff; }
        .nav-links-row { height:38px; display:flex; align-items:center; justify-content:center; gap:44px; background:#fff; border-bottom:1px solid var(--bd); list-style:none; padding:0; overflow:hidden; transition:height .3s cubic-bezier(.4,0,.2,1), opacity .3s ease; }
        .nav-links-row.hidden { height:0; opacity:0; pointer-events:none; }
        .nav-links-row a { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); text-decoration:none; transition:color .15s; }
        .nav-links-row a:hover, .nav-links-row a.active-link { color:var(--ink); }
        .ticker { background:var(--ink); overflow:hidden; white-space:nowrap; padding:7px 0; }
        .ticker-inner { display:inline-flex; animation:tick 48s linear infinite; }
        .ticker-inner span { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.13em; color:rgba(255,255,255,0.32); padding:0 42px; }
        @keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .nav-title-row { height:56px; display:flex; align-items:center; justify-content:center; padding:0 52px; background:#fff; border-bottom:1px solid var(--bd); position:relative; }
        .nav-logo { font-family:var(--f-display); font-size:20px; font-weight:700; letter-spacing:0.08em; text-transform:lowercase; color:var(--ink); text-decoration:none; }
        .nav-menu-btn { position:absolute; left:52px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; display:flex; flex-direction:column; gap:5px; padding:6px; }
        .nav-menu-btn span { display:block; width:22px; height:1.5px; background:var(--ink); transition:transform .2s, opacity .2s; }
        .nav-menu-btn.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
        .nav-menu-btn.open span:nth-child(2) { opacity:0; }
        .nav-menu-btn.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }
        .nav-pill { position:absolute; right:52px; top:50%; transform:translateY(-50%); font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; border:1px solid var(--bd); color:var(--light); padding:5px 13px; }
        .header-spacer { height:118px; }
        .header-spacer.collapsed { height:80px; }
        .nav-drawer { position:fixed; top:0; left:0; bottom:0; width:260px; background:#fff; z-index:200; transform:translateX(-100%); transition:transform .3s cubic-bezier(.4,0,.2,1); border-right:1px solid var(--bd); padding:72px 36px 40px; display:flex; flex-direction:column; gap:8px; }
        .nav-drawer.open { transform:translateX(0); }
        .nav-drawer a { font-family:var(--f-display); font-size:28px; font-weight:700; letter-spacing:-0.02em; text-transform:lowercase; color:var(--ink); text-decoration:none; line-height:1.25; opacity:.85; transition:opacity .15s; }
        .nav-drawer a:hover { opacity:1; }
        .nav-drawer-close { position:absolute; top:22px; right:22px; background:none; border:none; cursor:pointer; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .nav-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.18); z-index:190; opacity:0; pointer-events:none; transition:opacity .3s; }
        .nav-overlay.open { opacity:1; pointer-events:all; }

        /* page header */
        .analysis-header { padding:56px 52px 40px; border-bottom:1px solid var(--bd); background:#fff; display:flex; align-items:flex-end; justify-content:space-between; gap:48px; }
        .analysis-header h1 { font-family:var(--f-display); font-size:clamp(48px,6vw,80px); font-weight:700; letter-spacing:-0.03em; line-height:0.92; text-transform:lowercase; color:var(--ink); }
        .analysis-header h1 em { font-style:italic; font-family:var(--f-body); font-weight:500; }
        .analysis-header-right { max-width:320px; font-family:var(--f-mono); font-size:11px; line-height:1.7; color:var(--light); letter-spacing:0.04em; padding-bottom:4px; }
        .analysis-count { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); margin-top:16px; }

        /* filters */
        .filters-wrap { padding:0 52px; border-bottom:1px solid var(--bd); background:#fff; display:flex; align-items:stretch; overflow-x:auto; }
        .filter-group { display:flex; align-items:center; gap:2px; padding:14px 0; border-right:1px solid var(--bd); padding-right:28px; margin-right:28px; flex-shrink:0; }
        .filter-group:last-child { border-right:none; padding-right:0; margin-right:0; }
        .filter-label { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-right:12px; white-space:nowrap; }
        .filter-btn { background:none; border:1px solid transparent; padding:4px 12px; font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.08em; text-transform:uppercase; color:var(--light); cursor:pointer; transition:all .15s; white-space:nowrap; }
        .filter-btn:hover { color:var(--ink); }
        .filter-btn.active { color:var(--ink); border-color:var(--bd); }

        /* featured */
        .featured-wrap { display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid var(--bd); min-height:460px; overflow:hidden; }
        .featured-image-col { position:relative; overflow:hidden; }
        .featured-image-col img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(10%) brightness(0.86) contrast(1.04); display:block; transition:transform .6s ease, filter .4s ease; }
        .featured-wrap:hover .featured-image-col img { transform:scale(1.03); filter:grayscale(10%) brightness(0.72) contrast(1.06); }
        .featured-score-badge { position:absolute; top:20px; right:20px; background:var(--ink); color:#fff; font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; padding:6px 12px; }
        .featured-content-col { padding:48px 52px; display:flex; flex-direction:column; justify-content:space-between; background:var(--cream); }
        .featured-meta { display:flex; align-items:center; gap:14px; margin-bottom:24px; }
        .cat-pill { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.12em; text-transform:uppercase; padding:3px 10px; border:1px solid var(--bd); color:var(--mid); display:inline-block; }
        .season-tag { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .featured-title { font-family:var(--f-display); font-size:clamp(26px,2.8vw,40px); font-weight:700; line-height:1.05; letter-spacing:-0.02em; text-transform:lowercase; color:var(--ink); margin-bottom:18px; }
        .featured-excerpt { font-family:var(--f-body); font-size:13.5px; font-weight:500; line-height:1.7; color:var(--mid); margin-bottom:36px; }
        .featured-footer { display:flex; align-items:center; justify-content:space-between; padding-top:24px; border-top:1px solid var(--bd); }
        .featured-date { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .read-link { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink); text-decoration:none; display:flex; align-items:center; gap:8px; transition:gap .15s; }
        .read-link:hover { gap:14px; }

        /* grid */
        .grid-wrap { padding:0 52px 80px; background:#fff; }
        .grid-header { display:flex; align-items:center; justify-content:space-between; padding:28px 0 16px; border-bottom:1px solid var(--bd); }
        .grid-header-label { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); }
        .grid-header-count { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; color:var(--light); }
        .articles-grid { display:grid; grid-template-columns:repeat(3,1fr); border-left:1px solid var(--bd); }
        .article-card { border-right:1px solid var(--bd); border-bottom:1px solid var(--bd); text-decoration:none; color:inherit; display:flex; flex-direction:column; transition:opacity .15s; }
        .article-card:hover { opacity:.7; }
        .card-image { aspect-ratio:16/10; overflow:hidden; position:relative; }
        .card-image img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(10%) brightness(0.88); display:block; transition:transform .5s ease; }
        .article-card:hover .card-image img { transform:scale(1.04); }
        .card-score { position:absolute; bottom:10px; left:12px; background:rgba(12,11,9,0.82); color:#fff; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; padding:4px 10px; }
        .card-body { padding:18px 24px 22px; flex:1; display:flex; flex-direction:column; }
        .card-meta { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .card-title { font-family:var(--f-display); font-size:18px; font-weight:700; letter-spacing:-0.01em; line-height:1.1; text-transform:lowercase; color:var(--ink); margin-bottom:10px; flex:1; }
        .card-excerpt { font-family:var(--f-body); font-size:12.5px; font-weight:500; line-height:1.6; color:var(--mid); margin-bottom:18px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .card-footer { display:flex; align-items:center; justify-content:space-between; margin-top:auto; padding-top:14px; border-top:1px solid var(--bd); }
        .card-date { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.09em; text-transform:uppercase; color:var(--light); }
        .card-arrow { font-family:var(--f-mono); font-size:11px; color:var(--light); transition:transform .2s, color .2s; }
        .article-card:hover .card-arrow { transform:translateX(4px); color:var(--ink); }
        .empty { padding:80px 0; text-align:center; color:var(--light); font-family:var(--f-mono); font-size:11px; letter-spacing:0.08em; grid-column:1/-1; }

        /* footer */
        footer { background:var(--ink); padding:26px 52px; display:flex; align-items:center; justify-content:space-between; }
        .f-logo { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:0.1em; text-transform:lowercase; color:#fff; }
        .f-links { display:flex; gap:28px; list-style:none; }
        .f-links a { font-family:var(--f-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.3); text-decoration:none; transition:color .15s; }
        .f-links a:hover { color:rgba(255,255,255,0.7); }
        .f-copy { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; color:rgba(255,255,255,0.2); }

        @media (max-width:900px) {
          .nav-menu-btn { left:24px; } .nav-pill { right:24px; }
          .analysis-header { padding:40px 24px 32px; flex-direction:column; align-items:flex-start; }
          .filters-wrap { padding:0 24px; }
          .featured-wrap { grid-template-columns:1fr; }
          .featured-image-col { aspect-ratio:16/9; }
          .featured-content-col { padding:32px 24px; }
          .grid-wrap { padding:0 24px 60px; }
          .articles-grid { grid-template-columns:1fr 1fr; }
          footer { padding:24px; flex-direction:column; gap:16px; text-align:center; }
        }
        @media (max-width:600px) { .articles-grid { grid-template-columns:1fr; } }
      `}</style>

      {/* Drawer */}
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>✕ close</button>
        <Link href="/trends" onClick={() => setMenuOpen(false)}>Trends</Link>
        <Link href="/shows" onClick={() => setMenuOpen(false)}>Shows</Link>
        <Link href="/analysis" onClick={() => setMenuOpen(false)}>Analysis</Link>
        <Link href="/archive" onClick={() => setMenuOpen(false)}>Archive</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
      </div>
      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Header — identical to homepage */}
      <header className="site-header">
        <div className="ticker">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => <span key={i}>{item}</span>)}
          </div>
        </div>
        <div className="nav-title-row">
          <button className={`nav-menu-btn${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <Link href="/" className="nav-logo">runway fyi</Link>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className={`nav-links-row${navVisible ? '' : ' hidden'}`}>
          <li><Link href="/trends">Trends</Link></li>
          <li><Link href="/shows">Shows</Link></li>
          <li><Link href="/analysis" className="active-link">Analysis</Link></li>
          <li><Link href="/archive">Archive</Link></li>
        </ul>
      </header>
      <div className={`header-spacer${navVisible ? '' : ' collapsed'}`} />

      {/* Page header */}
      <div className="analysis-header">
        <div>
          <h1>data-backed<br /><em>opinion.</em></h1>
          <p className="analysis-count">{ARTICLES.length} pieces published · FW26 season</p>
        </div>
        <p className="analysis-header-right">
          runway trend analysis informed by search data, social velocity, and editorial frequency.
          composite scores: runway (50%) · search (30%) · social (20%).
        </p>
      </div>

      {/* Filters */}
      <div className="filters-wrap">
        <div className="filter-group">
          <span className="filter-label">Category</span>
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-btn${activeCategory === c ? ' active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Season</span>
          {SEASONS.map(s => (
            <button key={s} className={`filter-btn${activeSeason === s ? ' active' : ''}`} onClick={() => setActiveSeason(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <Link href={`/analysis/${featured.slug.current}`} style={{ textDecoration:'none', color:'inherit', display:'block' }}>
          <div className="featured-wrap">
            <div className="featured-image-col">
              {featured.coverImage && <img src={featured.coverImage} alt={featured.title} />}
              {featured.trendScore && <div className="featured-score-badge">trend score {featured.trendScore}</div>}
            </div>
            <div className="featured-content-col">
              <div>
                <div className="featured-meta">
                  <span className={`cat-pill ${featured.category}`}>{CATEGORY_LABELS[featured.category]}</span>
                  <span className="season-tag">{SEASON_LABELS[featured.season]}</span>
                </div>
                <h2 className="featured-title">{featured.title}</h2>
                <p className="featured-excerpt">{featured.excerpt}</p>
              </div>
              <div className="featured-footer">
                <span className="featured-date">{formatDate(featured.publishedAt)}</span>
                <span className="read-link">Read analysis <span>→</span></span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid-wrap">
        <div className="grid-header">
          <span className="grid-header-label">All analysis</span>
          <span className="grid-header-count">{rest.length} pieces</span>
        </div>
        <div className="articles-grid">
          {rest.length === 0
            ? <div className="empty">no articles match these filters.</div>
            : rest.map(article => (
              <Link key={article._id} href={`/analysis/${article.slug.current}`} className="article-card">
                <div className="card-image">
                  {article.coverImage
                    ? <img src={article.coverImage} alt={article.title} />
                    : <div style={{ background:'var(--warm)', height:'100%' }} />}
                  {article.trendScore && <div className="card-score">score {article.trendScore}</div>}
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span className={`cat-pill ${article.category}`}>{CATEGORY_LABELS[article.category]}</span>
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

      {/* Footer */}
      <footer>
        <span className="f-logo">runway fyi</span>
        <ul className="f-links">
          <li><a href="https://instagram.com/databutmakeitfashion" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="#">TikTok</a></li>
          <li><a href="#">Newsletter</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <span className="f-copy">© 2026 runway.fyi</span>
      </footer>
    </>
  )
}
