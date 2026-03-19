// sanity/lib/queries.ts

export const articlesQuery = `*[_type == "article"] | order(publishedAt desc) [0...4] {
  _id,
  title,
  slug,
  category,
  season,
  excerpt,
  publishedAt,
  "coverImage": coverImage.asset->url,
}`

export const featuredArticleQuery = `*[_type == "article" && featured == true] | order(publishedAt desc) [0] {
  _id,
  title,
  slug,
  category,
  season,
  excerpt,
  body,
  publishedAt,
  "coverImage": coverImage.asset->url,
}`

export const showsQuery = `*[_type == "show"] | order(showScore desc) {
  _id,
  designer,
  slug,
  season,
  city,
  showScore,
  runwayScore,
  searchScore,
  socialScore,
  notes,
  keyPieces,
  "coverImage": coverImage.asset->url,
}`

// Hero images — fetches the single siteSettings document
export const heroImagesQuery = `*[_type == "siteSettings"][0] {
  "heroImage1": heroImage1.asset->url,
  "heroImage2": heroImage2.asset->url,
  heroCaption1,
  heroCaption2,
}`
