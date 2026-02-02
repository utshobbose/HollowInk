import React, { useState } from 'react';
import { stories } from '../data/stories';
import StoryCard from './StoryCard';

const StoriesGrid = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = ['all', 'folklore', 'urban', 'psychological', 'historical'];

  const filteredStories =
    activeFilter === 'all' ? stories : stories.filter((story) => story.category === activeFilter);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-20">
      {/* Section Header */}
      <div className="text-center pt-12 pb-10">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-accent-gold font-heading mb-3">
          The Collection
        </span>
        <h2 className="font-display font-normal text-white" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)' }}>
          All Stories
        </h2>
        <div
          className="w-10 h-px mx-auto mt-5"
          style={{ background: 'linear-gradient(90deg, transparent, #9b2424, transparent)' }}
        ></div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 flex-wrap justify-center mb-11">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 rounded-full font-heading text-[0.68rem] tracking-[0.15em] uppercase transition-all duration-300 ${
              activeFilter === category
                ? 'border border-accent-gold text-accent-gold bg-accent-gold-dim'
                : 'border border-border text-text-secondary hover:border-accent-gold hover:text-accent-gold hover:bg-accent-gold-dim'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story, index) => (
          <StoryCard key={story.id} story={story} index={index} />
        ))}
      </div>
    </div>
  );
};

export default StoriesGrid;
