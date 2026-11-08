import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storage';
import { storyService } from './storyService';

export const moderationService = {
  getModerationLogs() {
    return getFromStorage(STORAGE_KEYS.MODERATION_LOGS, []);
  },

  logAction(storyId, adminUser, action, notes = '') {
    const logs = this.getModerationLogs();
    logs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      storyId: String(storyId),
      adminId: adminUser?.id || 'admin',
      adminName: adminUser?.name || 'Sanctum Archivist',
      action, // 'approve' | 'reject' | 'revision_requested'
      notes,
      timestamp: new Date().toISOString()
    });
    saveToStorage(STORAGE_KEYS.MODERATION_LOGS, logs);
  },

  getPendingQueue() {
    const stories = storyService.getAllStories();
    return stories.filter((s) => s.status === 'submitted');
  },

  approveStory(storyId, adminUser) {
    if (!adminUser || adminUser.role !== 'admin') {
      throw new Error('Administrative clearance required to approve manuscripts.');
    }
    const updated = storyService.updateStory(
      storyId,
      {
        status: 'published',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        publishedAt: new Date().toISOString()
      },
      adminUser
    );
    this.logAction(storyId, adminUser, 'approve', 'Manuscript approved and entered into the public archive.');
    return updated;
  },

  rejectStory(storyId, adminUser, reason = 'Did not meet dark folklore atmospheric standards.') {
    if (!adminUser || adminUser.role !== 'admin') {
      throw new Error('Administrative clearance required to reject manuscripts.');
    }
    const updated = storyService.updateStory(
      storyId,
      {
        status: 'draft',
        moderationNotes: reason,
        rejectedAt: new Date().toISOString()
      },
      adminUser
    );
    this.logAction(storyId, adminUser, 'reject', reason);
    return updated;
  },

  requestRevision(storyId, adminUser, notes = 'Needs thematic adjustments.') {
    if (!adminUser || adminUser.role !== 'admin') {
      throw new Error('Administrative clearance required to request revisions.');
    }
    const updated = storyService.updateStory(
      storyId,
      {
        status: 'revision_requested',
        moderationNotes: notes,
        revisionRequestedAt: new Date().toISOString()
      },
      adminUser
    );
    this.logAction(storyId, adminUser, 'revision_requested', notes);
    return updated;
  },

  getArchiveLedger(filters = {}) {
    const { status, region, search } = filters;
    let stories = storyService.getAllStories();

    if (status && status !== 'all') {
      stories = stories.filter((s) => s.status === status);
    }
    if (region && region !== 'all') {
      stories = stories.filter((s) => s.region?.toLowerCase() === region.toLowerCase());
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      stories = stories.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.authorName?.toLowerCase().includes(q) ||
          s.region?.toLowerCase().includes(q)
      );
    }
    return stories;
  },

  exportLedgerCsv() {
    const stories = storyService.getAllStories();
    const headers = ['ID', 'Title', 'Author', 'Category', 'Region', 'Status', 'Read Time', 'Word Count', 'Reactions', 'Views', 'Date'];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = stories.map((s) => [
      escapeCsv(s.id),
      escapeCsv(s.title),
      escapeCsv(s.authorName),
      escapeCsv(s.category),
      escapeCsv(s.region || 'Unknown'),
      escapeCsv(s.status),
      escapeCsv(s.readTime),
      escapeCsv(s.wordCount || 0),
      escapeCsv(s.reactionsCount || 0),
      escapeCsv(s.viewsCount || 0),
      escapeCsv(s.date)
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hollowink_archive_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  }
};

