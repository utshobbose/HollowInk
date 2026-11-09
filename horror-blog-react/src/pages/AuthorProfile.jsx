import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { storyService } from '../services/storyService';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const AuthorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [author, setAuthor] = useState(null);
  const [stories, setStories] = useState([]);
  const [pageLimit, setPageLimit] = useState(4);
  const [loading, setLoading] = useState(true);

  const loadAuthorData = React.useCallback(() => {
    setLoading(true);
    const users = authService.getAllUsers();
    // Match by ID or Name slug
    const targetAuthor = users.find(
      (u) =>
        u.id === id ||
        u.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id.toLowerCase() ||
        (u.role === 'writer' && u.name.toLowerCase().includes(id.toLowerCase()))
    );

    if (targetAuthor) {
      setAuthor(targetAuthor);
      const publishedWorks = storyService.getPublishedStoriesByAuthor(targetAuthor.id);
      setStories(publishedWorks);
    } else {
      // Fallback: Check if there's any author matching or default to Aarav Sharma
      const defaultWriter = users.find((u) => u.role === 'writer') || null;
      setAuthor(defaultWriter);
      if (defaultWriter) {
        setStories(storyService.getPublishedStoriesByAuthor(defaultWriter.id));
      }
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadAuthorData();
  }, [loadAuthorData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-accent-gold font-heading tracking-[0.2em] text-sm animate-pulse">
          Opening Author's Folio...
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen pt-32 bg-bg-base text-center px-6">
        <h2 className="font-display text-2xl text-white mb-2">Author Not Found</h2>
        <p className="font-body italic text-text-secondary mb-6">
          This scribe does not appear in our historical registry.
        </p>
        <Link
          to="/"
          className="px-6 py-2 border border-accent-gold text-accent-gold font-heading text-xs uppercase tracking-widest rounded"
        >
          Return to Archives
        </Link>
      </div>
    );
  }

  const isCurrentAuthor = user?.id === author.id;
  const totalReactions = stories.reduce((sum, s) => sum + (s.reactionsCount || 0), 0);
  const visibleStories = stories.slice(0, pageLimit);
  const hasMore = pageLimit < stories.length;

  return (
    <div className="min-h-screen pt-28 bg-bg-base text-text-primary animate-pageIn">
      <div className="max-w-[960px] mx-auto px-6 pb-24">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-heading uppercase tracking-widest text-text-muted hover:text-accent-gold transition-colors mb-8 flex items-center gap-2"
        >
          ← Return
        </button>

        {/* Top Author Dossier Banner (matching Screenshot 5) */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 md:gap-12 pb-14 border-b border-border items-start">
          {/* Framed Vintage Portrait */}
          <div className="relative group mx-auto md:mx-0">
            <div className="w-48 h-56 md:w-52 md:h-64 rounded-md overflow-hidden border-2 border-border/80 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative bg-bg-surface">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-full h-full border border-accent-gold/20 -z-10 rounded-md"></div>
          </div>

          {/* Bio & Engagement Statistics */}
          <div className="flex flex-col justify-center text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="font-display font-normal text-white text-3xl md:text-4xl">
                {author.name}
              </h1>
              {author.role && (
                <span className="text-[0.65rem] font-heading uppercase tracking-widest px-2 py-0.5 rounded bg-accent-gold-dim text-accent-gold border border-accent-gold/25">
                  {author.specialty || 'Archive Scribe'}
                </span>
              )}
            </div>

            <p className="font-body text-text-secondary text-base leading-relaxed mb-6 max-w-2xl">
              {author.bio}
            </p>

            {/* REAL CALCULATED STATS */}
            <div className="flex items-center justify-center md:justify-start gap-8 mb-6 py-4 border-y border-border/60">
              <div>
                <span className="block font-display text-2xl text-accent-gold">{stories.length}</span>
                <span className="text-[0.65rem] font-heading uppercase tracking-widest text-text-muted">
                  Published Stories
                </span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div>
                <span className="block font-display text-2xl text-accent-blood">
                  {totalReactions > 1000 ? `${(totalReactions / 1000).toFixed(1)}k` : totalReactions}
                </span>
                <span className="text-[0.65rem] font-heading uppercase tracking-widest text-text-muted">
                  Reader Reactions
                </span>
              </div>
            </div>

            {/* Social Links & Author Actions */}
            <div className="flex items-center justify-center md:justify-start gap-6 flex-wrap">
              {author.twitter && (
                <a
                  href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-heading uppercase tracking-widest text-text-muted hover:text-accent-gold transition-colors"
                >
                  Twitter ↗
                </a>
              )}
              {author.instagram && (
                <a
                  href={`https://instagram.com/${author.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-heading uppercase tracking-widest text-text-muted hover:text-accent-gold transition-colors"
                >
                  Instagram ↗
                </a>
              )}
              {isCurrentAuthor && (
                <Link
                  to="/writer"
                  className="px-4 py-1.5 border border-accent-gold text-accent-gold rounded text-xs font-heading uppercase tracking-wider hover:bg-accent-gold-dim ml-auto"
                >
                  Manage In Writer Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* SECTION: PUBLISHED WORKS (matching Screenshot 5) */}
        <section className="pt-14">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <span className="block text-[0.65rem] tracking-[0.3em] uppercase text-accent-gold font-heading mb-1">
                Bibliography
              </span>
              <h2 className="font-display font-normal text-white text-2xl">Published Works</h2>
            </div>
            <span className="text-xs font-heading uppercase tracking-wider text-text-muted">
              {stories.length} Manuscripts
            </span>
          </div>

          {stories.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-lg bg-bg-surface/30">
              <p className="text-sm font-heading text-text-secondary mb-1">No manuscripts published yet.</p>
              <p className="text-xs font-body italic text-text-muted">
                This scribe is currently transcribing new whispers in the dark.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {visibleStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => navigate(`/article/${story.id}`)}
                  className="p-6 md:p-8 rounded-lg bg-bg-surface border border-border hover:border-accent-gold/40 transition-all cursor-pointer grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6 items-center group shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[0.6rem] font-heading uppercase tracking-widest px-2 py-0.5 rounded bg-bg-raised text-accent-gold border border-border/50">
                        {story.category}
                      </span>
                      {story.region && (
                        <span className="text-[0.6rem] font-heading uppercase tracking-widest text-text-muted">
                          {story.region}
                        </span>
                      )}
                      <span className="text-text-muted text-xs">·</span>
                      <span className="text-[0.68rem] font-heading text-text-muted">{story.readTime}</span>
                    </div>

                    <h3 className="font-display font-normal text-xl md:text-2xl text-white group-hover:text-accent-gold transition-colors mb-3">
                      {story.title}
                    </h3>

                    <p className="text-sm text-text-secondary font-body leading-relaxed mb-4 line-clamp-2">
                      {story.excerpt}
                    </p>

                    <span className="text-accent-gold text-xs font-heading tracking-widest uppercase inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      Read Story →
                    </span>
                  </div>

                  {/* Thumbnail Cover */}
                  <div className="w-full h-36 md:h-36 rounded overflow-hidden bg-bg-raised border border-border/60 relative">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/80 via-transparent to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setPageLimit((prev) => prev + 4)}
                className="px-8 py-3 border border-border bg-bg-surface hover:border-accent-gold text-text-primary hover:text-accent-gold font-heading text-xs tracking-widest uppercase rounded transition-all"
              >
                LOAD MORE STORIES
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AuthorProfile;
