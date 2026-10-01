'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Sparkles, BookOpen, Layers, User, Mail, Database } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Search', href: '/search' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#090a0f]/80 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#0d0e17] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Lumina<span className="text-indigo-400 font-extrabold">Press</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-zinc-400 font-semibold">
              Modern Engineering & CMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/[0.06]">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Strapi Status */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/search"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-white/[0.07] text-zinc-400 hover:text-white text-xs transition-all duration-200"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span>Search articles...</span>
            <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.08] rounded border border-white/[0.1] text-zinc-300">
              /
            </kbd>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="hidden xl:inline">Strapi CMS:</span> Connected
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/search"
            className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-zinc-300"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0c0d14]/95 backdrop-blur-2xl px-6 py-6 transition-all duration-300">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Strapi CMS v5 Live API</span>
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-indigo-400 font-medium hover:underline"
            >
              Get in touch &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
