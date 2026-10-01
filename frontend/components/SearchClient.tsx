'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, Sparkles, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Article, Category } from '@/lib/types';
import ArticleCard from './ArticleCard';

interface SearchClientProps {
  initialArticles: Article[];
  categories: Category[];
}

export default function SearchClient({ initialArticles, categories }: SearchClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';
  const initialCat = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedTag, setSelectedTag] = useState('');

  // Synchronize state if URL params change
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    initialArticles.forEach((art) => {
      art.tags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [initialArticles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags?.some((t) => t.toLowerCase().includes(q)) ||
        article.author?.name.toLowerCase().includes(q);

      const matchesCategory =
        !selectedCategory ||
        article.category?.slug.toLowerCase() === selectedCategory.toLowerCase();

      const matchesTag =
        !selectedTag ||
        article.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesQuery && matchesCategory && matchesTag;
    });
  }, [initialArticles, query, selectedCategory, selectedTag]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    const params = new URLSearchParams(window.location.search);
    if (val.trim()) {
      params.set('q', val.trim());
    } else {
      params.delete('q');
    }
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    router.replace('/search');
  };

  const popularQueries = [
    'Autonomous Agents',
    'Next.js',
    'Strapi CMS',
    'Design Systems',
    'Cloud',
    'TypeScript',
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Search Input Bar */}
      <div className="relative max-w-3xl mx-auto w-full">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-5 text-indigo-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search by keywords, technologies, authors, or topics..."
            className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.12] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-white placeholder-zinc-500 text-base sm:text-lg backdrop-blur-md shadow-2xl transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.1]"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggested Queries */}
        {!query && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Popular Searches:
            </span>
            {popularQueries.map((term) => (
              <button
                key={term}
                onClick={() => handleQueryChange(term)}
                className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Controls: Categories & Tags */}
      <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Refine Search Results</span>
          </div>

          {(query || selectedCategory || selectedTag) && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-indigo-400 hover:underline cursor-pointer text-left"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 mr-1">Category:</span>
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/[0.04] text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((c) => {
            const isSelected = selectedCategory.toLowerCase() === c.slug.toLowerCase();
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(isSelected ? '' : c.slug)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Tag Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-zinc-400 mr-1">Tags:</span>
          {allTags.slice(0, 8).map((t) => {
            const isSelected = selectedTag.toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => setSelectedTag(isSelected ? '' : t)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/[0.05]'
                }`}
              >
                #{t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>
          Found <strong className="text-white">{filteredArticles.length}</strong> matching{' '}
          {filteredArticles.length === 1 ? 'article' : 'articles'}
          {query && (
            <span>
              {' '}for &quot;<span className="text-indigo-400">{query}</span>&quot;
            </span>
          )}
        </span>
      </div>

      {/* Articles Grid or Empty State */}
      {filteredArticles.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-3xl p-8 border border-white/[0.08] flex flex-col items-center">
          <SlidersHorizontal className="w-12 h-12 text-zinc-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No matching publications found</h3>
          <p className="text-sm text-zinc-400 max-w-md mb-6">
            We couldn&apos;t find any articles matching your search query. Try broadening your terms or clear active filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
