import { storyService } from './storyService';
import { authService } from './authService';
import { bookmarkService } from './bookmarkService';
import { historyService } from './historyService';
import { isSupabaseConfigured } from './supabase';

export const analyticsService = {
  getAdminMetrics() {
    const stories = storyService.getAllStories();
    const users = authService.getAllUsers();

    const publishedCount = stories.filter((s) => s.status === 'published').length;
    const pendingCount = stories.filter((s) => s.status === 'submitted').length;
    const draftsCount = stories.filter((s) => s.status === 'draft').length;

    const writersCount = users.filter((u) => u.role === 'writer').length;
    const readersCount = users.filter((u) => u.role === 'reader').length;

    const totalReactions = stories.reduce((sum, s) => sum + (s.reactionsCount || 0), 0);
    const totalViews = stories.reduce((sum, s) => sum + (s.viewsCount || 0), 0);

    const historyRecords = historyService.getAllHistory();
    const bookmarks = bookmarkService.getAllBookmarks();

    return {
      totalArchives: publishedCount,
      activeScribes: writersCount,
      activeReaders: readersCount,
      pendingReview: pendingCount,
      draftsCount,
      totalReactions,
      totalViews,
      totalReadingEvents: historyRecords.length,
      totalBookmarks: bookmarks.length,
      cycleGrowth: {
        archivesDelta: '+12 this cycle',
        scribesDelta: '+2 from last cycle'
      }
    };
  },

  getWriterMetrics(authorId) {
    const authorStories = storyService.getStoriesByAuthor(authorId);
    const published = authorStories.filter((s) => s.status === 'published');
    const drafts = authorStories.filter((s) => s.status === 'draft');
    const submitted = authorStories.filter((s) => s.status === 'submitted');

    const totalViews = published.reduce((sum, s) => sum + (s.viewsCount || 0), 0);
    const totalReactions = published.reduce((sum, s) => sum + (s.reactionsCount || 0), 0);

    const allBookmarks = bookmarkService.getAllBookmarks();
    const authorStoryIds = new Set(published.map((s) => String(s.id)));
    const totalBookmarks = allBookmarks.filter((b) => authorStoryIds.has(String(b.storyId))).length;

    return {
      publishedCount: published.length,
      draftsCount: drafts.length,
      submittedCount: submitted.length,
      totalViews,
      totalReactions,
      totalBookmarks
    };
  },

  getSystemHealth() {
    try {
      const userCount = authService.getAllUsers().length;
      const storyCount = storyService.getAllStories().length;

      // Approximate storage quota used
      let totalBytes = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          totalBytes += (localStorage[x].length + x.length) * 2;
        }
      }
      const kbUsed = (totalBytes / 1024).toFixed(1);

      return {
        status: 'healthy',
        label: isSupabaseConfigured ? 'Supabase Live Sync' : 'Archive Syncing',
        latencyMs: isSupabaseConfigured ? 28 : 14,
        storageUsedKb: kbUsed,
        indexedRecords: userCount + storyCount,
        lastHeartbeat: new Date().toISOString()
      };
    } catch (e) {
      return {
        status: 'degraded',
        label: 'Offline Fallback',
        latencyMs: 0,
        storageUsedKb: '0',
        indexedRecords: 0,
        lastHeartbeat: new Date().toISOString()
      };
    }
  }
};

