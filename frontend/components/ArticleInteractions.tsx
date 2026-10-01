'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check, MessageSquare, Send, Heart, Bookmark } from 'lucide-react';
import { TwitterIcon, LinkedinIcon } from './Icons';
import { Comment } from '@/lib/types';

interface ArticleInteractionsProps {
  title: string;
  slug: string;
}

export default function ArticleInteractions({ title, slug }: ArticleInteractionsProps) {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(42);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      authorName: 'David K.',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      date: '2 days ago',
      content: 'The architectural breakdown on decoupling state synchronization and context windows is masterclass. Definitely applying this in our internal agent platform!',
    },
    {
      id: '2',
      authorName: 'Sarah Jenkins',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      date: 'Yesterday',
      content: 'Strapi 5 paired with Next.js App Router has made our content modeling 10x faster. Excellent article and practical code snippets!',
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newEntry: Comment = {
      id: Date.now().toString(),
      authorName: newCommentName,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      date: 'Just now',
      content: newCommentText,
    };

    setComments([newEntry, ...comments]);
    setNewCommentName('');
    setNewCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  const shareOnTwitter = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnLinkedin = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Sticky Quick Actions Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/[0.08] shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              liked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-white/[0.05] text-zinc-300 hover:text-white border border-white/[0.08]'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              saved
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                : 'bg-white/[0.05] text-zinc-300 hover:text-white border border-white/[0.08]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-400 text-indigo-400' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 mr-1 hidden sm:inline">Share:</span>
          <button
            onClick={shareOnTwitter}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition-colors"
            title="Share on Twitter"
          >
            <TwitterIcon className="w-4 h-4" />
          </button>
          <button
            onClick={shareOnLinkedin}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition-colors"
            title="Share on LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] text-xs transition-colors"
            title="Copy link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>   

      {/* Discussion & Comments Section */}
      <section id="discussion" className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Reader Discussion ({comments.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-400">Moderated community</span>
        </div>

        {/* Comment submission form */}
        <form onSubmit={handleCommentSubmit} className="mb-10 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={newCommentName}
              onChange={(e) => setNewCommentName(e.target.value)}
              placeholder="Your Name (e.g. Alex Morgan)"
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <textarea
            required
            rows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Share your thoughts, architectural questions, or feedback..."
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            {commentSuccess ? (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Response posted successfully!
              </span>
            ) : (
              <span className="text-[11px] text-zinc-500">Markdown supported</span>
            )}
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Post Response</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Comment list */}
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center border border-white/10">
                    {c.authorName[0]}
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">{c.authorName}</span>
                </div>
                <span className="text-[11px] text-zinc-500">{c.date}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed pl-9">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
