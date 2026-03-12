import FYIClient from './FYIClient'
import { client } from '@/sanity/lib/client'

// Wire this query once you add the `fyi` schema to Sanity
// export const fyiQuery = `*[_type == "fyi"] | order(_createdAt desc) { _id, type, stat, label, body, season, show, "image": image.asset->url }`

export const metadata = {
  title: 'FYI · runway.fyi',
  description: 'Short data takes from the runway. One stat, one image, one sentence.',
}

export default async function FYIPage() {
  // Uncomment once Sanity fyi schema is ready:
  // const fyis = await client.fetch(fyiQuery)
  const fyis: any[] = []

  return <FYIClient fyis={fyis} />
}
