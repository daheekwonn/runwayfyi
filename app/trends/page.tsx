// app/trends/page.tsx
import { client } from '@/sanity/lib/client'
import TrendsClient from './TrendsClient'

const RAILWAY_API = process.env.NEXT_PUBLIC_RAILWAY_URL || 'https://fashion-backend-production-6880.up.railway.app'

async function fetchLeaderboard() {
  try {
    const res = await fetch(`${RAILWAY_API}/api/trends/leaderboard?limit=10`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function fetchAll() {
  try {
    const res = await fetch(`${RAILWAY_API}/api/trends/leaderboard?limit=50`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

// Static fallback if API is empty
const FALLBACK_ITEMS = [
  { id: 1, rank: 1, name: 'Leather Outerwear', category: 'outerwear', season: 'FW26', trend_score: 20.0, runway_score: 40.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 10, trend_delta: 20.0, is_rising: true, last_scored_at: null },
  { id: 2, rank: 2, name: 'Wide-Leg Tailoring', category: 'tailoring', season: 'FW26', trend_score: 20.0, runway_score: 40.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 8, trend_delta: 20.0, is_rising: true, last_scored_at: null },
  { id: 3, rank: 3, name: 'Power Suiting', category: 'tailoring', season: 'FW26', trend_score: 20.0, runway_score: 40.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 8, trend_delta: 20.0, is_rising: true, last_scored_at: null },
  { id: 4, rank: 4, name: 'Prairie Silhouette', category: 'dress', season: 'FW26', trend_score: 15.0, runway_score: 30.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 6, trend_delta: 15.0, is_rising: true, last_scored_at: null },
  { id: 5, rank: 5, name: 'Shearling', category: 'outerwear', season: 'FW26', trend_score: 17.5, runway_score: 35.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 7, trend_delta: 17.5, is_rising: true, last_scored_at: null },
  { id: 6, rank: 6, name: 'Ballet Flats', category: 'footwear', season: 'FW26', trend_score: 17.5, runway_score: 35.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 7, trend_delta: 17.5, is_rising: true, last_scored_at: null },
  { id: 7, rank: 7, name: 'Mary Janes', category: 'footwear', season: 'FW26', trend_score: 15.0, runway_score: 30.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 6, trend_delta: 15.0, is_rising: true, last_scored_at: null },
  { id: 8, rank: 8, name: 'Boucle', category: 'material', season: 'FW26', trend_score: 10.0, runway_score: 20.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 4, trend_delta: 10.0, is_rising: false, last_scored_at: null },
  { id: 9, rank: 9, name: 'Quiet Luxury', category: 'aesthetic', season: 'FW26', trend_score: 10.0, runway_score: 20.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 4, trend_delta: 10.0, is_rising: false, last_scored_at: null },
  { id: 10, rank: 10, name: 'Column Dress', category: 'dress', season: 'FW26', trend_score: 17.5, runway_score: 35.0, search_score: 0, social_score: 0, runway_count: 0, runway_show_count: 7, trend_delta: 17.5, is_rising: true, last_scored_at: null },
]

export default async function TrendsPage() {
  const [leaderboard, all] = await Promise.all([fetchLeaderboard(), fetchAll()])

  const finalLeaderboard = leaderboard.length > 0 ? leaderboard : FALLBACK_ITEMS.slice(0, 3)
  const finalAll = all.length > 0 ? all : FALLBACK_ITEMS

  return <TrendsClient leaderboard={finalLeaderboard} all={finalAll} />
}
