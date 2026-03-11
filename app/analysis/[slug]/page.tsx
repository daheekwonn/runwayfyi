'use client'

import { useState } from 'react'
import Link from 'next/link'

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
  body?: string
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
    coverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80',
    trendScore: 87,
    body: `The leather jacket appeared on 34 out of 47 FW26 shows tracked by this platform. That is a 72% runway frequency — the single highest of any category-defining piece this season. But the number alone doesn't tell you anything interesting.

What the data actually shows is *how* it appeared. In Milan, it was architecturally oversized at Bottega and Prada. In Paris, it ran slim and cropped at Saint Laurent and Courrèges. In London, it was deconstructed and raw at Burberry. Three completely different silhouettes, same material, same season.

## What the search signals say

Google Trends data for "leather jacket" has been elevated since October 2025 — well before the shows. The FW26 runway cycle did not create this trend. It validated one that consumers were already moving toward.

The composite score of 87 breaks down as: runway frequency 44 (out of 50), search trend signal 27 (out of 30), social velocity 16 (out of 20). The search component is the most interesting. It has been rising for five months.

## My actual take

Here is the part where the data and my opinion agree completely, which is unusual: the leather jacket is not a trend right now. It is a staple that the industry tries to trend-ify every few seasons because it performs well commercially.

What is interesting is the silhouette split. The oversized architectural version is new. That is the thing worth watching — not whether leather jackets are "back," but whether the proportion shift from slim to sculptural sticks beyond this season.

Search for "oversized leather jacket" is up 180% since February. That one is a real signal.`,
  },
  {
    _id: '2',
    title: 'What jonathan anderson did to dior in one season',
    slug: { current: 'jonathan-anderson-dior-fw26' },
    category: 'show-review',
    season: 'paris-fw26',
    excerpt: 'Search volume for "Christian Dior" spiked 340% in the 48 hours after the FW26 Paris show. I watched it twice, crying both times. Here is why the data backs up the feeling.',
    publishedAt: '2026-03-06T14:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    trendScore: 94,
    body: `The number is 94. That is the highest composite trend score this platform has produced for any single show this season. I want to be honest about what that means and what it does not mean.

It means the show drove unusually high search velocity, appeared in the highest number of editorial references within 72 hours, and generated social engagement that outpaced every other FW26 show by a significant margin. The data is objective. The platform does not know that I cried watching it.

## What actually happened at the show

Jonathan Anderson restructured the visual vocabulary of an 80-year-old house in approximately 40 minutes. The silhouettes referenced the Bar jacket era but distorted through a 2026 lens — proportions elongated, structure moved from waist to shoulder, colour palette pulled from faded archival photographs rather than the sharp contrast Dior is usually associated with.

## The data behind the feeling

Composite score 94 = runway 47 + search 29 + social 18. The search component is the highest of the season for any show. "Christian Dior FW26" peaked at 100 on Google Trends within 36 hours of the show.

"Jonathan Anderson Dior" as a combined search term barely existed before February 28th. His name attached to the house is becoming a new search entity. That is brand equity being created in real time.`,
  },
  {
    _id: '3',
    title: 'Prairie dress search volume is up 280% and i have thoughts',
    slug: { current: 'prairie-dress-search-trend' },
    category: 'data',
    season: 'paris-fw26',
    excerpt: 'Chloé, Zimmermann, and Simone Rocha all sent some version of the romantic countryside silhouette down the runway. Google Trends noticed before anyone else did.',
    publishedAt: '2026-03-04T09:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
    trendScore: 78,
    body: `The search data for "prairie dress" started climbing in December 2025. By January it was up 140% year-on-year. By the time the Paris shows opened in February it was at 280%. The runway did not cause this. The runway confirmed it.

## The show evidence

Chloé FW26 was the most talked-about prairie moment — the layered plaid pieces with ruffled hems became the most shared individual looks from Paris week. Simone Rocha has been doing versions of this silhouette for three seasons; this is the first season the search data has caught up with her.

## What this means for spring 2027

The composite score of 78 understates the trajectory. The search signal component (22 out of 30) is high, but the social velocity score (14 out of 20) is lagging — which means the influencer adoption wave has not peaked yet. That is usually a three to four month lag. Expect prairie silhouettes to dominate mid-price retail by September 2026.`,
  },
  {
    _id: '4',
    title: 'Copenhagen is the most interesting fashion week and nobody is talking about it',
    slug: { current: 'copenhagen-fw26-analysis' },
    category: 'cultural-context',
    season: 'copenhagen-fw26',
    excerpt: 'Lower search volume. Smaller shows. But a higher concentration of pieces that actually end up in your wardrobe 18 months later. I ran the numbers across three seasons.',
    publishedAt: '2026-03-02T11:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80',
    trendScore: 72,
    body: `Copenhagen Fashion Week generates approximately 12% of the search volume that Paris generates during the same week. Its shows are smaller, the houses are younger, and the editorial coverage is a fraction of the Big Four weeks. By every metric this platform uses to calculate composite trend scores, it scores lower.

And yet, across the last three seasons of data, Copenhagen-origin pieces have a disproportionately high rate of appearing in actual wardrobes 18 months later.

## The data problem

Standard trend forecasting metrics are biased toward noise. Search volume measures curiosity. Social velocity measures spectacle. Editorial coverage measures editorial priorities. None of these things measure whether a piece is actually good or actually wearable.

Copenhagen shows tend to produce fewer spectacular moments and more consistently wearable pieces. That is a bad formula for trend scores and a good formula for actual clothes.

## What I am watching from FW26 Copenhagen

Remain, Saks Potts, and Stine Goya all showed pieces this season that I expect to see everywhere by autumn 2026. The Saks Potts outerwear — which scored a 61 composite, well below this platform's threshold for "trending" — is the coat I think I will see most on the street in twelve months.`,
  },
  {
    _id: '5',
    title: 'Matthieu blazy at chanel: the numbers behind the feeling',
    slug: { current: 'blazy-chanel-fw26-data' },
    category: 'forecast',
    season: 'paris-fw26',
    excerpt: 'Every metric jumped. Social velocity, search signals, editorial coverage. But the most interesting thing was what the data said about the pieces nobody photographed.',
    publishedAt: '2026-02-28T16:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1536183922588-166604504d5e?w=1200&q=80',
    trendScore: 91,
    body: `The Chanel FW26 show scored 91. The breakdown: runway frequency 45, search signal 28, social velocity 18. All three components are elevated — this is unusual. Shows typically spike on one or two metrics.

## The editorial picture

Within 48 hours of the show, Chanel FW26 appeared on the front pages of every major fashion publication. What is less expected is the specific pieces that generated the most coverage — which were not the spectacular finale gowns, but the opening daywear looks. Tailored tweed re-proportioned into something that looked modern rather than archival. That is the hardest thing to do with Chanel, and he did it in look 4.

## The pieces nobody photographed

This platform tracks look-level frequency in editorial coverage. For Chanel FW26, the gap between most-photographed and most-searched is significant. The most-photographed looks are the finale sequence. The looks driving the most consumer search are the early daywear — the updated suits, the pieces that look like clothes you might actually wear. That is Blazy's formula and it is working.`,
  },
  {
    _id: '6',
    title: 'The quiet coat: how outerwear became the most consistent fw26 signal',
    slug: { current: 'quiet-coat-outerwear-fw26' },
    category: 'forecast',
    season: 'fw26',
    excerpt: 'Across 47 shows this season, structured outerwear appeared in 68% of collections. That is the highest cross-show material consistency since the trench coat cycle of SS23.',
    publishedAt: '2026-02-25T13:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80',
    trendScore: 83,
    body: `68% of FW26 shows tracked by this platform included at least one structured outerwear piece as a lead look. That number is significant not because outerwear appears on winter runways — it always does — but because of the consistency of the specific silhouette.

The silhouette is: clean shoulder, mid-calf length, minimal lapel, no external hardware. It appeared at price points ranging from Toteme to Balenciaga.

## What the search data says

Search data for "simple long coat" and "clean coat women" both began climbing in January 2026 — two weeks before the shows started validating it.

## The forecast

Composite score 83. Runway frequency component is the highest driver (42 out of 50) — this is a runway trend before it is a consumer trend. The trajectory suggests peak retail relevance in September-October 2026. Start shopping in July.`,
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

function renderBody(text: string) {
  return text.split('\n\n').map((para, i) => {
    if (para.startsWith('## ')) return <h2 key={i} className="body-h2">{para.slice(3)}</h2>
    const parts = para.split(/(\*[^*]+\*)/)
    return (
      <p key={i} className="body-p">
        {parts.map((part, j) =>
          part.startsWith('*') && part.endsWith('*')
            ? <em key={j} style={{ fontFamily:'var(--f-body)', fontStyle:'italic' }}>{part.slice(1,-1)}</em>
            : part
        )}
      </p>
    )
  })
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [navVisible]            = useState(true)

  const article = ARTICLES.find(a => a.slug.current === params.slug)
  const related  = article ? ARTICLES.filter(a => a._id !== article._id && a.season === article.season).slice(0, 3) : []

  if (!article) {
    return (
      <div style={{ padding:'80px 52px', fontFamily:'Geist Mono, monospace', color:'#A09A94', fontSize:'12px' }}>
        article not found. <Link href="/analysis" style={{ color:'#0C0B09', borderBottom:'1px solid' }}>back to analysis</Link>
      </div>
    )
  }

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

        /* header — identical to homepage */
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

        /* breadcrumb */
        .breadcrumb { padding:18px 52px; border-bottom:1px solid var(--bd); font-family:var(--f-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); display:flex; align-items:center; gap:10px; }
        .breadcrumb a { color:var(--light); text-decoration:none; transition:color .15s; }
        .breadcrumb a:hover { color:var(--ink); }

        /* hero */
        .article-hero { display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid var(--bd); min-height:480px; overflow:hidden; }
        .hero-meta-col { padding:52px; display:flex; flex-direction:column; justify-content:space-between; border-right:1px solid var(--bd); }
        .hero-tags { display:flex; align-items:center; gap:12px; margin-bottom:28px; }
        .cat-pill { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.12em; text-transform:uppercase; padding:3px 10px; border:1px solid var(--bd); color:var(--mid); display:inline-block; }
        .season-tag { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .hero-title { font-family:var(--f-display); font-size:clamp(28px,3vw,46px); font-weight:700; line-height:1.02; letter-spacing:-0.02em; text-transform:lowercase; color:var(--ink); margin-bottom:20px; }
        .hero-excerpt { font-family:var(--f-body); font-size:14px; font-weight:500; line-height:1.7; color:var(--mid); }
        .hero-bottom { display:flex; align-items:flex-end; justify-content:space-between; padding-top:32px; border-top:1px solid var(--bd); }
        .hero-date { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .score-block { text-align:right; }
        .score-number { font-family:var(--f-display); font-size:64px; font-weight:700; line-height:1; color:var(--ink); display:block; letter-spacing:-0.03em; }
        .score-label { font-family:var(--f-mono); font-size:8px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); }
        .hero-image-col { overflow:hidden; }
        .hero-image-col img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(10%) brightness(0.86) contrast(1.04); display:block; }

        /* score breakdown */
        .score-breakdown { background:var(--cream); padding:18px 52px; border-bottom:1px solid var(--bd); display:flex; align-items:center; gap:40px; }
        .breakdown-label { font-family:var(--f-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); white-space:nowrap; }
        .breakdown-items { display:flex; gap:28px; flex:1; }
        .breakdown-item { display:flex; flex-direction:column; gap:6px; flex:1; }
        .breakdown-item-label { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); display:flex; justify-content:space-between; }
        .breakdown-track { height:1.5px; background:rgba(12,11,9,0.08); position:relative; }
        .breakdown-fill { height:100%; background:var(--ink); position:absolute; left:0; top:0; }

        /* article layout */
        .article-layout { display:grid; grid-template-columns:1fr 300px; border-bottom:1px solid var(--bd); }
        .article-body-col { padding:52px 64px 80px 52px; border-right:1px solid var(--bd); max-width:740px; }
        .body-p { font-family:var(--f-body); font-size:15px; font-weight:500; line-height:1.85; color:var(--ink); letter-spacing:0.01em; margin-bottom:26px; }
        .body-h2 { font-family:var(--f-display); font-size:26px; font-weight:700; line-height:1.1; color:var(--ink); margin:48px 0 20px; letter-spacing:-0.02em; padding-top:48px; border-top:1px solid var(--bd); text-transform:lowercase; }

        /* sidebar */
        .article-sidebar { padding:40px 36px; position:sticky; top:118px; align-self:start; }
        .sidebar-section { margin-bottom:36px; padding-bottom:36px; border-bottom:1px solid var(--bd); }
        .sidebar-section:last-child { border-bottom:none; margin-bottom:0; }
        .sidebar-heading { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:14px; }
        .sidebar-stat-label { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); margin-bottom:4px; }
        .sidebar-stat-value { font-family:var(--f-display); font-size:32px; font-weight:700; color:var(--ink); line-height:1; letter-spacing:-0.02em; }
        .sidebar-note { font-family:var(--f-mono); font-size:10px; line-height:1.7; color:var(--light); letter-spacing:0.02em; margin-top:12px; }
        .sidebar-link { display:block; margin-top:12px; font-family:var(--f-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink); text-decoration:none; display:flex; align-items:center; gap:8px; transition:gap .15s; }
        .sidebar-link:hover { gap:14px; }

        /* related */
        .related-wrap { padding:40px 52px 80px; }
        .related-heading { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:0; padding-bottom:16px; border-bottom:1px solid var(--bd); }
        .related-grid { display:grid; grid-template-columns:repeat(3,1fr); border-left:1px solid var(--bd); }
        .related-card { border-right:1px solid var(--bd); border-bottom:1px solid var(--bd); text-decoration:none; color:inherit; transition:opacity .15s; }
        .related-card:hover { opacity:.7; }
        .related-image { aspect-ratio:16/9; overflow:hidden; }
        .related-image img { width:100%; height:100%; object-fit:cover; filter:grayscale(10%) brightness(0.88); display:block; transition:transform .5s; }
        .related-card:hover .related-image img { transform:scale(1.04); }
        .related-body { padding:16px 22px 20px; }
        .related-date { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.09em; text-transform:uppercase; color:var(--light); margin-bottom:8px; }
        .related-title { font-family:var(--f-display); font-size:17px; font-weight:700; letter-spacing:-0.01em; line-height:1.1; text-transform:lowercase; color:var(--ink); }

        /* footer */
        footer { background:var(--ink); padding:26px 52px; display:flex; align-items:center; justify-content:space-between; }
        .f-logo { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:0.1em; text-transform:lowercase; color:#fff; }
        .f-links { display:flex; gap:28px; list-style:none; }
        .f-links a { font-family:var(--f-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.3); text-decoration:none; transition:color .15s; }
        .f-links a:hover { color:rgba(255,255,255,0.7); }
        .f-copy { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; color:rgba(255,255,255,0.2); }

        @media (max-width:900px) {
          .nav-menu-btn { left:24px; } .nav-pill { right:24px; }
          .breadcrumb { padding:16px 24px; }
          .article-hero { grid-template-columns:1fr; }
          .hero-meta-col { padding:36px 24px; border-right:none; border-bottom:1px solid var(--bd); }
          .hero-image-col { aspect-ratio:16/9; }
          .score-breakdown { padding:16px 24px; gap:20px; flex-wrap:wrap; }
          .article-layout { grid-template-columns:1fr; }
          .article-body-col { padding:36px 24px 60px; border-right:none; max-width:100%; }
          .article-sidebar { position:static; border-top:1px solid var(--bd); padding:32px 24px; }
          .related-wrap { padding:32px 24px 60px; }
          .related-grid { grid-template-columns:1fr; }
          footer { padding:24px; flex-direction:column; gap:16px; text-align:center; }
        }
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

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/analysis">Analysis</Link>
        <span>›</span>
        <span>{CATEGORY_LABELS[article.category]}</span>
      </div>

      {/* Hero */}
      <div className="article-hero">
        <div className="hero-meta-col">
          <div>
            <div className="hero-tags">
              <span className={`cat-pill ${article.category}`}>{CATEGORY_LABELS[article.category]}</span>
              <span className="season-tag">{SEASON_LABELS[article.season]}</span>
            </div>
            <h1 className="hero-title">{article.title}</h1>
            <p className="hero-excerpt">{article.excerpt}</p>
          </div>
          <div className="hero-bottom">
            <span className="hero-date">{formatDate(article.publishedAt)}</span>
            {article.trendScore && (
              <div className="score-block">
                <span className="score-number">{article.trendScore}</span>
                <span className="score-label">composite score</span>
              </div>
            )}
          </div>
        </div>
        <div className="hero-image-col">
          {article.coverImage && <img src={article.coverImage} alt={article.title} />}
        </div>
      </div>

      {/* Score breakdown */}
      {article.trendScore && (
        <div className="score-breakdown">
          <span className="breakdown-label">Score breakdown</span>
          <div className="breakdown-items">
            {[
              { key:'runway', label:'Runway (50%)', val: Math.round(article.trendScore * 0.54), max:50 },
              { key:'search', label:'Search (30%)',  val: Math.round(article.trendScore * 0.32), max:30 },
              { key:'social', label:'Social (20%)',  val: Math.round(article.trendScore * 0.19), max:20 },
            ].map(({ key, label, val, max }) => (
              <div key={key} className="breakdown-item">
                <div className="breakdown-item-label"><span>{label}</span><span>{val}/{max}</span></div>
                <div className="breakdown-track">
                  <div className="breakdown-fill" style={{ width:`${(val/max)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body + sidebar */}
      <div className="article-layout">
        <div className="article-body-col">
          {article.body ? renderBody(article.body) : (
            <p className="body-p" style={{ color:'var(--light)' }}>
              Full article body will appear here when published in Sanity Studio.
            </p>
          )}
        </div>
        <aside className="article-sidebar">
          {article.trendScore && (
            <div className="sidebar-section">
              <div className="sidebar-heading">Trend Signal</div>
              <div className="sidebar-stat-label">Composite Score</div>
              <div className="sidebar-stat-value">{article.trendScore}</div>
              <p className="sidebar-note">Runway frequency (50%) · Search signals via pytrends (30%) · Social media velocity (20%).</p>
            </div>
          )}
          <div className="sidebar-section">
            <div className="sidebar-heading">Season</div>
            <div className="sidebar-stat-value" style={{ fontSize:'22px' }}>{SEASON_LABELS[article.season]}</div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-heading">Methodology</div>
            <p className="sidebar-note">Runway data from show images. Search signals via pytrends. Social velocity from Instagram engagement rate × post frequency.</p>
            <Link href="/about" className="sidebar-link">Read full methodology →</Link>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="related-wrap">
          <div className="related-heading">More from {SEASON_LABELS[article.season]}</div>
          <div className="related-grid">
            {related.map(r => (
              <Link key={r._id} href={`/analysis/${r.slug.current}`} className="related-card">
                <div className="related-image">
                  {r.coverImage ? <img src={r.coverImage} alt={r.title} /> : <div style={{ background:'var(--warm)', height:'100%' }} />}
                </div>
                <div className="related-body">
                  <div className="related-date">{formatDate(r.publishedAt)}</div>
                  <div className="related-title">{r.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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
