'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const TICKER_ITEMS = [
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7',
  'Dior FW26  87.4', 'Prairie Silhouette  78.6', 'Wide-Leg Trouser  74.3',
  'Burgundy  +180%', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
];

// ─── Static show data ─────────────────────────────────────────────────────────
// Replace image values with your own URLs. Wire to GET /api/trends/shows later.

const ALL_SHOWS = [
  { slug: 'chanel-fw26',          designer: 'Chanel',           city: 'Paris',    season: 'FW26', date: 'Mar 4, 2026',  looks: 52, score: 91, keywords: ['tweed', 'ballet flat', 'camellia'],      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { slug: 'dior-fw26',            designer: 'Dior',             city: 'Paris',    season: 'FW26', date: 'Feb 28, 2026', looks: 48, score: 88, keywords: ['tailoring', 'bar jacket', 'corset'],      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80' },
  { slug: 'chloe-fw26',           designer: 'Chloé',            city: 'Paris',    season: 'FW26', date: 'Mar 1, 2026',  looks: 40, score: 84, keywords: ['prairie dress', 'plaid', 'ruffle'],       img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
  { slug: 'saint-laurent-fw26',   designer: 'Saint Laurent',    city: 'Paris',    season: 'FW26', date: 'Feb 25, 2026', looks: 44, score: 82, keywords: ['blazer', 'le smoking', 'column'],         img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80' },
  { slug: 'gucci-fw26',           designer: 'Gucci',            city: 'Milan',    season: 'FW26', date: 'Feb 23, 2026', looks: 56, score: 87, keywords: ['leather bomber', 'loafer', 'double G'],   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { slug: 'prada-fw26',           designer: 'Prada',            city: 'Milan',    season: 'FW26', date: 'Feb 20, 2026', looks: 44, score: 90, keywords: ['nylon', 'utilitarian', 'mohair'],          img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80' },
  { slug: 'bottega-veneta-fw26',  designer: 'Bottega Veneta',   city: 'Milan',    season: 'FW26', date: 'Feb 22, 2026', looks: 38, score: 86, keywords: ['intrecciato', 'maxi boot', 'coat'],        img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
  { slug: 'burberry-fw26',        designer: 'Burberry',         city: 'London',   season: 'FW26', date: 'Feb 17, 2026', looks: 42, score: 79, keywords: ['trench', 'check', 'equestrian'],           img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80' },
  { slug: 'jw-anderson-fw26',     designer: 'JW Anderson',      city: 'London',   season: 'FW26', date: 'Feb 15, 2026', looks: 36, score: 82, keywords: ['knitwear', 'asymmetric', 'twisted'],       img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { slug: 'marc-jacobs-fw26',     designer: 'Marc Jacobs',      city: 'New York', season: 'FW26', date: 'Feb 12, 2026', looks: 46, score: 83, keywords: ['maximalism', 'platform', 'layering'],      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80' },
  { slug: 'proenza-schouler-fw26',designer: 'Proenza Schouler', city: 'New York', season: 'FW26', date: 'Feb 11, 2026', looks: 34, score: 78, keywords: ['leather', 'slouch', 'minimal'],            img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
];

const CITIES = ['All', 'Paris', 'Milan', 'London', 'New York'];

export default function ShowsPage() {
  const [navVisible,  setNavVisible]  = useState(true);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeCity,  setActiveCity]  = useState('All');
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setNavVisible(y < 20);
        lastScrollY.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shows = activeCity === 'All' ? ALL_SHOWS : ALL_SHOWS.filter(s => s.city === activeCity);

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Geist+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --ink:#0C0B09; --white:#FFFFFF; --cream:#F5F2ED; --warm:#EDE9E2;
          --mid:#5A5550; --light:#A09A94; --bd:rgba(12,11,9,0.1);
          --f-mono:'Geist Mono',monospace; --f-display:'Ranade',sans-serif; --f-body:'Lora',Georgia,serif;
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
        .nav-menu-btn span { display:block; width:22px; height:1.5px; background:var(--ink); transition:transform .2s,opacity .2s; }
        .nav-menu-btn.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
        .nav-menu-btn.open span:nth-child(2) { opacity:0; }
        .nav-menu-btn.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }
        .nav-pill { position:absolute; right:52px; top:50%; transform:translateY(-50%); font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; border:1px solid var(--bd); color:var(--light); padding:5px 13px; }
        .nav-links-row { height:38px; display:flex; align-items:center; justify-content:center; gap:44px; background:#fff; border-top:1px solid var(--bd); list-style:none; padding:0; overflow:hidden; transition:height .3s cubic-bezier(.4,0,.2,1),opacity .3s ease; }
        .nav-links-row.hidden { height:0; opacity:0; pointer-events:none; }
        .nav-links-row a { font-family:var(--f-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink); text-decoration:none; transition:color .15s; }
        .nav-links-row a:hover,.nav-links-row a.active { color:var(--light); }
        .header-spacer { height:118px; }
        .nav-drawer { position:fixed; top:0; left:0; bottom:0; width:260px; background:#fff; z-index:2000; transform:translateX(-100%); transition:transform .3s cubic-bezier(.4,0,.2,1); border-right:1px solid var(--bd); padding:88px 36px 40px; display:flex; flex-direction:column; gap:8px; }
        .nav-drawer.open { transform:translateX(0); }
        .nav-drawer a { font-family:var(--f-display); font-size:28px; font-weight:700; letter-spacing:-0.02em; text-transform:lowercase; color:var(--ink); text-decoration:none; line-height:1.25; opacity:.85; }
        .nav-drawer a:hover { opacity:1; }
        .nav-drawer-close { position:absolute; top:22px; right:22px; background:none; border:none; cursor:pointer; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .nav-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.18); z-index:1900; opacity:0; pointer-events:none; transition:opacity .3s; }
        .nav-overlay.open { opacity:1; pointer-events:all; }

        /* ── Page ── */
        .shows-wrap { max-width:1200px; margin:0 auto; padding:0 52px; }

        .shows-header { padding:64px 0 0; border-bottom:1px solid var(--bd); }
        .shows-kicker { font-family:var(--f-mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--light); margin-bottom:20px; }
        .shows-headline-row { display:flex; align-items:flex-end; justify-content:flex-start; gap:32px; margin-bottom:28px; }
        .shows-headline { font-family:var(--f-display); font-size:clamp(2.4rem,5vw,4.5rem); font-weight:700; letter-spacing:-0.03em; line-height:1; color:var(--ink); }

        /* city filter tabs */
        .city-tabs { display:flex; gap:0; }
        .ctab { font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; background:none; border:none; cursor:pointer; padding:14px 20px; color:var(--light); position:relative; transition:color .15s; flex-shrink:0; }
        .ctab::after { content:''; position:absolute; bottom:0; left:20px; right:20px; height:1.5px; background:var(--ink); transform:scaleX(0); transition:transform .2s; }
        .ctab:hover,.ctab.active { color:var(--ink); }
        .ctab.active::after,.ctab:hover::after { transform:scaleX(1); }

        /* ── Grid ── */
        .shows-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:0; border-left:1px solid var(--bd); border-top:1px solid var(--bd); margin-top:0; }
        .show-card { border-right:1px solid var(--bd); border-bottom:1px solid var(--bd); text-decoration:none; color:inherit; display:block; transition:opacity .15s; }
        .show-card:hover { opacity:.7; }
        .show-img-wrap { position:relative; aspect-ratio:2/3; overflow:hidden; background:var(--cream); }
        .show-img-wrap img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(10%) brightness(0.92); display:block; transition:transform .5s ease; }
        .show-card:hover .show-img-wrap img { transform:scale(1.04); }
        .show-score-badge { position:absolute; top:10px; right:10px; font-family:var(--f-mono); font-size:10px; font-weight:500; padding:3px 8px; background:#fff; color:var(--ink); border:1px solid var(--bd); }
        .show-score-badge.high { background:var(--ink); color:#fff; border-color:var(--ink); }
        .show-city-tag { position:absolute; bottom:10px; left:10px; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); background:rgba(255,255,255,0.88); padding:3px 8px; }
        .show-body { padding:16px 20px 20px; }
        .show-meta { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); margin-bottom:5px; }
        .show-designer { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:-0.01em; color:var(--ink); margin-bottom:4px; }
        .show-looks { font-family:var(--f-mono); font-size:9px; color:var(--light); margin-bottom:10px; }
        .show-keywords { display:flex; flex-wrap:wrap; gap:4px; }
        .show-kw { font-family:var(--f-mono); font-size:9px; letter-spacing:0.04em; color:var(--mid); background:var(--cream); padding:3px 7px; }

        /* ── Footer ── */
        footer { border-top:1px solid var(--bd); padding:32px 52px; display:flex; align-items:center; justify-content:space-between; }
        .f-logo { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:0.06em; text-transform:lowercase; color:var(--ink); }
        .f-links { display:flex; gap:28px; list-style:none; }
        .f-links a { font-family:var(--f-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--mid); text-decoration:none; transition:color .15s; }
        .f-links a:hover { color:var(--ink); }
        .f-copy { font-family:var(--f-mono); font-size:10px; letter-spacing:0.08em; color:var(--light); }

        @media (max-width:900px) {
          .shows-wrap { padding:0 24px; }
          .shows-grid { grid-template-columns:repeat(2,1fr); }
          .shows-headline-row { flex-direction:column; align-items:flex-start; }
          .shows-subline { text-align:left; max-width:100%; }
          footer { flex-direction:column; gap:20px; padding:32px 24px; align-items:flex-start; }
        }
      `}</style>

      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>close ×</button>
        <Link href="/" onClick={() => setMenuOpen(false)}>home</Link>
        <Link href="/trends" onClick={() => setMenuOpen(false)}>trends</Link>
        <Link href="/shows" onClick={() => setMenuOpen(false)}>shows</Link>
        <Link href="/analysis" onClick={() => setMenuOpen(false)}>analysis</Link>
        <Link href="/archive" onClick={() => setMenuOpen(false)}>archive</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>about</Link>
      </nav>

      <header className="site-header">
        <div className="ticker">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => <span key={i}>{item}</span>)}
          </div>
        </div>
        <div className="nav-title-row">
          <button className={`nav-menu-btn${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <Link href="/" className="nav-logo">runway fyi</Link>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className={`nav-links-row${navVisible ? '' : ' hidden'}`}>
          <li><Link href="/trends">Trends</Link></li>
          <li><Link href="/shows" className="active">Shows</Link></li>
          <li><Link href="/analysis">Analysis</Link></li>
          <li><Link href="/archive">Archive</Link></li>
        </ul>
      </header>

      <div className="header-spacer" />

      <main>
        <div className="shows-wrap">
          <div className="shows-header">
            <p className="shows-kicker">Season · FW26</p>
            <div className="shows-headline-row">
              <h1 className="shows-headline">FW26 Shows</h1>
            </div>
            <div className="city-tabs">
              {CITIES.map(city => (
                <button
                  key={city}
                  className={`ctab${activeCity === city ? ' active' : ''}`}
                  onClick={() => setActiveCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="shows-grid">
            {shows.map(show => (
              <Link key={show.slug} href={`/shows/${show.slug}`} className="show-card">
                <div className="show-img-wrap">
                  <img src={show.img} alt={`${show.designer} ${show.season}`} />
                  <span className={`show-score-badge${show.score >= 88 ? ' high' : ''}`}>
                    {show.score}
                  </span>
                  <span className="show-city-tag">{show.city}</span>
                </div>
                <div className="show-body">
                  <div className="show-meta">{show.city} · {show.date}</div>
                  <div className="show-designer">{show.designer}</div>
                  <div className="show-looks">{show.looks} looks</div>
                  <div className="show-keywords">
                    {show.keywords.slice(0, 2).map(kw => (
                      <span key={kw} className="show-kw">{kw}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <span className="f-logo">runway fyi</span>
        <ul className="f-links">
          <li><a href="https://instagram.com/runwayfyi" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://tiktok.com/@runwayfyi" target="_blank" rel="noopener noreferrer">TikTok</a></li>
          <li><Link href="/about">About</Link></li>
        </ul>
        <span className="f-copy">© 2026 runwayfyi.com</span>
      </footer>
    </>
  );
}
