'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Eye,
  Edit3,
  Trash2,
  Send,
  RefreshCw,
  FileText,
  Clock,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Code2,
  Key,
  Layers,
  ChevronRight,
  X,
  Sliders,
  Check,
  Zap,
  Bookmark,
  Share2,
} from 'lucide-react';
import { Article, Category, Author } from '@/lib/types';
import { mockCategories, mockAuthors } from '@/lib/data';
import { trendingTopicIdeas } from '@/lib/ai-generator';
import CategoryBadge from '@/components/CategoryBadge';

export default function AIStudioPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'queue' | 'published'>('queue');
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [published, setPublished] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Generation form state
  const [customTopic, setCustomTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(mockCategories[0].slug);
  const [selectedAuthor, setSelectedAuthor] = useState(mockAuthors[0].slug);
  const [selectedTone, setSelectedTone] = useState<'deep-technical' | 'tutorial' | 'architectural' | 'thought-leadership'>('deep-technical');
  const [aiProvider, setAiProvider] = useState<'lumina-builtin' | 'gemini' | 'openai'>('lumina-builtin');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Review & Edit Modal state
  const [selectedDraft, setSelectedDraft] = useState<Article | null>(null);
  const [reviewTab, setReviewTab] = useState<'preview' | 'editor'>('preview');
  const [editForm, setEditForm] = useState<Partial<Article>>({});
  const [tagInput, setTagInput] = useState('');
  const [publishingId, setPublishingId] = useState<string | number | null>(null);
  const [publishSuccessModal, setPublishSuccessModal] = useState<Article | null>(null);

  // Load drafts and published articles on mount
  useEffect(() => {
    loadDrafts();
    loadPublished();
  }, []);

  async function loadDrafts() {
    setLoading(true);
    try {
      // 1. Fetch from server API
      const res = await fetch('/api/articles/drafts');
      if (res.ok) {
        const json = await res.json();
        if (json.drafts && Array.isArray(json.drafts)) {
          setDrafts(json.drafts);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not fetch server drafts:', e);
    } finally {
      setLoading(false);
    }
  }

  async function loadPublished() {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          setPublished(json);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // Handle Automated Generation
  async function handleGenerate(topicOverride?: string) {
    const topicToUse = topicOverride || customTopic;
    setGenerating(true);
    setGenerationStep('Brainstorming technical architecture & outline...');

    try {
      const stepTimer1 = setTimeout(() => {
        setGenerationStep('Synthesizing deep markdown content & code blocks...');
      }, 1200);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep('Curating high-resolution thematic photography...');
      }, 2400);

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          categorySlug: selectedCategory,
          authorSlug: selectedAuthor,
          tone: selectedTone,
          provider: aiProvider,
          apiKey: apiKey || undefined,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate draft');
      }

      setGenerationStep('Staged in Drafts Review Queue (Unpublished)');
      await new Promise((r) => setTimeout(r, 600));

      // Refresh drafts list
      await loadDrafts();
      setCustomTopic('');
      setActiveTab('queue');
      // Automatically open the generated draft for review
      if (data.draft) {
        openReviewModal(data.draft);
      }
    } catch (err: any) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
      setGenerationStep('');
    }
  }

  // Open Review & Edit Modal
  function openReviewModal(draft: Article) {
    setSelectedDraft(draft);
    setEditForm({ ...draft });
    setReviewTab('preview');
  }

  // Save edits made to draft
  async function handleSaveDraftEdits() {
    if (!selectedDraft) return;

    try {
      const res = await fetch('/api/articles/drafts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDraft.id,
          ...editForm,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.draft) {
          setSelectedDraft(json.draft);
          setDrafts((prev) =>
            prev.map((d) => (String(d.id) === String(selectedDraft.id) ? json.draft : d))
          );
        }
      }
      alert('Draft edits saved successfully! Remains in Draft state.');
    } catch (e: any) {
      alert('Error saving draft: ' + e.message);
    }
  }

  // Publish Draft (The manual user action!)
  async function handlePublishDraft(draftToPublish: Article) {
    const confirmed = confirm(
      `Approve & Publish "${draftToPublish.title}" to the live blog?\n\nThis will immediately make it public on LuminaPress.`
    );
    if (!confirmed) return;

    setPublishingId(draftToPublish.id);

    try {
      const res = await fetch('/api/articles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: draftToPublish.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Publishing failed');
      }

      // Remove from drafts
      setDrafts((prev) => prev.filter((d) => String(d.id) !== String(draftToPublish.id)));
      if (selectedDraft?.id === draftToPublish.id) {
        setSelectedDraft(null);
      }

      // Show celebration modal
      setPublishSuccessModal(data.article);
      loadPublished();
    } catch (err: any) {
      alert('Failed to publish article: ' + err.message);
    } finally {
      setPublishingId(null);
    }
  }

  // Delete Draft
  async function handleDeleteDraft(id: string | number) {
    if (!confirm('Are you sure you want to delete this draft?')) return;

    try {
      await fetch(`/api/articles/drafts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      setDrafts((prev) => prev.filter((d) => String(d.id) !== String(id)));
      if (selectedDraft?.id === id) {
        setSelectedDraft(null);
      }
    } catch (e) {
      alert('Error deleting draft');
    }
  }

  // Tag management
  function handleAddTag() {
    if (!tagInput.trim()) return;
    const current = editForm.tags || [];
    if (!current.includes(tagInput.trim())) {
      setEditForm({ ...editForm, tags: [...current, tagInput.trim()] });
    }
    setTagInput('');
  }

  function handleRemoveTag(tag: string) {
    const current = editForm.tags || [];
    setEditForm({ ...editForm, tags: current.filter((t) => t !== tag) });
  }

  return (
    <div className="min-h-screen py-10 lg:py-16 relative">
      {/* Ambient background glows */}
      <div className="ambient-glow bg-indigo-600/15 top-20 left-1/4 -translate-x-1/2" />
      <div className="ambient-glow bg-purple-600/15 top-80 right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08] mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Editorial AI Studio
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 font-mono">Strapi CMS 5 Powered</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI Blog Automation & Editorial Review
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-1 max-w-2xl">
              Fully autonomous AI article generator with strict human review guardrails. Generate complete articles, review live in the editor, and publish only when approved.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Provider Config</span>
            </button>
            <button
              onClick={() => {
                loadDrafts();
                loadPublished();
              }}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-400 hover:text-white transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Editorial Guardrail Notice */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Editorial Review Guardrail Active
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ENFORCED
                </span>
              </h4>
              <p className="text-xs text-zinc-300 mt-0.5">
                Articles generated by AI are automatically staged in the <strong>Drafts Review Queue</strong> with <code className="text-indigo-300">publishedAt: null</code>. They are never published to the public blog until you manually approve them.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-zinc-300 whitespace-nowrap">
              Drafts: <span className="text-amber-400 font-bold">{drafts.length}</span>
            </span>
          </div>
        </div>

        {/* AI Provider Config Modal/Drawer */}
        {showSettings && (
          <div className="mb-8 p-6 rounded-3xl glass-panel border border-indigo-500/40 bg-[#10111a]/95 backdrop-blur-xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>AI Engine & Credentials Setup</span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                Close &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Active Model Engine
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAiProvider('lumina-builtin')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      aiProvider === 'lumina-builtin'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="text-xs font-bold text-indigo-300 flex items-center justify-between">
                      Lumina Neural
                      {aiProvider === 'lumina-builtin' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-1">Zero Key Needed (Free)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiProvider('gemini')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      aiProvider === 'gemini'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="text-xs font-bold text-cyan-300 flex items-center justify-between">
                      Gemini 1.5 / 2.0
                      {aiProvider === 'gemini' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-1">Google Generative AI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiProvider('openai')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      aiProvider === 'openai'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
                      OpenAI GPT-4o
                      {aiProvider === 'openai' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-1">GPT-4o Mini / 4o</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  API Key (Optional override)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={
                      aiProvider === 'lumina-builtin'
                        ? 'Not required for Lumina Neural Engine'
                        : `Enter your ${aiProvider.toUpperCase()} API key...`
                    }
                    disabled={aiProvider === 'lumina-builtin'}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  If left blank, server-side <code className="text-zinc-400 font-mono">GEMINI_API_KEY</code> or <code className="text-zinc-400 font-mono">OPENAI_API_KEY</code> will be used if configured.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/[0.08] pb-4">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'queue'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Drafts Review Queue</span>
            {drafts.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500 text-black font-bold">
                {drafts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Automated Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('published')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'published'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Published Archive</span>
            <span className="text-xs text-zinc-500 font-mono">({published.length})</span>
          </button>
        </div>

        {/* TAB 1: DRAFTS REVIEW QUEUE (CORE WORKFLOW) */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Pending Approval Queue</span>
                  <span className="text-xs font-mono text-zinc-400 font-normal">
                    ({drafts.length} waiting for your manual review)
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Click &quot;Review &amp; Edit&quot; to inspect full layout, make adjustments, and publish.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('generate')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate New Draft</span>
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center rounded-3xl glass-panel border border-white/[0.08]">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
                <span className="text-sm text-zinc-300">Loading drafts from Strapi &amp; local store...</span>
              </div>
            ) : drafts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl glass-panel border border-white/[0.08] flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No Drafts Pending Review</h3>
                <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
                  All articles have been reviewed and published, or no drafts have been generated yet. Use the automated generator to draft a new story in seconds.
                </p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Your First Automated Draft</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="group rounded-3xl glass-panel border border-amber-500/30 hover:border-indigo-500/50 p-5 flex flex-col justify-between transition-all duration-300 bg-[#10111a]/80 shadow-xl shadow-black/40 hover:shadow-indigo-950/20"
                  >
                    <div>
                      {/* Cover Image & Draft Badge */}
                      <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-white/[0.08]">
                        <Image
                          src={draft.coverImage}
                          alt={draft.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black flex items-center gap-1 shadow-md">
                            <Clock className="w-3 h-3" />
                            Draft (Unpublished)
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-md border border-white/20">
                            {draft.readingTime}
                          </span>
                        </div>
                      </div>

                      {/* Category & Tags */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <CategoryBadge
                          name={draft.category.name}
                          slug={draft.category.slug}
                          color={draft.category.color}
                          size="sm"
                        />
                        <span className="text-[11px] text-zinc-500">
                          {new Date(draft.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
                        {draft.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                        {draft.excerpt}
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06] mb-4">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
                          <Image
                            src={draft.author.avatar}
                            alt={draft.author.name}
                            fill
                            sizes="24px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs text-zinc-300 font-medium">
                          {draft.author.name}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                      <button
                        onClick={() => openReviewModal(draft)}
                        className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-zinc-200 hover:text-white border border-white/[0.1] transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Review &amp; Edit</span>
                      </button>

                      <button
                        onClick={() => handlePublishDraft(draft)}
                        disabled={publishingId === draft.id}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        {publishingId === draft.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Publish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI AUTOMATED GENERATOR */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Custom Prompt Generator Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08] bg-[#10111a]/90 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Autonomous Technical Generation</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                  Generate Complete Article Draft
                </h2>
                <p className="text-xs text-zinc-400 mb-6">
                  Specify a topic or prompt below. The AI will formulate the thesis, structure technical sections, generate code snippets, curate cover photography, and stage it in your review queue.
                </p>

                <div className="space-y-4">
                  {/* Topic / Prompt */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Article Topic or Working Title
                    </label>
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="e.g. Building Resilient Microservices with Next.js 16 and Strapi 5..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Selector */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                        Target Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0e0f17] border border-white/[0.1] text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                      >
                        {mockCategories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Author Selector */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                        Assigned Author
                      </label>
                      <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0e0f17] border border-white/[0.1] text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                      >
                        {mockAuthors.map((a) => (
                          <option key={a.slug} value={a.slug}>
                            {a.name} ({a.role.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Editorial Tone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Editorial Style &amp; Tone
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'deep-technical', label: 'Deep Technical' },
                        { id: 'tutorial', label: 'Practical Guide' },
                        { id: 'architectural', label: 'Architecture Review' },
                        { id: 'thought-leadership', label: 'Thought Leadership' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTone(t.id as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                            selectedTone === t.id
                              ? 'bg-indigo-600/30 border-indigo-500 text-white'
                              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:bg-white/[0.06]'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Generate Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => handleGenerate()}
                      disabled={generating}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                    >
                      {generating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{generationStep || 'Generating complete draft...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Complete Draft (Staged for Review)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 1-Click Trending Ideas Library (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl glass-panel border border-white/[0.08] bg-[#10111a]/90">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      1-Click Trending Tech Topics
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Click any topic to generate a full article instantly.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {trendingTopicIdeas.map((idea, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-indigo-500/40 transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-1">
                          {idea.categorySlug.replace(/-/g, ' ')}
                        </span>
                        <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug">
                          {idea.topic}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleGenerate(idea.topic)}
                        disabled={generating}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-semibold transition-all flex items-center gap-1 flex-shrink-0"
                      >
                        <span>Generate</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PUBLISHED ARTICLES ARCHIVE */}
        {activeTab === 'published' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Live Published Publications</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    (Visible to Public)
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Articles that you reviewed and approved for publication on the blog.
                </p>
              </div>

              <Link
                href="/blog"
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <span>View Live Blog</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {published.map((art) => (
                <div
                  key={art.id}
                  className="rounded-3xl glass-panel border border-white/[0.08] hover:border-emerald-500/40 p-5 flex flex-col justify-between transition-all bg-[#10111a]/80"
                >
                  <div>
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-white/[0.08]">
                      <Image
                        src={art.coverImage}
                        alt={art.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-black flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3 h-3" />
                          Live on Blog
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <CategoryBadge
                        name={art.category.name}
                        slug={art.category.slug}
                        color={art.category.color}
                        size="sm"
                      />
                      <span className="text-[11px] text-zinc-500">
                        {new Date(art.publishedAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-2 mb-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-zinc-400">{art.author.name}</span>
                    <Link
                      href={`/blog/${art.slug}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <span>Read Live Post</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FULL REVIEW & EDIT MODAL / SPLIT SCREEN (MANUAL APPROVAL WORKFLOW) */}
      {selectedDraft && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#0c0d15] border border-white/[0.12] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Top Bar */}
            <div className="px-6 py-4 bg-[#11121d] border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Draft Pending Review
                </span>
                <span className="text-zinc-600 hidden sm:inline">•</span>
                <h3 className="text-sm font-bold text-white max-w-md truncate hidden sm:block">
                  {editForm.title || selectedDraft.title}
                </h3>
              </div>

              {/* Review View Switcher Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
                  <button
                    onClick={() => setReviewTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      reviewTab === 'preview'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                  <button
                    onClick={() => setReviewTab('editor')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      reviewTab === 'editor'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>In-Place Editor</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedDraft(null)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* SUB-VIEW 1: LIVE ARTICLE PREVIEW */}
              {reviewTab === 'preview' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Article Header Preview */}
                  <header className="text-center flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-4">
                      <CategoryBadge
                        name={editForm.category?.name || selectedDraft.category.name}
                        slug={editForm.category?.slug || selectedDraft.category.slug}
                        color={editForm.category?.color || selectedDraft.category.color}
                        size="md"
                      />
                      <span className="text-zinc-600">•</span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <Clock className="w-3.5 h-3.5" />
                        {editForm.readingTime || selectedDraft.readingTime}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                      {editForm.title || selectedDraft.title}
                    </h1>

                    <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed mb-6">
                      {editForm.excerpt || selectedDraft.excerpt}
                    </p>

                    {/* Author Byline */}
                    <div className="flex items-center gap-3 p-2 px-4 rounded-full bg-white/[0.04] border border-white/[0.08]">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-indigo-500/40">
                        <Image
                          src={editForm.author?.avatar || selectedDraft.author.avatar}
                          alt={editForm.author?.name || selectedDraft.author.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-white">
                        {editForm.author?.name || selectedDraft.author.name}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-400">
                        {editForm.author?.role || selectedDraft.author.role}
                      </span>
                    </div>
                  </header>

                  {/* Cover Image */}
                  <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl">
                    <Image
                      src={editForm.coverImage || selectedDraft.coverImage}
                      alt={editForm.title || selectedDraft.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Content Preview */}
                  <div className="bg-[#10111a]/90 p-6 sm:p-10 rounded-3xl border border-white/[0.08] backdrop-blur-md">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (editForm.content || selectedDraft.content)
                          .replace(/### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-6 mb-2">$1</h3>')
                          .replace(/## (.*$)/gim, '<h2 class="text-xl font-extrabold text-white mt-8 mb-3 pb-2 border-b border-white/10">$1</h2>')
                          .replace(/# (.*$)/gim, '<h2 class="text-2xl font-extrabold text-white mt-6 mb-3">$1</h2>')
                          .replace(/\`\`\`typescript([\s\S]*?)\`\`\`/gim, '<pre class="bg-[#0b0c13] p-4 rounded-xl text-xs overflow-x-auto text-indigo-300 font-mono border border-white/10 my-4"><code>$1</code></pre>')
                          .replace(/\`\`\`yaml([\s\S]*?)\`\`\`/gim, '<pre class="bg-[#0b0c13] p-4 rounded-xl text-xs overflow-x-auto text-amber-300 font-mono border border-white/10 my-4"><code>$1</code></pre>')
                          .replace(/\`\`\`css([\s\S]*?)\`\`\`/gim, '<pre class="bg-[#0b0c13] p-4 rounded-xl text-xs overflow-x-auto text-cyan-300 font-mono border border-white/10 my-4"><code>$1</code></pre>')
                          .replace(/\`([^\`]+)\`/gim, '<code class="bg-white/10 px-1 py-0.5 rounded text-indigo-300 text-xs font-mono">$1</code>')
                          .replace(/> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-2 italic text-zinc-300 bg-indigo-500/10 rounded-r-xl my-4">$1</blockquote>')
                          .replace(/\n\n/g, '<p class="text-zinc-300 leading-relaxed mb-4 text-sm sm:text-base">')
                      }}
                    />

                    {/* Tags */}
                    <div className="pt-6 mt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
                      <span className="text-xs text-zinc-400 font-medium">Tags:</span>
                      {(editForm.tags || selectedDraft.tags).map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.05] text-zinc-300 border border-white/[0.08]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: IN-PLACE EDITOR */}
              {reviewTab === 'editor' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      Article Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-base font-bold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Slug */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={editForm.slug || ''}
                        onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-zinc-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Reading Time */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                        Reading Time
                      </label>
                      <input
                        type="text"
                        value={editForm.readingTime || ''}
                        onChange={(e) => setEditForm({ ...editForm, readingTime: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      Executive Excerpt / Hook
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.excerpt || ''}
                      onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={editForm.coverImage || ''}
                      onChange={(e) => setEditForm({ ...editForm, coverImage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Markdown Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Markdown Body Content
                      </label>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {(editForm.content || '').split(/\s+/).length} words
                      </span>
                    </div>
                    <textarea
                      rows={16}
                      value={editForm.content || ''}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      className="w-full p-4 rounded-xl bg-[#090a10] border border-white/[0.1] text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>

                  {/* Tags Editor */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      Manage Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(editForm.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-white"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add tag and press Enter..."
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.08] text-xs text-white"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Sticky Action Bar */}
            <div className="px-6 py-4 bg-[#11121d] border-t border-white/[0.08] flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => handleDeleteDraft(selectedDraft.id)}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Discard Draft</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraftEdits}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white transition-all"
                >
                  Save Draft Edits
                </button>

                <button
                  type="button"
                  onClick={() => handlePublishDraft({ ...selectedDraft, ...editForm } as Article)}
                  disabled={publishingId === selectedDraft.id}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/40 hover:shadow-emerald-600/60 transition-all flex items-center gap-2"
                >
                  {publishingId === selectedDraft.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Approve &amp; Publish to Live Blog</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CELEBRATION MODAL ON SUCCESSFUL PUBLISH */}
      {publishSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0e101a] border border-emerald-500/40 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Successfully Published
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-3 mb-2">
              Article is Now Live!
            </h3>

            <p className="text-xs text-zinc-300 mb-6 leading-relaxed">
              &quot;{publishSuccessModal.title}&quot; has been reviewed, approved, and officially released to LuminaPress and Strapi CMS.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/blog/${publishSuccessModal.slug}`}
                onClick={() => setPublishSuccessModal(null)}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>View Live Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setPublishSuccessModal(null)}
                className="py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 hover:text-white font-semibold text-xs border border-white/[0.1] transition-all"
              >
                Back to Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
