import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, ArrowUpRight } from 'lucide-react';
import { Article } from '@/lib/types';
import CategoryBadge from './CategoryBadge';

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'compact' | 'featured';
}

export default function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-IN', {
  timeZone: 'Asia/Kolkata',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

  if (variant === 'featured') {
    return (
      <article className="group relative rounded-3xl overflow-hidden glass-panel border border-white/[0.1] hover:border-indigo-500/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 shadow-2xl shadow-indigo-950/20">
        {/* Cover Image */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[320px] overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#11121a]" />
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-lg shadow-indigo-600/40">
              Featured Story
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#11121a]/90 backdrop-blur-md">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <CategoryBadge
                name={article.category.name}
                slug={article.category.slug}
                color={article.category.color}
              />
              <span className="text-zinc-500 text-xs">•</span>
              <span className="flex items-center gap-1 text-xs text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                {article.readingTime}
              </span>
            </div>

            <Link href={`/blog/${article.slug}`}>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight group-hover:text-indigo-300 transition-colors">
                {article.title}
              </h2>
            </Link>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author & CTA */}
          <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
            <Link
              href={`/author/${article.author.slug}`}
              className="flex items-center gap-3 group/author"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-200 group-hover/author:text-indigo-400 transition-colors">
                  {article.author.name}
                </span>
                <span className="text-xs text-zinc-500">{formattedDate}</span>
              </div>
            </Link>

            <Link
              href={`/blog/${article.slug}`}
              className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-zinc-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"
              aria-label={`Read ${article.title}`}
            >
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden glass-panel glass-panel-hover border border-white/[0.08] h-full">
      {/* Cover Image */}
<div className="relative h-52 w-full overflow-hidden">
  <Link
    href={`/blog/${article.slug}`}
    className="relative block w-full h-full"
  >
    <Image
      src={article.coverImage}
      alt={article.title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f]/80 via-transparent to-transparent" />
  </Link>

  {/* Category Badge - separate from the article Link */}
  <div className="absolute top-3 left-3 z-10">
    <CategoryBadge
      name={article.category.name}
      slug={article.category.slug}
      color={article.category.color}
      size="sm"
    />
  </div>
</div>

      {/* Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime}
            </span>
          </div>

          <Link href={`/blog/${article.slug}`}>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>

        {/* Footer: Author & Link */}
        <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between">
          <Link
            href={`/author/${article.author.slug}`}
            className="flex items-center gap-2.5 group/author"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium text-zinc-300 group-hover/author:text-indigo-400 transition-colors">
              {article.author.name}
            </span>
          </Link>

          <Link
            href={`/blog/${article.slug}`}
            className="text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
          >
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
