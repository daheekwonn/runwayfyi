'use client';

import { useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrendItem {
  id: number;
  rank: number;
  name: string;
  sub: string;
  score: number;
  breakdown: string;
  badge: string;
  badgeType: 'up' | 'new' | 'dn';
}

interface Post {
  kicker: string;
  title: string;
  excerpt: string;
  date: string;
  img: string;
}

interface ArchiveCard {
  color: string;
  pantoneLabel: string;
  pantoneTextColor: string;
  season: string;
  title: string;
}

// ─── Static data (swap these with fetch() calls to Railway once live) ─────────
const TRENDS: TrendItem[] = [
  { id: 1,  rank: 1,  name: 'Shearling Coat',       sub: 'Outerwear · Gucci, Bottega, Loewe',        score: 94.1, breakdown: 'R:47 · S:28 · V:19', badge: '+12.4 ↑',    badgeType: 'up'  },
  { id: 2,  rank: 2,  name: 'Chanel FW26',           sub: 'Show · Matthieu Blazy debut',              score: 91.2, breakdown: 'R:50 · S:27 · V:14', badge: 'Season high', badgeType: 'new' },
  { id: 3,  rank: 3,  name: 'Leather Bomber',        sub: 'Outerwear · +200% search post-Gucci',      score: 88.7, breakdown: 'R:44 · S:30 · V:15', badge: '+8.2 ↑',     badgeType: 'up'  },
  { id: 4,  rank: 4,  name: 'Dior FW26',             sub: 'Show · Jonathan Anderson era begins',      score: 87.4, breakdown: 'R:48 · S:25 · V:14', badge: 'New entry',   badgeType: 'new' },
  { id: 5,  rank: 5,  name: 'Prairie Silhouette',    sub: 'Dress · Chloé, Zimmermann',                score: 78.6, breakdown: 'R:41 · S:22 · V:16', badge: 'New entry',   badgeType: 'new' },
  { id: 6,  rank: 6,  name: 'Wide-Leg Trouser',      sub: 'Trousers · Consistent across all cities',  score: 74.3, breakdown: 'R:38 · S:21 · V:15', badge: '−2.1 ↓',     badgeType: 'dn'  },
  { id: 7,  rank: 7,  name: 'Burgundy',              sub: 'Colour · +180% search, 34 collections',    score: 71.8, breakdown: 'R:36 · S:24 · V:12', badge: '+5.3 ↑',     badgeType: 'up'  },
  { id: 8,  rank: 8,  name: 'Oversized Blazer',      sub: 'Tailoring · Saint Laurent, Gucci',         score: 68.4, breakdown: 'R:35 · S:20 · V:13', badge: '+1.9 ↑',     badgeType: 'up'  },
  { id: 9,  rank: 9,  name: 'Ballet Flat',           sub: 'Footwear · Miu Miu, Prada, Chloé',         score: 65.2, breakdown: 'R:33 · S:19 · V:13', badge: '−0.8 ↓',     badgeType: 'dn'  },
  { id: 10, rank: 10, name: 'Column Dress',          sub: 'Dress · Bottega, Jil Sander',              score: 61.7, breakdown: 'R:31 · S:18 · V:13', badge: 'New entry',   badgeType: 'new' },
];

const POSTS: Post[] = [
  {
    kicker: 'Data · Milan FW26',
    title: 'The leather bomber is a macro trend',
    excerpt: '200% search spike, 7 major shows, 3 cities. A data-driven case for the jacket of the season.',
    date: 'Mar 6, 2026',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    kicker: 'Forecast · FW26',
    title: 'Prairie or bust: the silhouette taking over',
    excerpt: 'Chloé made it obvious but the signal started in Copenhagen. A data-driven case for the maxi dress revival.',
    date: 'Mar 4, 2026',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  },
  {
    kicker: 'Opinion · Paris FW26',
    title: "Why Chanel's mushroom set was the moment",
    excerpt: "The SS26 couture set predicted everything Blazy would do next. Here's what the data says.",
    date: 'Mar 8, 2026',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  },
  {
    kicker: 'Cultural Context · FW26',
    title: 'Why recession dressing always brings the coat',
    excerpt: "Shearling at #1 isn't a coincidence. A historical pattern analysis of outerwear trends and economic anxiety.",
    date: 'Mar 2, 2026',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  },
];

const ARCHIVE: ArchiveCard[] = [
  { color: '#A47764', pantoneLabel: 'Mocha Mousse', pantoneTextColor: '#fff',    season: 'FW25 · Paris',    title: 'The quiet luxury correction'           },
  { color: '#FFBE98', pantoneLabel: 'Peach Fuzz',   pantoneTextColor: '#6B5040', season: 'FW24 · London',   title: 'Softening of power dressing'           },
  { color: '#BE3455', pantoneLabel: 'Viva Magenta', pantoneTextColor: '#fff',    season: 'FW23 · Milan',    title: 'Viva Magenta was never just a color'   },
  { color: '#6667AB', pantoneLabel: 'Very Peri',    pantoneTextColor: '#fff',    season: 'FW22 · New York', title: 'The periwinkle moment nobody predicted' },
];

const TICKER_ITEMS = [
  'Shearling Coat  94.1', 'Chanel FW26  91.2', 'Leather Bomber  88.7',
  'Dior FW26  87.4', 'Prairie Silhouette  78.6', 'Wide-Leg Trouser  74.3',
  'Burgundy  +180%', 'Paris FW26', 'Milan FW26', 'London FW26', 'New York FW26',
];

const FYIS = [
  { tag: 'Paris FW26',    stat: '91.2 composite score',      text: "chanel is back and better than it's been in years",     img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { tag: 'Milan FW26',    stat: '+200% search post-show',    text: 'the leather bomber won this season. full stop.',          img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80' },
  { tag: 'FW26 Forecast', stat: '89% YoY growth',            text: "prairie is not a micro trend. it's the silhouette.",     img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80' },
  { tag: 'Paris FW26',    stat: '87.4 · highest show score', text: 'jonathan anderson just redefined what dior means',       img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' },
];

const CITIES = ['All', 'Paris', 'Milan', 'London', 'New York', 'Copenhagen'];



// ─── Detection boxes (3 panels now) ──────────────────────────────────────────
const DETECTIONS = [
  { id: 0, panel: 0, style: { top: '18%', left: '22%', width: '52%', height: '54%' }, label: 'Silhouette',    val: 94.1, delay: 200  },
  { id: 1, panel: 0, style: { top: '62%', left: '8%',  width: '30%', height: '26%' }, label: 'Material',      val: 74.3, delay: 500 },
  { id: 2, panel: 1, style: { top: '14%', left: '18%', width: '56%', height: '52%' }, label: 'Outerwear',     val: 88.7, delay: 800 },
  { id: 3, panel: 2, style: { top: '58%', left: '15%', width: '34%', height: '30%' }, label: 'Colour Signal', val: 78.6, delay: 1100 },
];

// ─── Page component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const [panelsLoaded, setPanelsLoaded] = useState([false, false, false]);
  const [detVisible,   setDetVisible]   = useState([false, false, false, false]);
  const [detScores,    setDetScores]    = useState([0, 0, 0, 0]);
  const [titleVisible, setTitleVisible] = useState(false);
  const [detCount,     setDetCount]     = useState(0);
  const [activeCity,   setActiveCity]   = useState('All');
  const [navVisible,   setNavVisible]   = useState(true);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const imgRefs        = useRef<(HTMLImageElement | null)[]>([null, null, null]);
  const sequenceStarted = useRef(false);
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

  function countUp(index: number, target: number, duration: number) {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const val = parseFloat((target * (1 - Math.pow(1 - p, 3))).toFixed(1));
      setDetScores(prev => { const next = [...prev]; next[index] = val; return next; });
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function startSequence() {
    if (sequenceStarted.current) return;
    sequenceStarted.current = true;
    DETECTIONS.forEach(({ id, val, delay }) => {
      setTimeout(() => {
        setDetVisible(prev => { const next = [...prev]; next[id] = true; return next; });
        countUp(id, val, 700);
        setDetCount(c => c + 1);
      }, delay);
    });
    setTimeout(() => setTitleVisible(true), 1600);
  }

  function handleImgLoad(index: number) {
    setPanelsLoaded(prev => {
      const next = [...prev];
      next[index] = true;
      if (next.every(Boolean)) setTimeout(startSequence, 600);
      return next;
    });
  }

  useEffect(() => {
    imgRefs.current.forEach((img, i) => {
      if (img?.complete) handleImgLoad(i);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const badgeClass = (type: TrendItem['badgeType']) =>
    type === 'up' ? 'badge-up' : type === 'dn' ? 'badge-dn' : 'badge-new';

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Geist+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --ink:   #0C0B09;
          --white: #FFFFFF;
          --cream: #F5F2ED;
          --warm:  #EDE9E2;
          --mid:   #5A5550;
          --light: #A09A94;
          --bd:    rgba(12,11,9,0.1);
          --f-mono:    'Geist Mono', monospace;
          --f-display: 'Ranade', sans-serif;
          --f-body:    'Lora', Georgia, serif;
        }

        body { background:#fff; color:var(--ink); -webkit-font-smoothing:antialiased; }

        /* ── Site header — fixed, always visible ── */
        .site-header { position:fixed; top:0; left:0; right:0; z-index:1000; background:rgba(255,255,255,1); border-bottom:1px solid var(--bd); }

        /* nav links row slides up/out on scroll down */
        .nav-links-row { height:38px; display:flex; align-items:center; justify-content:center; gap:44px; background:#fff; border-top:1px solid var(--bd); list-style:none; padding:0; overflow:hidden; transition:height .3s cubic-bezier(.4,0,.2,1), opacity .3s ease, border-color .3s ease; }
        .nav-links-row.hidden { height:0; opacity:0; pointer-events:none; border-color:transparent; }
        .nav-links-row a { font-family:var(--f-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink); text-decoration:none; transition:color .15s; }
        .nav-links-row a:hover { color:var(--light); }

        /* ── Ticker ── */
        .ticker { background:var(--ink); overflow:hidden; white-space:nowrap; padding:7px 0; }
        .ticker-inner { display:inline-flex; animation:tick 48s linear infinite; }
        .ticker-inner span { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.13em; color:rgba(255,255,255,0.9); padding:0 42px; }
        @keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* ── Nav title row (centered logo) ── */
        .nav-title-row { height:56px; display:flex; align-items:center; justify-content:center; padding:0 52px; background:#fff; position:relative; }
        .nav-logo { font-family:var(--f-display); font-size:20px; font-weight:700; letter-spacing:0.08em; text-transform:lowercase; color:var(--ink); text-decoration:none; }

        /* hamburger left */
        .nav-menu-btn { position:absolute; left:24px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; display:flex; flex-direction:column; gap:5px; padding:6px; }
        .nav-menu-btn span { display:block; width:22px; height:1.5px; background:var(--ink); transition:transform .2s, opacity .2s; }
        .nav-menu-btn.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
        .nav-menu-btn.open span:nth-child(2) { opacity:0; }
        .nav-menu-btn.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }

        /* season pill right */
        .nav-pill { position:absolute; right:52px; top:50%; transform:translateY(-50%); font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; border:1px solid var(--bd); color:var(--light); padding:5px 13px; }

        /* spacer matches fixed header: ticker≈24 + logo-row=56 + links-row=38 */
        .header-spacer { height:118px; }
        .header-spacer.collapsed { height:80px; }

        /* ── Slide-out mobile/dropdown menu ── */
        .nav-drawer { position:fixed; top:0; left:0; bottom:0; width:260px; background:#fff; z-index:2000; transform:translateX(-100%); transition:transform .3s cubic-bezier(.4,0,.2,1); border-right:1px solid var(--bd); padding:88px 36px 40px; display:flex; flex-direction:column; gap:8px; }
        .nav-drawer.open { transform:translateX(0); }
        .nav-drawer a { font-family:var(--f-display); font-size:28px; font-weight:700; letter-spacing:-0.02em; text-transform:lowercase; color:var(--ink); text-decoration:none; line-height:1.25; opacity:.85; transition:opacity .15s; }
        .nav-drawer a:hover { opacity:1; }
        .nav-drawer-close { position:absolute; top:22px; right:22px; background:none; border:none; cursor:pointer; font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }
        .nav-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.18); z-index:190; opacity:0; pointer-events:none; transition:opacity .3s; }
        .nav-overlay.open { opacity:1; pointer-events:all; }

        /* ── Hero ── */
        .hero { position:relative; width:100%; height:calc(100vh - 84px); min-height:600px; background:#fff; overflow:hidden; display:grid; grid-template-columns:1fr 1fr 1fr; z-index:0; isolation:isolate; }
        .img-panel { position:relative; overflow:hidden; opacity:0; transition:opacity 1s ease; border-right:1px solid var(--bd); }
        .img-panel:last-of-type { border-right:none; }
        .img-panel.loaded { opacity:1; }
        .img-panel img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:grayscale(15%) brightness(0.86) contrast(1.04); display:block; }
        .cell-cam { position:absolute; top:14px; left:16px; font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.38); z-index:5; }

        /* detection boxes */
        .det-box { position:absolute; z-index:30; opacity:0; transform:scale(1.04); transition:opacity .1s ease, transform .15s cubic-bezier(.22,1,.36,1); pointer-events:none; }
        .det-box.show { opacity:1; transform:scale(1); }
        .c { position:absolute; }
        .c-tl { top:0;left:0;  border-top:2px solid var(--ink); border-left:2px solid var(--ink);   width:16px;height:16px; }
        .c-tr { top:0;right:0; border-top:2px solid var(--ink); border-right:2px solid var(--ink);  width:16px;height:16px; }
        .c-bl { bottom:0;left:0;  border-bottom:2px solid var(--ink); border-left:2px solid var(--ink);  width:16px;height:16px; }
        .c-br { bottom:0;right:0; border-bottom:2px solid var(--ink); border-right:2px solid var(--ink); width:16px;height:16px; }
        .det-label { position:absolute; top:-28px; left:-1px; background:var(--ink); padding:4px 10px; display:flex; align-items:center; gap:10px; white-space:nowrap; }
        .det-label-text { font-family:var(--f-mono); font-size:9px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:#fff; }
        .det-score { font-family:var(--f-mono); font-size:11px; font-weight:500; color:rgba(255,255,255,0.55); min-width:28px; }

        /* HUD */
        .hud { position:absolute; z-index:40; pointer-events:none; }
        .hud-bl { bottom:20px; left:18px; }
        .hud-br { bottom:20px; right:18px; }
        .hud-counter { font-family:var(--f-mono); font-size:9px; letter-spacing:0.13em; text-transform:uppercase; color:rgba(12,11,9,0.28); }
        .hud-counter b { font-size:18px; font-weight:500; color:var(--ink); letter-spacing:-0.02em; }
        .rec-indicator { display:flex; align-items:center; gap:7px; font-family:var(--f-mono); font-size:8.5px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(12,11,9,0.24); }
        .rec-dot { width:6px;height:6px;border-radius:50%;background:var(--ink);opacity:.6; animation:blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:.6} 50%{opacity:.12} }

        /* hero title — bottom center, no box */
        .hero-title-wrap { position:absolute; inset:0; z-index:50; display:flex; align-items:flex-end; justify-content:center; pointer-events:none; padding-bottom:40px; }
        .hero-title-inner { text-align:center; opacity:0; transform:translateY(10px); transition:opacity .65s ease, transform .65s ease; }
        .hero-title-inner.show { opacity:1; transform:translateY(0); pointer-events:all; }
        .title-backdrop { display:inline-block; padding:0; }
        .hero-title { font-family:var(--f-display); font-size:clamp(36px,5vw,64px); font-weight:700; line-height:1; letter-spacing:-0.03em; color:#fff; margin-bottom:24px; text-transform:lowercase; text-shadow:0 2px 24px rgba(0,0,0,0.45); }
        .hero-cta { display:inline-flex; align-items:center; gap:10px; font-family:var(--f-mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:#fff; background:var(--ink); padding:11px 24px; text-decoration:none; transition:opacity .2s; }
        .hero-cta:hover { opacity:.72; }
        .arr { display:inline-block; transition:transform .18s; }
        .hero-cta:hover .arr { transform:translateX(5px); }

        /* ── Season bar ── */
        .season-bar { display:flex; align-items:stretch; padding:0 52px; border-bottom:1px solid var(--bd); background:#fff; overflow-x:auto; }
        .season-lbl { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--light); display:flex; align-items:center; padding-right:22px; border-right:1px solid var(--bd); margin-right:18px; white-space:nowrap; flex-shrink:0; }
        .sbtn { font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; background:none; border:none; cursor:pointer; padding:14px 16px; color:var(--light); position:relative; transition:color .15s; flex-shrink:0; }
        .sbtn::after { content:''; position:absolute; bottom:0; left:16px; right:16px; height:1.5px; background:var(--ink); transform:scaleX(0); transition:transform .2s; }
        .sbtn:hover,.sbtn.active { color:var(--ink); }
        .sbtn.active::after,.sbtn:hover::after { transform:scaleX(1); }

        /* ── Leaderboard + Analysis two-col layout ── */
        .board-analysis-wrap { display:grid; grid-template-columns:44% 56%; border-bottom:1px solid var(--bd); background:#fff; align-items:stretch; position:relative; z-index:0; }

        /* ── Leaderboard (left, compact) ── */
        .board { padding:32px 32px 32px 52px; border-right:1px solid var(--bd); }
        .section-head { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid var(--bd); }
        .section-title { font-family:var(--f-display); font-size:32px; font-weight:700; letter-spacing:-0.02em; line-height:1; color:var(--ink); }
        .section-note { font-family:var(--f-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); }
        .t-row { display:flex; align-items:baseline; padding:11px 0 9px; border-bottom:1px solid var(--bd); cursor:pointer; gap:0; transition:opacity .15s; }
        .t-row:last-child { border-bottom:none; }
        .t-row:hover { opacity:.4; }
        .t-rank { font-family:var(--f-mono); font-size:9px; font-weight:300; color:rgba(12,11,9,0.18); width:28px; flex-shrink:0; }
        .t-name { display:flex; align-items:baseline; gap:8px; flex:1; min-width:0; }
        .t-name-main { font-family:var(--f-display); font-size:17px; font-weight:700; letter-spacing:-0.01em; line-height:1.2; color:var(--ink); white-space:nowrap; flex-shrink:0; }
        .t-sub { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--light); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink:1; }
        .t-right { display:flex; align-items:center; gap:10px; flex-shrink:0; margin-left:16px; }
        .t-score-right { display:flex; flex-direction:column; align-items:flex-end; gap:3px; }
        .t-score-badge-row { display:flex; align-items:center; gap:6px; }
        .t-num-row { display:flex; align-items:baseline; gap:5px; }

        /* score with R/S/V hover */
        .t-score-hover-wrap { position:relative; display:inline-block; }
        .t-num { font-family:var(--f-mono); font-size:20px; font-weight:500; letter-spacing:-0.02em; color:var(--ink); line-height:1; cursor:default; }
        .t-rsv-tooltip { position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%); background:var(--ink); color:#fff; font-family:var(--f-mono); font-size:8px; letter-spacing:0.08em; line-height:1.9; padding:7px 12px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .15s; z-index:200; }
        .t-rsv-tooltip::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:4px solid transparent; border-top-color:var(--ink); }
        .t-score-hover-wrap:hover .t-rsv-tooltip { opacity:1; }

        .t-track { width:40px; height:1.5px; background:rgba(12,11,9,0.08); }
        .t-fill { height:100%; background:var(--ink); }
        .t-badge { font-family:var(--f-mono); font-size:8px; letter-spacing:0.05em; padding:2px 6px; white-space:nowrap; }
        /* ── Badge icons (right of score) ── */
        .t-badge { font-family:var(--f-mono); font-size:9px; font-weight:500; letter-spacing:0.04em; display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; flex-shrink:0; }
        .badge-up  { background:rgba(30,107,60,0.12); color:#1E6B3C; }
        .badge-dn  { background:rgba(160,50,40,0.09); color:#9B3228; }
        .badge-new { background:rgba(12,11,9,0.06);   color:var(--ink); }
        .badge-hi  { background:rgba(180,140,0,0.10); color:#8B6A00; }

        /* ── Legend tooltip — opens downward ── */
        .score-tooltip-wrap { position:relative; display:inline-flex; align-items:center; gap:6px; cursor:help; }
        .score-tooltip-wrap:hover .score-tooltip { opacity:1; pointer-events:all; }
        .score-tooltip { position:absolute; top:calc(100% + 10px); right:0; background:var(--ink); color:#fff; font-family:var(--f-mono); font-size:8px; letter-spacing:0.07em; line-height:1; padding:14px 16px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .18s; z-index:200; min-width:200px; }
        .score-tooltip::after { content:''; position:absolute; bottom:100%; right:12px; border:5px solid transparent; border-bottom-color:var(--ink); }
        .tooltip-legend-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .tooltip-legend-row:last-child { margin-bottom:0; }
        .tooltip-legend-badge { font-family:var(--f-mono); font-size:9px; font-weight:500; display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; flex-shrink:0; }
        .tl-up  { background:rgba(30,107,60,0.25);  color:#4caf78; }
        .tl-dn  { background:rgba(160,50,40,0.22);  color:#d4705f; }
        .tl-n   { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.8); }
        .tl-h   { background:rgba(180,140,0,0.22);  color:#d4aa40; }
        .tooltip-legend-label { color:rgba(255,255,255,0.55); font-size:8px; letter-spacing:0.09em; }
        .tooltip-divider { height:1px; background:rgba(255,255,255,0.08); margin:10px 0; }
        .tooltip-score-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
        .tooltip-score-row:last-child { margin-bottom:0; }
        .tooltip-score-key { color:rgba(255,255,255,0.8); font-size:9px; font-weight:500; min-width:14px; }
        .tooltip-score-desc { color:rgba(255,255,255,0.38); font-size:8px; letter-spacing:0.07em; }
        .tooltip-icon { font-family:var(--f-mono); font-size:8px; color:var(--light); border:1px solid rgba(12,11,9,0.15); width:16px; height:16px; display:inline-flex; align-items:center; justify-content:center; line-height:1; }

        /* ── Latest analysis (right, list style) ── */
        .analysis-col { padding:32px 40px 32px 32px; display:flex; flex-direction:column; }
        .analysis-list { margin-top:20px; display:flex; flex-direction:column; justify-content:space-between; flex:1; }
        .a-item { display:grid; grid-template-columns:1fr 110px; gap:14px; align-items:center; border-bottom:1px solid var(--bd); cursor:pointer; transition:opacity .15s; text-decoration:none; color:inherit; padding:16px 0; }
        .a-item:last-child { border-bottom:none; padding-bottom:0; }
        .a-item:first-child { padding-top:0; }
        .a-item:hover { opacity:.45; }
        .a-kicker { font-family:var(--f-mono); font-size:10px; letter-spacing:0.13em; text-transform:uppercase; color:var(--light); margin-bottom:4px; }
        .a-title { font-family:var(--f-display); font-size:15px; font-weight:700; letter-spacing:-0.01em; line-height:1.15; color:var(--ink); margin-bottom:4px; }
        .a-excerpt { font-family:var(--f-body); font-size:12px; font-weight:500; line-height:1.55; color:var(--mid); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .a-date { font-family:var(--f-mono); font-size:10px; letter-spacing:0.09em; text-transform:uppercase; color:var(--light); margin-top:5px; }
        .a-img { width:110px; height:88px; object-fit:cover; object-position:top center; display:block; filter:grayscale(10%) brightness(0.9); flex-shrink:0; }

        /* ── Feature — two articles left, compact white stats right ── */
        .feature { display:grid; grid-template-columns:1fr 280px; border-bottom:1px solid var(--bd); position:relative; z-index:0; height:calc(100vh - 80px); min-height:520px; }

        /* left: two article cards stacked — divider aligns with stats midpoint */
        /* stats-grid takes flex:1, read-bar is ~41px, so top half = (100% - 41px) / 2 */
        .feature-articles { display:flex; flex-direction:column; height:100%; background:#fff; border-right:1px solid var(--bd); }
        .feature-article { display:grid; grid-template-columns:140px 1fr; text-decoration:none; color:inherit; cursor:pointer; transition:opacity .15s; overflow:hidden; border-bottom:1px solid var(--bd); }
        .feature-article:first-child { height:calc((100% - 41px) / 2); flex-shrink:0; }
        .feature-article:last-child  { flex:1; border-bottom:none; }
        .feature-article:hover { opacity:.65; }
        .feature-article-img { width:140px; height:100%; object-fit:cover; object-position:top center; display:block; filter:grayscale(8%) brightness(0.93); }
        .feature-article-body { padding:32px 32px; display:flex; flex-direction:column; justify-content:center; gap:10px; }
        .feature-article-kicker { font-family:var(--f-mono); font-size:10px; letter-spacing:0.13em; text-transform:uppercase; color:var(--light); }
        .feature-article-title { font-family:var(--f-display); font-size:clamp(17px,1.6vw,22px); font-weight:700; letter-spacing:-0.02em; line-height:1.1; color:var(--ink); }
        .feature-article-excerpt { font-family:var(--f-body); font-size:13px; font-weight:500; line-height:1.65; color:var(--mid); display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .feature-article-meta { font-family:var(--f-mono); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); }

        /* right: compact WHITE stats column */
        .feature-right { background:#fff; display:flex; flex-direction:column; height:100%; border-left:1px solid var(--bd); }
        .feature-stats-grid { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; flex:1; min-height:0; }
        .feature-stat { padding:22px 22px; border-bottom:1px solid var(--bd); border-right:1px solid var(--bd); display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; overflow:hidden; }
        .feature-stat:nth-child(2),.feature-stat:nth-child(4) { border-right:none; }
        .feature-stat:nth-child(3),.feature-stat:nth-child(4) { border-bottom:none; }
        .feature-stat-num { font-family:var(--f-display); font-size:clamp(36px,3.6vw,54px); font-weight:700; color:var(--ink); line-height:1; margin-bottom:8px; letter-spacing:-0.03em; }
        .feature-stat-num .prefix { font-size:0.55em; vertical-align:0.16em; letter-spacing:0; }
        .feature-stat-num .suffix { font-size:0.65em; }
        .feature-stat-label { font-family:var(--f-mono); font-size:8px; letter-spacing:0.16em; text-transform:uppercase; color:var(--light); margin-bottom:8px; line-height:1.5; }
        .feature-stat-body { font-family:var(--f-body); font-size:11px; font-weight:500; color:var(--mid); line-height:1.55; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .feature-read-bar { height:41px; padding:0 18px; border-top:1px solid var(--bd); display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
        .feature-read-kicker { font-family:var(--f-mono); font-size:8px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); }
        .feature-read { font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink); display:flex; align-items:center; gap:8px; text-decoration:none; transition:gap .15s; }
        .feature-read:hover { gap:14px; }

        /* ── Stats strip (standalone, below feature) ── */
        .stats-strip { display:none; }

        /* ── Archive ── */
        .archive { padding:56px 52px; border-bottom:1px solid var(--bd); background:#fff; }
        .archive-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:32px; }
        .arc-card { cursor:pointer; transition:opacity .15s; }
        .arc-card:hover { opacity:.6; }
        .arc-swatch { width:100%; aspect-ratio:4/3; margin-bottom:14px; display:flex; align-items:flex-end; padding:12px 14px; }
        .arc-pantone { font-family:var(--f-mono); font-size:8px; letter-spacing:0.12em; text-transform:uppercase; opacity:.6; }
        .arc-season { font-family:var(--f-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); margin-bottom:7px; display:block; }
        .arc-title { font-family:var(--f-display); font-size:18px; font-weight:700; letter-spacing:-0.01em; line-height:1.15; color:var(--ink); }
        .arc-arrow { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--light); margin-top:10px; display:flex; align-items:center; gap:6px; transition:gap .15s; }
        .arc-card:hover .arc-arrow { gap:10px; }

        /* ── FYI strip — trending style with images ── */
        .fyi-strip { background:#fff; border-bottom:1px solid var(--bd); padding:48px 52px; }
        .fyi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:28px; margin-top:32px; }
        .fyi-card { text-decoration:none; color:inherit; cursor:pointer; transition:opacity .15s; }
        .fyi-card:hover { opacity:.65; }
        .fyi-card-img { width:100%; aspect-ratio:3/2; object-fit:cover; object-position:top center; display:block; filter:grayscale(8%) brightness(0.92); margin-bottom:16px; }
        .fyi-tag { font-family:var(--f-mono); font-size:10px; letter-spacing:0.13em; text-transform:uppercase; color:var(--light); margin-bottom:8px; }
        .fyi-text { font-family:var(--f-display); font-size:17px; font-weight:700; letter-spacing:-0.01em; line-height:1.2; color:var(--ink); margin-bottom:8px; text-transform:lowercase; }
        .fyi-stat { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--mid); }
        .fyi-read { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--light); margin-top:10px; display:flex; align-items:center; gap:6px; transition:gap .15s; }
        .fyi-card:hover .fyi-read { gap:10px; color:var(--ink); }

        /* ── Footer ── */
        footer { background:var(--ink); padding:26px 52px; display:flex; align-items:center; justify-content:space-between; }
        .f-logo { font-family:var(--f-display); font-size:16px; font-weight:700; letter-spacing:0.1em; text-transform:lowercase; color:#fff; }
        .f-links { display:flex; gap:28px; list-style:none; }
        .f-links a { font-family:var(--f-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.3); text-decoration:none; transition:color .15s; }
        .f-links a:hover { color:rgba(255,255,255,0.7); }
        .f-copy { font-family:var(--f-mono); font-size:9px; letter-spacing:0.1em; color:rgba(255,255,255,0.2); }
      `}</style>

      {/* ── Slide-out drawer ── */}
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>✕ close</button>
        <a href="/trends" onClick={() => setMenuOpen(false)}>Trends</a>
        <a href="/shows" onClick={() => setMenuOpen(false)}>Shows</a>
        <a href="/analysis" onClick={() => setMenuOpen(false)}>Analysis</a>
        <a href="/archive" onClick={() => setMenuOpen(false)}>Archive</a>
        <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
      </div>
      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* ── Sticky site header (ticker + logo row + nav links) ── */}
      <header className="site-header">
        {/* Ticker */}
        <div className="ticker">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
        {/* Logo row */}
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
        {/* Links row — collapses on scroll down */}
        <ul className={`nav-links-row${navVisible ? '' : ' hidden'}`}>
          <li><a href="/trends">Trends</a></li>
          <li><a href="/shows">Shows</a></li>
          <li><a href="/analysis">Analysis</a></li>
          <li><a href="/archive">Archive</a></li>
        </ul>
      </header>
      <div className={`header-spacer${navVisible ? '' : ' collapsed'}`} />
      <div className="hero">
        {[0, 1, 2].map(panelIdx => (
          <div key={panelIdx} className={`img-panel${panelsLoaded[panelIdx] ? ' loaded' : ''}`}>
            <span className="cell-cam">
              {panelIdx === 0 ? 'CAM-01 · PARIS FW26' : panelIdx === 1 ? 'CAM-02 · MILAN FW26' : 'CAM-03 · LONDON FW26'}
            </span>
            <img
              ref={el => { imgRefs.current[panelIdx] = el; }}
              src={
                panelIdx === 0
                  ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80'
                  : panelIdx === 1
                  ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80'
                  : 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80'
              }
              alt={panelIdx === 0 ? 'Paris FW26' : panelIdx === 1 ? 'Milan FW26' : 'London FW26'}
              onLoad={() => handleImgLoad(panelIdx)}
            />
            {DETECTIONS.filter(d => d.panel === panelIdx).map(det => (
              <div
                key={det.id}
                className={`det-box${detVisible[det.id] ? ' show' : ''}`}
                style={det.style as React.CSSProperties}
              >
                <div className="det-label">
                  <span className="det-label-text">{det.label}</span>
                  <span className="det-score">{detScores[det.id].toFixed(1)}</span>
                </div>
                <span className="c c-tl" /><span className="c c-tr" />
                <span className="c c-bl" /><span className="c c-br" />
              </div>
            ))}
          </div>
        ))}

        <div className="hud hud-bl">
          <div className="hud-counter">
            Detections <b>{String(detCount).padStart(2, '0')}</b>
          </div>
        </div>
        <div className="hud hud-br">
          <div className="rec-indicator">
            <span className="rec-dot" /> Live · FW26
          </div>
        </div>

      </div>

      {/* ── Season bar ── */}
      <div className="season-bar">
        <span className="season-lbl">FW26 Season</span>
        {CITIES.map(city => (
          <button
            key={city}
            className={`sbtn${activeCity === city ? ' active' : ''}`}
            onClick={() => setActiveCity(city)}
          >
            {city}
          </button>
        ))}
      </div>

      {/* ── Leaderboard (left) + Analysis (right) ── */}
      <div className="board-analysis-wrap">

        {/* Leaderboard — compact, top 10 */}
        <section className="board" id="trends">
          <div className="section-head">
            <h2 className="section-title">Trend Leaderboard</h2>
            <span className="score-tooltip-wrap">
              <span className="section-note">FW26 · Composite Score</span>
              <span className="tooltip-icon">?</span>
              <div className="score-tooltip">
                <div className="tooltip-legend-row">
                  <span className="tooltip-legend-badge tl-up">↑</span>
                  <span className="tooltip-legend-label">Score increase this week</span>
                </div>
                <div className="tooltip-legend-row">
                  <span className="tooltip-legend-badge tl-dn">↓</span>
                  <span className="tooltip-legend-label">Score decrease this week</span>
                </div>
                <div className="tooltip-legend-row">
                  <span className="tooltip-legend-badge tl-n">N</span>
                  <span className="tooltip-legend-label">New entry this season</span>
                </div>
                <div className="tooltip-legend-row">
                  <span className="tooltip-legend-badge tl-h">H</span>
                  <span className="tooltip-legend-label">Season high score</span>
                </div>
                <div className="tooltip-divider" />
                <div className="tooltip-score-row">
                  <span className="tooltip-score-key">R</span>
                  <span className="tooltip-score-desc">Runway frequency · 50%</span>
                </div>
                <div className="tooltip-score-row">
                  <span className="tooltip-score-key">S</span>
                  <span className="tooltip-score-desc">Search trend signal · 30%</span>
                </div>
                <div className="tooltip-score-row">
                  <span className="tooltip-score-key">V</span>
                  <span className="tooltip-score-desc">Social velocity · 20%</span>
                </div>
              </div>
            </span>
          </div>
          {TRENDS.slice(0, 10).map(t => {
            const badgeIcon = t.badgeType === 'up' ? '↑' : t.badgeType === 'dn' ? '↓' : t.badge === 'Season high' ? 'H' : 'N';
            const badgeCls  = t.badgeType === 'up' ? 'badge-up' : t.badgeType === 'dn' ? 'badge-dn' : t.badge === 'Season high' ? 'badge-hi' : 'badge-new';
            return (
              <div key={t.id} className="t-row">
                <span className="t-rank">{String(t.rank).padStart(2, '0')}</span>
                <div className="t-name">
                  <span className="t-name-main">{t.name}</span>
                  <span className="t-sub">{t.sub}</span>
                </div>
                <div className="t-right">
                  <div className="t-score-right">
                    <div className="t-score-badge-row">
                      <div className="t-score-hover-wrap">
                        <span className="t-num">{t.score.toFixed(1)}</span>
                        <div className="t-rsv-tooltip">{t.breakdown}</div>
                      </div>
                      <span className={`t-badge ${badgeCls}`}>{badgeIcon}</span>
                    </div>
                    <div className="t-track"><div className="t-fill" style={{ width: `${t.score}%` }} /></div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Latest analysis — right column, list with images */}
        <section className="analysis-col">
          <div className="section-head">
            <h2 className="section-title">Latest Analysis</h2>
            <span className="section-note">Opinion · Data · Forecasts</span>
          </div>
          <div className="analysis-list">
            {POSTS.map((post, i) => (
              <a key={i} href="#" className="a-item">
                <div>
                  <div className="a-kicker">{post.kicker}</div>
                  <div className="a-title">{post.title}</div>
                  <p className="a-excerpt">{post.excerpt}</p>
                  <div className="a-date">{post.date}</div>
                </div>
                <img src={post.img} alt={post.title} className="a-img" />
              </a>
            ))}
          </div>
        </section>

      </div>

      {/* ── Feature — two articles left, compact white stats right ── */}
      <div className="feature">

        {/* Left: two article cards stacked */}
        <div className="feature-articles">
          <a href="#" className="feature-article">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" alt="Leather Bomber" className="feature-article-img" />
            <div className="feature-article-body">
              <div className="feature-article-kicker">Data · Milan FW26</div>
              <div className="feature-article-title">The leather bomber is a macro trend</div>
              <div className="feature-article-excerpt">200% search spike, 7 major shows, 3 cities. A data-driven case for the jacket of the season.</div>
              <div className="feature-article-meta">Mar 6, 2026</div>
            </div>
          </a>
          <a href="#" className="feature-article">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" alt="Prairie" className="feature-article-img" />
            <div className="feature-article-body">
              <div className="feature-article-kicker">Forecast · FW26</div>
              <div className="feature-article-title">Prairie or bust: the silhouette taking over</div>
              <div className="feature-article-excerpt">Chloé made it obvious but the signal started in Copenhagen. A data-driven case for the maxi dress revival.</div>
              <div className="feature-article-meta">Mar 4, 2026</div>
            </div>
          </a>
        </div>

        {/* Right: compact white stats panel */}
        <div className="feature-right">
          <div className="feature-stats-grid">
            <div className="feature-stat">
              <div className="feature-stat-label">Search spike</div>
              <div className="feature-stat-num"><span className="prefix">+</span>200<span className="suffix">%</span></div>
              <div className="feature-stat-body">Leather bomber searches after Gucci Milan FW26</div>
            </div>
            <div className="feature-stat">
              <div className="feature-stat-label">Shows</div>
              <div className="feature-stat-num">7<span className="suffix">/12</span></div>
              <div className="feature-stat-body">Major FW26 shows featured the silhouette</div>
            </div>
            <div className="feature-stat">
              <div className="feature-stat-label">Trend score</div>
              <div className="feature-stat-num">94<span className="suffix">/100</span></div>
              <div className="feature-stat-body">Composite runway + search + social signal</div>
            </div>
            <div className="feature-stat">
              <div className="feature-stat-label">Cities</div>
              <div className="feature-stat-num">3<span className="suffix">/4</span></div>
              <div className="feature-stat-body">Milan, Paris, London all confirmed the signal</div>
            </div>
          </div>
          <div className="feature-read-bar">
            <span className="feature-read-kicker">Milan FW26 · Data</span>
            <a href="#" className="feature-read">Read analysis <span>→</span></a>
          </div>
        </div>

      </div>

      {/* ── FYI strip ── */}
      <section className="fyi-strip">
        <div className="section-head">
          <h2 className="section-title">FYI</h2>
          <span className="section-note">Data-backed takes on the season</span>
        </div>
        <div className="fyi-grid">
          {FYIS.map((fyi, i) => (
            <a key={i} href="#" className="fyi-card">
              <img src={fyi.img} alt={fyi.text} className="fyi-card-img" />
              <div className="fyi-tag">{fyi.tag}</div>
              <div className="fyi-text">{fyi.text}</div>
              <div className="fyi-stat">{fyi.stat}</div>
              <div className="fyi-read">Read more <span>→</span></div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Archive ── */}
      <section className="archive">
        <div className="section-head">
          <h2 className="section-title">Archive</h2>
          <span className="section-note">Each season · Pantone Color of the Year</span>
        </div>
        <div className="archive-grid">
          {ARCHIVE.map((card, i) => (
            <div key={i} className="arc-card">
              <div className="arc-swatch" style={{ background: card.color }}>
                <span className="arc-pantone" style={{ color: card.pantoneTextColor }}>
                  {card.pantoneLabel}
                </span>
              </div>
              <span className="arc-season">{card.season}</span>
              <div className="arc-title">{card.title}</div>
              <div className="arc-arrow">View season <span>→</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
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
  );
}
