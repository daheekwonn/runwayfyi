'use client';

import { useEffect, useState } from 'react';

// swap with sanityFetch when CMS is live
const ARTICLES = [
  {
    id: 1,
    kicker: 'Opinion Â· Paris FW26',
    category: 'Opinion',
    season: 'Paris FW26',
    title: 'Jonathan Anderson just redefined what Dior means now',
    excerpt: 'The data agreed before the critics did. Searches for "Dior aesthetic" climbed 140% in the 48 hours after the show â€" a signal we'd been tracking since Anderson's appointment was announced in late 2025.',
    date: 'Mar 8, 2026',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    score: 94,
    runwayScore: 48,
    searchScore: 27,
    socialScore: 19,
    body: `## The data spoke first

When Jonathan Anderson was announced as Dior's new creative director in late 2025, we started tracking the signal. His appointment created immediate spikes in searches for both "Jonathan Anderson" and "Dior" â€" but more tellingly, searches for "Dior aesthetic" and "Dior style guide" began climbing weeks before the FW26 show even opened.

That pre-show anticipation translated into one of the highest composite scores we've recorded this season: 94/100.

## What the runway said

Anderson's debut was characterised by a tension between Dior's architectural heritage and his own instinct for the tactile and the strange. The collection featured 48 looks. Of those, 31 showed up in multiple trend detection sweeps â€" unusual for a single show. Materials that registered most strongly: structured wool, tonal cream, and unexpected leatherwork at the collar.

The silhouette was lean but never severe. A long coat with a barely-there waist. Trousers that broke cleanly at the ankle. Shoulders that hinted at volume without committing to it.

*This is what a designer who knows exactly what he's doing looks like.*

## The search signal

The 48-hour post-show window is where we find the clearest signal. Searches for "Dior leather coat" jumped 140%. "Dior FW26 looks" entered the top 50 fashion searches for the first time in three seasons.

What's significant isn't just the volume â€" it's the specificity. People weren't searching for "Dior" broadly. They were searching for particular pieces. That tells us the collection produced actual desire, not just admiration.

## What this means for your wardrobe

The structured coat is the piece to watch. Not just at Dior â€" Anderson's interpretation will filter through to the high street within two seasons. The lean trouser + long coat combination already appeared at 6 other FW26 shows in similar form.

Score: 94/100. Watch this space.`,
  },
  {
    id: 2,
    kicker: 'Data Â· Milan FW26',
    category: 'Data',
    season: 'Milan FW26',
    title: 'The leather bomber is a macro trend',
    excerpt: '200% search spike, 7 major shows, 3 cities. A data-driven case for the jacket of the season.',
    date: 'Mar 6, 2026',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=80',
    score: 88,
    runwayScore: 44,
    searchScore: 30,
    socialScore: 14,
    body: `## The numbers

Seven shows. Three cities. Two hundred percent search increase. The leather bomber didn't just appear at Gucci FW26 Milan â€" it appeared everywhere, in every form, across the entire season.

## Why this is different from a micro trend

A micro trend is a single runway moment that the internet amplifies briefly. The leather bomber is something else: it has runway frequency, search velocity, *and* social signal all moving in the same direction at the same time.

That trifecta is what produces a high composite score. 88/100.`,
  },
];

const TICKER_ITEMS = [
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7',
  'Dior FW26  87.4', 'Prairie Silhouette  78.6', 'Wide-Leg Trouser  74.3',
  'Burgundy  +180%', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
];

function renderBody(text: string) {
  return text.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) {
      return <h2 key={i} style={{ fontFamily:"'Ranade',sans-serif", fontSize:'clamp(20px,2vw,26px)', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.1, color:'#0C0B09', marginBottom:'16px', marginTop: i === 0 ? 0 : '40px', textTransform:'lowercase' }}>{block.slice(3)}</h2>;
    }
    if (block.startsWith('*') && block.endsWith('*')) {
      return <p key={i} style={{ fontFamily:"'Lora',Georgia,serif", fontSize:'16px', fontStyle:'italic', lineHeight:1.8, color:'#5A5550', borderLeft:'2px solid #0C0B09', paddingLeft:'20px', margin:'32px 0' }}>{block.slice(1, -1)}</p>;
    }
    return <p key={i} style={{ fontFamily:"'Lora',Georgia,serif", fontSize:'16px', lineHeight:1.85, color:'#5A5550', marginBottom:'22px' }}>{block}</p>;
  });
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [navVisible, setNavVisible] = useState(true);
  const [menuOpen,   setMenuOpen]   = useState(false);

  const article = ARTICLES.find(a => String(a.id) === params.slug) || ARTICLES[0];
  const related = ARTICLES.filter(a => a.id !== article.id).slice(0, 3);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { setNavVisible(window.scrollY < 20); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          --f-mono:'Geist Mono',monospace;
          --f-display:'Ranade',sans-serif;
          --f-body:'Lora',Georgia,serif;
        }
        body { background:#fff; color:var(--ink); -webkit-font-smoothing:antialiased; }

        /* â"€â"€ Header â€" exact homepage â"€â"€ */
        .site-header { position:fixed; top:0; left:0; right:0; z-index:1000; background:#fff; border-bottom:1px solid var(--bd); }

        .ticker { background:var(--ink); overflow:hidden; white-space:nowrap; padding:7px 0; }
        .ticker-inner { display:inline-flex; animation:tick 48s linear infinite; }
        .ticker-inner span { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.13em; color:rgba(255,255,255,0.9); padding:0 42px; }
        @keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        .nav-title-row { height:56px; display:flex; align-items:center; justify-content:center; padding:0 52px; background:#fff; position:relative; }
        .nav-logo { font-family:var(--f-display); font-size:20px; font-weight:700; letter-spacing:0.08em; text-transform:lowercase; color:var(--ink); text-decoration:none; }

        .nav-menu-btn { position:absolute; left:24px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; display:flex; flex-direction:column; gap:5px; padding:6px; }
        .nav-menu-btn span { display:block; width:22px; height:1.5px; background:var(--ink); transition:transform .2s, opacity .2s; }
        .nav-menu-btn.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
        .nav-menu-btn.open span:nth-child(2) { opacity:0; }
        .nav-menu-btn.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }

        .nav-pill { position:absolute; right:52px; top:50%; transform:translateY(-50%); font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; border:1px solid var(--bd); color:var(--light); padding:5px 13px; }

        .nav-links-row { height:38px; display:flex; align-items:center; justify-content:center; gap:44px; background:#fff; border-top:1px solid var(--bd); list-style:none; padding:0; overflow:hidden; transition:height .3s cubic-bezier(.4,0,.2,1), opacity .3s ease, border-color .3s ease; }
        .nav-links-row.hidden { height:0; opacity:0; pointer-events:none; border-color:transparent; }
        .nav-links-row a { font-family:var(--f-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink); text-decoration:none; transition:color .15s; }
        .nav-links-row a:hover { color:var(--light); }
        .nav-links-row a.curr { color:var(--light); }

        .header-spacer { height:118px; }
        .header-spacer.collapsed { height:80px; }

        .nav-drawer { position:fixed; top:0; left:0; bottom:0; width:260px; background:#fff; z-index:2000; transform:translateX(-100%); transition:transform .3s cubic-bezier(.4,0,.2,1); border-right:1px solid var(--bd); padding:88px 36px 40px; display:flex; flex-direction:column; gap:8px; }
        .nav-drawer.open { transform:translateX(0); }
        .nav-drawer a { font-family:var(--f-display); font-size:28px; font-weight:700; letter-spacing:-0.02em; text-transform:lowercase; color:var(--ink); text-decoration:none; line-height:1.25; opacity:.85; transition:opacity .15s; }
        .nav-drawer a:hover { opacity:1; }
        .nav-drawer-close { position:absolute; top:22px; right:22px; background:none; border:none; cursor:pointer; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .nav-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.18); z-index:1900; opacity:0; pointer-events:none; transition:opacity .3s; }
        .nav-overlay.open { opacity:1; pointer-events:all; }

        /* â"€â"€ Article layout â"€â"€ */

        /* breadcrumb */
        .breadcrumb { padding:18px 52px; border-bottom:1px solid var(--bd); font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); display:flex; align-items:center; gap:10px; }
        .breadcrumb a { color:var(--light); text-decoration:none; transition:color .15s; }
        .breadcrumb a:hover { color:var(--ink); }
        .breadcrumb-sep { color:var(--bd); }

        /* GQ-style article header: meta top, big title, hero image full width */
        .article-header { padding:44px 52px 0; border-bottom:1px solid var(--bd); }
        .article-meta-row { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
        .article-category { font-family:var(--f-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); display:flex; align-items:center; gap:10px; }
        .article-category::before { content:''; width:18px; height:1px; background:var(--light); }
        .article-date { font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .article-season { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; background:var(--warm); color:var(--mid); padding:3px 10px; margin-left:auto; }
        .article-title { font-family:var(--f-display); font-size:clamp(32px,4.5vw,64px); font-weight:700; letter-spacing:-0.03em; line-height:0.96; text-transform:lowercase; color:var(--ink); margin-bottom:24px; max-width:880px; }
        .article-excerpt { font-family:var(--f-body); font-size:17px; font-weight:400; line-height:1.7; color:var(--mid); max-width:620px; margin-bottom:36px; }

        /* hero image â€" full width with score badge over */
        .article-hero { position:relative; margin:0 -0px; overflow:hidden; }
        .article-hero img { width:100%; aspect-ratio:21/9; object-fit:cover; object-position:top center; filter:grayscale(6%) brightness(0.88); display:block; }
        .article-hero-score { position:absolute; bottom:20px; left:52px; background:var(--ink); color:#fff; font-family:var(--f-mono); font-size:10px; letter-spacing:0.13em; text-transform:uppercase; padding:6px 14px; display:flex; align-items:center; gap:14px; }
        .article-hero-score-num { font-size:18px; font-weight:500; letter-spacing:-0.02em; }

        /* score breakdown bar below image */
        .score-bar { display:grid; grid-template-columns:repeat(3,1fr); border-bottom:1px solid var(--bd); }
        .score-bar-item { padding:16px 24px; border-right:1px solid var(--bd); display:flex; flex-direction:column; gap:8px; }
        .score-bar-item:last-child { border-right:none; }
        .score-bar-label { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); display:flex; align-items:center; justify-content:space-between; }
        .score-bar-pct { font-family:var(--f-mono); font-size:9px; color:var(--light); }
        .score-bar-track { height:2px; background:var(--warm); width:100%; }
        .score-bar-fill { height:100%; background:var(--ink); transition:width .8s cubic-bezier(.4,0,.2,1); }
        .score-bar-num { font-family:var(--f-display); font-size:22px; font-weight:700; letter-spacing:-0.02em; color:var(--ink); line-height:1; }

        /* body: two-col with sidebar */
        .article-body-wrap { display:grid; grid-template-columns:1fr 280px; border-bottom:1px solid var(--bd); align-items:start; }
        .article-body { padding:52px 52px 64px; border-right:1px solid var(--bd); max-width:780px; }
        .article-sidebar { padding:32px 28px; position:sticky; top:120px; }
        .sidebar-score-block { border:1px solid var(--bd); padding:20px; margin-bottom:24px; }
        .sidebar-score-lbl { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:8px; }
        .sidebar-score-num { font-family:var(--f-display); font-size:48px; font-weight:700; letter-spacing:-0.04em; color:var(--ink); line-height:1; margin-bottom:4px; }
        .sidebar-score-sub { font-family:var(--f-mono); font-size:8px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .sidebar-info { margin-bottom:24px; }
        .sidebar-info-row { display:flex; justify-content:space-between; align-items:baseline; padding:9px 0; border-bottom:1px solid var(--bd); }
        .sidebar-info-row:first-child { border-top:1px solid var(--bd); }
        .sidebar-info-key { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .sidebar-info-val { font-family:var(--f-mono); font-size:9px; color:var(--ink); }
        .sidebar-method { font-family:var(--f-body); font-size:12px; line-height:1.7; color:var(--mid); margin-bottom:16px; }
        .sidebar-link { font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; color:var(--ink); text-decoration:none; display:flex; align-items:center; gap:6px; transition:gap .15s; }
        .sidebar-link:hover { gap:10px; }

        /* Related articles â€" 3-col grid like GQ Recommends */
        .related { border-bottom:1px solid var(--bd); }
        .related-head { padding:26px 52px 16px; border-bottom:1px solid var(--bd); display:flex; align-items:baseline; justify-content:space-between; }
        .related-title { font-family:var(--f-display); font-size:32px; font-weight:700; letter-spacing:-0.02em; line-height:1; color:var(--ink); }
        .related-link { font-family:var(--f-mono); font-size:10px; letter-spacing:0.13em; text-transform:uppercase; color:var(--light); text-decoration:none; transition:color .15s; display:flex; align-items:center; gap:6px; }
        .related-link:hover { color:var(--ink); }
        .related-grid { display:grid; grid-template-columns:repeat(3,1fr); }
        .r-card { text-decoration:none; color:inherit; border-right:1px solid var(--bd); display:flex; flex-direction:column; transition:opacity .18s; }
        .r-card:last-child { border-right:none; }
        .r-card:hover { opacity:.76; }
        .r-card-img { overflow:hidden; }
        .r-card-img img { width:100%; aspect-ratio:4/3; object-fit:cover; object-position:top center; filter:grayscale(8%) brightness(0.9); display:block; transition:transform .5s; }
        .r-card:hover .r-card-img img { transform:scale(1.04); }
        .r-card-body { padding:18px 24px 24px; flex:1; display:flex; flex-direction:column; }
        .r-card-kicker { font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; color:var(--light); margin-bottom:8px; }
        .r-card-title { font-family:var(--f-display); font-size:17px; font-weight:700; letter-spacing:-0.01em; line-height:1.1; text-transform:lowercase; color:var(--ink); flex:1; margin-bottom:12px; }
        .r-card-foot { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid var(--bd); margin-top:auto; }
        .r-card-date { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.09em; text-transform:uppercase; color:var(--light); }
        .r-card-arrow { font-family:var(--f-mono); font-size:12px; color:var(--light); transition:transform .18s, color .15s; }
        .r-card:hover .r-card-arrow { transform:translateX(4px); color:var(--ink); }

        /* â"€â"€ Footer â€" exact homepage â"€â"€ */
        footer { background:var(--ink); padding:26px 52px; display:flex; align-items:center; justify-content:space-between; }
        .f-logo { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:0.1em; text-transform:lowercase; color:#fff; }
        .f-links { display:flex; gap:28px; list-style:none; }
        .f-links a { font-family:var(--f-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.3); text-decoration:none; transition:color .15s; }
        .f-links a:hover { color:rgba(255,255,255,0.7); }
        .f-copy { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; color:rgba(255,255,255,0.2); }
      `}</style>

      {/* Drawer */}
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>âœ• close</button>
        <a href="/trends"   onClick={() => setMenuOpen(false)}>Trends</a>
        <a href="/shows"    onClick={() => setMenuOpen(false)}>Shows</a>
        <a href="/analysis" onClick={() => setMenuOpen(false)}>Analysis</a>
        <a href="/archive"  onClick={() => setMenuOpen(false)}>Archive</a>
        <a href="/about"    onClick={() => setMenuOpen(false)}>About</a>
      </div>
      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Header */}
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
          <a href="/" className="nav-logo">runway fyi</a>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className={`nav-links-row${navVisible ? '' : ' hidden'}`}>
          <li><a href="/trends">Trends</a></li>
          <li><a href="/shows">Shows</a></li>
          <li><a href="/analysis" className="curr">Analysis</a></li>
          <li><a href="/archive">Archive</a></li>
        </ul>
      </header>
      <div className={`header-spacer${navVisible ? '' : ' collapsed'}`} />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="breadcrumb-sep">/</span>
        <a href="/analysis">Analysis</a>
        <span className="breadcrumb-sep">/</span>
        <span>{article.category}</span>
      </div>

      {/* Article header â€" GQ style: meta â†' title â†' excerpt â†' then hero image */}
      <div className="article-header">
        <div className="article-meta-row">
          <span className="article-category">{article.kicker}</span>
          <span className="article-date">{article.date}</span>
          <span className="article-season">{article.season}</span>
        </div>
        <h1 className="article-title">{article.title}</h1>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="article-hero">
          <img src={article.img} alt={article.title} />
          <div className="article-hero-score">
            <span>Composite Score</span>
            <span className="article-hero-score-num">{article.score}/100</span>
          </div>
        </div>
      </div>

      {/* Score breakdown bar */}
      <div className="score-bar">
        {[
          { label: 'Runway', weight: '50%', val: article.runwayScore, max: 50 },
          { label: 'Search', weight: '30%', val: article.searchScore, max: 30 },
          { label: 'Social', weight: '20%', val: article.socialScore, max: 20 },
        ].map(s => (
          <div key={s.label} className="score-bar-item">
            <div className="score-bar-label">
              <span>{s.label}</span>
              <span className="score-bar-pct">{s.weight}</span>
            </div>
            <div className="score-bar-track">
              <div className="score-bar-fill" style={{ width: `${(s.val / s.max) * 100}%` }} />
            </div>
            <div className="score-bar-num">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Body + sidebar */}
      <div className="article-body-wrap">
        <div className="article-body">
          {renderBody(article.body)}
        </div>
        <aside className="article-sidebar">
          <div className="sidebar-score-block">
            <div className="sidebar-score-lbl">Composite Score</div>
            <div className="sidebar-score-num">{article.score}</div>
            <div className="sidebar-score-sub">/ 100 Â· FW26</div>
          </div>
          <div className="sidebar-info">
            {[
              { key: 'Category',  val: article.category },
              { key: 'Season',    val: article.season },
              { key: 'Published', val: article.date },
              { key: 'Runway',    val: `${article.runwayScore} / 50` },
              { key: 'Search',    val: `${article.searchScore} / 30` },
              { key: 'Social',    val: `${article.socialScore} / 20` },
            ].map(row => (
              <div key={row.key} className="sidebar-info-row">
                <span className="sidebar-info-key">{row.key}</span>
                <span className="sidebar-info-val">{row.val}</span>
              </div>
            ))}
          </div>
          <p className="sidebar-method">Scores are computed using a composite formula: 50% runway frequency, 30% search velocity (pytrends), 20% social signal.</p>
          <a href="/about" className="sidebar-link">Read the methodology â†'</a>
        </aside>
      </div>

      {/* Related â€" GQ Recommends 3-col */}
      <div className="related">
        <div className="related-head">
          <h2 className="related-title">More Analysis</h2>
          <a href="/analysis" className="related-link">View all â†'</a>
        </div>
        <div className="related-grid">
          {related.map(a => (
            <a key={a.id} href={`/analysis/${a.id}`} className="r-card">
              <div className="r-card-img">
                <img src={a.img} alt={a.title} />
              </div>
              <div className="r-card-body">
                <div className="r-card-kicker">{a.kicker}</div>
                <div className="r-card-title">{a.title}</div>
                <div className="r-card-foot">
                  <span className="r-card-date">{a.date}</span>
                  <span className="r-card-arrow">â†'</span>
                </div>
              </div>
            </a>
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
        <span className="f-copy">Â© 2026 runway.fyi</span>
      </footer>
    </>
  );
}
