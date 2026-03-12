'use client';

// app/analysis/AnalysisClient.tsx
// All interactive UI — filter tabs, nav scroll, drawer.
// Receives pre-fetched articles from the server component.

import { useEffect, useState } from 'react';

interface Article {
  id: string;
  kicker: string;
  category: string;
  season: string;
  title: string;
  excerpt: string;
  date: string;
  img: string;
  score: number;
  featured?: boolean;
}

const TICKER_ITEMS = [
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7',
  'Dior FW26  87.4', 'Prairie Silhouette  78.6', 'Wide-Leg Trouser  74.3',
  'Burgundy  +180%', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
];

const CATEGORIES = ['All', 'Analysis', 'Opinion', 'Data', 'Forecast', 'Culture'];

export default function AnalysisClient({ articles }: { articles: Article[] }) {
  const [navVisible,     setNavVisible]     = useState(true);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

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

  const filtered = articles.filter(a =>
    activeCategory === 'All' || a.category === activeCategory.toLowerCase()
  );

  const hero = filtered.find(a => a.featured) || filtered[0];
  const side = filtered.filter(a => a.id !== hero?.id).slice(0, 2);
  const rows = filtered.filter(a => a.id !== hero?.id).slice(2, 4);
  const grid = filtered.filter(a => a.id !== hero?.id).slice(4);

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

        .filter-bar { display:flex; align-items:stretch; background:#fff; border-bottom:1px solid var(--bd); overflow-x:auto; padding:0 52px; }
        .filter-group { display:flex; align-items:center; padding-left:4px; }
        .fbtn { background:none; border:none; cursor:pointer; font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); padding:14px 11px; position:relative; transition:color .15s; white-space:nowrap; }
        .fbtn::after { content:''; position:absolute; bottom:0; left:11px; right:11px; height:2px; background:var(--ink); transform:scaleX(0); transition:transform .2s; }
        .fbtn:hover { color:var(--ink); }
        .fbtn.active { color:var(--ink); }
        .fbtn.active::after { transform:scaleX(1); }

        /* Lead — fixed heights, consistent proportions */
        .lead-wrap { padding:0 48px; }
        .lead { display:grid; grid-template-columns:1fr 1fr; border:1px solid var(--bd); align-items:stretch; }
        .lead-main { border-right:1px solid var(--bd); display:flex; flex-direction:column; overflow:hidden; }
        .lead-main-a { display:block; text-decoration:none; color:inherit; transition:opacity .18s; }
        .lead-main-a:hover { opacity:.84; }
        .lead-img { overflow:hidden; width:100%; height:320px; }
        .lead-img img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(8%) brightness(0.9); display:block; transition:transform .55s ease; }
        .lead-main-a:hover .lead-img img { transform:scale(1.025); }
        .lead-body { padding:14px 28px 22px; }
        .lead-score { display:inline-block; font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; background:var(--ink); color:#fff; padding:3px 10px; margin-bottom:14px; }
        .lead-kicker { font-family:var(--f-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:10px; }
        .lead-title { font-family:var(--f-display); font-size:clamp(20px,2.2vw,30px); font-weight:700; letter-spacing:-0.02em; line-height:1.05; text-transform:lowercase; color:var(--ink); margin-bottom:8px; }
        .lead-excerpt { font-family:var(--f-body); font-size:13px; line-height:1.65; color:var(--mid); margin-bottom:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .lead-date { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }

        .lead-side { display:flex; flex-direction:column; }
        .side-a { flex:1; text-decoration:none; color:inherit; display:flex; flex-direction:column; border-bottom:1px solid var(--bd); transition:opacity .18s; overflow:hidden; }
        .side-a:last-child { border-bottom:none; }
        .side-a:hover { opacity:.78; }
        .side-img { overflow:hidden; width:100%; height:160px; flex-shrink:0; }
        .side-img img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(8%) brightness(0.9); display:block; transition:transform .5s ease; }
        .side-a:hover .side-img img { transform:scale(1.04); }
        .side-body { padding:10px 18px 14px; display:flex; flex-direction:column; flex:1; }
        .side-kicker { font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; color:var(--light); margin-bottom:7px; }
        .side-title { font-family:var(--f-display); font-size:clamp(14px,1.4vw,18px); font-weight:700; letter-spacing:-0.01em; line-height:1.1; text-transform:lowercase; color:var(--ink); margin-bottom:7px; flex:1; }
        .side-foot { display:flex; align-items:center; justify-content:space-between; margin-top:10px; padding-top:9px; border-top:1px solid var(--bd); }
        .side-date { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.09em; text-transform:uppercase; color:var(--light); }
        .side-score { font-family:var(--f-mono); font-size:8.5px; color:var(--mid); }

        .sec-head { display:flex; align-items:baseline; justify-content:space-between; padding:26px 52px 16px; border-bottom:1px solid var(--bd); }
        .sec-title { font-family:var(--f-display); font-size:32px; font-weight:700; letter-spacing:-0.02em; line-height:1; color:var(--ink); }
        .sec-note { font-family:var(--f-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); white-space:nowrap; margin-left:16px; }

        .a-rows { border-bottom:1px solid var(--bd); }
        .a-row-link { display:grid; grid-template-columns:1fr 240px; border-bottom:1px solid var(--bd); text-decoration:none; color:inherit; transition:opacity .18s; align-items:start; }
        .a-row-link:last-child { border-bottom:none; }
        .a-row-link:hover { opacity:.76; }
        .a-row-body { padding:28px 36px 28px 52px; display:flex; flex-direction:column; justify-content:space-between; border-right:1px solid var(--bd); min-height:160px; }
        .a-row-kicker { font-family:var(--f-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:12px; display:flex; align-items:center; gap:10px; }
        .a-row-kicker::before { content:''; width:18px; height:1px; background:var(--light); }
        .a-row-title { font-family:var(--f-display); font-size:clamp(18px,1.8vw,26px); font-weight:700; letter-spacing:-0.02em; line-height:1.06; text-transform:lowercase; color:var(--ink); margin-bottom:10px; }
        .a-row-excerpt { font-family:var(--f-body); font-size:13px; line-height:1.7; color:var(--mid); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; flex:1; }
        .a-row-foot { display:flex; align-items:center; gap:14px; margin-top:18px; padding-top:14px; border-top:1px solid var(--bd); }
        .a-row-date { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .a-row-score-tag { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; background:var(--warm); color:var(--mid); padding:3px 9px; }
        .a-row-cta { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink); margin-left:auto; display:flex; align-items:center; gap:6px; transition:gap .15s; }
        .a-row-link:hover .a-row-cta { gap:11px; }
        .a-row-img-wrap { width:240px; height:160px; overflow:hidden; flex-shrink:0; }
        .a-row-img-wrap img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(8%) brightness(0.9); display:block; transition:transform .5s ease; }
        .a-row-link:hover .a-row-img-wrap img { transform:scale(1.03); }

        .four-grid { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--bd); }
        .g-card { text-decoration:none; color:inherit; border-right:1px solid var(--bd); display:flex; flex-direction:column; transition:opacity .18s; }
        .g-card:last-child { border-right:none; }
        .g-card:hover { opacity:.76; }
        .g-card-img { overflow:hidden; height:220px; }
        .g-card-img img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(8%) brightness(0.9); display:block; transition:transform .5s ease; }
        .g-card:hover .g-card-img img { transform:scale(1.04); }
        .g-card-body { padding:18px 22px 22px; flex:1; display:flex; flex-direction:column; }
        .g-card-kicker { font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; color:var(--light); margin-bottom:8px; }
        .g-card-title { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:-0.01em; line-height:1.15; text-transform:lowercase; color:var(--ink); margin-bottom:8px; flex:1; }
        .g-card-excerpt { font-family:var(--f-body); font-size:12px; line-height:1.6; color:var(--mid); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:12px; }
        .g-card-foot { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid var(--bd); margin-top:auto; }
        .g-card-date { font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.09em; text-transform:uppercase; color:var(--light); }
        .g-card-arrow { font-family:var(--f-mono); font-size:12px; color:var(--light); transition:transform .18s, color .15s; }
        .g-card:hover .g-card-arrow { transform:translateX(4px); color:var(--ink); }

        .empty { padding:80px 52px; font-family:var(--f-mono); font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); border-bottom:1px solid var(--bd); }

        footer { background:var(--ink); padding:26px 52px; display:flex; align-items:center; justify-content:space-between; }
        .f-logo { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:0.1em; text-transform:lowercase; color:#fff; }
        .f-links { display:flex; gap:28px; list-style:none; }
        .f-links a { font-family:var(--f-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.3); text-decoration:none; transition:color .15s; }
        .f-links a:hover { color:rgba(255,255,255,0.7); }
        .f-copy { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; color:rgba(255,255,255,0.2); }

        @media (max-width:900px) {
          .lead { grid-template-columns:1fr; }
          .lead-main { border-right:none; border-bottom:1px solid var(--bd); }
          .a-row-link { grid-template-columns:1fr; }
          .a-row-img-wrap { aspect-ratio:2/3; width:100%; }
          .four-grid { grid-template-columns:repeat(2,1fr); }
          .fyi-grid { grid-template-columns:repeat(2,1fr); }
          .fyi-item:nth-child(3n) { border-right:1px solid var(--bd); }
          .fyi-item:nth-child(2n) { border-right:none; }
          footer { flex-direction:column; gap:20px; padding:32px 24px; align-items:flex-start; }
        }
      `}</style>

      {/* Drawer */}
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>close ×</button>
        <a href="/trends">trends</a>
        <a href="/analysis">analysis</a>
        <a href="/fyi">fyi</a>
        <a href="/shows">shows</a>
        <a href="/archive">archive</a>
        <a href="/about">about</a>
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
          <li><a href="/analysis" className="curr">Analysis</a></li>
          <li><a href="/fyi">FYI</a></li>
          <li><a href="/shows">Shows</a></li>
          <li><a href="/archive">Archive</a></li>
        </ul>
      </header>
      <div className={`header-spacer${navVisible ? '' : ' collapsed'}`} />

      {/* Page header */}
      <div style={{ padding: '28px 48px 0', borderBottom: 'none' }}>
        <p style={{
          fontFamily: 'var(--f-mono)',
          fontSize: '9px',
          letterSpacing: '0.16em',
          color: 'var(--light)',
          textTransform: 'uppercase',
          margin: '0 0 8px 0'
        }}>Season · FW26</p>
        <h1 style={{
          fontFamily: 'var(--f-display)',
          fontSize: 'clamp(52px, 8vw, 96px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 0.9,
          color: 'var(--ink)',
          margin: '0 0 28px'
        }}>Analysis</h1>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-group">
          {CATEGORIES.map(c => (
            <button key={c} className={`fbtn${activeCategory === c ? ' active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No articles match these filters.</div>
      ) : (
        <>
          {/* Lead story */}
          {hero && (
            <div className="lead-wrap">
            <div className="lead">
              <div className="lead-main">
                <a href={`/analysis/${hero.id}`} className="lead-main-a">
                  <div className="lead-img">
                    <img src={hero.img} alt={hero.title} />
                  </div>
                  <div className="lead-body">
                    {hero.score > 0 && <div className="lead-score">Score {hero.score}</div>}
                    <div className="lead-kicker">{hero.kicker}</div>
                    <div className="lead-title">{hero.title}</div>
                    <p className="lead-excerpt">{hero.excerpt}</p>
                    <div className="lead-date">{hero.date}</div>
                  </div>
                </a>
              </div>
              <div className="lead-side">
                {side.map(a => (
                  <a key={a.id} href={`/analysis/${a.id}`} className="side-a">
                    <div className="side-img">
                      <img src={a.img} alt={a.title} />
                    </div>
                    <div className="side-body">
                      <div className="side-kicker">{a.kicker}</div>
                      <div className="side-title">{a.title}</div>
                      <div className="side-foot">
                        <span className="side-date">{a.date}</span>
                        {a.score > 0 && <span className="side-score">Score {a.score}</span>}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            </div>
          )}

          {/* Latest rows */}
          {rows.length > 0 && (
            <>
              <div className="sec-head">
                <h2 className="sec-title">Latest</h2>
                <span className="sec-note">{rows.length + grid.length} more pieces</span>
              </div>
              <div className="a-rows">
                {rows.map(a => (
                  <a key={a.id} href={`/analysis/${a.id}`} className="a-row-link">
                    <div className="a-row-body">
                      <div>
                        <div className="a-row-kicker">{a.kicker}</div>
                        <div className="a-row-title">{a.title}</div>
                        <p className="a-row-excerpt">{a.excerpt}</p>
                      </div>
                      <div className="a-row-foot">
                        <span className="a-row-date">{a.date}</span>
                        {a.score > 0 && <span className="a-row-score-tag">Score {a.score}</span>}
                        <span className="a-row-cta">Read analysis {'→'}</span>
                      </div>
                    </div>
                    <div className="a-row-img-wrap">
                      <img src={a.img} alt={a.title} />
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* 4-col grid */}
          {grid.length > 0 && (
            <div className="four-grid">
              {grid.map(a => (
                <a key={a.id} href={`/analysis/${a.id}`} className="g-card">
                  <div className="g-card-img">
                    <img src={a.img} alt={a.title} />
                  </div>
                  <div className="g-card-body">
                    <div className="g-card-kicker">{a.kicker}</div>
                    <div className="g-card-title">{a.title}</div>
                    <p className="g-card-excerpt">{a.excerpt}</p>
                    <div className="g-card-foot">
                      <span className="g-card-date">{a.date}</span>
                      <span className="g-card-arrow">{'→'}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer>
        <span className="f-logo">runway fyi</span>
        <ul className="f-links">
          <li><a href="https://instagram.com/runwayfyi" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://tiktok.com/@runwayfyi" target="_blank" rel="noopener noreferrer">TikTok</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <span className="f-copy">© 2026 runwayfyi.com</span>
      </footer>
    </>
  );
}
