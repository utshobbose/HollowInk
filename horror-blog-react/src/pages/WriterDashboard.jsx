import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storyService } from '../services/storyService';
import { analyticsService } from '../services/analyticsService';
import Footer from '../components/Footer';

const WriterDashboard = () => {
  const { user } = useAuth();

  const [activeSidebarTab, setActiveSidebarTab] = useState('manuscripts'); // 'manuscripts' | 'analytics' | 'settings'
  const [manuscripts, setManuscripts] = useState([]);
  const [selectedManuscript, setSelectedManuscript] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  // Story Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorSlug, setEditorSlug] = useState('');
  const [editorCategory, setEditorCategory] = useState('folklore');
  const [editorRegion, setEditorRegion] = useState('Bengal');
  const [editorMood, setEditorMood] = useState('Chilling');
  const [editorExcerpt, setEditorExcerpt] = useState('');
  const [editorBody, setEditorBody] = useState('');
  const [editorCoverImage, setEditorCoverImage] = useState('');
  const [editorContentWarning, setEditorContentWarning] = useState('');
  const [editorTags, setEditorTags] = useState('Bengal, Folklore');
  const [editorError, setEditorError] = useState('');
  const [editorSuccess, setEditorSuccess] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const loadData = React.useCallback(() => {
    if (!user) return;
    const authorStories = storyService.getStoriesByAuthor(user.id);
    setManuscripts(authorStories);

    // Default select first manuscript for the right preview pane
    if (authorStories.length > 0 && !selectedManuscript) {
      setSelectedManuscript(authorStories[0]);
    } else if (selectedManuscript) {
      const refreshed = authorStories.find((s) => s.id === selectedManuscript.id);
      setSelectedManuscript(refreshed || authorStories[0] || null);
    }

    const metrics = analyticsService.getWriterMetrics(user.id);
    setAnalytics(metrics);
  }, [user, selectedManuscript]);

  useEffect(() => {
    if (user) {
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

  const handleOpenNewStory = () => {
    setEditingStoryId(null);
    setEditorTitle('');
    setEditorSlug('');
    setEditorCategory('folklore');
    setEditorRegion('Bengal');
    setEditorMood('Chilling');
    setEditorExcerpt('');
    setEditorBody('<p class="mb-6 font-light">Begin writing the darkness here...</p>');
    setEditorCoverImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80');
    setEditorContentWarning('');
    setEditorTags('Bengal, Folklore, Dark');
    setEditorError('');
    setEditorSuccess('');
    setIsDirty(false);
    setIsEditorOpen(true);
  };

  const handleEditStory = (story) => {
    setEditingStoryId(story.id);
    setEditorTitle(story.title || '');
    setEditorSlug(story.slug || '');
    setEditorCategory(story.category || 'folklore');
    setEditorRegion(story.region || 'Bengal');
    setEditorMood(story.mood || 'Chilling');
    setEditorExcerpt(story.excerpt || '');
    setEditorBody(story.body || '');
    setEditorCoverImage(story.coverImage || '');
    setEditorContentWarning(story.contentWarning || '');
    setEditorTags((story.tags || []).join(', '));
    setEditorError('');
    setEditorSuccess('');
    setIsDirty(false);
    setIsEditorOpen(true);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    setEditorError('');
    if (!editorTitle.trim()) {
      setEditorError('A title is required for the manuscript.');
      return;
    }

    try {
      const parsedTags = editorTags.split(',').map((t) => t.trim()).filter(Boolean);
      const storyPayload = {
        title: editorTitle,
        slug: editorSlug,
        category: editorCategory,
        region: editorRegion,
        mood: editorMood,
        excerpt: editorExcerpt,
        body: editorBody,
        coverImage: editorCoverImage,
        contentWarning: editorContentWarning,
        tags: parsedTags,
        status: 'draft'
      };

      if (editingStoryId) {
        storyService.updateStory(editingStoryId, storyPayload, user);
        setEditorSuccess('Draft saved successfully.');
      } else {
        const created = storyService.createStory(storyPayload, user);
        setEditingStoryId(created.id);
        setEditorSuccess('Manuscript created as draft.');
      }
      setIsDirty(false);
      loadData();
      setTimeout(() => setEditorSuccess(''), 2500);
    } catch (err) {
      setEditorError(err.message || 'Error saving draft.');
    }
  };

  const handleSubmitForReview = () => {
    if (!editorTitle.trim() || !editorExcerpt.trim()) {
      setEditorError('Title and short excerpt are required before submitting for review.');
      return;
    }

    try {
      const parsedTags = editorTags.split(',').map((t) => t.trim()).filter(Boolean);
      const storyPayload = {
        title: editorTitle,
        slug: editorSlug,
        category: editorCategory,
        region: editorRegion,
        mood: editorMood,
        excerpt: editorExcerpt,
        body: editorBody,
        coverImage: editorCoverImage,
        contentWarning: editorContentWarning,
        tags: parsedTags,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };

      if (editingStoryId) {
        storyService.updateStory(editingStoryId, storyPayload, user);
      } else {
        storyService.createStory(storyPayload, user);
      }

      setIsDirty(false);
      setIsEditorOpen(false);
      loadData();
      alert('Manuscript submitted to the Sanctum Sanctorum for archivist review.');
    } catch (err) {
      setEditorError(err.message || 'Error submitting manuscript.');
    }
  };

  const handleDeleteManuscript = (storyId) => {
    if (window.confirm('Are you sure you wish to permanently destroy this manuscript?')) {
      storyService.deleteStory(storyId, user);
      loadData();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2.5 py-0.5 rounded text-[0.62rem] font-heading uppercase tracking-wider bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">
            Published
          </span>
        );
      case 'submitted':
        return (
          <span className="px-2.5 py-0.5 rounded text-[0.62rem] font-heading uppercase tracking-wider bg-amber-900/40 text-amber-300 border border-amber-500/30">
            Submitted
          </span>
        );
      case 'revision_requested':
        return (
          <span className="px-2.5 py-0.5 rounded text-[0.62rem] font-heading uppercase tracking-wider bg-red-900/40 text-red-300 border border-red-500/30">
            Revision Needed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[0.62rem] font-heading uppercase tracking-wider bg-bg-raised text-text-muted border border-border">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-bg-base text-text-primary animate-pageIn flex flex-col justify-between">
      <div className="max-w-[1360px] w-full mx-auto px-4 md:px-8 py-6">
        {/* Top Bar (matching Screenshot 6) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
          <div className="flex items-center gap-4">
            <span className="font-display text-xl text-white">HOLLOW<span className="text-accent-blood">INK</span></span>
            <span className="text-border">|</span>
            <h1 className="font-heading text-lg text-text-primary tracking-wide">
              {activeSidebarTab === 'manuscripts' ? 'Manuscripts' : activeSidebarTab === 'analytics' ? 'Scribe Analytics' : 'Writer Profile Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/author/${user?.id}`}
              className="px-4 py-2 border border-border rounded text-xs font-heading uppercase tracking-wider text-text-secondary hover:text-accent-gold hover:border-accent-gold/40 transition-colors"
            >
              Public Profile
            </Link>
            <button
              onClick={handleOpenNewStory}
              className="px-5 py-2 bg-accent-gold hover:bg-[#d6b75c] text-bg-base font-heading text-xs tracking-widest uppercase font-semibold rounded transition-all shadow-[0_4px_15px_rgba(201,168,76,0.2)] flex items-center gap-1.5"
            >
              <span>+</span> New Post
            </button>
          </div>
        </div>

        {/* 3-Column Layout: Sidebar Navigation | Manuscripts Table | Draft Preview Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-8 items-start">
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="bg-bg-surface border border-border rounded-lg p-4 space-y-6">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSidebarTab('manuscripts')}
                className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-heading uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeSidebarTab === 'manuscripts'
                    ? 'bg-accent-gold-dim text-accent-gold font-semibold border-l-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                My Stories
              </button>

              <button
                onClick={() => setActiveSidebarTab('analytics')}
                className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-heading uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeSidebarTab === 'analytics'
                    ? 'bg-accent-gold-dim text-accent-gold font-semibold border-l-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Analytics
              </button>

              <button
                onClick={() => setActiveSidebarTab('settings')}
                className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-heading uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeSidebarTab === 'settings'
                    ? 'bg-accent-gold-dim text-accent-gold font-semibold border-l-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </nav>

            {/* Writer Identity Footer */}
            <div className="pt-4 border-t border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-bg-raised">
                <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-heading text-text-primary truncate">{user?.name}</p>
                <p className="text-[0.62rem] font-heading uppercase text-accent-gold tracking-wider">
                  Author / Scribe
                </p>
              </div>
            </div>
          </aside>

          {/* MIDDLE SECTION */}
          <main className="bg-bg-surface border border-border rounded-lg p-6 overflow-hidden">
            {activeSidebarTab === 'manuscripts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xs uppercase tracking-[0.2em] text-accent-gold">
                    Manuscript Registry ({manuscripts.length})
                  </h2>
                </div>

                {manuscripts.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-border rounded-lg">
                    <p className="text-sm font-heading text-text-secondary mb-2">You have no recorded manuscripts.</p>
                    <button
                      onClick={handleOpenNewStory}
                      className="text-xs font-heading uppercase tracking-wider text-accent-gold hover:underline"
                    >
                      Draft your first tale →
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border text-text-muted font-heading uppercase tracking-wider text-[0.65rem]">
                          <th className="pb-3 font-semibold">Title</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold">Last Modified</th>
                          <th className="pb-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 font-body">
                        {manuscripts.map((story) => (
                          <tr
                            key={story.id}
                            onClick={() => setSelectedManuscript(story)}
                            className={`hover:bg-bg-raised/70 transition-colors cursor-pointer ${
                              selectedManuscript?.id === story.id ? 'bg-bg-raised/90' : ''
                            }`}
                          >
                            <td className="py-4 pr-3">
                              <span className="font-heading text-sm text-text-primary block hover:text-accent-gold transition-colors">
                                {story.title}
                              </span>
                              <span className="text-[0.68rem] text-text-muted font-heading tracking-wide">
                                {story.category} · {story.region || 'Bengal'}
                              </span>
                            </td>

                            <td className="py-4 pr-3 whitespace-nowrap">
                              {getStatusBadge(story.status)}
                            </td>

                            <td className="py-4 pr-3 text-text-muted whitespace-nowrap text-[0.7rem] font-heading">
                              {story.lastModified ? new Date(story.lastModified).toLocaleDateString() : story.date}
                            </td>

                            <td className="py-4 text-right whitespace-nowrap space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEditStory(story); }}
                                className="px-2.5 py-1 text-[0.65rem] font-heading uppercase tracking-wider text-accent-gold hover:bg-accent-gold-dim rounded border border-accent-gold/20"
                              >
                                Edit
                              </button>
                              {story.status === 'published' && (
                                <Link
                                  to={`/article/${story.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-2.5 py-1 text-[0.65rem] font-heading uppercase tracking-wider text-text-secondary hover:text-text-primary rounded border border-border"
                                >
                                  View
                                </Link>
                              )}
                              {story.status === 'draft' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    storyService.submitStory(story.id, user);
                                    loadData();
                                  }}
                                  className="px-2.5 py-1 text-[0.65rem] font-heading uppercase tracking-wider text-emerald-400 hover:bg-emerald-950/40 rounded border border-emerald-500/30"
                                >
                                  Submit
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteManuscript(story.id); }}
                                className="px-2 py-1 text-[0.65rem] font-heading uppercase tracking-wider text-text-muted hover:text-accent-blood"
                                title="Delete"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ANALYTICS */}
            {activeSidebarTab === 'analytics' && analytics && (
              <div className="space-y-8 animate-pageIn">
                <div>
                  <h2 className="font-heading text-xs uppercase tracking-[0.2em] text-accent-gold mb-1">
                    Performance Metrics
                  </h2>
                  <p className="text-xs text-text-muted font-body">
                    Authentic reader interactions calculated from active archival records.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-bg-raised p-5 rounded-md border border-border">
                    <span className="text-[0.65rem] font-heading uppercase tracking-wider text-text-muted block mb-1">
                      Published Works
                    </span>
                    <span className="font-display text-3xl text-white">{analytics.publishedCount}</span>
                  </div>

                  <div className="bg-bg-raised p-5 rounded-md border border-border">
                    <span className="text-[0.65rem] font-heading uppercase tracking-wider text-text-muted block mb-1">
                      Total Story Views
                    </span>
                    <span className="font-display text-3xl text-accent-gold">{analytics.totalViews}</span>
                  </div>

                  <div className="bg-bg-raised p-5 rounded-md border border-border">
                    <span className="text-[0.65rem] font-heading uppercase tracking-wider text-text-muted block mb-1">
                      Reader Reactions
                    </span>
                    <span className="font-display text-3xl text-accent-blood">{analytics.totalReactions}</span>
                  </div>

                  <div className="bg-bg-raised p-5 rounded-md border border-border">
                    <span className="text-[0.65rem] font-heading uppercase tracking-wider text-text-muted block mb-1">
                      Saved In Bookmarks
                    </span>
                    <span className="font-display text-3xl text-text-primary">{analytics.totalBookmarks}</span>
                  </div>

                  <div className="bg-bg-raised p-5 rounded-md border border-border">
                    <span className="text-[0.65rem] font-heading uppercase tracking-wider text-text-muted block mb-1">
                      Active Drafts
                    </span>
                    <span className="font-display text-3xl text-text-muted">{analytics.draftsCount}</span>
                  </div>

                  <div className="bg-bg-raised p-5 rounded-md border border-border">
                    <span className="text-[0.65rem] font-heading uppercase tracking-wider text-text-muted block mb-1">
                      Under Review
                    </span>
                    <span className="font-display text-3xl text-amber-300">{analytics.submittedCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeSidebarTab === 'settings' && (
              <div className="space-y-6 animate-pageIn">
                <div>
                  <h2 className="font-heading text-xs uppercase tracking-[0.2em] text-accent-gold mb-1">
                    Writer Identity Settings
                  </h2>
                  <p className="text-xs text-text-muted font-body">
                    Update your public author dossier and writing specialties.
                  </p>
                </div>

                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-[0.68rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                      Pen Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      readOnly
                      className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                      Specialty
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.specialty || 'Bengal Gothic & River Lore'}
                      className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                      Biography
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={user?.bio}
                      className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-primary resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Author profile saved.')}
                    className="px-5 py-2 bg-accent-gold text-bg-base font-heading text-xs uppercase tracking-wider font-semibold rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* RIGHT PANE: DRAFT PREVIEW (matching Screenshot 6) */}
          <aside className="bg-bg-surface border border-border rounded-lg p-6 space-y-4 sticky top-24">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-[0.65rem] font-heading uppercase tracking-[0.2em] text-accent-gold">
                Draft Preview
              </span>
              {selectedManuscript && getStatusBadge(selectedManuscript.status)}
            </div>

            {selectedManuscript ? (
              <div className="space-y-4">
                {/* Artwork Thumbnail */}
                <div className="w-full h-44 rounded overflow-hidden border border-border relative bg-bg-raised">
                  <img
                    src={selectedManuscript.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'}
                    alt={selectedManuscript.title}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent"></div>
                  <span className="absolute bottom-2 left-3 text-[0.62rem] font-heading uppercase tracking-widest text-accent-gold">
                    {selectedManuscript.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-normal text-lg text-white mb-1">
                    {selectedManuscript.title}
                  </h3>
                  <p className="text-[0.68rem] font-heading text-text-muted uppercase tracking-wider">
                    {selectedManuscript.category} · {selectedManuscript.wordCount || 2000} words · {selectedManuscript.readTime}
                  </p>
                </div>

                <div className="border-t border-border pt-3">
                  <span className="text-[0.62rem] font-heading uppercase tracking-widest text-text-muted block mb-1">
                    Excerpt
                  </span>
                  <p className="font-body text-xs text-text-secondary italic leading-relaxed line-clamp-4">
                    "{selectedManuscript.excerpt}"
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleEditStory(selectedManuscript)}
                    className="w-full py-2.5 bg-bg-raised hover:bg-bg-hover border border-accent-gold/30 hover:border-accent-gold text-accent-gold font-heading text-xs tracking-wider uppercase rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✎</span> Continue Writing
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-text-muted text-xs font-body italic">
                Select a manuscript from the ledger to preview.
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* STORY WRITER & EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-bg-base/90 backdrop-blur-md animate-pageIn">
          <div className="w-full max-w-4xl max-h-[92vh] bg-bg-surface border border-accent-gold/40 rounded-lg shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 md:px-6 border-b border-border bg-bg-raised flex items-center justify-between">
              <div>
                <span className="text-[0.62rem] font-heading uppercase tracking-widest text-accent-gold block">
                  Manuscript Workshop
                </span>
                <h3 className="font-display text-lg text-white">
                  {editingStoryId ? 'Edit Manuscript' : 'New Tale Creation'}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {isDirty && (
                  <span className="text-[0.65rem] text-amber-400 font-heading uppercase tracking-wider animate-pulse">
                    ● Unsaved Changes
                  </span>
                )}
                <button
                  onClick={() => {
                    if (isDirty && !window.confirm('Discard unsaved manuscript changes?')) return;
                    setIsEditorOpen(false);
                  }}
                  className="text-text-muted hover:text-white p-1 text-base"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Notification Messages */}
            {editorError && (
              <div className="p-3 bg-accent-blood-dim border-b border-accent-blood text-red-200 text-xs font-heading">
                {editorError}
              </div>
            )}
            {editorSuccess && (
              <div className="p-3 bg-accent-gold-dim border-b border-accent-gold text-accent-gold text-xs font-heading">
                {editorSuccess}
              </div>
            )}

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[0.65rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    value={editorTitle}
                    onChange={(e) => {
                      setEditorTitle(e.target.value);
                      setIsDirty(true);
                      if (!editorSlug) {
                        setEditorSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                      }
                    }}
                    placeholder="e.g. The Whispers of Malabar"
                    className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-gold/40"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                    Slug / URL Identifier
                  </label>
                  <input
                    type="text"
                    value={editorSlug}
                    onChange={(e) => { setEditorSlug(e.target.value); setIsDirty(true); }}
                    placeholder="e.g. whispers-of-malabar"
                    className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-gold/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[0.65rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                    Genre / Category
                  </label>
                  <select
                    value={editorCategory}
                    onChange={(e) => { setEditorCategory(e.target.value); setIsDirty(true); }}
                    className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs font-heading uppercase text-text-primary outline-none"
                  >
                    <option value="folklore">Folklore</option>
                    <option value="horror">Horror</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="psychological">Psychological</option>
                    <option value="urban">Urban</option>
                    <option value="historical">Historical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.65rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                    Region
                  </label>
                  <select
                    value={editorRegion}
                    onChange={(e) => { setEditorRegion(e.target.value); setIsDirty(true); }}
                    className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs font-heading uppercase text-text-primary outline-none"
                  >
                    <option value="Bengal">Bengal</option>
                    <option value="Delta Bengal">Delta Bengal</option>
                    <option value="Varanasi">Varanasi</option>
                    <option value="Malabar">Malabar</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Darjeeling">Darjeeling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.65rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                    Mood
                  </label>
                  <select
                    value={editorMood}
                    onChange={(e) => { setEditorMood(e.target.value); setIsDirty(true); }}
                    className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs font-heading uppercase text-text-primary outline-none"
                  >
                    <option value="Chilling">Chilling</option>
                    <option value="Supernatural">Supernatural</option>
                    <option value="Haunted">Haunted</option>
                    <option value="Dread">Dread</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                  Short Synopsis / Excerpt *
                </label>
                <textarea
                  rows={2}
                  value={editorExcerpt}
                  onChange={(e) => { setEditorExcerpt(e.target.value); setIsDirty(true); }}
                  placeholder="Atmospheric summary enticing the reader into the darkness..."
                  className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-gold/40 resize-none font-body"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[0.65rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={editorCoverImage}
                    onChange={(e) => { setEditorCoverImage(e.target.value); setIsDirty(true); }}
                    placeholder="https://..."
                    className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] font-heading uppercase tracking-wider text-text-muted mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editorTags}
                    onChange={(e) => { setEditorTags(e.target.value); setIsDirty(true); }}
                    placeholder="Bengal, Water Spirit, Gothic"
                    className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>
              </div>

              {/* Story Body Editor */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[0.65rem] font-heading uppercase tracking-wider text-text-muted">
                    Story Body (HTML Supported)
                  </label>
                  <span className="text-[0.62rem] text-text-muted font-heading">
                    {editorBody.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={editorBody}
                  onChange={(e) => { setEditorBody(e.target.value); setIsDirty(true); }}
                  placeholder="<p class='mb-6 font-light'>The night fell quickly over the river...</p>"
                  className="w-full bg-bg-raised border border-border rounded px-4 py-3 text-sm text-text-primary font-body outline-none focus:border-accent-gold/40 font-light leading-relaxed resize-y font-mono"
                />
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 md:px-6 border-t border-border bg-bg-raised flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  if (isDirty && !window.confirm('Discard unsaved manuscript changes?')) return;
                  setIsEditorOpen(false);
                }}
                className="text-text-muted hover:text-text-primary text-xs font-heading uppercase tracking-wider"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-bg-surface border border-border hover:border-accent-gold text-text-primary font-heading text-xs uppercase tracking-wider rounded transition-colors"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-accent-blood hover:bg-[#b02c2c] text-white font-heading text-xs uppercase tracking-widest font-semibold rounded shadow-lg transition-colors"
                >
                  Submit For Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default WriterDashboard;
