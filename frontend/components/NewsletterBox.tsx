'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail('');
    }, 700);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 glass-panel border border-indigo-500/20 shadow-2xl shadow-indigo-950/40">
      {/* Background radial gradient highlight */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Mail className="w-6 h-6" />
        </div>

        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Join the Weekly <span className="gradient-text-primary">Engineering Dispatch</span>
        </h3>

        <p className="text-sm sm:text-base text-zinc-300 max-w-lg leading-relaxed">
          Get curated deep dives on Next.js, Strapi CMS architecture, distributed systems, and modern AI engineering delivered straight to your inbox every Thursday.
        </p>

        {submitted ? (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm font-medium animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>You&apos;re in! We&apos;ve sent a verification link to your inbox. Welcome aboard!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 w-full max-w-md flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email address"
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-white placeholder-zinc-500 text-sm transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        <span className="text-[11px] text-zinc-500 mt-1">
          Zero marketing spam. Instant one-click unsubscribe at any time.
        </span>
      </div>
    </div>
  );
}
