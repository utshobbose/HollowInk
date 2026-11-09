import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookmarkService } from '../services/bookmarkService';

const StoryCard = ({ story, index = 0 }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setIsSaved(bookmarkService.isBookmarked(user.id, story.id));
    } else {
      setIsSaved(false);
    }
  }, [user, story.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(index * 60, 400));
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    const res = bookmarkService.toggleBookmark(user.id, story.id, 'to_read');
    setIsSaved(res.action === 'added');
  };

  const getCategoryTheme = (category) => {
    const themes = {
      folklore: {
        bg: 'linear-gradient(135deg, #0d1117, #1a1525 40%, #0f1a10 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(42,61,46,0.25), transparent 70%)',
        tag: 'bg-[rgba(42,100,50,0.85)] text-[#d4ebd8]',
      },
      urban: {
        bg: 'linear-gradient(135deg, #0d1117, #1a1020 40%, #150d1a 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(100,42,120,0.2), transparent 70%)',
        tag: 'bg-[rgba(100,42,120,0.85)] text-[#ecd8f3]',
      },
      psychological: {
        bg: 'linear-gradient(135deg, #0d1117, #1a1510 40%, #1a0f0d 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(155,36,36,0.2), transparent 70%)',
        tag: 'bg-[rgba(155,36,36,0.85)] text-[#fcd8d8]',
      },
      historical: {
        bg: 'linear-gradient(135deg, #0d1117, #151a1a 40%, #0d1510 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(58,74,92,0.25), transparent 70%)',
        tag: 'bg-[rgba(58,100,120,0.85)] text-[#d8ebfc]',
      },
      horror: {
        bg: 'linear-gradient(135deg, #0d1117, #201015 40%, #150d10 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(155,36,36,0.3), transparent 70%)',
        tag: 'bg-accent-blood text-white',
      },
      fantasy: {
        bg: 'linear-gradient(135deg, #0d1117, #1a1820 40%, #151025 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(130,90,180,0.25), transparent 70%)',
        tag: 'bg-[rgba(90,60,140,0.85)] text-[#e8dbfc]',
      }
    };
    return themes[category?.toLowerCase()] || themes.folklore;
  };

  const theme = getCategoryTheme(story.category);

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/article/${story.id}`)}
      className="reveal bg-bg-surface border border-border rounded-md overflow-hidden transition-all duration-300 hover:border-accent-gold/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] cursor-pointer flex flex-col group"
    >
      {/* Cover Artwork */}
      <div className="relative h-[190px] overflow-hidden" style={{ background: theme.bg }}>
        {story.coverImage ? (
          <img
            src={story.coverImage}
            alt={story.title}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: theme.glow }}></div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent opacity-80"></div>

        {/* Category & Region badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span
            className={`text-[0.58rem] tracking-[0.18em] uppercase font-heading px-2 py-0.5 rounded shadow-sm ${theme.tag}`}
          >
            {story.category}
          </span>
          {story.region && (
            <span className="bg-bg-base/80 backdrop-blur-sm border border-border text-accent-gold text-[0.56rem] tracking-[0.15em] uppercase font-heading px-2 py-0.5 rounded">
              {story.region}
            </span>
          )}
        </div>

        {/* Bookmark Quick Action Button */}
        <button
          onClick={handleBookmarkToggle}
          title={isSaved ? 'Remove from saved reading list' : 'Save to reading list'}
          className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isSaved
              ? 'bg-accent-blood text-white shadow-[0_0_12px_rgba(155,36,36,0.6)]'
              : 'bg-bg-base/70 text-text-muted hover:text-accent-gold hover:bg-bg-base/90'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex gap-3 items-center mb-3">
          <span className="text-[0.68rem] text-text-muted font-heading tracking-[0.1em]">{story.date}</span>
          <span className="text-text-muted text-xs">·</span>
          <span className="text-[0.68rem] text-text-muted">{story.readTime}</span>
        </div>

        <h4 className="font-heading font-medium text-[0.95rem] text-[#d6c8a8] leading-[1.45] mb-2 transition-colors duration-300 group-hover:text-accent-gold">
          {story.title}
        </h4>

        <p className="text-text-secondary text-[0.88rem] leading-[1.7] flex-1 line-clamp-3">
          {story.excerpt}
        </p>

        {/* Author Attribution */}
        {story.authorName && (
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
            <Link
              to={`/author/${story.authorId || 'usr_writer_aarav'}`}
              onClick={(e) => e.stopPropagation()}
              className="text-text-secondary hover:text-accent-gold font-heading text-[0.7rem] tracking-wider transition-colors"
            >
              By {story.authorName}
            </Link>
            {story.reactionsCount > 0 && (
              <span className="text-text-muted text-[0.65rem] flex items-center gap-1">
                <svg className="w-3 h-3 text-accent-blood" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {story.reactionsCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3.5 border-t border-border bg-bg-surface/50 flex justify-between items-center">
        <div className="flex gap-1 flex-wrap">
          {(story.tags || []).slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="text-[0.58rem] tracking-[0.12em] uppercase text-text-muted font-heading bg-bg-raised px-2 py-0.5 rounded border border-border/40"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-accent-gold text-[0.7rem] tracking-[0.15em] uppercase font-heading group-hover:translate-x-1 transition-transform">
          Read →
        </span>
      </div>
    </div>
  );
};

export default StoryCard;
