import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthors } from '@/lib/strapi';
import { Sparkles, Terminal, Layers, ShieldCheck, Cpu, Code2, Users, ArrowRight, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About LuminaPress — Engineering & Editorial Philosophy',
  description: 'Learn about our mission, editorial standards, technology architecture, and the team behind LuminaPress.',
};

export default async function AboutPage() {
  const authors = await getAuthors();

  const values = [
    {
      icon: Terminal,
      title: 'Verified Engineering Practice',
      description: 'We do not publish theoretical fluff. Every code snippet, architecture diagram, and benchmark is rigorously tested on actual production workloads.',
    },
    {
      icon: Layers,
      title: 'Headless CMS Architecture',
      description: 'We advocate for clean separation between presentation and data modeling. Strapi CMS empowers our editorial team while Next.js powers lightning-fast edge delivery.',
    },
    {
      icon: Cpu,
      title: 'Autonomous Systems & AI',
      description: 'We demystify modern machine learning models and multi-agent protocols with pragmatic engineering principles rather than speculative hype.',
    },
    {
      icon: ShieldCheck,
      title: 'Radical Transparency',
      description: 'Zero sponsored placement disguises. We openly dissect failure modes, architectural trade-offs, and lessons learned from high-traffic outages.',
    },
  ];

  const stats = [
    { label: 'Monthly Engineers', value: '180,000+' },
    { label: 'Published Deep Dives', value: '60+' },
    { label: 'Avg Read Time', value: '6.4 mins' },
    { label: 'Core Contributors', value: '12' },
  ];

  return (
    <div className="relative min-h-screen py-12 lg:py-20">
      {/* Background ambient lighting */}
      <div className="ambient-glow bg-indigo-600/15 top-20 left-1/4 -translate-x-1/2" />
      <div className="ambient-glow bg-purple-600/15 top-96 right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Behind The Publication</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Crafted for Engineers who <span className="gradient-text-primary">Demand Rigor</span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg mt-6 leading-relaxed">
            LuminaPress is an independent digital publication committed to exploring the cutting edge of web architecture, headless CMS ecosystems, and autonomous intelligence.
          </p>
        </div>

        {/* Publication Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl glass-panel border border-white/[0.08] shadow-2xl mb-20">
          {stats.map((s) => (
            <div key={s.label} className="text-center flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-white gradient-text-primary">
                {s.value}
              </span>
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Our Editorial Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Our Vision
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Bridging the Abyss Between Monoliths and Modern Edge Mesh
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              The modern web moves at breakneck velocity. As organizations transition from legacy monoliths to headless ecosystems, software architects face critical choices in data orchestration, caching, and state synchronization.
            </p>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              We started LuminaPress to build an open, accessible compendium of battle-tested patterns—from connecting Next.js 16 React Server Components with Strapi 5 APIs to designing self-healing multi-agent pipelines.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-indigo-950/40">
              <Image
                src="/images/web-arch.jpg"
                alt="Web Architecture Visual"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-white/[0.1] backdrop-blur-md">
                <span className="text-xs font-semibold text-indigo-300 block">Technology Stack</span>
                <span className="text-xs text-zinc-400">Next.js 16 + Strapi 5 Headless CMS + TypeScript</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Editorial Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Our Core Tenets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-8 rounded-3xl glass-panel glass-panel-hover border border-white/[0.08] flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{v.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Authors Team */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                The Staff
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Meet the Authors
              </h2>
            </div>
            <Link
              href="/contact"
              className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Interested in writing for us?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/author/${author.slug}`}
                className="group p-6 rounded-3xl glass-panel glass-panel-hover border border-white/[0.08] flex flex-col items-center text-center"
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
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                  {author.bio}
                </p>

                <span className="text-xs font-semibold text-zinc-300 group-hover:text-white flex items-center gap-1 mt-auto">
                  View Profile &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
