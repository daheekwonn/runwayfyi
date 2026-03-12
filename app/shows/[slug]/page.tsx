'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// ─── Static show data ──────────────────────────────────────────────────────────
// Wire to GET /api/trends/shows/{slug} once backend is live.

const SHOWS_DATA: Record<string, any> = {
  'chanel-fw26': {
    designer: 'Chanel', season: 'FW26', city: 'Paris', date: 'March 4, 2026',
    venue: 'Grand Palais Éphémère, Paris',
    trendScore: 91, runwayScore: 94, searchScore: 90, socialScore: 87,
    description: `Matthieu Blazy's first full Chanel season rewired the house codes entirely. Tweed is back — but cut like a second skin. The ballet flat appeared on 34 of 52 looks, a frequency that almost never happens at this level. Search data confirmed it within 48 hours: "Chanel ballet flat" up 312% globally after the show.`,
    keySignals: [
      '"Chanel ballet flat" +312% search in 48hrs post-show',
      'Tweed appeared on 38 of 52 looks — highest frequency in 6 seasons',
      'Instagram saves on show content: 2.4× higher than FW25',
      'Camellia motif recurred across accessories — first time since 2019',
    ],
    heroImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    looks: Array.from({ length: 12 }, (_, i) => ({ number: i + 1, score: Math.floor(70 + Math.random() * 28), materials: ['tweed', 'silk'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' })),
  },
  'dior-fw26': {
    designer: 'Dior', season: 'FW26', city: 'Paris', date: 'February 28, 2026',
    venue: 'Musée Rodin, Paris',
    trendScore: 88, runwayScore: 92, searchScore: 86, socialScore: 83,
    description: `Jonathan Anderson's debut at Dior was the most watched show of the season. His signature object-as-embellishment approach landed differently at a house this historic — more legible, more wearable, but no less strange. The bar jacket returned but warped. "Dior bar jacket" searches hit +245% post-show.`,
    keySignals: [
      '"Dior bar jacket" +245% search post-show',
      'Anderson\'s first collection: highest social engagement of any Paris show',
      'Corset silhouette on 29 of 48 looks',
      'Strongest press response of the Paris season',
    ],
    heroImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80',
    looks: Array.from({ length: 10 }, (_, i) => ({ number: i + 1, score: Math.floor(68 + Math.random() * 28), materials: ['tailoring', 'silk'], img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' })),
  },
  'chloe-fw26': {
    designer: 'Chloé', season: 'FW26', city: 'Paris', date: 'March 1, 2026',
    venue: 'Palais de Tokyo, Paris',
    trendScore: 84, runwayScore: 88, searchScore: 80, socialScore: 83,
    description: `Chemena Kamali pushed prairie dressing into genuinely strange territory — pink plaid, tiered ruffles, dark boots. It shouldn't work. The data says it does. "Prairie dress" searches hit a 5-year high in the 72 hours after the show, spreading well beyond the fashion crowd into general lifestyle content.`,
    keySignals: [
      '"Prairie dress" searches at 5-year high post-show',
      'Plaid fabric searches up 178% globally',
      'Heavy organic reach in lifestyle and cottage content on Instagram',
      'Ruffle silhouette appeared on 28 of 40 looks',
    ],
    heroImg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
    looks: Array.from({ length: 10 }, (_, i) => ({ number: i + 1, score: Math.floor(65 + Math.random() * 28), materials: ['plaid', 'organza'], img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80' })),
  },
  'gucci-fw26': {
    designer: 'Gucci', season: 'FW26', city: 'Milan', date: 'February 23, 2026',
    venue: 'Gucci Hub, Milan',
    trendScore: 87, runwayScore: 85, searchScore: 91, socialScore: 84,
    description: `The leather bomber at Gucci was the single most-searched post-show item of FW26. A 200% spike in "leather bomber jacket" searches within 24 hours is the kind of number that changes a buyer's order book. The loafer signal — 41 of 56 looks — is the dominant footwear forecast of the season.`,
    keySignals: [
      '"Leather bomber" +200% search within 24hrs post-show',
      'Loafer silhouette on 41 of 56 looks — dominant footwear signal',
      'Double G hardware drove 3× engagement vs non-logo looks',
      'Highest repost rate of any Milan show',
    ],
    heroImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=80',
    looks: Array.from({ length: 12 }, (_, i) => ({ number: i + 1, score: Math.floor(72 + Math.random() * 26), materials: ['leather', 'wool'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80' })),
  },
};

export default function ShowPage({ params }: { params: { slug: string } }) {
  const show = SHOWS_DATA[params.slug] ?? {
    designer: params.slug, season: 'FW26', city: '—', date: '—', venue: '—',
    trendScore: 0, runwayScore: 0, searchScore: 0, socialScore: 0,
    description: 'Full show data coming soon.',
    keySignals: [], heroImg: '', looks: [],
  };

  const [navVisible, setNavVisible] = useState(true);
  const [menuOpen,   setMenuOpen]   = useState(false);
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
        .header-spacer { height:94px; }
        .nav-drawer { position:fixed; top:0; left:0; bottom:0; width:260px; background:#fff; z-index:2000; transform:translateX(-100%); transition:transform .3s cubic-bezier(.4,0,.2,1); border-right:1px solid var(--bd); padding:88px 36px 40px; display:flex; flex-direction:column; gap:8px; }
        .nav-drawer.open { transform:translateX(0); }
        .nav-drawer a { font-family:var(--f-display); font-size:28px; font-weight:700; letter-spacing:-0.02em; text-transform:lowercase; color:var(--ink); text-decoration:none; line-height:1.25; opacity:.85; }
        .nav-drawer a:hover { opacity:1; }
        .nav-drawer-close { position:absolute; top:22px; right:22px; background:none; border:none; cursor:pointer; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .nav-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.18); z-index:1900; opacity:0; pointer-events:none; transition:opacity .3s; }
        .nav-overlay.open { opacity:1; pointer-events:all; }

        /* ── Hero ── */
        .show-hero { position:relative; width:100%; height:70vh; min-height:420px; overflow:hidden; border-bottom:1px solid var(--bd); }
        .show-hero-img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(10%) brightness(0.88); display:block; }
        .show-hero-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.3) 45%, transparent 100%); }
        .show-hero-content { position:absolute; bottom:0; left:0; right:0; padding:0 52px 48px; display:flex; align-items:flex-end; justify-content:space-between; gap:40px; }
        .show-breadcrumb { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--mid); margin-bottom:16px; display:flex; gap:8px; align-items:center; }
        .show-breadcrumb a { color:var(--mid); text-decoration:none; transition:color .15s; }
        .show-breadcrumb a:hover { color:var(--ink); }
        .show-kicker { font-family:var(--f-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:12px; }
        .show-title { font-family:var(--f-display); font-size:clamp(3rem,7vw,6.5rem); font-weight:700; letter-spacing:-0.03em; line-height:0.95; color:var(--ink); }
        .show-venue { font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); margin-top:14px; }
        .show-composite { text-align:right; flex-shrink:0; }
        .composite-label { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:4px; }
        .composite-score { font-family:var(--f-display); font-size:clamp(4rem,8vw,7rem); font-weight:700; letter-spacing:-0.04em; line-height:1; color:var(--ink); }
        .composite-denom { font-family:var(--f-mono); font-size:11px; letter-spacing:0.08em; color:var(--light); }

        /* ── Body ── */
        .show-wrap { max-width:1200px; margin:0 auto; padding:0 52px; }
        .show-body-grid { display:grid; grid-template-columns:1fr 360px; gap:80px; padding:56px 0 64px; border-bottom:1px solid var(--bd); align-items:start; }
        .show-section-label { font-family:var(--f-mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--light); margin-bottom:20px; }
        .show-description { font-family:var(--f-body); font-size:16px; line-height:1.8; color:var(--mid); margin-bottom:40px; max-width:600px; }
        .signals-list { border-top:1px solid var(--bd); }
        .signal-row { display:grid; grid-template-columns:28px 1fr; gap:14px; padding:16px 0; border-bottom:1px solid var(--bd); align-items:start; }
        .signal-num { font-family:var(--f-mono); font-size:9px; color:var(--light); padding-top:2px; }
        .signal-text { font-family:var(--f-body); font-size:14px; line-height:1.6; color:var(--mid); }

        /* ── Score sidebar ── */
        .score-sidebar { border:1px solid var(--bd); padding:32px; position:sticky; top:110px; }
        .sidebar-title { font-family:var(--f-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:24px; }
        .score-bar-row { margin-bottom:20px; }
        .score-bar-header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
        .score-bar-label { font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--mid); }
        .score-bar-value { font-family:var(--f-display); font-size:20px; font-weight:700; letter-spacing:-0.02em; color:var(--ink); }
        .score-track { height:2px; background:var(--warm); }
        .score-fill { height:100%; background:var(--ink); transition:width .7s ease; }
        .sidebar-divider { height:1px; background:var(--bd); margin:24px 0; }
        .sidebar-meta-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--bd); }
        .sidebar-meta-row:last-of-type { border-bottom:none; }
        .sidebar-meta-key { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .sidebar-meta-val { font-family:var(--f-body); font-size:13px; color:var(--mid); }
        .sidebar-method-link { display:block; margin-top:20px; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); text-decoration:none; transition:color .15s; }
        .sidebar-method-link:hover { color:var(--ink); }

        /* ── Looks grid ── */
        .looks-section { padding:48px 0 80px; }
        .looks-header { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:0; padding-bottom:16px; border-bottom:1px solid var(--bd); }
        .looks-title { font-family:var(--f-display); font-size:28px; font-weight:700; letter-spacing:-0.02em; color:var(--ink); }
        .looks-note { font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .looks-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:0; border-left:1px solid var(--bd); border-top:1px solid var(--bd); margin-top:0; }
        .look-cell { border-right:1px solid var(--bd); border-bottom:1px solid var(--bd); }
        .look-img-wrap { position:relative; aspect-ratio:2/3; overflow:hidden; background:var(--cream); }
        .look-img-wrap img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(8%) brightness(0.93); display:block; transition:transform .4s ease; }
        .look-cell:hover .look-img-wrap img { transform:scale(1.04); }
        .look-num { position:absolute; top:8px; left:8px; font-family:var(--f-mono); font-size:9px; background:rgba(255,255,255,0.9); color:var(--mid); padding:2px 7px; }
        .look-score-badge { position:absolute; top:8px; right:8px; font-family:var(--f-mono); font-size:9px; font-weight:500; background:var(--ink); color:#fff; padding:2px 7px; }
        .look-footer { padding:10px 12px; display:flex; flex-wrap:wrap; gap:4px; }
        .look-mat { font-family:var(--f-mono); font-size:9px; color:var(--mid); background:var(--cream); padding:2px 6px; }

        /* ── Back link ── */
        .back-link { display:inline-flex; align-items:center; gap:8px; font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); text-decoration:none; padding:48px 0 0; border:none; background:none; cursor:pointer; transition:color .15s; }
        .back-link:hover { color:var(--ink); }

        /* ── Footer ── */
        footer { border-top:1px solid var(--bd); padding:32px 52px; display:flex; align-items:center; justify-content:space-between; }
        .f-logo { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:0.06em; text-transform:lowercase; color:var(--ink); }
        .f-links { display:flex; gap:28px; list-style:none; }
        .f-links a { font-family:var(--f-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--mid); text-decoration:none; transition:color .15s; }
        .f-links a:hover { color:var(--ink); }
        .f-copy { font-family:var(--f-mono); font-size:10px; letter-spacing:0.08em; color:var(--light); }

        @media (max-width:900px) {
          .show-hero-content { padding:0 24px 36px; flex-direction:column; align-items:flex-start; gap:16px; }
          .show-composite { text-align:left; }
          .show-wrap { padding:0 24px; }
          .show-body-grid { grid-template-columns:1fr; gap:40px; }
          .score-sidebar { position:static; }
          .looks-grid { grid-template-columns:repeat(3,1fr); }
          footer { flex-direction:column; gap:20px; padding:32px 24px; align-items:flex-start; }
        }
      `}</style>

      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>close ×</button>
        <Link href="/" onClick={() => setMenuOpen(false)}>home</Link>
        <Link href="/analysis" onClick={() => setMenuOpen(false)}>analysis</Link>
        <Link href="/shows" onClick={() => setMenuOpen(false)}>shows</Link>
        <Link href="/trends" onClick={() => setMenuOpen(false)}>trends</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>about</Link>
      </nav>

      <header className="site-header">
        <div className="nav-title-row">
          <button className={`nav-menu-btn${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <Link href="/" className="nav-logo">runway fyi</Link>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className={`nav-links-row${navVisible ? '' : ' hidden'}`}>
          <li><Link href="/analysis">Analysis</Link></li>
          <li><Link href="/shows" className="active">Shows</Link></li>
          <li><Link href="/trends">Trends</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
      </header>

      <div className="header-spacer" />

      {/* ── Hero ── */}
      <div className="show-hero">
        {show.heroImg && <img src={show.heroImg} alt={`${show.designer} ${show.season}`} className="show-hero-img" />}
        <div className="show-hero-overlay" />
        <div className="show-hero-content">
          <div>
            <div className="show-breadcrumb">
              <Link href="/shows">Shows</Link>
              <span>/</span>
              <span>{show.city}</span>
              <span>/</span>
              <span>{show.designer}</span>
            </div>
            <p className="show-kicker">{show.city} · {show.season} · {show.date}</p>
            <h1 className="show-title">{show.designer}</h1>
            <p className="show-venue">{show.venue}</p>
          </div>
          <div className="show-composite">
            <div className="composite-label">Trend Score</div>
            <div className="composite-score">{show.trendScore}</div>
            <div className="composite-denom">/ 100</div>
          </div>
        </div>
      </div>

      <main>
        <div className="show-wrap">

          {/* ── Body + sidebar ── */}
          <div className="show-body-grid">
            <div>
              <p className="show-section-label">Analysis</p>
              <p className="show-description">{show.description}</p>

              {show.keySignals.length > 0 && (
                <>
                  <p className="show-section-label">Key Signals</p>
                  <div className="signals-list">
                    {show.keySignals.map((signal: string, i: number) => (
                      <div key={i} className="signal-row">
                        <span className="signal-num">0{i + 1}</span>
                        <span className="signal-text">{signal}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="score-sidebar">
              <div className="sidebar-title">Score Breakdown</div>
              {[
                { label: 'Runway', value: show.runwayScore },
                { label: 'Search', value: show.searchScore },
                { label: 'Social', value: show.socialScore },
              ].map(row => (
                <div key={row.label} className="score-bar-row">
                  <div className="score-bar-header">
                    <span className="score-bar-label">{row.label}</span>
                    <span className="score-bar-value">{row.value}</span>
                  </div>
                  <div className="score-track">
                    <div className="score-fill" style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
              <div className="sidebar-divider" />
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-key">Composite</span>
                <span className="sidebar-meta-val" style={{ fontFamily: 'var(--f-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>{show.trendScore}</span>
              </div>
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-key">City</span>
                <span className="sidebar-meta-val">{show.city}</span>
              </div>
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-key">Season</span>
                <span className="sidebar-meta-val">{show.season}</span>
              </div>
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-key">Looks</span>
                <span className="sidebar-meta-val">{show.looks.length}</span>
              </div>
              <Link href="/about" className="sidebar-method-link">About the methodology →</Link>
            </div>
          </div>

          {/* ── Looks grid ── */}
          {show.looks.length > 0 && (
            <div className="looks-section">
              <div className="looks-header">
                <span className="looks-title">Looks</span>
                <span className="looks-note">{show.looks.length} total · scores = individual trend signal</span>
              </div>
              <div className="looks-grid">
                {show.looks.map((look: any) => (
                  <div key={look.number} className="look-cell">
                    <div className="look-img-wrap">
                      <img src={look.img} alt={`Look ${look.number}`} />
                      <span className="look-num">{String(look.number).padStart(2, '0')}</span>
                      <span className="look-score-badge">{look.score}</span>
                    </div>
                    <div className="look-footer">
                      {look.materials.slice(0, 1).map((m: string) => (
                        <span key={m} className="look-mat">{m}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link href="/shows" className="back-link">← All Shows</Link>

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

export async function generateStaticParams() {
  return [
    { slug: 'chanel-fw26' }, { slug: 'dior-fw26' }, { slug: 'chloe-fw26' },
    { slug: 'gucci-fw26' }, { slug: 'prada-fw26' }, { slug: 'bottega-veneta-fw26' },
    { slug: 'burberry-fw26' }, { slug: 'jw-anderson-fw26' }, { slug: 'marc-jacobs-fw26' },
    { slug: 'proenza-schouler-fw26' }, { slug: 'saint-laurent-fw26' },
  ];
}
