# app/services/search_trends.py
#
# Pulls Google Trends data for FW26 fashion keywords via pytrends.
# Writes results into the SearchSignal table in Railway PostgreSQL.
# Called by POST /api/trends/ingest/search
#
# pytrends has no official API key — it scrapes Google Trends directly.
# Rate limits apply: we batch keywords (max 5 per request) and add
# delays between requests to avoid being blocked.

import asyncio
import logging
from datetime import datetime, timezone

from pytrends.request import TrendReq
from pytrends.exceptions import ResponseError
from sqlalchemy import select, delete

from app.db.session import AsyncSessionLocal
from app.models.database import SearchSignal, TrendItem

logger = logging.getLogger(__name__)

# ── FW26 keyword groups ────────────────────────────────────────────────────────
# Grouped by theme. Each group is one pytrends request (max 5 keywords).
# Add or remove keywords here as the season evolves.

FW26_KEYWORD_GROUPS: list[list[str]] = [
    # Outerwear
    ["shearling coat", "leather bomber jacket", "oversized blazer", "trench coat", "fur coat"],
    # Silhouettes & dresses
    ["prairie dress", "column dress", "maxi dress", "slip dress", "wrap dress"],
    # Trousers & suiting
    ["wide leg trousers", "tailored trousers", "barrel leg jeans", "pleated trousers", "pinstripe suit"],
    # Footwear
    ["ballet flats", "mary jane shoes", "kitten heels", "knee high boots", "loafers women"],
    # Colours
    ["burgundy fashion", "chocolate brown outfit", "cream aesthetic outfit", "forest green coat", "navy blue fashion"],
    # Bags & accessories
    ["shoulder bag trend", "tote bag fashion", "mini bag trend", "belt bag outfit", "bucket bag"],
    # Show-specific search spikes — high signal for runway to consumer pipeline
    ["Chanel FW26", "Dior FW26", "Gucci FW26", "Chloe FW26", "Saint Laurent FW26"],
]

# Timeframe — last 90 days captures the full FW26 show season reaction
TIMEFRAME = "today 3-m"
GEO = ""  # worldwide; swap to "US" or "GB" to narrow if preferred


# ── Main ingest function ───────────────────────────────────────────────────────

async def ingest_search_signals() -> dict:
    """
    Pull Google Trends data for all FW26 keyword groups and write
    SearchSignal rows to the database. Returns a summary dict.

    Called by: POST /api/trends/ingest/search
    """
    pt = TrendReq(
        hl="en-US",
        tz=0,
        timeout=(10, 25),
        retries=3,
        backoff_factor=1.5,
    )

    all_signals: list[dict] = []
    errors: list[str] = []

    for i, keywords in enumerate(FW26_KEYWORD_GROUPS):
        logger.info(f"Fetching group {i + 1}/{len(FW26_KEYWORD_GROUPS)}: {keywords}")
        try:
            signals = await _fetch_group(pt, keywords)
            all_signals.extend(signals)
            logger.info(f"  -> {len(signals)} signals returned")
        except ResponseError as e:
            msg = f"ResponseError on group {keywords}: {e}"
            logger.warning(msg)
            errors.append(msg)
        except Exception as e:
            msg = f"Unexpected error on group {keywords}: {e}"
            logger.error(msg, exc_info=True)
            errors.append(msg)

        # Polite delay between groups — pytrends is rate-limited aggressively
        if i < len(FW26_KEYWORD_GROUPS) - 1:
            await asyncio.sleep(4)

    # Write to database
    saved = 0
    if all_signals:
        saved = await _save_signals(all_signals)

    summary = {
        "status": "ok" if not errors else "partial",
        "groups_processed": len(FW26_KEYWORD_GROUPS),
        "keywords_processed": sum(len(g) for g in FW26_KEYWORD_GROUPS),
        "signals_saved": saved,
        "errors": errors,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    logger.info(f"Search ingest complete: {summary}")
    return summary


# ── Fetch one keyword group ────────────────────────────────────────────────────

async def _fetch_group(pt: TrendReq, keywords: list[str]) -> list[dict]:
    """
    Fetch interest-over-time for up to 5 keywords from Google Trends.
    Returns a list of signal dicts ready to insert into SearchSignal.
    pytrends is synchronous — run in executor to avoid blocking the event loop.
    """
    loop = asyncio.get_event_loop()

    def _sync_fetch():
        pt.build_payload(keywords, cat=0, timeframe=TIMEFRAME, geo=GEO, gprop="")
        return pt.interest_over_time()

    iot = await loop.run_in_executor(None, _sync_fetch)

    if iot is None or iot.empty:
        logger.warning(f"Empty response for group: {keywords}")
        return []

    signals = []
    for keyword in keywords:
        if keyword not in iot.columns:
            continue

        series = iot[keyword]
        if series.empty:
            continue

        current_value = int(series.iloc[-1])
        avg_value     = float(series.mean())
        peak_value    = int(series.max())

        # Velocity: how much the last 2 weeks compare to the prior 6-week avg
        recent   = float(series.iloc[-2:].mean()) if len(series) >= 2 else float(series.iloc[-1])
        baseline = float(series.iloc[-8:-2].mean()) if len(series) >= 8 else avg_value
        velocity = round((recent - baseline) / max(baseline, 1) * 100, 1)

        signals.append({
            "keyword":       keyword,
            "current_value": current_value,
            "avg_value":     round(avg_value, 2),
            "peak_value":    peak_value,
            "velocity":      velocity,   # % change recent vs baseline
            "fetched_at":    datetime.now(timezone.utc),
        })

    return signals


# ── Save to database ───────────────────────────────────────────────────────────

async def _save_signals(signals: list[dict]) -> int:
    """
    Upsert SearchSignal rows. Clears existing signals for the same keywords
    before inserting fresh data so scores always reflect the latest pull.
    """
    async with AsyncSessionLocal() as session:
        async with session.begin():
            keywords = [s["keyword"] for s in signals]

            # Delete stale rows for these keywords
            await session.execute(
                delete(SearchSignal).where(SearchSignal.keyword.in_(keywords))
            )

            # Insert fresh rows
            for s in signals:
                row = SearchSignal(
                    keyword       = s["keyword"],
                    current_value = s["current_value"],
                    avg_value     = s["avg_value"],
                    peak_value    = s["peak_value"],
                    velocity      = s["velocity"],
                    fetched_at    = s["fetched_at"],
                )
                session.add(row)

    return len(signals)


# ── Convenience: get score for a keyword ──────────────────────────────────────

async def get_search_score_for_keyword(keyword: str) -> float:
    """
    Returns a normalised 0-100 search score for a given keyword.
    Used by trend_scorer.py when computing the 30% search component.

    Score = weighted blend of current interest (60%) and velocity (40%),
    clamped to 0-100.
    """
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(SearchSignal).where(SearchSignal.keyword == keyword)
        )
        signal = result.scalars().first()

    if signal is None:
        return 0.0

    # current_value is already 0-100 (Google Trends normalised scale)
    current_component = signal.current_value * 0.6

    # velocity is a % change — clamp between -50 and +100, map to 0-40
    velocity_clamped   = max(-50.0, min(100.0, signal.velocity))
    velocity_component = ((velocity_clamped + 50) / 150) * 40

    score = round(min(100.0, current_component + velocity_component), 2)
    return score


async def get_all_search_signals() -> list[dict]:
    """
    Returns all SearchSignal rows as dicts.
    Used by the GET /api/trends/keywords endpoint.
    """
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(SearchSignal).order_by(SearchSignal.current_value.desc())
        )
        rows = result.scalars().all()

    return [
        {
            "keyword":       r.keyword,
            "current_value": r.current_value,
            "avg_value":     r.avg_value,
            "peak_value":    r.peak_value,
            "velocity":      r.velocity,
            "fetched_at":    r.fetched_at.isoformat() if r.fetched_at else None,
        }
        for r in rows
    ]
