import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookmarkService } from '../services/bookmarkService';
import { historyService } from '../services/historyService';
import Footer from '../components/Footer';

const ReaderAccount = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeBookmarkTab, setActiveBookmarkTab] = useState('to_read'); // 'to_read' | 'favorites'
  const [savedStories, setSavedStories] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  
  // Settings form state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [saveOnDevice, setSaveOnDevice] = useState(true);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  const loadData = React.useCallback(() => {
    if (!user) return;
    const stories = bookmarkService.getUserSavedStories(user.id, activeBookmarkTab);
    setSavedStories(stories);

    const history = historyService.getUserHistoryStories(user.id);
    setReadingHistory(history);
  }, [user, activeBookmarkTab]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || '');
      setEmail(user.email || '');
      setSaveOnDevice(user.saveOnDevice !== false);
      loadData();
    }
  }, [user, loadData]);

  useEffect(() => {
    const handleStorage = () => {
      if (user) loadData();
    };
    window.addEventListener('hollowink_storage_update', handleStorage);
    return () => window.removeEventListener('hollowink_storage_update', handleStorage);
  }, [user, loadData]);

  const handleRemoveBookmark = (e, storyId) => {
    e.stopPropagation();
    if (!user) return;
    bookmarkService.removeBookmark(user.id, storyId, activeBookmarkTab);
    loadData();
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!user) return;
    updateProfile({
      name: displayName,
      email,
      saveOnDevice
    });
    setSettingsSavedMsg('Account preferences sealed in the archives.');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen pt-28 bg-bg-base text-text-primary animate-pageIn">
      <div className="max-w-[860px] mx-auto px-6 pb-24">
        {/* Page Header */}
        <div className="text-center pb-12 border-b border-border">
          <span className="block text-[0.68rem] tracking-[0.35em] uppercase text-accent-gold font-heading mb-2">
            Archival Dossier
          </span>
          <h1 className="font-display font-normal text-white text-3xl md:text-4xl mb-3">
            Reader Account
          </h1>
          <p className="font-body italic text-text-secondary text-sm">
            Manage your personal archive of saved tales, reading relics, and preferences.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-xs font-heading uppercase tracking-wider text-text-muted">
              Role: <span className="text-accent-gold">{user?.role}</span>
            </span>
            {user?.role === 'writer' && (
              <Link to="/writer" className="text-xs font-heading uppercase tracking-wider text-accent-blood hover:underline">
                → Open Writer Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-xs font-heading uppercase tracking-wider text-accent-blood hover:underline">
                → Open Sanctum Sanctorum
              </Link>
            )}
          </div>
        </div>

        {/* SECTION A — BOOKMARKS */}
        <section className="py-12 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display font-normal text-white text-xl">Bookmarks</h2>
              <p className="text-xs text-text-muted font-heading uppercase tracking-wider">
                Saved manuscripts awaiting your attention
              </p>
            </div>

            {/* Sub-tabs: To Read & Favorites */}
            <div className="flex bg-bg-surface border border-border rounded-md p-1 self-start sm:self-auto">
              <button
                onClick={() => setActiveBookmarkTab('to_read')}
                className={`px-4 py-1.5 rounded text-xs font-heading uppercase tracking-wider transition-all ${
                  activeBookmarkTab === 'to_read'
                    ? 'bg-accent-gold text-bg-base font-semibold shadow-sm'
                    : 'text-text-secondary hover:text-accent-gold'
                }`}
              >
                To Read
              </button>
              <button
                onClick={() => setActiveBookmarkTab('favorites')}
                className={`px-4 py-1.5 rounded text-xs font-heading uppercase tracking-wider transition-all ${
                  activeBookmarkTab === 'favorites'
                    ? 'bg-accent-blood text-white font-semibold shadow-sm'
                    : 'text-text-secondary hover:text-accent-gold'
                }`}
              >
                Favorites
              </button>
            </div>
          </div>

          {savedStories.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border rounded-lg bg-bg-surface/30">
              <svg className="w-8 h-8 mx-auto text-text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-sm font-heading text-text-secondary mb-1">
                No manuscripts marked as {activeBookmarkTab === 'to_read' ? '"To Read"' : '"Favorites"'}
              </p>
              <p className="text-xs font-body italic text-text-muted mb-4">
                Wander through the archive and save the whispers that beckon you.
              </p>
              <Link
                to="/archive"
                className="inline-block px-5 py-2 border border-accent-gold/40 text-accent-gold font-heading text-[0.68rem] tracking-widest uppercase rounded hover:bg-accent-gold-dim transition-colors"
              >
                Browse Archive
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => navigate(`/article/${story.id}`)}
                  className="p-5 rounded-lg bg-bg-surface border border-border hover:border-accent-gold/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[0.6rem] font-heading uppercase tracking-wider px-2 py-0.5 rounded bg-bg-raised text-accent-gold border border-border/40">
                        {story.category}
                      </span>
                      {story.region && (
                        <span className="text-[0.6rem] font-heading uppercase tracking-wider text-text-muted">
                          {story.region}
                        </span>
                      )}
                      <span className="text-[0.65rem] text-text-muted ml-auto md:ml-2 font-heading">
                        {story.readTime}
                      </span>
                    </div>

                    <h3 className="font-heading text-base text-text-primary group-hover:text-accent-gold transition-colors mb-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 font-body">
                      {story.excerpt}
                    </p>
                    <p className="text-[0.68rem] text-text-muted mt-2 font-heading">
                      By {story.authorName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={(e) => handleRemoveBookmark(e, story.id)}
                      className="text-text-muted hover:text-accent-blood text-xs font-heading uppercase tracking-wider p-2"
                      title="Remove from list"
                    >
                      Remove
                    </button>
                    <span className="px-4 py-2 border border-accent-gold/30 text-accent-gold font-heading text-[0.68rem] tracking-wider uppercase rounded group-hover:bg-accent-gold group-hover:text-bg-base transition-all">
                      Read Tale →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION B — READING HISTORY */}
        <section className="py-12 border-b border-border">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-display font-normal text-white text-xl">History</h2>
              <p className="text-xs text-text-muted font-heading uppercase tracking-wider">
                Chronicles of tales you have stepped through
              </p>
            </div>
            {readingHistory.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all reading traces from your archive?')) {
                    historyService.clearUserHistory(user.id);
                    loadData();
                  }
                }}
                className="text-[0.65rem] font-heading uppercase tracking-widest text-text-muted hover:text-accent-blood transition-colors"
              >
                Clear History
              </button>
            )}
          </div>

          {readingHistory.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-border rounded-lg bg-bg-surface/30">
              <p className="text-xs font-heading text-text-secondary mb-1">
                No recent reading history recorded.
              </p>
              <p className="text-xs font-body italic text-text-muted">
                Open any story to begin charting your journey through the dark.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {readingHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/article/${item.id}`)}
                  className="p-4 rounded-md bg-bg-surface/80 border border-border/80 hover:border-accent-gold/30 hover:bg-bg-hover transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-heading text-sm text-text-primary group-hover:text-accent-gold truncate transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[0.65rem] text-text-muted font-heading flex-shrink-0">
                        ({item.readTime})
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-36 h-1.5 bg-bg-raised rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-gold transition-all duration-500"
                          style={{ width: `${item.historyMeta?.progressPercent || 0}%` }}
                        />
                      </div>
                      <span className="text-[0.65rem] font-heading text-accent-gold">
                        {item.historyMeta?.progressPercent || 0}% read
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[0.7rem] font-heading text-text-muted block">
                      {formatTimeAgo(item.historyMeta?.lastReadAt)}
                    </span>
                    <span className="text-[0.68rem] font-heading uppercase text-accent-gold group-hover:underline">
                      Continue →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION C — ACCOUNT SETTINGS */}
        <section className="py-12">
          <div className="mb-8">
            <h2 className="font-display font-normal text-white text-xl">Settings</h2>
            <p className="text-xs text-text-muted font-heading uppercase tracking-wider">
              Identity, credentials, and local storage parameters
            </p>
          </div>

          {settingsSavedMsg && (
            <div className="mb-6 p-3 bg-accent-gold-dim border border-accent-gold/40 text-accent-gold rounded text-xs font-heading">
              {settingsSavedMsg}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="bg-bg-surface border border-border rounded-lg p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.7rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-2">
                  Pen Name / Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full bg-bg-raised border border-border rounded px-4 py-2 text-sm text-text-primary outline-none focus:border-accent-gold/50"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-heading tracking-[0.2em] text-text-muted mb-2">
                  Secret Pigeon (Email)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-bg-raised border border-border rounded px-4 py-2 text-sm text-text-primary outline-none focus:border-accent-gold/50"
                />
              </div>
            </div>

            {/* Device Persistence Toggle */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div>
                <span className="block font-heading text-xs tracking-wider uppercase text-text-primary">
                  Save on Device
                </span>
                <span className="text-xs text-text-muted font-body">
                  Retain your reading relics, bookmarks, and draft cache on this machine.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSaveOnDevice(!saveOnDevice)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  saveOnDevice ? 'bg-accent-blood' : 'bg-bg-raised border border-border'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    saveOnDevice ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-text-muted hover:text-accent-blood text-xs font-heading uppercase tracking-widest transition-colors"
              >
                ← Sign Out (Sever Session)
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-accent-gold hover:bg-[#d6b75c] text-bg-base font-heading text-xs tracking-widest uppercase font-semibold rounded transition-colors shadow-md"
              >
                Save Archive Settings
              </button>
            </div>
          </form>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ReaderAccount;
