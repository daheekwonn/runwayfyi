import { client } from '@/sanity/lib/client'
import FYIClient from './FYIClient'

export const revalidate = 60

const fyiQuery = `*[_type == "article" && section == "fyi"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  category,
  season,
  excerpt,
  publishedAt,
  "coverImage": coverImage.asset->url
}`

interface SanityFYI {
  _id: string
  title: string
  slug: { current: string } | string
  category?: string
  season?: string
  excerpt?: string
  publishedAt?: string
  coverImage?: string
}

export default async function FYIPage() {
  const items = await client.fetch<SanityFYI[]>(fyiQuery).catch(() => [])
  return <FYIClient items={items} />
}