import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { storyService } from '../services/storyService';
import { bookmarkService } from '../services/bookmarkService';
import { historyService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [story, setStory] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [reactions, setReactions] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const foundStory = storyService.getStoryById(id);
    if (foundStory) {
      setStory(foundStory);
      setReactions(foundStory.reactionsCount || 0);
      storyService.recordView(foundStory.id);
    }
  }, [id]);

  useEffect(() => {
    if (user && story) {
      setIsSaved(bookmarkService.isBookmarked(user.id, story.id));
      // Track scroll progress for reading history
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const scrollPercent = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
          if (scrollPercent > 10) {
            historyService.recordReadingProgress(user.id, story.id, scrollPercent);
          }
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [user, story]);

  const handleToggleBookmark = () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    const res = bookmarkService.toggleBookmark(user.id, story.id, 'to_read');
    setIsSaved(res.action === 'added');
  };

  const handleToggleReaction = () => {
    if (!hasReacted && story) {
      const updatedCount = storyService.toggleReaction(story.id);
      setReactions(updatedCount);
      setHasReacted(true);
    }
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-display text-2xl text-white mb-2">Manuscript Not Found</h2>
        <p className="text-text-secondary font-body italic mb-6">
          The parchment you seek has disintegrated into ash or remains unwritten.
        </p>
        <Link
          to="/"
          className="px-6 py-2 border border-accent-gold text-accent-gold font-heading text-xs uppercase tracking-widest rounded"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-pageIn bg-bg-base text-text-primary">
      {/* Hero Header */}
      <div className="relative min-h-[55vh] flex items-end px-6 pt-24 pb-16">
        {/* Background Artwork */}
        <div
          className="absolute inset-0"
          style={{ background: story.heroGradient || 'linear-gradient(135deg,#0d1117 0%,#201015 40%,#0a1510 100%)' }}
        >
          {story.coverImage && (
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover opacity-25 filter blur-[2px]"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: story.heroGlow || 'radial-gradient(ellipse 60% 50% at 40% 60%,rgba(155,36,36,.25) 0%,transparent 70%)' }}
          ></div>
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,9,11,0.2) 0%, rgba(8,9,11,0.7) 60%, rgba(8,9,11,1) 100%)',
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 max-w-[780px] mx-auto w-full">
          <div className="flex items-center justify-between gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-accent-gold font-heading text-[0.68rem] tracking-[0.18em] uppercase transition-all duration-300 hover:gap-3 cursor-pointer"
            >
              ← Back to Stories
            </button>

            {/* Quick Actions: Bookmark & Reactions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleBookmark}
                className={`px-3 py-1.5 rounded-full border text-xs font-heading uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  isSaved
                    ? 'bg-accent-blood border-accent-blood text-white shadow-md'
                    : 'border-border bg-bg-surface/80 text-text-muted hover:text-accent-gold'
                }`}
                title={isSaved ? 'Bookmarked' : 'Save Story'}
              >
                <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[0.68rem] tracking-[0.2em] uppercase text-accent-gold font-heading px-2 py-0.5 rounded bg-accent-gold-dim border border-accent-gold/20">
              {story.category}
            </span>
            {story.region && (
              <span className="text-[0.68rem] tracking-[0.2em] uppercase text-text-muted font-heading">
                · {story.region}
              </span>
            )}
          </div>

          <h1
            className="font-display font-normal text-white mb-4 text-shadow-glow"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: '1.2' }}
          >
            {story.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-text-secondary text-xs font-heading tracking-wider">
            <span>{story.date}</span>
            <span>·</span>
            <span>{story.readTime}</span>
            {story.authorName && (
              <>
                <span>·</span>
                <Link
                  to={`/author/${story.authorId || 'usr_writer_aarav'}`}
                  className="text-accent-gold hover:underline"
                >
                  By {story.authorName}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-[740px] mx-auto px-6 py-14 pb-20">
        {story.contentWarning && (
          <div className="mb-10 p-4 border border-accent-blood/40 bg-accent-blood-dim rounded text-xs font-heading text-red-200">
            <span className="font-bold text-accent-blood uppercase tracking-wider block mb-1">Content Warning</span>
            {story.contentWarning}
          </div>
        )}

        <div
          className="article-content text-[1.12rem] leading-[2] font-body text-text-primary/95"
          dangerouslySetInnerHTML={{ __html: story.body }}
        />

        {/* Story Footer with Reactions and Author Attribution */}
        <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleReaction}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${
                hasReacted
                  ? 'bg-accent-blood-dim border-accent-blood text-accent-blood'
                  : 'bg-bg-surface border-border text-text-secondary hover:border-accent-blood hover:text-accent-blood'
              }`}
            >
              <svg className="w-4 h-4 text-accent-blood" fill={hasReacted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-heading text-xs tracking-wider uppercase font-semibold">
                {reactions} {reactions === 1 ? 'Reaction' : 'Reactions'}
              </span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className="p-2.5 rounded-full border border-border text-text-muted hover:text-accent-gold hover:border-accent-gold transition-colors"
              title="Save story"
            >
              <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {story.authorName && (
            <Link
              to={`/author/${story.authorId || 'usr_writer_aarav'}`}
              className="font-heading text-xs tracking-widest uppercase text-text-muted hover:text-accent-gold transition-colors"
            >
              Read more by {story.authorName} →
            </Link>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Article;
