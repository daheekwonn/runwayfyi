// app/shows/page.tsx
import ShowsClient from './ShowsClient'

const RAILWAY_API = process.env.NEXT_PUBLIC_RAILWAY_URL || 'https://fashion-backend-production-6880.up.railway.app'

async function fetchShows() {
  try {
    const res = await fetch(`${RAILWAY_API}/api/trends/shows`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function ShowsPage() {
  const shows = await fetchShows()
  return <ShowsClient shows={shows} />
}
