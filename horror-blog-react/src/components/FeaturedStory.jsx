import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { stories } from '../data/stories';

const FeaturedStory = () => {
  const navigate = useNavigate();
  const featuredRef = useRef(null);
  const story = stories[0]; // Featured story

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
  }, []);

  return (
    <div id="featured-section">
      {/* Section Header */}
      <div className="text-center pt-20 pb-10 px-4 relative">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-accent-gold font-heading mb-3">
          Featured
        </span>
        <h2 className="font-display font-normal text-white" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)' }}>
          Tonight's Story
        </h2>
        <div
          className="w-10 h-px mx-auto mt-5"
          style={{ background: 'linear-gradient(90deg, transparent, #9b2424, transparent)' }}
        ></div>
      </div>

      {/* Featured Card */}
      <div className="max-w-[1100px] mx-auto px-6 pb-16">
        <div
          ref={featuredRef}
          onClick={() => navigate(`/article/${story.id}`)}
          className="reveal grid md:grid-cols-[1.1fr_1fr] gap-0 bg-bg-surface rounded-[10px] overflow-hidden border border-border transition-all duration-300 hover:border-accent-gold/25 cursor-pointer"
        >
          {/* Image */}
          <div
            className="relative min-h-[380px] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1020 40%, #0a1510 100%)' }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 40% 60%, rgba(155,36,36,0.18) 0%, transparent 70%), radial-gradient(ellipse 80% 40% at 70% 80%, rgba(42,61,46,0.2) 0%, transparent 60%)`,
              }}
            ></div>
            <span className="absolute top-5 left-5 bg-accent-blood/80 text-white text-[0.6rem] tracking-[0.2em] uppercase font-heading px-3 py-2 rounded z-10">
              Folklore
            </span>
            <span className="absolute bottom-5 right-5 text-text-muted text-xs z-10">{story.readTime}</span>
          </div>

          {/* Content */}
          <div className="p-11 flex flex-col justify-center">
            <span className="text-[0.7rem] text-text-muted tracking-[0.15em] uppercase mb-4 font-heading">
              {story.date}
            </span>
            <h3 className="font-display font-normal text-white mb-4 transition-colors duration-300 hover:text-accent-gold" style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)', lineHeight: '1.35' }}>
              {story.title}
            </h3>
            <p className="text-text-secondary text-[0.95rem] leading-[1.8] mb-6">{story.excerpt}</p>
            <span className="text-accent-gold text-[0.72rem] tracking-[0.18em] uppercase font-heading inline-flex items-center gap-2 group">
              Read Story <span className="transition-all duration-300 group-hover:translate-x-2">→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStory;
