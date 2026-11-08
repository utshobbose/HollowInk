import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storage';
import { storyService } from './storyService';

export const historyService = {
  getAllHistory() {
    return getFromStorage(STORAGE_KEYS.HISTORY, []);
  },

  getUserHistory(userId) {
    if (!userId) return [];
    return this.getAllHistory()
      .filter((h) => h.userId === userId)
      .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));
  },

  recordReadingProgress(userId, storyId, progressPercent = 0) {
    if (!userId || !storyId) return;

    const history = this.getAllHistory();
    const index = history.findIndex(
      (h) => h.userId === userId && String(h.storyId) === String(storyId)
    );

    const validProgress = Math.min(100, Math.max(0, Math.round(progressPercent)));

    if (index !== -1) {
      // Keep higher progress unless re-read from start
      const existing = history[index];
      const newProgress = Math.max(existing.progressPercent || 0, validProgress);
      history[index] = {
        ...existing,
        progressPercent: newProgress,
        lastReadAt: new Date().toISOString()
      };
    } else {
      history.push({
        userId,
        storyId: String(storyId),
        progressPercent: validProgress,
        lastReadAt: new Date().toISOString()
      });
    }

    saveToStorage(STORAGE_KEYS.HISTORY, history);
  },

  getUserHistoryStories(userId) {
    const userRecords = this.getUserHistory(userId);
    const stories = storyService.getAllStories();

    return userRecords
      .map((rec) => {
        const story = stories.find((s) => String(s.id) === String(rec.storyId));
        return story ? { ...story, historyMeta: rec } : null;
      })
      .filter(Boolean);
  },

  clearUserHistory(userId) {
    if (!userId) return;
    const history = this.getAllHistory();
    const filtered = history.filter((h) => h.userId !== userId);
    saveToStorage(STORAGE_KEYS.HISTORY, filtered);
  }
};

