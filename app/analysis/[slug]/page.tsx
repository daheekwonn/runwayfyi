'use client'

import Link from 'next/link'

// ── same placeholder data (replace with sanityFetch later) ────────────────────
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
  body?: string  // placeholder: real body is Portable Text array
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
    coverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80',
    trendScore: 87,
    featured: true,
    body: `The leather jacket appeared on 34 out of 47 FW26 shows tracked by this platform. That is a 72% runway frequency — the single highest of any category-defining piece this season. But the number alone doesn't tell you anything interesting.

What the data actually shows is *how* it appeared. In Milan, it was architecturally oversized at Bottega and Prada. In Paris, it ran slim and cropped at Saint Laurent and Courrèges. In London, it was deconstructed and raw at Burberry. Three completely different silhouettes, same material, same season.

## What the search signals say

Google Trends data for "leather jacket" has been elevated since October 2025 — well before the shows. The FW26 runway cycle did not create this trend. It validated one that consumers were already moving toward.

The composite score of 87 breaks down as: runway frequency 44 (out of 50), search trend signal 27 (out of 30), social velocity 16 (out of 20). The search component is the most interesting. It has been rising for five months.

## My actual take

Here is the part where the data and my opinion agree completely, which is unusual: the leather jacket is not a trend right now. It is a staple that the industry is trying to trend-ify every few seasons because it performs well commercially.

What *is* interesting is the silhouette split. The oversized architectural version is new. That is the thing worth watching — not whether leather jackets are "back," but whether the proportion shift from slim to sculptural sticks beyond this season.

Search for "oversized leather jacket" is up 180% since February. That one is a real signal.`,
  },
  {
    _id: '2',
    title: 'what jonathan anderson did to dior in one season',
    slug: { current: 'jonathan-anderson-dior-fw26' },
    category: 'show-review',
    season: 'paris-fw26',
    excerpt: 'Search volume for "Christian Dior" spiked 340% in the 48 hours after the FW26 Paris show. I watched it twice, crying both times. Here is why the data backs up the feeling.',
    publishedAt: '2026-03-06T14:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    trendScore: 94,
    body: `The number is 94. That is the highest composite trend score this platform has produced for any single show this season. I want to be honest about what that means and what it does not mean.

It means that the show drove unusually high search velocity, appeared in the highest number of editorial references within 72 hours, and generated social engagement that outpaced every other FW26 show by a significant margin. The data is objective. The platform does not know that I cried watching it.

## What actually happened at the show

Jonathan Anderson restructured the visual vocabulary of a 80-year-old house in approximately 40 minutes. The silhouettes referenced the Bar jacket era but distorted through a 2026 lens — proportions elongated, structure moved from waist to shoulder, colour palette pulled from faded archival photographs rather than the sharp contrast Dior is usually associated with.

The finale look is the one that tells you what he is doing. It is simultaneously the most historically referential piece in the collection and the most contemporary thing I have seen on a runway this season.

## The data behind the feeling

Composite score 94 = runway 47 + search 29 + social 18. The search component is the highest of the season for any show. "Christian Dior FW26" peaked at 100 on Google Trends within 36 hours of the show. "Jonathan Anderson Dior" as a combined search term barely existed before February 28th.

That last number is the interesting one. His name attached to the house is becoming a new search entity. That is brand equity being created in real time.`,
  },
  {
    _id: '3',
    title: 'prairie dress search volume is up 280% and i have thoughts',
    slug: { current: 'prairie-dress-search-trend' },
    category: 'data',
    season: 'paris-fw26',
    excerpt: 'Chloé, Zimmermann, and Simone Rocha all sent some version of the romantic countryside silhouette down the runway. Google Trends noticed before anyone else did.',
    publishedAt: '2026-03-04T09:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
    trendScore: 78,
    body: `The search data for "prairie dress" started climbing in December 2025. By January it was up 140% year-on-year. By the time the Paris shows opened in February it was at 280%. The runway did not cause this. The runway confirmed it.

This is a pattern this platform tracks specifically: consumer search interest that predates editorial coverage. When search climbs before the shows, and then the shows validate what consumers are already interested in, the resulting trend has a much longer runway than something the industry invents and tries to push downward.

## The show evidence

Chloé FW26 was the most talked-about prairie moment — the layered plaid pieces with ruffled hems became the most shared individual looks from Paris week. Simone Rocha has been doing versions of this silhouette for three seasons; this is the first season the search data has caught up with her. Zimmermann, which operates at a more commercial price point, sent almost identical shapes down the runway at New York, which tells you the trend is already in production at commercial volume.

## What this means for spring 2027

The composite score of 78 understates the trajectory. The search signal component (22 out of 30) is high, but the social velocity score (14 out of 20) is lagging — which means the influencer adoption wave has not peaked yet. That is usually a three to four month lag. Expect prairie silhouettes to dominate mid-price retail by September 2026.`,
  },
  {
    _id: '4',
    title: 'copenhagen is the most interesting fashion week and nobody is talking about it',
    slug: { current: 'copenhagen-fw26-analysis' },
    category: 'cultural-context',
    season: 'copenhagen-fw26',
    excerpt: 'Lower search volume. Smaller shows. But a higher concentration of pieces that actually end up in your wardrobe 18 months later. I ran the numbers across three seasons.',
    publishedAt: '2026-03-02T11:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80',
    trendScore: 72,
    body: `Copenhagen Fashion Week generates approximately 12% of the search volume that Paris generates during the same week. Its shows are smaller, the houses are younger, and the editorial coverage is a fraction of the Big Four weeks. By every metric this platform uses to calculate composite trend scores, it scores lower.

And yet, across the last three seasons of data, Copenhagen-origin pieces have a disproportionately high rate of appearing in actual wardrobes 18 months later. I started tracking this informally after noticing that several pieces I bought — and several pieces I saw consistently on people I consider stylish — originated from Copenhagen shows that got almost no coverage at the time.

## The data problem

Standard trend forecasting metrics are biased toward noise. Search volume measures curiosity. Social velocity measures spectacle. Editorial coverage measures editorial priorities. None of these things measure whether a piece is actually good or actually wearable.

Copenhagen shows tend to produce fewer spectacular moments and more consistently wearable pieces. That is a bad formula for trend scores and a good formula for actual clothes.

## What I am watching from FW26 Copenhagen

Remain, Saks Potts, and Stine Goya all showed pieces this season that I expect to see everywhere by autumn 2026. The Remain structured trouser is already on a waiting list. Saks Potts' outerwear — which scored a 61 composite, well below this platform's threshold for "trending" — is the coat I think I will see most on the street in twelve months.`,
  },
  {
    _id: '5',
    title: 'matthieu blazy at chanel: the numbers behind the feeling',
    slug: { current: 'blazy-chanel-fw26-data' },
    category: 'forecast',
    season: 'paris-fw26',
    excerpt: 'Every metric jumped. Social velocity, search signals, editorial coverage. But the most interesting thing was what the data said about the pieces nobody photographed.',
    publishedAt: '2026-02-28T16:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1536183922588-166604504d5e?w=1200&q=80',
    trendScore: 91,
    body: `The Chanel FW26 show scored 91. The breakdown: runway frequency 45, search signal 28, social velocity 18. All three components are elevated — this is unusual. Shows typically spike on one or two metrics. A show that performs above average across all three is either a cultural moment or a media event. Sometimes it is both.

Matthieu Blazy's first Chanel season is both.

## The editorial picture

Within 48 hours of the show, Chanel FW26 appeared on the front pages of every major fashion publication. That is expected. What is less expected is the specific pieces that generated the most coverage — which were not the spectacular finale gowns, but the opening daywear looks. Tailored tweed re-proportioned into something that looked modern rather than archival. That is the hardest thing to do with Chanel, and he did it in look 4.

## The pieces nobody photographed

This platform tracks look-level frequency in editorial coverage. The pieces that appear most in professional photography within 72 hours of a show are not always the pieces that drive the most consumer search. There is usually a gap.

For Chanel FW26, the gap is significant. The most-photographed looks are looks 38-42 (the finale sequence). The looks driving the most consumer search are looks 6-12 — the early daywear, the updated suits, the pieces that look like clothes you might actually wear. That is Blazy's formula and it is working.`,
  },
  {
    _id: '6',
    title: 'the quiet coat: how outerwear became the most consistent fw26 signal',
    slug: { current: 'quiet-coat-outerwear-fw26' },
    category: 'forecast',
    season: 'fw26',
    excerpt: 'Across 47 shows this season, structured outerwear appeared in 68% of collections. That is the highest cross-show material consistency since the trench coat cycle of SS23.',
    publishedAt: '2026-02-25T13:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80',
    trendScore: 83,
    body: `68% of FW26 shows tracked by this platform included at least one structured outerwear piece as a lead look. That number is significant not because outerwear appears on winter runways — it always does — but because of the consistency of the specific silhouette.

The silhouette is: clean shoulder, mid-calf length, minimal lapel, no external hardware. It appeared at price points ranging from Toteme to Balenciaga. That cross-market consistency is the signal.

## What "quiet coat" means in data terms

This platform does not use the phrase "quiet luxury." The cultural phenomenon it described has largely played out in consumer terms. But the outerwear trend for FW26 has a different character — it is not about the absence of logos (that was SS24-FW25), it is about the absence of styling. The coats are meant to be worn alone, unbelted, over everything.

Search data for "simple long coat" and "clean coat women" both began climbing in January 2026. The combined search volume index hit 78 (out of 100) by mid-February — two weeks before the shows started validating it.

## The forecast

Composite score 83. Runway frequency component is the highest driver (42 out of 50) — this is a runway trend before it is a consumer trend. Search signal (25 out of 30) is elevated but not exceptional. Social velocity (16 out of 20) is growing.

The trajectory suggests peak retail relevance in September-October 2026. Start shopping in July.`,
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

// Naive markdown-ish body renderer for placeholder text
function renderBody(text: string) {
  return text.split('\n\n').map((para, i) => {
    if (para.startsWith('## ')) {
      return <h2 key={i} className="body-h2">{para.slice(3)}</h2>
    }
    // handle italic *text*
    const parts = para.split(/(\*[^*]+\*)/)
    return (
      <p key={i} className="body-p">
        {parts.map((part, j) =>
          part.startsWith('*') && part.endsWith('*')
            ? <em key={j}>{part.slice(1, -1)}</em>
            : part
        )}
      </p>
    )
  })
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find(a => a.slug.current === params.slug)

  if (!article) {
    return (
      <div style={{ padding: '80px 48px', fontFamily: 'DM Mono, monospace', color: '#8a8480', fontSize: '12px' }}>
        article not found.{' '}
        <Link href="/analysis" style={{ color: '#0f0e0d', borderBottom: '1px solid' }}>back to analysis</Link>
      </div>
    )
  }

  const related = ARTICLES.filter(a => a._id !== article._id && a.season === article.season).slice(0, 3)

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

        .slug-root {
          font-family: 'DM Mono', monospace;
          background: var(--cream);
          color: var(--ink);
          min-height: 100vh;
        }

        /* nav */
        .snav {
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
        .snav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: var(--ink);
          text-decoration: none;
        }
        .snav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        .snav-links a {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .snav-links a:hover { color: var(--ink); }
        .snav-back {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.15s;
        }
        .snav-back:hover { color: var(--ink); }

        /* hero */
        .article-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 480px;
          border-bottom: 1px solid var(--rule);
        }
        .hero-meta-col {
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid var(--rule);
        }
        .hero-top {}
        .hero-breadcrumb {
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hero-tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .cat-pill {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 3px 10px;
          border: 1px solid var(--ink);
          color: var(--ink);
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
          align-self: center;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 3.5vw, 52px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 24px;
        }
        .hero-excerpt {
          font-size: 12px;
          line-height: 1.8;
          color: var(--muted);
          letter-spacing: 0.03em;
        }
        .hero-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-top: 32px;
          border-top: 1px solid var(--rule);
        }
        .hero-date {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .score-block {
          text-align: right;
        }
        .score-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 56px;
          font-weight: 300;
          line-height: 1;
          color: var(--ink);
          display: block;
        }
        .score-label {
          font-size: 8px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .hero-image-col {
          position: relative;
          overflow: hidden;
        }
        .hero-image-col img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* score breakdown bar */
        .score-breakdown {
          background: var(--warm);
          padding: 20px 48px;
          border-bottom: 1px solid var(--rule);
          display: flex;
          align-items: center;
          gap: 48px;
        }
        .breakdown-label {
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
        }
        .breakdown-items {
          display: flex;
          gap: 32px;
          flex: 1;
        }
        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .breakdown-item-label {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          justify-content: space-between;
        }
        .breakdown-bar-track {
          height: 2px;
          background: var(--rule);
          position: relative;
        }
        .breakdown-bar-fill {
          height: 100%;
          background: var(--ink);
          position: absolute;
          left: 0;
          top: 0;
          transition: width 0.8s ease;
        }
        .breakdown-bar-fill.runway  { background: #2A4A6B; }
        .breakdown-bar-fill.search  { background: #3A6B4A; }
        .breakdown-bar-fill.social  { background: #C8391A; }

        /* article body */
        .article-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          border-bottom: 1px solid var(--rule);
        }
        .article-body-col {
          padding: 56px 64px 80px 48px;
          border-right: 1px solid var(--rule);
          max-width: 720px;
        }
        .body-p {
          font-size: 14px;
          line-height: 1.85;
          color: var(--ink);
          letter-spacing: 0.02em;
          margin-bottom: 24px;
        }
        .body-p em {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 16px;
        }
        .body-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          line-height: 1.2;
          color: var(--ink);
          margin: 48px 0 20px;
          letter-spacing: -0.01em;
          padding-top: 48px;
          border-top: 1px solid var(--rule);
        }
        .body-h2:first-child { margin-top: 0; padding-top: 0; border-top: none; }

        /* sidebar */
        .article-sidebar {
          padding: 40px 32px;
          position: sticky;
          top: 56px;
          align-self: start;
        }
        .sidebar-section {
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--rule);
        }
        .sidebar-section:last-child { border-bottom: none; margin-bottom: 0; }
        .sidebar-heading {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 16px;
        }
        .sidebar-stat {
          margin-bottom: 12px;
        }
        .sidebar-stat-label {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 2px;
        }
        .sidebar-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          color: var(--ink);
          line-height: 1;
        }
        .sidebar-note {
          font-size: 10px;
          line-height: 1.7;
          color: var(--muted);
          letter-spacing: 0.02em;
          margin-top: 12px;
        }

        /* related */
        .related-wrap {
          padding: 40px 48px 80px;
        }
        .related-heading {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--rule);
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-left: 1px solid var(--rule);
        }
        .related-card {
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: background 0.2s;
        }
        .related-card:hover { background: var(--warm); }
        .related-card-image {
          aspect-ratio: 16/9;
          overflow: hidden;
        }
        .related-card-image img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.5s;
        }
        .related-card:hover .related-card-image img { transform: scale(1.04); }
        .related-card-body { padding: 16px 20px 20px; }
        .related-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 400;
          line-height: 1.2;
          color: var(--ink);
          margin-bottom: 8px;
          margin-top: 10px;
        }
        .related-card-date {
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* footer */
        .slug-footer {
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
          .snav { padding: 0 24px; }
          .article-hero { grid-template-columns: 1fr; }
          .hero-meta-col { padding: 40px 24px; border-right: none; border-bottom: 1px solid var(--rule); }
          .hero-image-col { aspect-ratio: 16/9; }
          .score-breakdown { padding: 16px 24px; gap: 24px; flex-wrap: wrap; }
          .article-layout { grid-template-columns: 1fr; }
          .article-body-col { padding: 40px 24px; border-right: none; max-width: 100%; }
          .article-sidebar { position: static; padding: 32px 24px; border-top: 1px solid var(--rule); }
          .related-wrap { padding: 32px 24px 60px; }
          .related-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="slug-root">
        {/* nav */}
        <nav className="snav">
          <Link href="/" className="snav-logo">runway fyi</Link>
          <ul className="snav-links">
            <li><Link href="/analysis" className="snav-back">← Analysis</Link></li>
            <li><Link href="/trends" style={{ fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', textDecoration:'none' }}>Trends</Link></li>
            <li><Link href="/shows" style={{ fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', textDecoration:'none' }}>Shows</Link></li>
          </ul>
        </nav>

        {/* hero */}
        <div className="article-hero">
          <div className="hero-meta-col">
            <div className="hero-top">
              <div className="hero-breadcrumb">
                <Link href="/analysis" style={{ color:'inherit', textDecoration:'none' }}>Analysis</Link>
                <span>›</span>
                <span>{CATEGORY_LABELS[article.category]}</span>
              </div>
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

        {/* score breakdown */}
        {article.trendScore && (
          <div className="score-breakdown">
            <span className="breakdown-label">Score breakdown</span>
            <div className="breakdown-items">
              {[
                { key: 'runway', label: 'Runway (50%)', val: Math.round(article.trendScore * 0.54), max: 50 },
                { key: 'search', label: 'Search (30%)', val: Math.round(article.trendScore * 0.32), max: 30 },
                { key: 'social', label: 'Social (20%)',  val: Math.round(article.trendScore * 0.19), max: 20 },
              ].map(({ key, label, val, max }) => (
                <div key={key} className="breakdown-item">
                  <div className="breakdown-item-label">
                    <span>{label}</span>
                    <span>{val}/{max}</span>
                  </div>
                  <div className="breakdown-bar-track">
                    <div className={`breakdown-bar-fill ${key}`} style={{ width: `${(val/max)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* article body + sidebar */}
        <div className="article-layout">
          <div className="article-body-col">
            {article.body ? renderBody(article.body) : (
              <p className="body-p" style={{ color: 'var(--muted)' }}>
                Full article body will appear here when published in Sanity Studio.
              </p>
            )}
          </div>
          <aside className="article-sidebar">
            {article.trendScore && (
              <div className="sidebar-section">
                <div className="sidebar-heading">Trend Signal</div>
                <div className="sidebar-stat">
                  <div className="sidebar-stat-label">Composite Score</div>
                  <div className="sidebar-stat-value">{article.trendScore}</div>
                </div>
                <p className="sidebar-note">
                  Calculated from runway frequency (50%), search signals via pytrends (30%),
                  and social media velocity (20%).
                </p>
              </div>
            )}
            <div className="sidebar-section">
              <div className="sidebar-heading">Season</div>
              <div className="sidebar-stat">
                <div className="sidebar-stat-value" style={{ fontSize: '20px' }}>
                  {SEASON_LABELS[article.season]}
                </div>
              </div>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-heading">Methodology</div>
              <p className="sidebar-note">
                Runway data ingested from show images. Search signals pulled weekly via pytrends.
                Social velocity calculated from engagement rate × post frequency across Instagram.
              </p>
              <Link href="/about" style={{ display:'block', marginTop:'12px', fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink)', textDecoration:'none', borderBottom:'1px solid var(--rule)', paddingBottom:'2px' }}>
                Read full methodology →
              </Link>
            </div>
          </aside>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div className="related-wrap">
            <div className="related-heading">More from {SEASON_LABELS[article.season]}</div>
            <div className="related-grid">
              {related.map(r => (
                <Link key={r._id} href={`/analysis/${r.slug.current}`} className="related-card">
                  <div className="related-card-image">
                    {r.coverImage
                      ? <img src={r.coverImage} alt={r.title} />
                      : <div style={{ background: 'var(--warm)', height: '100%' }} />
                    }
                  </div>
                  <div className="related-card-body">
                    <div className="related-card-date">{formatDate(r.publishedAt)}</div>
                    <h3 className="related-card-title">{r.title}</h3>
                    <span className={`cat-pill ${r.category}`}>{CATEGORY_LABELS[r.category]}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <footer className="slug-footer">
          <span>runway fyi · FW26</span>
          <span>composite score = 0.5×runway + 0.3×search + 0.2×social</span>
        </footer>
      </div>
    </>
  )
}
