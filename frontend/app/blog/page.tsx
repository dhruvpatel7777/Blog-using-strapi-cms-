import { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getCategories } from '@/lib/strapi';
import ArticleCard from '@/components/ArticleCard';
import { Search, Filter, BookOpen, Sparkles, SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Archive & Articles',
  description: 'Explore our full library of technical essays, deep architecture breakdowns, and engineering tutorials.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category;
  const activeTag = resolvedParams.tag;
  const query = resolvedParams.q;

  const [categories, articles] = await Promise.all([
    getCategories(),
    getArticles({
      categorySlug: activeCategory,
      tag: activeTag,
      search: query,
    }),
  ]);

  return (
    <div className="relative min-h-screen py-12 lg:py-16">
      {/* Background ambient lighting */}
      <div className="ambient-glow bg-indigo-600/20 top-20 left-10" />
      <div className="ambient-glow bg-purple-600/15 top-80 right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Banner */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Publication Index</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            All Articles & Technical Guides
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg mt-3 leading-relaxed">
            In-depth engineering articles written by practitioners. Filter across specialized engineering domains or search our full knowledge index.
          </p>
        </div>

        {/* Filter Bar & Category Tabs */}
        <div className="flex flex-col gap-6 mb-10 pb-6 border-b border-white/[0.08]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  !activeCategory
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                All Topics ({articles.length})
              </Link>
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/blog?category=${cat.slug}`}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>

            {/* Quick search input */}
            <form action="/search" method="GET" className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                name="q"
                defaultValue={query || ''}
                placeholder="Search titles & tags..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </form>
          </div>

          {/* Active filter notification if filtered */}
          {(activeCategory || activeTag || query) && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/[0.03] px-3.5 py-2 rounded-lg border border-white/[0.06] w-fit">
              <span>Showing results for:</span>
              {activeCategory && (
                <span className="font-semibold text-indigo-400">Category: {activeCategory}</span>
              )}
              {activeTag && (
                <span className="font-semibold text-cyan-400">Tag: #{activeTag}</span>
              )}
              {query && (
                <span className="font-semibold text-emerald-400">Query: &quot;{query}&quot;</span>
              )}
              <Link href="/blog" className="ml-2 text-zinc-500 hover:text-white underline">
                Reset filters
              </Link>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center glass-panel rounded-3xl p-8 border border-white/[0.08]">
            <SlidersHorizontal className="w-12 h-12 text-zinc-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
            <p className="text-sm text-zinc-400 max-w-md mb-6">
              We couldn&apos;t find any articles matching your selected criteria. Try resetting your filter or searching for another keyword.
            </p>
            <Link
              href="/blog"
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Clear all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
