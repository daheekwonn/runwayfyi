// app/shows/[slug]/page.tsx
// SERVER COMPONENT — no 'use client' here.
// generateStaticParams must live in a server component in Next.js App Router.

import ShowPageClient from './ShowPageClient';

export async function generateStaticParams() {
  return [
    { slug: 'chanel-fw26' },
    { slug: 'dior-fw26' },
    { slug: 'chloe-fw26' },
    { slug: 'gucci-fw26' },
    { slug: 'prada-fw26' },
    { slug: 'bottega-veneta-fw26' },
    { slug: 'burberry-fw26' },
    { slug: 'jw-anderson-fw26' },
    { slug: 'marc-jacobs-fw26' },
    { slug: 'proenza-schouler-fw26' },
    { slug: 'saint-laurent-fw26' },
  ];
}

export default function ShowPage({ params }: { params: { slug: string } }) {
  return <ShowPageClient slug={params.slug} />;
}
