// app/analysis/page.tsx
// SERVER COMPONENT — fetches from Sanity at build/request time.
// Falls back to static data if Sanity returns nothing (useful during dev).

import { client } from '@/sanity/lib/client';
import { articlesQuery, featuredArticleQuery } from '@/sanity/lib/queries';
import AnalysisClient from './AnalysisClient';

export const revalidate = 60; // ISR: revalidate every 60 seconds

// ── Sanity field shapes ────────────────────────────────────────────────────────
interface SanityArticle {
  _id: string;
  title: string;
  slug: { current: string } | string;
  category: string;
  season?: string;
  excerpt?: string;
  publishedAt?: string;
  coverImage?: string;
  score?: number;
  featured?: boolean;
}

// ── Normalise Sanity → UI shape ────────────────────────────────────────────────
function normalise(a: SanityArticle, index: number) {
  const slug = typeof a.slug === 'string' ? a.slug : a.slug?.current ?? String(a._id);
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';
  return {
    id: slug,
    kicker: `${(a.category ?? 'Analysis').replace(/-/g, ' ')} · ${a.season ?? 'FW26'}`,
    category: (a.category ?? 'analysis').toLowerCase(),
    season: a.season ?? 'FW26',
    title: a.title,
    excerpt: a.excerpt ?? '',
    date,
    img: a.coverImage ?? `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80`,
    score: a.score ?? 0,
    featured: a.featured ?? index === 0,
  };
}

// ── Static fallback (shown while Sanity is empty) ──────────────────────────────
const FALLBACK: SanityArticle[] = [];

export default async function AnalysisPage() {
  // Fetch from Sanity — parallel requests
  let [articles, featured] = await Promise.all([
    client.fetch<SanityArticle[]>(articlesQuery).catch(() => []),
    client.fetch<SanityArticle | null>(featuredArticleQuery).catch(() => null),
  ]);

  // Use fallback if Sanity returns nothing
  const sanity = (articles && articles.length > 0) ? articles : [];
const source: SanityArticle[] = sanity;

  // If Sanity returned a featured article, make sure it's first
  let normalised = source.map((a, i) => normalise(a, i));
  if (featured) {
    const featSlug = typeof featured.slug === 'string' ? featured.slug : featured.slug?.current;
    // Remove it from list if already present, then prepend
    normalised = [
      { ...normalise(featured, 0), featured: true },
      ...normalised.filter(a => a.id !== featSlug),
    ];
  }

  return <AnalysisClient articles={normalised} />;
}
