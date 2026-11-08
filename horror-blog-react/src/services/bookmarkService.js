import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storage';
import { storyService } from './storyService';

export const bookmarkService = {
  getAllBookmarks() {
    return getFromStorage(STORAGE_KEYS.BOOKMARKS, []);
  },

  getUserBookmarks(userId) {
    if (!userId) return [];
    return this.getAllBookmarks().filter((b) => b.userId === userId);
  },

  isBookmarked(userId, storyId, listType = null) {
    if (!userId) return false;
    const bookmarks = this.getUserBookmarks(userId);
    if (listType) {
      return bookmarks.some((b) => String(b.storyId) === String(storyId) && b.listType === listType);
    }
    return bookmarks.some((b) => String(b.storyId) === String(storyId));
  },

  toggleBookmark(userId, storyId, listType = 'to_read') {
    if (!userId) throw new Error('Please sign in to save stories to your archive.');
    const bookmarks = this.getAllBookmarks();
    const existingIndex = bookmarks.findIndex(
      (b) => b.userId === userId && String(b.storyId) === String(storyId) && b.listType === listType
    );

    if (existingIndex !== -1) {
      // Remove
      bookmarks.splice(existingIndex, 1);
      saveToStorage(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return { action: 'removed', listType };
    } else {
      // Add
      bookmarks.push({
        userId,
        storyId: String(storyId),
        listType,
        addedAt: new Date().toISOString()
      });
      saveToStorage(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return { action: 'added', listType };
    }
  },

  removeBookmark(userId, storyId, listType = null) {
    if (!userId) return;
    const bookmarks = this.getAllBookmarks();
    const filtered = bookmarks.filter((b) => {
      if (b.userId !== userId) return true;
      if (String(b.storyId) !== String(storyId)) return true;
      if (listType && b.listType !== listType) return true;
      return false;
    });
    saveToStorage(STORAGE_KEYS.BOOKMARKS, filtered);
  },

  // Returns actual story objects mapped with bookmark metadata
  getUserSavedStories(userId, listType = 'to_read') {
    const userBookmarks = this.getUserBookmarks(userId).filter((b) => b.listType === listType);
    const stories = storyService.getAllStories();

    return userBookmarks
      .map((bm) => {
        const story = stories.find((s) => String(s.id) === String(bm.storyId));
        return story ? { ...story, bookmarkMeta: bm } : null;
      })
      .filter(Boolean);
  }
};

