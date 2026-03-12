'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const TICKER_ITEMS = [
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7',
  'Dior FW26  87.4', 'Prairie Silhouette  78.6', 'Wide-Leg Trouser  74.3',
  'Burgundy  +180%', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
];

const METHODOLOGY = [
  { weight: '50%', label: 'Runway Data',     description: 'Look frequency, silhouette recurrence, material and colour signals pulled from show data across Paris, Milan, London, and New York.' },
  { weight: '30%', label: 'Search Trends',   description: 'Google Trends velocity via pytrends — how fast a term accelerates after a show drops. A 200% spike in "leather bomber" after Gucci FW26 means something.' },
  { weight: '20%', label: 'Social Velocity', description: 'Instagram engagement signals on show content. Not follower counts — save rate and reshare speed.' },
];

const STATS = [
  { value: '4',    label: 'Fashion Capitals' },
  { value: '50+',  label: 'Shows per Season' },
  { value: '3',    label: 'Data Signals'     },
  { value: 'FW26', label: 'Active Season'    },
];

const PLATFORMS = [
  { name: 'Instagram', description: 'Simplified data insights and show reactions after every show.', url: 'https://instagram.com/runwayfyi', cta: '@runwayfyi' },
  { name: 'TikTok',    description: 'Short-form trend breakdowns and fashion data takes.',           url: 'https://tiktok.com/@runwayfyi',  cta: '@runwayfyi' },
];

export default function AboutPage() {
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
        html { scroll-behavior:smooth; }

        :root {
          --ink:#0C0B09; --white:#FFFFFF; --cream:#F5F2ED; --warm:#EDE9E2;
          --mid:#5A5550; --light:#A09A94; --bd:rgba(12,11,9,0.1);
          --f-mono:'Geist Mono',monospace;
          --f-display:'Ranade',sans-serif;
          --f-body:'Lora',Georgia,serif;
        }

        body { background:#fff; color:var(--ink); -webkit-font-smoothing:antialiased; }

        /* ── Header — exact match to homepage ── */
        .site-header { position:fixed; top:0; left:0; right:0; z-index:1000; background:rgba(255,255,255,1); border-bottom:1px solid var(--bd); }
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
        .nav-links-row { height:38px; display:flex; align-items:center; justify-content:center; gap:44px; background:#fff; border-top:1px solid var(--bd); list-style:none; padding:0; overflow:hidden; transition:height .3s cubic-bezier(.4,0,.2,1),opacity .3s ease,border-color .3s ease; }
        .nav-links-row.hidden { height:0; opacity:0; pointer-events:none; border-color:transparent; }
        .nav-links-row a { font-family:var(--f-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink); text-decoration:none; transition:color .15s; }
        .nav-links-row a:hover { color:var(--light); }
        /* spacer: ticker≈24 + logo-row=56 + links-row=38 */
        .header-spacer { height:118px; }
        .header-spacer.collapsed { height:80px; }

        /* ── Drawer — about lives here ── */
        .nav-drawer { position:fixed; top:0; left:0; bottom:0; width:260px; background:#fff; z-index:2000; transform:translateX(-100%); transition:transform .3s cubic-bezier(.4,0,.2,1); border-right:1px solid var(--bd); padding:88px 36px 40px; display:flex; flex-direction:column; gap:8px; }
        .nav-drawer.open { transform:translateX(0); }
        .nav-drawer a { font-family:var(--f-display); font-size:28px; font-weight:700; letter-spacing:-0.02em; text-transform:lowercase; color:var(--ink); text-decoration:none; line-height:1.25; opacity:.85; transition:opacity .15s; }
        .nav-drawer a:hover { opacity:1; }
        .nav-drawer-close { position:absolute; top:22px; right:22px; background:none; border:none; cursor:pointer; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .nav-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.18); z-index:1900; opacity:0; pointer-events:none; transition:opacity .3s; }
        .nav-overlay.open { opacity:1; pointer-events:all; }

        /* ── Page layout ── */
        .about-wrap { max-width:1200px; margin:0 auto; padding:0 52px; }

        /* ── Hero ── */
        .about-hero { padding:72px 0 56px; border-bottom:1px solid var(--bd); }
        .about-kicker { font-family:var(--f-mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--light); margin-bottom:28px; }
        .about-headline { font-family:var(--f-display); font-size:clamp(2.6rem,6vw,5.5rem); font-weight:700; letter-spacing:-0.03em; line-height:1.0; color:var(--ink); margin-bottom:40px; }
        .about-rule { width:40px; height:1px; background:var(--ink); margin-bottom:36px; }
        .about-intro-grid { display:grid; grid-template-columns:1fr 1fr; gap:32px; max-width:860px; }
        .about-intro-grid p { font-family:var(--f-body); font-size:15px; line-height:1.75; color:var(--mid); }

        /* ── Stats row ── */
        .stats-row { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--bd); }
        .stat-cell { padding:48px 40px 44px; border-right:1px solid var(--bd); }
        .stat-cell:first-child { padding-left:0; }
        .stat-cell:last-child { border-right:none; }
        .stat-value { font-family:var(--f-display); font-size:clamp(2.8rem,5vw,4.5rem); font-weight:700; letter-spacing:-0.03em; line-height:1; color:var(--ink); margin-bottom:8px; }
        .stat-label { font-family:var(--f-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); }

        /* ── Section header ── */
        .section-head { display:flex; align-items:baseline; justify-content:space-between; padding:52px 0 0; border-bottom:1px solid var(--bd); padding-bottom:20px; margin-bottom:0; }
        .section-title { font-family:var(--f-display); font-size:32px; font-weight:700; letter-spacing:-0.02em; line-height:1; color:var(--ink); }
        .section-note { font-family:var(--f-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); }

        /* ── Methodology ── */
        .method-grid { display:grid; grid-template-columns:repeat(3,1fr); border:1px solid var(--bd); border-top:none; margin-bottom:0; }
        .method-cell { padding:40px 36px; border-right:1px solid var(--bd); }
        .method-cell:last-child { border-right:none; }
        .method-weight { font-family:var(--f-display); font-size:clamp(2.8rem,4vw,4rem); font-weight:700; letter-spacing:-0.03em; line-height:1; color:var(--ink); margin-bottom:10px; }
        .method-label { font-family:var(--f-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:18px; }
        .method-desc { font-family:var(--f-body); font-size:13px; line-height:1.7; color:var(--mid); }
        .formula-box { border:1px solid var(--bd); border-top:none; padding:28px 36px; background:var(--cream); }
        .formula-label { font-family:var(--f-mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--light); margin-bottom:12px; }
        .formula-eq { font-family:var(--f-mono); font-size:clamp(1rem,1.8vw,1.3rem); color:var(--ink); }
        .formula-eq .dim { color:var(--light); }
        .formula-note { font-family:var(--f-mono); font-size:10px; letter-spacing:0.06em; color:var(--light); margin-top:10px; line-height:1.6; }

        /* ── Social ── */
        .platform-grid { display:grid; grid-template-columns:repeat(2,1fr); border:1px solid var(--bd); border-top:none; max-width:800px; }
        .platform-cell { padding:36px; border-right:1px solid var(--bd); display:flex; flex-direction:column; gap:16px; }
        .platform-cell:last-child { border-right:none; }
        .platform-name { font-family:var(--f-display); font-size:20px; font-weight:700; letter-spacing:-0.01em; color:var(--ink); }
        .platform-desc { font-family:var(--f-body); font-size:13px; line-height:1.7; color:var(--mid); flex:1; }
        .platform-link { font-family:var(--f-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink); text-decoration:none; border-bottom:1px solid var(--bd); padding-bottom:2px; align-self:flex-start; transition:color .15s; }
        .platform-link:hover { color:var(--light); }

        /* ── Contact ── */
        .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; padding:64px 0 80px; align-items:start; }
        .contact-headline { font-family:var(--f-display); font-size:clamp(2rem,5vw,4.5rem); font-weight:700; letter-spacing:-0.03em; line-height:1; color:var(--ink); }
        .contact-fields { display:flex; flex-direction:column; gap:32px; }
        .contact-field-label { font-family:var(--f-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); margin-bottom:8px; }
        .contact-email { font-family:var(--f-display); font-size:22px; font-weight:600; letter-spacing:-0.01em; color:var(--ink); text-decoration:none; border-bottom:1px solid var(--bd); padding-bottom:3px; transition:color .15s; display:inline-block; }
        .contact-email:hover { color:var(--light); }
        .contact-social-list { display:flex; flex-direction:column; gap:8px; }
        .contact-social-link { font-family:var(--f-body); font-size:14px; color:var(--mid); text-decoration:none; transition:color .15s; }
        .contact-social-link:hover { color:var(--ink); }

        /* ── Footer ── */
        footer { border-top:1px solid var(--bd); padding:32px 52px; display:flex; align-items:center; justify-content:space-between; }
        .f-logo { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:0.06em; text-transform:lowercase; color:var(--ink); }
        .f-links { display:flex; gap:28px; list-style:none; }
        .f-links a { font-family:var(--f-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--mid); text-decoration:none; transition:color .15s; }
        .f-links a:hover { color:var(--ink); }
        .f-copy { font-family:var(--f-mono); font-size:10px; letter-spacing:0.08em; color:var(--light); }

        @media (max-width:768px) {
          .about-wrap { padding:0 24px; }
          .about-intro-grid { grid-template-columns:1fr; }
          .stats-row { grid-template-columns:1fr 1fr; }
          .method-grid { grid-template-columns:1fr; }
          .method-cell { border-right:none; border-bottom:1px solid var(--bd); }
          .platform-grid { grid-template-columns:1fr; max-width:100%; }
          .platform-cell { border-right:none; border-bottom:1px solid var(--bd); }
          .contact-grid { grid-template-columns:1fr; gap:40px; }
          footer { flex-direction:column; gap:20px; padding:32px 24px; align-items:flex-start; }
        }
      `}</style>

      {/* ── Nav overlay + drawer ── */}
      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>close ×</button>
        <a href="/" onClick={() => setMenuOpen(false)}>home</a>
        <a href="/trends" onClick={() => setMenuOpen(false)}>trends</a>
        <a href="/shows" onClick={() => setMenuOpen(false)}>shows</a>
        <a href="/analysis" onClick={() => setMenuOpen(false)}>analysis</a>
        <a href="/archive" onClick={() => setMenuOpen(false)}>archive</a>
        <a href="/about" onClick={() => setMenuOpen(false)}>about</a>
      </nav>

      {/* ── Fixed header — exact homepage structure ── */}
      <header className="site-header">
        <div className="ticker">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
        <div className="nav-title-row">
          <button
            className={`nav-menu-btn${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
          <a href="/" className="nav-logo">runway fyi</a>
          <span className="nav-pill">FW26</span>
        </div>
        <ul className={`nav-links-row${navVisible ? '' : ' hidden'}`}>
          <li><a href="/trends">Trends</a></li>
          <li><a href="/shows">Shows</a></li>
          <li><a href="/analysis">Analysis</a></li>
          <li><a href="/archive">Archive</a></li>
          <li><a href="/fyi">FYI</a></li>
        </ul>
      </header>
      <div className={`header-spacer${navVisible ? '' : ' collapsed'}`} />

      <main>
        <div className="about-wrap">

          {/* ── Hero ── */}
          <section className="about-hero">
            <p className="about-kicker">About / runway fyi</p>
            <h1 className="about-headline">
              Fashion has always<br />been data.
            </h1>
            <div className="about-rule" />
            <div className="about-intro-grid">
              <p>
                runway fyi is a fashion trend intelligence platform that analyses runway data
                from the newest seasons to forecast what is actually going to land in culture.
                Not what PR teams are pushing. What the data says.
              </p>
              <p>
                It combines runway show data, Google Trends search velocity, and social media
                signals into a composite trend score — then surfaces that as editorial analysis,
                data dashboards, and simplified posts on Instagram and TikTok.
              </p>
            </div>
          </section>

          {/* ── Stats ── */}
          <div className="stats-row">
            {STATS.map(s => (
              <div key={s.label} className="stat-cell">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Scoring formula ── */}
          <div className="section-head">
            <span className="section-title">The Scoring Formula</span>
            <span className="section-note">How every score is calculated</span>
          </div>
          <div className="method-grid">
            {METHODOLOGY.map(m => (
              <div key={m.label} className="method-cell">
                <div className="method-weight">{m.weight}</div>
                <div className="method-label">{m.label}</div>
                <p className="method-desc">{m.description}</p>
              </div>
            ))}
          </div>
          <div className="formula-box">
            <div className="formula-label">Composite Score Formula</div>
            <div className="formula-eq">
              score <span className="dim">=</span> 0.5<span className="dim"> × runway</span>
              {' '}+{' '}0.3<span className="dim"> × search</span>
              {' '}+{' '}0.2<span className="dim"> × social</span>
            </div>
            <p className="formula-note">
              Scores are normalised to 0–100 per season. Above 75 indicates strong cross-signal momentum.
              Recalculated daily once all data pipelines are live.
            </p>
          </div>

          {/* ── Social ── */}
          <div className="section-head">
            <span className="section-title">Follow Along</span>
          </div>
          <div className="platform-grid">
            {PLATFORMS.map(p => (
              <div key={p.name} className="platform-cell">
                <div className="platform-name">{p.name}</div>
                <p className="platform-desc">{p.description}</p>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="platform-link">
                  {p.cta} →
                </a>
              </div>
            ))}
          </div>

          {/* ── Contact ── */}
          <div className="section-head">
            <span className="section-title">Contact</span>
          </div>
          <div className="contact-grid">
            <h2 className="contact-headline">Get in touch.</h2>
            <div className="contact-fields">
              <div>
                {/* Update once domain email is configured */}
                <div className="contact-field-label">General</div>
                <a href="mailto:hi@runwayfyi.com" className="contact-email">hi@runwayfyi.com</a>
              </div>
              <div>
                <div className="contact-field-label">Press &amp; Partnerships</div>
                <a href="mailto:press@runwayfyi.com" className="contact-email">press@runwayfyi.com</a>
              </div>
              <div>
                <div className="contact-field-label">Social</div>
                <div className="contact-social-list">
                  <a href="https://instagram.com/runwayfyi" target="_blank" rel="noopener noreferrer" className="contact-social-link">Instagram → @runwayfyi</a>
                  <a href="https://tiktok.com/@runwayfyi" target="_blank" rel="noopener noreferrer" className="contact-social-link">TikTok → @runwayfyi</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

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
