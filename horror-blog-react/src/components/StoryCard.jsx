import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const StoryCard = ({ story, index }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const getCategoryClasses = (category) => {
    const classes = {
      folklore: {
        bg: 'linear-gradient(135deg, #0d1117, #1a1525 40%, #0f1a10 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(42,61,46,0.25), transparent 70%)',
        tag: 'bg-[rgba(42,100,50,0.7)]',
      },
      urban: {
        bg: 'linear-gradient(135deg, #0d1117, #1a1020 40%, #150d1a 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(100,42,120,0.2), transparent 70%)',
        tag: 'bg-[rgba(100,42,120,0.7)]',
      },
      psychological: {
        bg: 'linear-gradient(135deg, #0d1117, #1a1510 40%, #1a0f0d 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(155,36,36,0.2), transparent 70%)',
        tag: 'bg-[rgba(155,36,36,0.7)]',
      },
      historical: {
        bg: 'linear-gradient(135deg, #0d1117, #151a1a 40%, #0d1510 100%)',
        glow: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(58,74,92,0.25), transparent 70%)',
        tag: 'bg-[rgba(58,100,120,0.7)]',
      },
    };
    return classes[category] || classes.folklore;
  };

  const categoryClasses = getCategoryClasses(story.category);

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/article/${story.id}`)}
      className="reveal bg-bg-surface border border-border rounded-md overflow-hidden transition-all duration-300 hover:border-accent-gold/25 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="relative h-[180px] overflow-hidden" style={{ background: categoryClasses.bg }}>
        <div className="absolute inset-0" style={{ background: categoryClasses.glow }}></div>
        <span
          className={`absolute top-3 left-3 text-white text-[0.58rem] tracking-[0.18em] uppercase font-heading px-2 py-1 rounded z-10 ${categoryClasses.tag}`}
        >
          {story.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex gap-4 items-center mb-3">
          <span className="text-[0.68rem] text-text-muted font-heading tracking-[0.1em]">{story.date}</span>
          <span className="text-[0.68rem] text-text-muted">{story.readTime}</span>
        </div>
        <h4 className="font-heading font-medium text-[0.92rem] text-[#d6c8a8] leading-[1.45] mb-2 transition-colors duration-300 hover:text-accent-gold">
          {story.title}
        </h4>
        <p className="text-text-secondary text-[0.88rem] leading-[1.7] flex-1">{story.excerpt}</p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex justify-between items-center">
        <div className="flex gap-1">
          {story.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[0.6rem] tracking-[0.12em] uppercase text-text-muted font-heading bg-bg-raised px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-accent-gold text-[0.7rem] tracking-[0.15em] uppercase font-heading">Read →</span>
      </div>
    </div>
  );
};

export default StoryCard;
