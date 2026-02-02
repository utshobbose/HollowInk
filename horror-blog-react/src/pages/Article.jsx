import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stories } from '../data/stories';
import Footer from '../components/Footer';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const story = stories.find((s) => s.id === parseInt(id));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Story not found</p>
      </div>
    );
  }

  return (
    <div className="animate-pageIn">
      {/* Hero */}
      <div className="relative min-h-[50vh] flex items-end px-6 pt-12 pb-16">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: story.heroGradient }}>
          <div className="absolute inset-0" style={{ background: story.heroGlow }}></div>
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,9,11,0.2) 0%, rgba(8,9,11,0.6) 50%, rgba(8,9,11,0.95) 100%)',
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 max-w-[760px] mx-auto w-full">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-accent-gold font-heading text-[0.68rem] tracking-[0.18em] uppercase mb-8 transition-all duration-300 hover:gap-3 cursor-pointer"
          >
            ← Back to Stories
          </button>

          <span className="block text-[0.68rem] tracking-[0.2em] uppercase text-accent-gold font-heading mb-2">
            {story.category}
          </span>

          <h1
            className="font-display font-normal text-white mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: '1.25' }}
          >
            {story.title}
          </h1>

          <div className="flex gap-6 text-text-secondary text-xs">
            <span>{story.date}</span>
            <span>{story.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-[720px] mx-auto px-6 py-14 pb-24">
        <div
          className="article-content text-[1.08rem] leading-[1.95]"
          dangerouslySetInnerHTML={{ __html: story.body }}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Article;
