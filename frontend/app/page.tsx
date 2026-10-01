import Link from 'next/link';
import { getArticles, getCategories, getAuthors, getFeaturedArticles } from '@/lib/strapi';
import ArticleCard from '@/components/ArticleCard';
import CategoryBadge from '@/components/CategoryBadge';
import NewsletterBox from '@/components/NewsletterBox';
import { Sparkles, ArrowRight, TrendingUp, Layers, Terminal, BookOpen, Users, Compass } from 'lucide-react';
import Image from 'next/image';

export default async function HomePage() {
  const [featuredArticles, latestArticles, categories, authors] = await Promise.all([
    getFeaturedArticles(),
    getArticles(),
    getCategories(),
    getAuthors(),
  ]);

  const flagshipArticle = featuredArticles[0] || latestArticles[0];
  const secondaryFeatured = featuredArticles.slice(1, 3);

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="ambient-glow bg-indigo-600 top-10 left-1/4 -translate-x-1/2" />
      <div className="ambient-glow bg-cyan-500 top-96 right-10" />

      {/* Hero Header Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-medium text-zinc-300 backdrop-blur-md mb-8 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-semibold text-white">LuminaPress 2026</span>
            <span className="text-zinc-500">|</span>
            <span className="text-indigo-300">Powered by Strapi CMS & Next.js</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Engineering the Next Wave of{' '}
            <span className="gradient-text-primary">Digital Intelligence</span> &{' '}
            <span className="gradient-text-cyan">Web Systems</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl leading-relaxed mb-10">
            Deep technical investigations into autonomous AI agents, React Server Components, headless content modeling, and resilient cloud architectures.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="px-7 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="px-7 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-200 font-semibold text-sm backdrop-blur-md transition-all"
            >
              Editorial Philosophy
            </Link>
          </div>

          {/* Quick Category Chips */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-zinc-400 mr-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Trending:
            </span>
            {categories.slice(0, 4).map((category) => (
              <CategoryBadge
                key={category.id}
                name={category.name}
                slug={category.slug}
                color={category.color}
                size="sm"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Flagship Post */}
      {flagshipArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Editor&apos;s Flagship Story</h2>
            </div>
            <Link href="/blog" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Browse archive &rarr;
            </Link>
          </div>

          <ArticleCard article={flagshipArticle} variant="featured" />
        </section>
      )}

      {/* Latest Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Fresh Perspectives</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Latest Publications
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-indigo-400 transition-colors"
          >
            <span>View all articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Interactive Categories Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Curated Domains</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Explore by Knowledge Track
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            Targeted technical literature organized across foundational engineering domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group p-6 rounded-2xl glass-panel glass-panel-hover border border-white/[0.08] flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                    {cat.count || 6} Articles
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-white">
                <span>Browse category</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Authors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">The Editorial Guild</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Meet Our Authors
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Writers with deep domain authority across machine learning labs, frontend performance teams, and infrastructure guilds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/author/${author.slug}`}
              className="group p-6 rounded-2xl glass-panel glass-panel-hover border border-white/[0.08] flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/40 p-1 mb-5 group-hover:border-indigo-400 transition-colors">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {author.name}
              </h3>
              <span className="text-xs text-indigo-400 font-medium mt-1 mb-3">
                {author.role}
              </span>
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-6">
                {author.bio}
              </p>

              <div className="mt-auto w-full pt-4 border-t border-white/[0.06] flex items-center justify-around text-xs text-zinc-400">
                <div>
                  <span className="block font-bold text-white">{author.stats?.articlesCount || 6}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Articles</span>
                </div>
                <div>
                  <span className="block font-bold text-white">{author.stats?.followers || '12k'}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Followers</span>
                </div>
                <div>
                  <span className="block font-bold text-white">{author.stats?.views || '150k'}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Reads</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <NewsletterBox />
      </section>
    </div>
  );
}
