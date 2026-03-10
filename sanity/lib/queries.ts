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
