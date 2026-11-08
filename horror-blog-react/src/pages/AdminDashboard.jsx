import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moderationService } from '../services/moderationService';
import { analyticsService } from '../services/analyticsService';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'moderation' | 'ledger' | 'analytics'
  const [metrics, setMetrics] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [ledgerStories, setLedgerStories] = useState([]);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState('all');
  const [ledgerPageLimit, setLedgerPageLimit] = useState(6);

  // Moderation Review Modal
  const [inspectingStory, setInspectingStory] = useState(null);
  const [moderationNote, setModerationNote] = useState('');
  const [moderationActionMsg, setModerationActionMsg] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    const handleStorage = () => loadAllData();
    window.addEventListener('hollowink_storage_update', handleStorage);
    return () => window.removeEventListener('hollowink_storage_update', handleStorage);
  }, []);

  const loadAllData = () => {
    setMetrics(analyticsService.getAdminMetrics());
    setSystemHealth(analyticsService.getSystemHealth());
    setPendingQueue(moderationService.getPendingQueue());
    setLedgerStories(moderationService.getArchiveLedger());
  };

  const handleExportCsv = () => {
    moderationService.exportLedgerCsv();
  };

  const handleApprove = (storyId) => {
    try {
      moderationService.approveStory(storyId, user);
      setModerationActionMsg('Manuscript approved and released into public archive.');
      setInspectingStory(null);
      loadAllData();
      setTimeout(() => setModerationActionMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = (storyId) => {
    const reason = prompt('Specify rejection rationale:', 'Does not conform to archival horror benchmarks.');
    if (reason === null) return;
    try {
      moderationService.rejectStory(storyId, user, reason);
      setModerationActionMsg('Manuscript rejected and returned to draft state.');
      setInspectingStory(null);
      loadAllData();
      setTimeout(() => setModerationActionMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRequestRevision = (storyId) => {
    if (!moderationNote.trim()) {
      alert('Please provide notes detailing required revisions.');
      return;
    }
    try {
      moderationService.requestRevision(storyId, user, moderationNote);
      setModerationActionMsg('Revision requested from author.');
      setInspectingStory(null);
      setModerationNote('');
      loadAllData();
      setTimeout(() => setModerationActionMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered Ledger
  const filteredLedger = ledgerStories.filter((s) => {
    const matchesSearch = !ledgerSearch.trim() ||
      s.title?.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      s.authorName?.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      s.region?.toLowerCase().includes(ledgerSearch.toLowerCase());
    const matchesStatus = ledgerStatusFilter === 'all' || s.status === ledgerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const visibleLedger = filteredLedger.slice(0, ledgerPageLimit);

  return (
    <div className="min-h-screen pt-24 bg-bg-base text-text-primary animate-pageIn flex flex-col justify-between">
      <div className="max-w-[1360px] w-full mx-auto px-4 md:px-8 py-6">
        {/* Top Header Banner (matching Screenshot 7) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-white text-shadow-glow">
              Sanctum Sanctorum
            </h1>
            <p className="font-body text-xs md:text-sm text-text-secondary mt-1">
              Administrative Dashboard. Oversee the archives, moderate submissions, and analyze ledger metrics.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-5 py-2.5 border border-accent-gold/40 hover:border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-bg-base font-heading text-xs tracking-widest uppercase rounded transition-all duration-300 shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            EXPORT LEDGER
          </button>
        </div>

        {moderationActionMsg && (
          <div className="mb-6 p-3 bg-accent-gold-dim border border-accent-gold text-accent-gold rounded text-xs font-heading">
            {moderationActionMsg}
          </div>
        )}

        {/* 2-Column Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
          {/* LEFT SIDEBAR */}
          <aside className="bg-bg-surface border border-border rounded-lg p-5 space-y-6">
            {/* SYSTEM STATUS CARD (Live health check) */}
            <div className="p-3.5 rounded bg-bg-raised border border-border/80">
              <span className="block text-[0.62rem] font-heading uppercase tracking-widest text-text-muted mb-1.5">
                System Status
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-heading text-text-primary tracking-wide">
                  {systemHealth?.label || 'Archive Syncing'}
                </span>
              </div>
              <div className="mt-2 text-[0.62rem] text-text-muted font-body">
                Latency: {systemHealth?.latencyMs || 14}ms · Storage: {systemHealth?.storageUsedKb || '12'} KB
              </div>
            </div>

            {/* Admin Navigation */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-heading uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-accent-blood text-white font-semibold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('moderation')}
                className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-heading uppercase tracking-wider flex items-center justify-between transition-colors ${
                  activeTab === 'moderation'
                    ? 'bg-accent-blood text-white font-semibold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                <span className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Moderation
                </span>
                {pendingQueue.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] bg-accent-gold text-bg-base font-bold">
                    {pendingQueue.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('ledger')}
                className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-heading uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === 'ledger'
                    ? 'bg-accent-blood text-white font-semibold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Archive Ledger
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-heading uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-accent-blood text-white font-semibold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Analytics
              </button>
            </nav>

            <div className="pt-4 border-t border-border">
              <span className="text-[0.62rem] font-heading uppercase tracking-widest text-text-muted block mb-1">
                Archivist Signed In
              </span>
              <p className="text-xs font-heading text-text-primary truncate">{user?.name}</p>
              <p className="text-[0.65rem] text-accent-blood font-heading tracking-wider uppercase">
                Grand Master Clearance
              </p>
            </div>
          </aside>

          {/* MAIN PANELS */}
          <main className="space-y-8">
            {/* TAB: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Key Metrics Cards (matching Screenshot 7) */}
                <div>
                  <h3 className="text-xs font-heading uppercase tracking-[0.2em] text-accent-gold mb-3">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: TOTAL ARCHIVES */}
                    <div className="p-5 rounded-lg bg-bg-surface border border-border relative overflow-hidden group">
                      <span className="block text-[0.65rem] font-heading uppercase tracking-widest text-text-muted mb-2">
                        Total Archives
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-3xl text-white font-normal">
                          {metrics?.totalArchives || 0}
                        </span>
                        <svg className="w-8 h-8 text-border group-hover:text-accent-gold/20 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <span className="text-[0.68rem] text-emerald-400 font-heading tracking-wider mt-2 block">
                        {metrics?.cycleGrowth.archivesDelta}
                      </span>
                    </div>

                    {/* Card 2: ACTIVE SCRIBES */}
                    <div className="p-5 rounded-lg bg-bg-surface border border-border relative overflow-hidden group">
                      <span className="block text-[0.65rem] font-heading uppercase tracking-widest text-text-muted mb-2">
                        Active Scribes
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-3xl text-white font-normal">
                          {metrics?.activeScribes || 0}
                        </span>
                        <svg className="w-8 h-8 text-border group-hover:text-accent-gold/20 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="text-[0.68rem] text-text-muted font-heading tracking-wider mt-2 block">
                        {metrics?.cycleGrowth.scribesDelta}
                      </span>
                    </div>

                    {/* Card 3: PENDING REVIEW */}
                    <div className="p-5 rounded-lg bg-bg-surface border border-accent-blood/30 relative overflow-hidden group">
                      <span className="block text-[0.65rem] font-heading uppercase tracking-widest text-text-muted mb-2">
                        Pending Review
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-3xl text-red-300 font-normal">
                          {metrics?.pendingReview || 0}
                        </span>
                        <svg className="w-8 h-8 text-accent-blood/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <button
                        onClick={() => setActiveTab('moderation')}
                        className="text-[0.68rem] text-accent-blood hover:text-red-300 font-heading tracking-wider mt-2 block uppercase transition-colors"
                      >
                        Moderate Queue →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Urgent Moderation Section (matching Screenshot 7) */}
                <div className="bg-bg-surface border border-border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-accent-gold">
                      Urgent Moderation
                    </h3>
                    {pendingQueue.length > 0 && (
                      <button
                        onClick={() => setActiveTab('moderation')}
                        className="text-[0.68rem] font-heading uppercase tracking-wider text-text-muted hover:text-accent-gold"
                      >
                        VIEW ALL ({pendingQueue.length})
                      </button>
                    )}
                  </div>

                  {pendingQueue.length === 0 ? (
                    <div className="py-8 text-center text-text-muted font-body text-xs italic">
                      The moderation altar is clear. No manuscripts currently await judgment.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingQueue.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-md bg-bg-raised border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <h4 className="font-heading text-sm text-text-primary mb-1">
                              {item.title}
                            </h4>
                            <p className="text-[0.68rem] text-text-muted font-heading tracking-wider">
                              Submitted by {item.authorName} · {item.region || 'Bengal'} · {item.wordCount || 2000} words
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              onClick={() => handleReject(item.id)}
                              className="px-3 py-1.5 border border-border hover:border-accent-blood text-text-muted hover:text-accent-blood font-heading text-[0.65rem] tracking-wider uppercase rounded transition-colors"
                            >
                              REJECT
                            </button>
                            <button
                              onClick={() => setInspectingStory(item)}
                              className="px-4 py-1.5 bg-bg-surface hover:bg-bg-hover border border-accent-gold/40 text-accent-gold font-heading text-[0.65rem] tracking-wider uppercase rounded transition-colors"
                            >
                              REVIEW
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Archive Ledger Preview (matching Screenshot 7) */}
                <div className="bg-bg-surface border border-border rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-accent-gold">
                      Archive Ledger
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        value={ledgerSearch}
                        onChange={(e) => setLedgerSearch(e.target.value)}
                        placeholder="Search archives..."
                        className="bg-bg-raised border border-border rounded px-3 py-1.5 text-xs text-text-primary outline-none focus:border-accent-gold/40 pr-8"
                      />
                      <svg className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border text-text-muted font-heading uppercase tracking-wider text-[0.62rem]">
                          <th className="pb-3 font-semibold">Title</th>
                          <th className="pb-3 font-semibold">Region</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-body">
                        {visibleLedger.map((s) => (
                          <tr key={s.id} className="hover:bg-bg-raised/50 transition-colors">
                            <td className="py-3 pr-3">
                              <span className="font-heading text-text-primary block">{s.title}</span>
                              <span className="text-[0.65rem] text-text-muted font-heading">By {s.authorName}</span>
                            </td>
                            <td className="py-3 pr-3 text-text-secondary whitespace-nowrap">{s.region || 'Unknown'}</td>
                            <td className="py-3 pr-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[0.6rem] font-heading uppercase tracking-wider ${
                                s.status === 'published'
                                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                                  : s.status === 'submitted'
                                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/20'
                                  : 'bg-bg-raised text-text-muted border border-border'
                              }`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3 text-right whitespace-nowrap">
                              <Link
                                to={`/article/${s.id}`}
                                className="text-accent-gold hover:underline font-heading text-[0.65rem] uppercase tracking-wider"
                              >
                                View ↗
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {ledgerPageLimit < filteredLedger.length && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setLedgerPageLimit((prev) => prev + 6)}
                        className="text-[0.65rem] font-heading uppercase tracking-widest text-text-muted hover:text-accent-gold"
                      >
                        LOAD MORE ENTRIES
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: MODERATION QUEUE */}
            {activeTab === 'moderation' && (
              <div className="bg-bg-surface border border-border rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-accent-gold mb-1">
                    Manuscript Moderation Queue
                  </h3>
                  <p className="text-xs text-text-muted font-body">
                    Submissions awaiting clearance for entry into the public archive.
                  </p>
                </div>

                {pendingQueue.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-border rounded-lg">
                    <p className="text-sm font-heading text-text-secondary mb-1">No manuscripts pending judgment.</p>
                    <p className="text-xs font-body italic text-text-muted">All submissions have been settled.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingQueue.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-lg bg-bg-raised border border-border hover:border-accent-gold/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[0.6rem] font-heading uppercase tracking-wider px-2 py-0.5 rounded bg-bg-surface text-accent-gold border border-border/40">
                              {item.category}
                            </span>
                            {item.region && (
                              <span className="text-[0.6rem] font-heading uppercase tracking-wider text-text-muted">
                                {item.region}
                              </span>
                            )}
                            <span className="text-[0.65rem] text-text-muted ml-auto font-heading">
                              Submitted {new Date(item.submittedAt || item.lastModified).toLocaleDateString()}
                            </span>
                          </div>

                          <h4 className="font-heading text-base text-white mb-1">{item.title}</h4>
                          <p className="text-xs text-text-secondary font-body line-clamp-2">{item.excerpt}</p>
                          <p className="text-[0.68rem] text-text-muted font-heading mt-2">
                            Author: <span className="text-text-primary">{item.authorName}</span> · {item.wordCount || 2000} words
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 self-end md:self-center">
                          <button
                            onClick={() => handleReject(item.id)}
                            className="px-3.5 py-2 border border-border hover:border-accent-blood text-text-muted hover:text-accent-blood font-heading text-xs uppercase tracking-wider rounded transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setInspectingStory(item)}
                            className="px-5 py-2 bg-accent-gold hover:bg-[#d6b75c] text-bg-base font-heading text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                          >
                            Inspect & Moderate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ARCHIVE LEDGER */}
            {activeTab === 'ledger' && (
              <div className="bg-bg-surface border border-border rounded-lg p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-accent-gold mb-1">
                      Full Archive Ledger ({filteredLedger.length})
                    </h3>
                    <p className="text-xs text-text-muted font-body">Master catalogue of all stories across all states.</p>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={ledgerStatusFilter}
                      onChange={(e) => setLedgerStatusFilter(e.target.value)}
                      className="bg-bg-raised border border-border rounded px-3 py-1.5 text-xs font-heading uppercase text-text-primary outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="published">Published</option>
                      <option value="submitted">Submitted</option>
                      <option value="draft">Drafts</option>
                    </select>

                    <button
                      onClick={handleExportCsv}
                      className="px-3 py-1.5 bg-bg-raised border border-accent-gold/40 text-accent-gold hover:bg-accent-gold hover:text-bg-base text-xs font-heading uppercase rounded tracking-wider"
                    >
                      CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-text-muted font-heading uppercase tracking-wider text-[0.62rem]">
                        <th className="pb-3 font-semibold">Title</th>
                        <th className="pb-3 font-semibold">Author</th>
                        <th className="pb-3 font-semibold">Category/Region</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-body">
                      {filteredLedger.map((s) => (
                        <tr key={s.id} className="hover:bg-bg-raised/50 transition-colors">
                          <td className="py-3 pr-3 font-heading text-text-primary">{s.title}</td>
                          <td className="py-3 pr-3 text-text-secondary">{s.authorName}</td>
                          <td className="py-3 pr-3 text-text-muted">{s.category} · {s.region || 'Bengal'}</td>
                          <td className="py-3 pr-3">
                            <span className={`px-2 py-0.5 rounded text-[0.6rem] font-heading uppercase tracking-wider ${
                              s.status === 'published' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-bg-raised text-text-muted'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            {s.status === 'published' && (
                              <Link to={`/article/${s.id}`} className="text-accent-gold hover:underline">
                                Read
                              </Link>
                            )}
                            {s.status === 'submitted' && (
                              <button onClick={() => setInspectingStory(s)} className="text-amber-300 hover:underline">
                                Moderate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: ANALYTICS */}
            {activeTab === 'analytics' && metrics && (
              <div className="bg-bg-surface border border-border rounded-lg p-6 space-y-8">
                <div>
                  <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-accent-gold mb-1">
                    Administrative Ledger Analytics
                  </h3>
                  <p className="text-xs text-text-muted font-body">
                    Platform-wide reading, submission, and scribe engagement metrics.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded bg-bg-raised border border-border">
                    <span className="text-[0.62rem] font-heading uppercase text-text-muted block mb-1">Total Stories</span>
                    <span className="font-display text-2xl text-white">{ledgerStories.length}</span>
                  </div>
                  <div className="p-4 rounded bg-bg-raised border border-border">
                    <span className="text-[0.62rem] font-heading uppercase text-text-muted block mb-1">Active Readers</span>
                    <span className="font-display text-2xl text-accent-gold">{metrics.activeReaders}</span>
                  </div>
                  <div className="p-4 rounded bg-bg-raised border border-border">
                    <span className="text-[0.62rem] font-heading uppercase text-text-muted block mb-1">Total Views</span>
                    <span className="font-display text-2xl text-accent-blood">{metrics.totalViews}</span>
                  </div>
                  <div className="p-4 rounded bg-bg-raised border border-border">
                    <span className="text-[0.62rem] font-heading uppercase text-text-muted block mb-1">Reactions</span>
                    <span className="font-display text-2xl text-white">{metrics.totalReactions}</span>
                  </div>
                </div>

                {/* Storage Health */}
                <div className="p-5 rounded bg-bg-raised border border-border/80">
                  <h4 className="font-heading text-xs uppercase tracking-wider text-accent-gold mb-3">
                    System Architecture & Storage
                  </h4>
                  <div className="space-y-2 text-xs font-body text-text-secondary">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span>Persistence Engine</span>
                      <span className="text-emerald-400 font-heading">LocalStorage / Synced Relational Store</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span>Indexed Records</span>
                      <span className="text-text-primary font-heading">{systemHealth?.indexedRecords}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span>Storage Quota Allocated</span>
                      <span className="text-text-primary font-heading">{systemHealth?.storageUsedKb} KB</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Last Heartbeat Check</span>
                      <span className="text-text-muted font-heading">{new Date(systemHealth?.lastHeartbeat).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MANUSCRIPT INSPECTION & MODERATION MODAL */}
      {inspectingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-bg-base/90 backdrop-blur-md animate-pageIn">
          <div className="w-full max-w-3xl max-h-[90vh] bg-bg-surface border border-accent-gold/40 rounded-lg shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-border bg-bg-raised flex items-center justify-between">
              <div>
                <span className="text-[0.62rem] font-heading uppercase tracking-widest text-accent-blood block">
                  Sanctum Moderation Altar
                </span>
                <h3 className="font-display text-lg text-white">
                  Inspect Manuscript: {inspectingStory.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectingStory(null)}
                className="text-text-muted hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded bg-bg-raised text-xs font-heading">
                <div>
                  <span className="text-[0.62rem] text-text-muted block uppercase">Author</span>
                  <span className="text-text-primary">{inspectingStory.authorName}</span>
                </div>
                <div>
                  <span className="text-[0.62rem] text-text-muted block uppercase">Genre</span>
                  <span className="text-accent-gold">{inspectingStory.category}</span>
                </div>
                <div>
                  <span className="text-[0.62rem] text-text-muted block uppercase">Region</span>
                  <span className="text-text-primary">{inspectingStory.region || 'Bengal'}</span>
                </div>
                <div>
                  <span className="text-[0.62rem] text-text-muted block uppercase">Word Count</span>
                  <span className="text-text-primary">{inspectingStory.wordCount || 2000}</span>
                </div>
              </div>

              <div>
                <span className="text-[0.65rem] font-heading uppercase tracking-widest text-text-muted block mb-1">
                  Submitted Excerpt
                </span>
                <p className="p-4 rounded bg-bg-raised text-sm text-text-secondary font-body italic leading-relaxed">
                  "{inspectingStory.excerpt}"
                </p>
              </div>

              <div>
                <span className="text-[0.65rem] font-heading uppercase tracking-widest text-text-muted block mb-1">
                  Full Manuscript Body
                </span>
                <div
                  className="p-5 rounded bg-bg-raised border border-border text-sm text-text-primary font-body font-light leading-relaxed max-h-64 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: inspectingStory.body }}
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-heading uppercase tracking-widest text-text-muted mb-1.5">
                  Moderator Notes (Required for Revision Requests)
                </label>
                <textarea
                  rows={2}
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  placeholder="e.g. Please deepen the atmosphere of the second scene..."
                  className="w-full bg-bg-raised border border-border rounded px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-gold/40 resize-none font-body"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-border bg-bg-raised flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setInspectingStory(null)}
                className="text-text-muted hover:text-text-primary text-xs font-heading uppercase tracking-wider"
              >
                Close
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleReject(inspectingStory.id)}
                  className="px-4 py-2 border border-accent-blood text-accent-blood hover:bg-accent-blood hover:text-white text-xs font-heading uppercase tracking-wider rounded transition-colors"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestRevision(inspectingStory.id)}
                  className="px-4 py-2 border border-border text-amber-300 hover:border-amber-400 text-xs font-heading uppercase tracking-wider rounded transition-colors"
                >
                  Request Revision
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(inspectingStory.id)}
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-heading text-xs uppercase tracking-widest font-semibold rounded shadow-lg transition-colors"
                >
                  Approve & Publish
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

export default AdminDashboard;
