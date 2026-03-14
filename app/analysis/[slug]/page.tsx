// app/analysis/[slug]/page.tsx
// SERVER COMPONENT — fetches single article from Sanity by slug.

import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [article, relatedArticles] = await Promise.all([
    client.fetch<SanityArticle | null>(articleBySlugQuery, { slug }),
    client.fetch<SanityArticle[]>(relatedArticlesQuery, { slug }),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <ArticleClient
      article={normalise(article)}
      related={(relatedArticles ?? []).map(normalise)}
    />
  );
}
