import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storyService } from '../services/storyService';

const FeaturedStory = () => {
  const navigate = useNavigate();
  const featuredRef = useRef(null);
  const [story, setStory] = useState(null);

  useEffect(() => {
    const featured = storyService.getFeaturedStory();
    setStory(featured);

    const handleStorage = () => {
      setStory(storyService.getFeaturedStory());
    };
    window.addEventListener('hollowink_storage_update', handleStorage);
    return () => window.removeEventListener('hollowink_storage_update', handleStorage);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    if (featuredRef.current) {
      observer.observe(featuredRef.current);
    }

    return () => observer.disconnect();
  }, [story]);

  if (!story) return null;

  return (
    <div id="featured-section">
      {/* Section Header */}
      <div className="text-center pt-24 pb-10 px-4 relative">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-accent-gold font-heading mb-3">
          Curated Manuscript
        </span>
        <h2 className="font-display font-normal text-white" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
          Tonight's Featured Tale
        </h2>
        <div
          className="w-12 h-px mx-auto mt-5"
          style={{ background: 'linear-gradient(90deg, transparent, #9b2424, transparent)' }}
        ></div>
      </div>

      {/* Featured Card */}
      <div className="max-w-[1100px] mx-auto px-6 pb-16">
        <div
          ref={featuredRef}
          onClick={() => navigate(`/article/${story.id}`)}
          className="reveal grid md:grid-cols-[1.15fr_1fr] gap-0 bg-bg-surface rounded-[10px] overflow-hidden border border-border transition-all duration-500 hover:border-accent-gold/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer group"
        >
          {/* Cover Art / Atmospheric Graphic */}
          <div
            className="relative min-h-[380px] overflow-hidden"
            style={{ background: story.heroGradient || 'linear-gradient(135deg, #0d1117 0%, #1a1020 40%, #0a1510 100%)' }}
          >
            {story.coverImage && (
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 ease-out"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-bg-surface/30 to-bg-surface"></div>

            <div className="absolute top-5 left-5 flex gap-2 z-10">
              <span className="bg-accent-blood text-white text-[0.62rem] tracking-[0.2em] uppercase font-heading px-3 py-1.5 rounded shadow-lg">
                {story.category}
              </span>
              {story.region && (
                <span className="bg-bg-base/80 backdrop-blur-md border border-border text-accent-gold text-[0.62rem] tracking-[0.2em] uppercase font-heading px-3 py-1.5 rounded">
                  {story.region}
                </span>
              )}
            </div>
            <span className="absolute bottom-5 left-5 text-text-muted text-xs z-10 font-heading tracking-wider">
              {story.readTime}
            </span>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[0.7rem] text-text-muted tracking-[0.15em] uppercase font-heading">
                {story.date}
              </span>
              {story.authorName && (
                <>
                  <span className="text-text-muted text-xs">·</span>
                  <Link
                    to={`/author/${story.authorId || 'usr_writer_aarav'}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[0.72rem] text-accent-gold/90 hover:text-accent-gold tracking-wider uppercase font-heading"
                  >
                    By {story.authorName}
                  </Link>
                </>
              )}
            </div>

            <h3
              className="font-display font-normal text-white mb-4 transition-colors duration-300 group-hover:text-accent-gold"
              style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', lineHeight: '1.3' }}
            >
              {story.title}
            </h3>

            <p className="text-text-secondary text-[0.98rem] leading-[1.85] mb-8 font-body">
              {story.excerpt}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
              <span className="text-accent-gold text-[0.75rem] tracking-[0.2em] uppercase font-heading inline-flex items-center gap-2 group-hover:text-white transition-colors">
                Read Story <span className="transition-all duration-300 group-hover:translate-x-2 text-accent-blood">→</span>
              </span>

              {story.tags && (
                <div className="flex gap-1.5">
                  {story.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[0.58rem] tracking-wider uppercase text-text-muted bg-bg-raised px-2 py-0.5 rounded font-heading border border-border/40">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStory;
