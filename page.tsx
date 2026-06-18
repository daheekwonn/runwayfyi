export default function MaintenancePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital@0;1&family=Geist+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #0C0B09;
          --cream: #F5F2ED;
          --warm: #EDE9E2;
          --mid: #5A5550;
          --light: #A09A94;
          --bd: rgba(12,11,9,0.1);
          --f-mono: 'Geist Mono', monospace;
          --f-display: 'Ranade', sans-serif;
          --f-body: 'Lora', Georgia, serif;
        }

        html, body {
          height: 100%;
          background: var(--cream);
          color: var(--ink);
          font-family: var(--f-body);
          -webkit-font-smoothing: antialiased;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* NAV */
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          height: 56px;
          border-bottom: 1px solid var(--bd);
        }

        .nav-wordmark {
          font-family: var(--f-mono);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--ink);
          text-decoration: none;
        }

        .nav-right {
          font-family: var(--f-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          color: var(--light);
          text-transform: uppercase;
        }

        /* MAIN */
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 48px;
          max-width: 680px;
        }

        .kicker {
          font-family: var(--f-mono);
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--light);
          margin-bottom: 24px;
        }

        h1 {
          font-family: var(--f-display), var(--f-body);
          font-size: clamp(48px, 7vw, 80px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 0.92;
          color: var(--ink);
          margin-bottom: 32px;
        }

        .body-text {
          font-family: var(--f-body);
          font-size: 16px;
          line-height: 1.65;
          color: var(--mid);
          max-width: 480px;
        }

        .body-text em {
          color: var(--ink);
          font-style: italic;
        }

        .divider {
          width: 40px;
          height: 1px;
          background: var(--bd);
          margin: 40px 0;
        }

        .season-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--f-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          color: var(--light);
        }

        .season-tag::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--light);
          opacity: 0.5;
        }

        /* FOOTER */
        footer {
          padding: 24px 48px;
          border-top: 1px solid var(--bd);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-left {
          font-family: var(--f-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--light);
        }

        .footer-right {
          font-family: var(--f-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--light);
        }

        @media (max-width: 640px) {
          nav, main, footer { padding-left: 24px; padding-right: 24px; }
          main { padding-top: 60px; padding-bottom: 60px; }
        }
      `}</style>

      <div className="page">
        <nav>
          <span className="nav-wordmark">runway fyi</span>
          <span className="nav-right">Coming Soon</span>
        </nav>

        <main>
          <p className="kicker">Season · AW26 — Under Construction</p>
          <h1>Back<br />shortly.</h1>

          <p className="body-text">
            runway fyi is being updated with new data and analysis for the upcoming season.
            Check back soon for trend intelligence, runway breakdowns, and search signal forecasts.
          </p>

          <div className="divider" />

          <span className="season-tag">AW26 · Paris · Milan · London · New York</span>
        </main>

        <footer>
          <span className="footer-left">runwayfyi.com</span>
          <span className="footer-right">@runwayfyi</span>
        </footer>
      </div>
    </>
  )
}
