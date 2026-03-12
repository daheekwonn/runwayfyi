// app/page.tsx
// SERVER COMPONENT — fetches latest articles and FYI items from Sanity.
// All static data (TRENDS, ARCHIVE, hero images) stays in HomeClient.
// Falls back gracefully if Sanity returns nothing.

import { client } from '@/sanity/lib/client';
import HomeClient from './HomeClient';

export const revalidate = 60;

// ── Queries ───────────────────────────────────────────────────────────────────

const latestPostsQuery = `*[_type == "article"] | order(publishedAt desc) [0...4] {
  _id,
  title,
  slug,
  category,
  season,
  excerpt,
  publishedAt,
  "coverImage": coverImage.asset->url,
}`;

// FYI items — if you have a dedicated 'fyi' type use that,
// otherwise we pull the top 3 articles and format them as FYI cards.
const fyiQuery = `*[_type == "article"] | order(publishedAt desc) [0...3] {
  _id,
  title,
  slug,
  category,
  season,
  excerpt,
  score,
  "coverImage": coverImage.asset->url,
}`;

// ── Types ─────────────────────────────────────────────────────────────────────

interface SanityArticle {
  _id: string;
  title: string;
  slug: { current: string } | string;
  category?: string;
  season?: string;
  excerpt?: string;
  publishedAt?: string;
  score?: number;
  coverImage?: string;
}

// ── Normalisers ───────────────────────────────────────────────────────────────

function slugString(s: SanityArticle['slug']) {
  return typeof s === 'string' ? s : s?.current ?? '';
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toPost(a: SanityArticle) {
  return {
    id: slugString(a.slug),
    kicker: `${a.category ?? 'Analysis'} · ${a.season ?? 'FW26'}`,
    title: a.title,
    excerpt: a.excerpt ?? '',
    date: formatDate(a.publishedAt),
    img: a.coverImage ?? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  };
}

function toFyi(a: SanityArticle) {
  return {
    id: slugString(a.slug),
    tag: a.season ?? 'FW26',
    stat: a.score ? `${a.score} composite score` : a.category ?? 'Analysis',
    text: a.title,
    img: a.coverImage ?? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  };
}

// ── Static fallbacks ──────────────────────────────────────────────────────────

const FALLBACK_POSTS = [
  { id: 'leather-bomber-macro-trend', kicker: 'Data · Milan FW26', title: 'The leather bomber is a macro trend', excerpt: '200% search spike, 7 major shows, 3 cities. A data-driven case for the jacket of the season.', date: 'Mar 6, 2026', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { id: 'prairie-silhouette-fw26', kicker: 'Forecast · FW26', title: 'Prairie or bust: the silhouette taking over', excerpt: 'Chloé made it obvious but the signal started in Copenhagen. A data-driven case for the maxi dress revival.', date: 'Mar 4, 2026', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
  { id: 'blazy-chanel-fw26', kicker: 'Opinion · Paris FW26', title: "Why Chanel's mushroom set was the moment", excerpt: "The SS26 couture set predicted everything Blazy would do next. Here's what the data says.", date: 'Mar 8, 2026', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80' },
  { id: 'recession-dressing-outerwear', kicker: 'Cultural Context · FW26', title: 'Why recession dressing always brings the coat', excerpt: "Shearling at #1 isn't a coincidence. A historical pattern analysis of outerwear trends and economic anxiety.", date: 'Mar 2, 2026', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80' },
];

const FALLBACK_FYIS = [
  { id: 'blazy-chanel-fw26',           tag: 'Opinion · Paris FW26',   stat: '91.2 composite score',  text: "matthieu blazy at chanel fw26 was the most anticipated collection of the season — but i think karl lagerfeld's tenure will never be lived up to",   img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80' },
  { id: 'jonathan-anderson-dior-fw26', tag: 'Opinion · Paris FW26',   stat: '87.4 composite score',  text: 'jonathan anderson at dior is the most exciting appointment in fashion right now and the data already agrees',                                       img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'    },
  { id: 'prairie-silhouette-fw26',     tag: 'Forecast · FW26',        stat: '+312% search velocity', text: "prairie is not a micro trend. chloe fw26 confirmed what copenhagen started — this is the silhouette of the season",                               img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [sanityPosts, sanityFyis] = await Promise.all([
    client.fetch<SanityArticle[]>(latestPostsQuery).catch(() => []),
    client.fetch<SanityArticle[]>(fyiQuery).catch(() => []),
  ]);

  const posts = sanityPosts?.length > 0 ? sanityPosts.map(toPost) : FALLBACK_POSTS;
  const fyis  = sanityFyis?.length  > 0 ? sanityFyis.map(toFyi)  : FALLBACK_FYIS;

  return <HomeClient posts={posts} fyis={fyis} />;
}
