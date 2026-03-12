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
    kicker: `${a.category ?? 'Analysis'} · ${a.season ?? 'FW26'}`,
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
const FALLBACK = [
  { _id: '1', title: 'Jonathan Anderson just redefined what Dior means now', slug: 'jonathan-anderson-dior-fw26', category: 'analysis', season: 'Paris FW26', excerpt: `The data agreed before the critics did. Searches for "Dior aesthetic" climbed 140% in the 48 hours after the show.`, publishedAt: '2026-03-08', coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', score: 94, featured: true },
  { _id: '2', title: 'The leather bomber is a macro trend', slug: 'leather-bomber-macro-trend', category: 'data', season: 'Milan FW26', excerpt: '200% search spike, 7 major shows, 3 cities. A data-driven case for the jacket of the season.', publishedAt: '2026-03-06', coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80', score: 88 },
  { _id: '3', title: 'Prairie or bust: the silhouette taking over', slug: 'prairie-silhouette-fw26', category: 'forecast', season: 'FW26', excerpt: 'Chloe made it obvious but the signal started in Copenhagen. A data-driven case for the maxi dress revival.', publishedAt: '2026-03-04', coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80', score: 78 },
  { _id: '4', title: 'Matthieu Blazy at Chanel: the numbers behind the feeling', slug: 'blazy-chanel-fw26', category: 'analysis', season: 'Paris FW26', excerpt: 'Every metric jumped. Social velocity, search signals, editorial coverage — all at once.', publishedAt: '2026-03-05', coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80', score: 91 },
  { _id: '5', title: 'Why recession dressing always brings the coat', slug: 'recession-dressing-outerwear', category: 'culture', season: 'FW26', excerpt: "Shearling at #1 isn't a coincidence. A historical pattern analysis of outerwear trends and economic anxiety.", publishedAt: '2026-03-02', coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80', score: 82 },
  { _id: '6', title: 'Burgundy ran through every city this season', slug: 'burgundy-fw26', category: 'data', season: 'FW26', excerpt: '34 collections. +180% search interest. The deep red that became the unavoidable colour signal of FW26.', publishedAt: '2026-02-28', coverImage: 'https://images.unsplash.com/photo-1536183922588-166604504d5e?w=900&q=80', score: 71 },
  { _id: '7', title: 'Copenhagen is the most interesting fashion week and nobody talks about it', slug: 'copenhagen-fw26', category: 'analysis', season: 'Copenhagen FW26', excerpt: 'Lower search volume. Smaller shows. But a higher concentration of pieces that actually end up in your wardrobe.', publishedAt: '2026-02-25', coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80', score: 72 },
] as SanityArticle[];

export default async function AnalysisPage() {
  // Fetch from Sanity — parallel requests
  let [articles, featured] = await Promise.all([
    client.fetch<SanityArticle[]>(articlesQuery).catch(() => []),
    client.fetch<SanityArticle | null>(featuredArticleQuery).catch(() => null),
  ]);

  // Use fallback if Sanity returns nothing
  const source: SanityArticle[] = (articles && articles.length > 0) ? articles : FALLBACK;

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
