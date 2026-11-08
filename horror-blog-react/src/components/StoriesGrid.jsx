import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storyService } from '../services/storyService';
import StoryCard from './StoryCard';

const StoriesGrid = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [stories, setStories] = useState([]);

  const loadStories = React.useCallback(() => {
    let filters = {};
    if (activeTab === 'bengal') {
      filters.region = 'Bengal';
    } else if (activeTab === 'varanasi') {
      filters.region = 'Varanasi';
    } else if (activeTab !== 'all') {
      filters.genre = activeTab;
    }
    const list = storyService.getPublishedStories(filters);
    setStories(list);
  }, [activeTab]);

  useEffect(() => {
    loadStories();
    const handleUpdate = () => loadStories();
    window.addEventListener('hollowink_storage_update', handleUpdate);
    return () => window.removeEventListener('hollowink_storage_update', handleUpdate);
  }, [loadStories]);

  const tabs = [
    { id: 'all', label: 'Latest Tales' },
    { id: 'folklore', label: 'Folklore' },
    { id: 'horror', label: 'Horror' },
    { id: 'bengal', label: 'Bengal' },
    { id: 'varanasi', label: 'Varanasi' },
    { id: 'psychological', label: 'Psychological' },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-20">
      {/* Section Header */}
      <div className="text-center pt-16 pb-10">
        <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-accent-gold font-heading mb-3">
          The Living Vault
        </span>
        <h2 className="font-display font-normal text-white" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)' }}>
          Tales from the Dark
        </h2>
        <div
          className="w-10 h-px mx-auto mt-5"
          style={{ background: 'linear-gradient(90deg, transparent, #9b2424, transparent)' }}
        ></div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2.5 flex-wrap justify-center mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full font-heading text-[0.7rem] tracking-[0.16em] uppercase transition-all duration-300 ${
              activeTab === tab.id
                ? 'border border-accent-gold text-accent-gold bg-accent-gold-dim shadow-[0_0_15px_rgba(201,168,76,0.15)]'
                : 'border border-border text-text-secondary hover:border-accent-gold/40 hover:text-accent-gold hover:bg-accent-gold-dim/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {stories.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-lg bg-bg-surface/40">
          <p className="text-text-secondary font-heading text-sm mb-2">No tales found in this wing of the archive.</p>
          <button
            onClick={() => setActiveTab('all')}
            className="text-accent-gold font-heading text-xs uppercase tracking-wider underline hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <StoryCard key={story.id} story={story} index={index} />
          ))}
        </div>
      )}

      {/* Archive Explorer Link */}
      <div className="text-center mt-14">
        <Link
          to="/archive"
          className="inline-flex items-center gap-2 px-8 py-3.5 border border-border bg-bg-surface hover:border-accent-gold text-text-primary hover:text-accent-gold font-heading text-[0.72rem] tracking-[0.2em] uppercase rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.15)]"
        >
          Explore Entire Archive →
        </Link>
      </div>
    </div>
  );
};

export default StoriesGrid;
