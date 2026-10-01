import Link from 'next/link';
import { Sparkles, Terminal, Layers } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="w-full bg-[#07080c] border-t border-white/[0.08] relative overflow-hidden mt-auto">
      {/* Subtle background ambient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/[0.08]">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#0d0e17] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Lumina<span className="text-indigo-400">Press</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              An editorial publication and technical playground exploring modern AI engineering, Next.js architecture, headless Strapi CMS design, and scalable cloud systems.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/[0.2] transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/[0.2] transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/[0.2] transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Publication</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">Home Feed</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-indigo-400 transition-colors">All Articles</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-indigo-400 transition-colors">Article Search</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">Our Editorial Team</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact & Pitch</Link>
              </li>
            </ul>
          </div>

          {/* Categories Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Topics</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/category/artificial-intelligence" className="hover:text-cyan-400 transition-colors">Artificial Intelligence</Link>
              </li>
              <li>
                <Link href="/category/modern-web-architecture" className="hover:text-emerald-400 transition-colors">Web Architecture</Link>
              </li>
              <li>
                <Link href="/category/design-systems" className="hover:text-purple-400 transition-colors">Design Systems</Link>
              </li>
              <li>
                <Link href="/category/cloud-infrastructure" className="hover:text-amber-400 transition-colors">Cloud & DevOps</Link>
              </li>
              <li>
                <Link href="/category/engineering-leadership" className="hover:text-pink-400 transition-colors">Leadership</Link>
              </li>
            </ul>
          </div>

          {/* Strapi Architecture Col */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Technology</h4>
            <div className="flex flex-col gap-2 text-xs text-zinc-400">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-1">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Strapi CMS v5
                </span>
                <span className="text-[11px] text-zinc-400">Decoupled REST & GraphQL content repository backend.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-1">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Next.js App Router
                </span>
                <span className="text-[11px] text-zinc-400">React 19 Server Components with TypeScript & Tailwind CSS.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} LuminaPress Inc. Crafted with excellence for developers.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Powered by <span className="text-indigo-400 font-semibold">Strapi CMS</span> & <span className="text-zinc-200 font-semibold">Next.js</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
