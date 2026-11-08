import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { storyService } from '../services/storyService';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const found = storyService.getPublishedStories({ search: query });
    setResults(found);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (story) => {
    onClose();
    navigate(`/article/${story.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-bg-base/85 backdrop-blur-md animate-pageIn">
      <div
        className="w-full max-w-2xl bg-bg-surface border border-accent-gold/25 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="p-4 border-b border-border flex items-center gap-3 bg-bg-raised">
          <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tales, folklore, authors, or regions..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted font-body text-lg outline-none"
          />
          <button
            onClick={onClose}
            className="text-text-muted hover:text-accent-gold text-xs font-heading tracking-widest uppercase px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Links */}
        <div className="px-5 py-3 border-b border-border/50 bg-bg-base/50 flex items-center gap-3 text-xs overflow-x-auto">
          <span className="text-text-muted font-heading uppercase text-[0.65rem] tracking-wider">Regions:</span>
          {['Bengal', 'Varanasi', 'Malabar', 'Rajasthan'].map((r) => (
            <button
              key={r}
              onClick={() => {
                onClose();
                navigate(`/archive?region=${encodeURIComponent(r)}`);
              }}
              className="text-text-secondary hover:text-accent-gold text-[0.72rem] tracking-wider transition-colors"
            >
              {r}
            </button>
          ))}
          <span className="text-border">|</span>
          <span className="text-text-muted font-heading uppercase text-[0.65rem] tracking-wider">Genres:</span>
          {['Folklore', 'Horror', 'Psychological', 'Fantasy'].map((g) => (
            <button
              key={g}
              onClick={() => {
                onClose();
                navigate(`/archive?genre=${encodeURIComponent(g.toLowerCase())}`);
              }}
              className="text-text-secondary hover:text-accent-gold text-[0.72rem] tracking-wider transition-colors"
            >
              {g}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-text-muted text-sm font-body italic">
              Type to search the living dark archive...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-text-secondary font-heading text-sm mb-1">No manuscripts match "{query}"</p>
              <p className="text-text-muted text-xs font-body italic">Perhaps the spirits buried that knowledge too deep.</p>
            </div>
          ) : (
            results.map((story) => (
              <div
                key={story.id}
                onClick={() => handleSelect(story)}
                className="p-4 rounded-md bg-bg-base/60 border border-border/60 hover:border-accent-gold/40 hover:bg-bg-hover transition-all cursor-pointer flex gap-4 items-center group"
              >
                <div className="w-16 h-16 rounded overflow-hidden bg-bg-surface flex-shrink-0 relative">
                  <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[0.6rem] uppercase tracking-wider font-heading text-accent-gold px-1.5 py-0.5 rounded bg-accent-gold-dim">
                      {story.category}
                    </span>
                    {story.region && (
                      <span className="text-[0.6rem] uppercase tracking-wider font-heading text-text-muted">
                        · {story.region}
                      </span>
                    )}
                    <span className="text-[0.65rem] text-text-muted ml-auto font-heading">{story.readTime}</span>
                  </div>
                  <h4 className="font-heading text-sm text-text-primary group-hover:text-accent-gold truncate transition-colors">
                    {story.title}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-1 font-body">{story.excerpt}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

