import { Suspense } from 'react';
import { Metadata } from 'next';
import { getArticles, getCategories } from '@/lib/strapi';
import SearchClient from '@/components/SearchClient';
import { Search as SearchIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search Publications',
  description: 'Search across articles, architectural guides, technical deep-dives, authors, and topics.',
};

export default async function SearchPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  return (
    <div className="relative min-h-screen py-12 lg:py-16">
      {/* Background ambient lighting */}
      <div className="ambient-glow bg-cyan-600/15 top-20 right-1/4" />
      <div className="ambient-glow bg-indigo-600/15 top-96 left-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <SearchIcon className="w-3.5 h-3.5" />
            <span>Global Knowledge Index</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Search Articles & Deep Dives
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Real-time keyword search across all technical publications, code samples, tags, and authors.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-20 text-center text-zinc-400 text-sm">
              Loading search engine...
            </div>
          }
        >
          <SearchClient initialArticles={articles} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
