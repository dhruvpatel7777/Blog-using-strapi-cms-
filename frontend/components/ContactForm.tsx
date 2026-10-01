'use client';

import { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Editorial Pitch & Guest Article',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const topics = [
    'Editorial Pitch & Guest Article',
    'Sponsorship & Brand Partnership',
    'Technical Feedback or Bug Report',
    'Content Syndication Request',
    'General Inquiry',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        topic: 'Editorial Pitch & Guest Article',
        subject: '',
        message: '',
      });
    }, 800);
  };

  if (submitted) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-emerald-500/30 text-center flex flex-col items-center gap-4 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-white">Message Dispatched!</h3>
        <p className="text-zinc-300 text-sm max-w-md leading-relaxed">
          Thank you for reaching out to the LuminaPress editorial desk. Our team reviews all incoming inquiries within 24 to 48 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] transition-all cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/[0.1] flex flex-col gap-6 shadow-2xl">
      <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
        <MessageSquare className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-bold text-white tracking-tight">Direct Editorial Desk</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-zinc-300">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ada Lovelace"
            className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-zinc-300">
            Work Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ada@lovelace.dev"
            className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Inquiry Topic */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-300">
          Inquiry Topic <span className="text-rose-400">*</span>
        </label>
        <select
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          className="px-4 py-3 rounded-xl bg-[#11121b] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          {topics.map((t) => (
            <option key={t} value={t} className="bg-[#11121b] text-white">
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-300">
          Subject Line <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="e.g. Pitch: Deconstructing Edge Cache Invalidation in Next.js"
          className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-300">
          Message Details <span className="text-rose-400">*</span>
        </label>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please provide your abstract, timeline, code repository links, or inquiry details..."
          className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <span>{loading ? 'Transmitting inquiry...' : 'Send Message to Editorial Team'}</span>
        {!loading && <Send className="w-4 h-4" />}
      </button>
    </form>
  );
}
