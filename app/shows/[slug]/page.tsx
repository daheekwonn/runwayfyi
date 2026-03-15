// app/shows/[slug]/page.tsx
// SERVER COMPONENT — fetches show data from the API and passes it to the client.

import ShowPageClient from './ShowPageClient';

const RAILWAY_API = process.env.NEXT_PUBLIC_RAILWAY_URL || 'https://fashion-backend-production-6880.up.railway.app'

async function fetchShowBySlug(slug: string) {
  try {
    const res = await fetch(`${RAILWAY_API}/api/trends/shows/by-slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchShowLooks(showId: string) {
  try {
    const res = await fetch(`${RAILWAY_API}/api/trends/shows/${encodeURIComponent(showId)}/looks`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function ShowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const show = await fetchShowBySlug(slug)
  const looks = show?.id ? await fetchShowLooks(show.id) : []

  return <ShowPageClient show={show} looks={looks} />
}
