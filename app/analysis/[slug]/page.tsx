// app/analysis/[slug]/page.tsx
// SERVER COMPONENT — fetches single article from Sanity by slug.
// Falls back to static data if Sanity returns nothing.

import { client } from '@/sanity/lib/client';
import ArticleClient from './ArticleClient';

export const revalidate = 60;

const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  category,
  season,
  excerpt,
  publishedAt,
  score,
  runwayScore,
  searchScore,
  socialScore,
  featured,
  body,
  "coverImage": coverImage.asset->url,
}`;

const relatedArticlesQuery = `*[_type == "article" && slug.current != $slug] | order(publishedAt desc) [0...3] {
  _id,
  title,
  slug,
  category,
  season,
  excerpt,
  publishedAt,
  score,
  "coverImage": coverImage.asset->url,
}`;

interface SanityArticle {
  _id: string;
  title: string;
  slug: { current: string } | string;
  category?: string;
  season?: string;
  excerpt?: string;
  publishedAt?: string;
  score?: number;
  runwayScore?: number;
  searchScore?: number;
  socialScore?: number;
  featured?: boolean;
  body?: any;
  coverImage?: string;
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function normalise(a: SanityArticle) {
  const slug = typeof a.slug === 'string' ? a.slug : a.slug?.current ?? a._id;
  return {
    id: slug,
    kicker: `${a.category ?? 'Analysis'} · ${a.season ?? 'FW26'}`,
    category: a.category ?? 'Analysis',
    season: a.season ?? 'FW26',
    title: a.title,
    excerpt: a.excerpt ?? '',
    date: formatDate(a.publishedAt),
    img: a.coverImage ?? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    score: a.score ?? 0,
    runwayScore: a.runwayScore ?? 0,
    searchScore: a.searchScore ?? 0,
    socialScore: a.socialScore ?? 0,
    body: a.body ?? null,
  };
}

// ── Static fallback articles ───────────────────────────────────────────────────
const FALLBACK_ARTICLES: SanityArticle[] = [
  {
    _id: '1',
    title: 'Jonathan Anderson just redefined what Dior means now',
    slug: 'jonathan-anderson-dior-fw26',
    category: 'Opinion',
    season: 'Paris FW26',
    excerpt: `The data agreed before the critics did. Searches for "Dior aesthetic" climbed 140% in the 48 hours after the show.`,
    publishedAt: '2026-03-08',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    score: 94, runwayScore: 48, searchScore: 27, socialScore: 19,
    body: null,
  },
  {
    _id: '2',
    title: 'The leather bomber is a macro trend',
    slug: 'leather-bomber-macro-trend',
    category: 'Data',
    season: 'Milan FW26',
    excerpt: '200% search spike, 7 major shows, 3 cities. A data-driven case for the jacket of the season.',
    publishedAt: '2026-03-06',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=80',
    score: 88, runwayScore: 44, searchScore: 30, socialScore: 14,
    body: null,
  },
  {
    _id: '3',
    title: 'Prairie or bust: the silhouette taking over',
    slug: 'prairie-silhouette-fw26',
    category: 'Forecast',
    season: 'FW26',
    excerpt: 'Chloe made it obvious but the signal started in Copenhagen.',
    publishedAt: '2026-03-04',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
    score: 78, runwayScore: 39, searchScore: 23, socialScore: 16,
    body: null,
  },
];

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [sanityArticle, sanityRelated] = await Promise.all([
    client.fetch<SanityArticle | null>(articleBySlugQuery, { slug }).catch(() => null),
    client.fetch<SanityArticle[]>(relatedArticlesQuery, { slug }).catch(() => []),
  ]);

  // Use Sanity data if available, otherwise fall back to static
  const rawArticle = sanityArticle
    ?? FALLBACK_ARTICLES.find(a => (typeof a.slug === 'string' ? a.slug : a.slug?.current) === slug)
    ?? FALLBACK_ARTICLES[0];

  const rawRelated = (sanityRelated && sanityRelated.length > 0)
    ? sanityRelated
    : FALLBACK_ARTICLES.filter(a => (typeof a.slug === 'string' ? a.slug : a.slug?.current) !== slug).slice(0, 3);

  const article = normalise(rawArticle);
  const related = rawRelated.map(normalise);

  return <ArticleClient article={article} related={related} />;
}
