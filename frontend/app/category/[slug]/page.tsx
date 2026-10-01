import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getArticles, getCategories } from '@/lib/strapi';
import ArticleCard from '@/components/ArticleCard';
import { Layers, ArrowLeft, Sparkles, FolderOpen, ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} Articles`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const articles = await getArticles({ categorySlug: category.slug });
  const otherCategories = allCategories.filter((c) => c.slug !== category.slug);

  return (
    <div className="relative min-h-screen py-12 lg:py-16">
      {/* Category Accent Ambient Glow */}
      <div
        className="ambient-glow top-10 left-1/2 -translate-x-1/2 opacity-20"
        style={{ backgroundColor: category.color }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Categories</span>
          </Link>
        </div>

        {/* Category Header Banner */}
        <div className="relative p-8 sm:p-12 rounded-3xl glass-panel border border-white/[0.1] shadow-2xl mb-14 overflow-hidden">
          {/* Subtle accent border top */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: category.color }}
          />

          <div className="max-w-3xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg"
                style={{
                  backgroundColor: `${category.color}25`,
                  color: category.color,
                  border: `1px solid ${category.color}40`,
                }}
              >
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Topic Collection
                </span>
                <span className="mx-2 text-zinc-600">•</span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-300">
                  {articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {category.name}
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Other Categories Chips for quick jumping */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-white/[0.08]">
          <span className="text-xs text-zinc-400 mr-2 flex items-center gap-1">
            <FolderOpen className="w-3.5 h-3.5 text-zinc-500" /> Explore other tracks:
          </span>
          {otherCategories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] transition-all"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl p-8 border border-white/[0.08]">
            <Layers className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No articles in this category yet</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
              Our editorial staff is currently preparing new deep dives in this topic track.
            </p>
            <Link
              href="/blog"
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Browse all other articles
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
