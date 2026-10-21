import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles, getArticles } from '@/lib/strapi';
import CategoryBadge from '@/components/CategoryBadge';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import ArticleInteractions from '@/components/ArticleInteractions';
import ArticleCard from '@/components/ArticleCard';
import { Calendar, Clock, ArrowLeft, ArrowUpRight, Share2, Bookmark, Check, ShieldCheck } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.slug, article.category?.slug);

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft Preview';

  return (
    <article className="relative min-h-screen py-10 lg:py-16">
      {/* Scroll Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Ambient background glow */}
      <div className="ambient-glow bg-indigo-600/15 top-20 left-1/3 -translate-x-1/2" />
      <div className="ambient-glow bg-cyan-600/10 top-96 right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header & Title */}
        <header className="max-w-4xl mx-auto text-center flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CategoryBadge
              name={article.category.name}
              slug={article.category.slug}
              color={article.category.color}
              size="lg"
            />
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {article.readingTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed mb-8">
            {article.excerpt}
          </p>

          {/* Author Byline */}
          <div className="flex items-center gap-4 p-2 pl-3 pr-5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <Link href={`/author/${article.author.slug}`} className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-indigo-500/40">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-white hover:text-indigo-300 transition-colors">
                  {article.author.name}
                </span>
                <span className="block text-[11px] text-zinc-400">{article.author.role}</span>
              </div>
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {formattedDate}
            </span>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="max-w-5xl mx-auto relative h-72 sm:h-[450px] lg:h-[520px] rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-indigo-950/40 mb-16">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f]/60 via-transparent to-transparent" />
        </div>

        {/* Content Layout Grid: 8 cols content + 4 cols sticky sidebar */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Body */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Rich Content */}
            <div className="prose-article bg-[#10111a]/70 p-6 sm:p-10 rounded-3xl border border-white/[0.08] backdrop-blur-md shadow-xl">
              {/* Render article markdown sections cleanly */}
              <div
                dangerouslySetInnerHTML={{
                  __html: article.content
                    .replace(/### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-8 mb-3">$1</h3>')
                    .replace(/## (.*$)/gim, '<h2 class="text-2xl font-extrabold text-white mt-10 mb-4 pb-2 border-b border-white/10">$1</h2>')
                    .replace(/# (.*$)/gim, '<h2 class="text-3xl font-extrabold text-white mt-8 mb-4">$1</h2>')
                    .replace(/\`\`\`typescript([\s\S]*?)\`\`\`/gim, '<pre class="bg-[#0b0c13] p-4 rounded-xl text-xs overflow-x-auto text-indigo-300 font-mono border border-white/10 my-6"><code>$1</code></pre>')
                    .replace(/\`\`\`css([\s\S]*?)\`\`\`/gim, '<pre class="bg-[#0b0c13] p-4 rounded-xl text-xs overflow-x-auto text-cyan-300 font-mono border border-white/10 my-6"><code>$1</code></pre>')
                    .replace(/\`\`\`yaml([\s\S]*?)\`\`\`/gim, '<pre class="bg-[#0b0c13] p-4 rounded-xl text-xs overflow-x-auto text-amber-300 font-mono border border-white/10 my-6"><code>$1</code></pre>')
                    .replace(/\`\`\`tsx([\s\S]*?)\`\`\`/gim, '<pre class="bg-[#0b0c13] p-4 rounded-xl text-xs overflow-x-auto text-emerald-300 font-mono border border-white/10 my-6"><code>$1</code></pre>')
                    .replace(/\`([^\`]+)\`/gim, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs font-mono">$1</code>')
                    .replace(/> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-2 italic text-zinc-300 bg-indigo-500/10 rounded-r-xl my-6">$1</blockquote>')
                    .replace(/\n\n/g, '<p class="text-zinc-300 leading-relaxed mb-5 text-base sm:text-lg">')
                }}
              />

              {/* Tags List */}
              <div className="pt-8 mt-8 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium mr-2">Tags:</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Interactive Reactions, Share & Comment Section */}
            <ArticleInteractions title={article.title} slug={article.slug} />
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Author Profile Card */}
            <div className="p-6 rounded-3xl glass-panel border border-white/[0.08] flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                About the Author
              </span>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{article.author.name}</h4>
                  <span className="text-xs text-zinc-400">{article.author.role}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {article.author.bio}
              </p>
              <Link
                href={`/author/${article.author.slug}`}
                className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-center text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Author Profile & Archive</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Table of Contents / Key Highlights */}
            <div className="p-6 rounded-3xl glass-panel border border-white/[0.08] flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Key Highlights
              </span>
              <ul className="flex flex-col gap-2.5 text-xs text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <span>Decoupling architecture and context optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>Strapi 5 Headless CMS integration schemas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>Zero-downtime cache invalidation protocols</span>
                </li>
              </ul>
            </div>

            {/* Strapi CMS Powered Metadata */}
            <div className="p-6 rounded-3xl glass-panel border border-white/[0.08] flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Content Source
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Published via headless Strapi 5 Content API with automated slug generation, webhook invalidation, and TypeScript runtime contracts.
              </p>
            </div>
          </aside>
        </div>

        {/* Related Publications Carousel/Grid */}
        {relatedArticles.length > 0 && (
          <section className="mt-24 pt-16 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Keep Reading</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  Related Publications
                </h3>
              </div>
              <Link href="/blog" className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1">
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
