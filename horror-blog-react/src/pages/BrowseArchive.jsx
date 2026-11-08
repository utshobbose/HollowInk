import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { storyService } from '../services/storyService';
import StoryCard from '../components/StoryCard';
import Footer from '../components/Footer';

const BrowseArchive = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL query params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [genre, setGenre] = useState(searchParams.get('genre') || 'all');
  const [region, setRegion] = useState(searchParams.get('region') || 'all');
  const [mood, setMood] = useState(searchParams.get('mood') || 'all');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [pageLimit, setPageLimit] = useState(6);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state from URL when URL changes
  useEffect(() => {
    setGenre(searchParams.get('genre') || 'all');
    setRegion(searchParams.get('region') || 'all');
    setMood(searchParams.get('mood') || 'all');
    setSearch(searchParams.get('search') || '');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Update URL whenever filters change
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(location.search);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (!val || val === 'all') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    navigate(`/archive?${params.toString()}`, { replace: false });
  };

  const clearAllFilters = () => {
    setGenre('all');
    setRegion('all');
    setMood('all');
    setSearch('');
    setSort('newest');
    navigate('/archive');
  };

  // Query stories
  const filteredStories = useMemo(() => {
    return storyService.getPublishedStories({
      genre: genre !== 'all' ? genre : undefined,
      region: region !== 'all' ? region : undefined,
      mood: mood !== 'all' ? mood : undefined,
      search: search.trim() || undefined,
      sort
    });
  }, [genre, region, mood, search, sort]);

  const visibleStories = filteredStories.slice(0, pageLimit);
  const hasMore = pageLimit < filteredStories.length;

  // Thematic Heading Generation based on filters
  const getArchiveHeading = () => {
    if (region !== 'all' && genre !== 'all') {
      return `${genre.charAt(0).toUpperCase() + genre.slice(1)} from ${region}`;
    }
    if (region !== 'all') {
      return `Horror & Lore from ${region}`;
    }
    if (genre !== 'all') {
      return `${genre.charAt(0).toUpperCase() + genre.slice(1)} Archive`;
    }
    return 'The Living Archive';
  };

  const getArchiveDescription = () => {
    if (region.toLowerCase().includes('bengal')) {
      return 'Tales steeped in the ravenous mists of the Sundarbans and the decaying grandeur of colonial Calcutta. Where ancient water demons and forgotten gods wait in the muddy waters.';
    }
    if (region.toLowerCase().includes('varanasi')) {
      return 'Chronicles from the burning ghats and timeless stone staircases of Kashi, where the river washes between the realms of mortal life and unquiet ashes.';
    }
    if (region.toLowerCase().includes('malabar')) {
      return 'Echoes from the nalukettu courtyards, sacred serpent groves, and rain-soaked plantations of rural Malabar where the Yakshi still claims her ancestral dues.';
    }
    if (region.toLowerCase().includes('rajasthan')) {
      return 'Whispers of subterranean stepwells, abandoned desert havelis, and frescoes painted with charnel soot in the arid winds of Shekhawati.';
    }
    return 'Explore our curated compendium of South Asian Gothic literature, rural horrors, and regional folklore resurrected from the living dark.';
  };

  const genresList = ['all', 'folklore', 'horror', 'fantasy', 'psychological', 'urban', 'historical'];
  const regionsList = ['all', 'Bengal', 'Delta Bengal', 'Varanasi', 'Malabar', 'Rajasthan'];
  const moodsList = ['all', 'Chilling', 'Supernatural', 'Haunted'];

  return (
    <div className="min-h-screen pt-28 bg-bg-base text-text-primary animate-pageIn">
      <div className="max-w-[1240px] mx-auto px-6 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-text-muted mb-6">
          <Link to="/" className="hover:text-accent-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/archive" onClick={clearAllFilters} className="hover:text-accent-gold transition-colors">Archive</Link>
          {region !== 'all' && (
            <>
              <span>/</span>
              <span className="text-accent-gold">{region}</span>
            </>
          )}
          {genre !== 'all' && (
            <>
              <span>/</span>
              <span className="text-accent-blood">{genre}</span>
            </>
          )}
        </div>

        {/* Dynamic Thematic Heading */}
        <div className="text-center max-w-3xl mx-auto pb-12 mb-10 border-b border-border">
          <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-accent-gold font-heading mb-3">
            {region !== 'all' ? 'Regional Archive' : 'Curated Compendium'}
          </span>
          <h1 className="font-display font-normal text-white text-3xl md:text-5xl mb-4 text-shadow-glow">
            {getArchiveHeading()}
          </h1>
          <p className="font-body italic text-text-secondary text-base md:text-lg leading-relaxed">
            {getArchiveDescription()}
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6 flex justify-between items-center bg-bg-surface p-4 border border-border rounded-md">
          <span className="text-xs font-heading uppercase tracking-wider text-text-muted">
            {filteredStories.length} Manuscripts Found
          </span>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-accent-gold text-bg-base rounded text-xs font-heading uppercase tracking-wider font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {mobileFilterOpen ? 'Hide Filters' : 'Filter Archive'}
          </button>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          {/* FILTER PANEL */}
          <aside
            className={`bg-bg-surface border border-border rounded-lg p-6 space-y-7 sticky top-24 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-accent-gold font-semibold">
                Archive Filters
              </h3>
              {(genre !== 'all' || region !== 'all' || mood !== 'all' || search) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[0.65rem] uppercase font-heading tracking-wider text-text-muted hover:text-accent-blood transition-colors"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[0.65rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-2">
                Search In Archive
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    updateFilters({ search: e.target.value });
                  }}
                  placeholder="Keywords or author..."
                  className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-gold/40 placeholder:text-text-muted/60"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch('');
                      updateFilters({ search: '' });
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-[0.65rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-2">
                Region
              </label>
              <div className="space-y-1">
                {regionsList.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRegion(r);
                      updateFilters({ region: r });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs font-heading tracking-wider uppercase transition-colors flex justify-between items-center ${
                      region.toLowerCase() === r.toLowerCase()
                        ? 'bg-accent-gold-dim text-accent-gold font-semibold border-l-2 border-accent-gold'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                    }`}
                  >
                    <span>{r === 'all' ? 'All Regions' : r}</span>
                    {region.toLowerCase() === r.toLowerCase() && (
                      <span className="text-accent-gold">●</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-[0.65rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-2">
                Genre / Discipline
              </label>
              <div className="space-y-1">
                {genresList.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGenre(g);
                      updateFilters({ genre: g });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs font-heading tracking-wider uppercase transition-colors flex justify-between items-center ${
                      genre.toLowerCase() === g.toLowerCase()
                        ? 'bg-accent-blood-dim text-red-200 font-semibold border-l-2 border-accent-blood'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                    }`}
                  >
                    <span>{g === 'all' ? 'All Genres' : g}</span>
                    {genre.toLowerCase() === g.toLowerCase() && (
                      <span className="text-accent-blood">●</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Filter */}
            <div>
              <label className="block text-[0.65rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-2">
                Atmosphere / Mood
              </label>
              <div className="flex flex-wrap gap-1.5">
                {moodsList.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMood(m);
                      updateFilters({ mood: m });
                    }}
                    className={`px-2.5 py-1 rounded text-[0.65rem] font-heading tracking-wider uppercase border transition-all ${
                      mood.toLowerCase() === m.toLowerCase()
                        ? 'border-accent-gold bg-accent-gold-dim text-accent-gold'
                        : 'border-border text-text-secondary hover:border-accent-gold/40'
                    }`}
                  >
                    {m === 'all' ? 'All' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="pt-2 border-t border-border">
              <label className="block text-[0.65rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-2">
                Sort Archive
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  updateFilters({ sort: e.target.value });
                }}
                className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs font-heading tracking-wider uppercase text-text-primary outline-none focus:border-accent-gold/40"
              >
                <option value="newest">Newest Additions</option>
                <option value="oldest">Oldest Chronicles</option>
                <option value="popular">Most Feared / Popular</option>
                <option value="readingTime">Reading Duration</option>
              </select>
            </div>
          </aside>

          {/* STORY RESULTS LIST */}
          <main>
            {/* Active Filter Pills Bar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-text-muted font-heading uppercase tracking-wider">
                  Active:
                </span>
                {region !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading bg-accent-gold-dim text-accent-gold border border-accent-gold/30">
                    Region: {region}
                    <button onClick={() => { setRegion('all'); updateFilters({ region: 'all' }); }} className="hover:text-white">✕</button>
                  </span>
                )}
                {genre !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading bg-accent-blood-dim text-red-200 border border-accent-blood/30">
                    Genre: {genre}
                    <button onClick={() => { setGenre('all'); updateFilters({ genre: 'all' }); }} className="hover:text-white">✕</button>
                  </span>
                )}
                {mood !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading bg-bg-surface text-text-primary border border-border">
                    Mood: {mood}
                    <button onClick={() => { setMood('all'); updateFilters({ mood: 'all' }); }} className="hover:text-white">✕</button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading bg-bg-surface text-text-primary border border-border">
                    "{search}"
                    <button onClick={() => { setSearch(''); updateFilters({ search: '' }); }} className="hover:text-white">✕</button>
                  </span>
                )}
                {(region === 'all' && genre === 'all' && mood === 'all' && !search) && (
                  <span className="text-xs text-text-secondary font-body italic">
                    All archival wings unsealed ({filteredStories.length} manuscripts)
                  </span>
                )}
              </div>

              <span className="text-xs font-heading uppercase tracking-wider text-text-muted">
                Showing {visibleStories.length} of {filteredStories.length}
              </span>
            </div>

            {/* Stories Grid */}
            {visibleStories.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-border rounded-lg bg-bg-surface/30">
                <svg className="w-12 h-12 mx-auto text-text-muted mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="font-heading text-lg text-text-primary mb-2">No Chronicles Match Your Inquiry</h3>
                <p className="font-body text-text-secondary text-sm max-w-md mx-auto mb-6">
                  The dark does not recognize this combination of region, genre, or query. Try adjusting your parameters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-accent-gold text-bg-base font-heading text-xs tracking-widest uppercase font-semibold rounded hover:bg-[#d6b75c] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleStories.map((story, idx) => (
                  <StoryCard key={story.id} story={story} index={idx} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPageLimit((prev) => prev + 6)}
                  className="px-8 py-3 border border-border bg-bg-surface hover:border-accent-gold text-text-primary hover:text-accent-gold font-heading text-xs tracking-[0.2em] uppercase rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]"
                >
                  LOAD MORE TALES
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BrowseArchive;

