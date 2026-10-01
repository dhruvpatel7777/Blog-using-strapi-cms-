import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAuthorBySlug, getArticles, getAuthors } from '@/lib/strapi';
import ArticleCard from '@/components/ArticleCard';
import { Globe, Mail, ArrowLeft, CheckCircle2, BookOpen, Users } from 'lucide-react';
import { TwitterIcon, GithubIcon, LinkedinIcon } from '@/components/Icons';

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: 'Author Not Found',
    };
  }

  return {
    title: `${author.name} — Author Profile`,
    description: author.bio,
    openGraph: {
      title: author.name,
      description: author.bio,
      images: [author.avatar],
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const [author, allAuthors] = await Promise.all([
    getAuthorBySlug(slug),
    getAuthors(),
  ]);

  if (!author) {
    notFound();
  }

  const articles = await getArticles({ authorSlug: author.slug });
  const otherAuthors = allAuthors.filter((a) => a.slug !== author.slug);

  return (
    <div className="relative min-h-screen py-12 lg:py-16">
      {/* Ambient background glow */}
      <div className="ambient-glow bg-purple-600/15 top-20 left-1/3 -translate-x-1/2" />
      <div className="ambient-glow bg-indigo-600/15 top-80 right-10" />

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

        {/* Author Profile Hero Card */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/[0.1] shadow-2xl mb-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-2 border-indigo-500/50 p-1 flex-shrink-0 shadow-2xl shadow-indigo-950/50">
              <div className="relative w-full h-full rounded-[22px] overflow-hidden">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Author Information */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 gap-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Contributor
                </span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-400">{author.role}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {author.name}
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {author.bio}
              </p>

              {/* Stats Bar */}
              <div className="flex items-center gap-6 py-3 my-1 border-y border-white/[0.08] w-full max-w-md justify-around md:justify-start md:gap-10">
                <div>
                  <span className="block text-xl font-bold text-white">
                    {articles.length}
                  </span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">
                    Published
                  </span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-white">
                    {author.stats?.followers || '18k'}
                  </span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">
                    Followers
                  </span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-white">
                    {author.stats?.views || '240k'}
                  </span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">
                    Total Reads
                  </span>
                </div>
              </div>

              {/* Social Link Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {author.socialLinks?.twitter && (
                  <a
                    href={author.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition-colors"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                )}
                {author.socialLinks?.github && (
                  <a
                    href={author.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition-colors"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {author.socialLinks?.linkedin && (
                  <a
                    href={author.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {author.socialLinks?.website && (
                  <a
                    href={author.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition-colors"
                    aria-label="Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Published Articles by Author */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Publications by {author.name} ({articles.length})
              </h2>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-3xl p-8 border border-white/[0.08]">
              <p className="text-sm text-zinc-400">No published articles under this author yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Other Authors Preview */}
        {otherAuthors.length > 0 && (
          <div className="pt-12 border-t border-white/[0.08]">
            <h3 className="text-lg font-bold text-white mb-6">
              Other Editorial Contributors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherAuthors.map((other) => (
                <Link
                  key={other.id}
                  href={`/author/${other.slug}`}
                  className="p-4 rounded-2xl glass-panel glass-panel-hover border border-white/[0.08] flex items-center gap-4"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                    <Image
                      src={other.avatar}
                      alt={other.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{other.name}</h4>
                    <span className="text-xs text-indigo-400">{other.role}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
