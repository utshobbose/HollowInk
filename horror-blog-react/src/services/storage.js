import { SEED_USERS, SEED_STORIES, SEED_BOOKMARKS, SEED_HISTORY } from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'hollowink_users_v1',
  CURRENT_USER: 'hollowink_session_v1',
  STORIES: 'hollowink_stories_v2', // Bumped to v2 to enforce dark folklore horror thumbnails
  BOOKMARKS: 'hollowink_bookmarks_v1',
  HISTORY: 'hollowink_history_v1',
  MODERATION_LOGS: 'hollowink_moderation_logs_v1',
};

// Initialize default storage data if missing & auto-migrate old thumbnails
export const initializeStorage = () => {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }

    // Story data check and auto-migration of thumbnails
    const rawV2 = localStorage.getItem(STORAGE_KEYS.STORIES);
    const rawV1 = localStorage.getItem('hollowink_stories_v1');

    if (!rawV2) {
      if (rawV1) {
        try {
          const oldStories = JSON.parse(rawV1);
          const migrated = oldStories.map((story) => {
            const seed = SEED_STORIES.find((s) => s.id === story.id);
            if (seed) {
              return { ...story, coverImage: seed.coverImage };
            }
            return story;
          });
          localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(migrated));
          localStorage.removeItem('hollowink_stories_v1');
        } catch {
          localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(SEED_STORIES));
        }
      } else {
        localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(SEED_STORIES));
      }
    } else {
      // Cleanse any legacy placeholder/controller/mountain images
      try {
        const currentStories = JSON.parse(rawV2);
        let updated = false;
        const cleansed = currentStories.map((story) => {
          const seed = SEED_STORIES.find((s) => s.id === story.id);
          if (
            seed &&
            seed.coverImage &&
            (story.coverImage !== seed.coverImage ||
              !story.coverImage ||
              story.coverImage.includes('509198397868') || // PS5 controller
              story.coverImage.includes('508739773434') || // Mountain landscape
              story.coverImage.includes('1761377857310') || // broken photo
              story.coverImage.includes('1760201588470'))
          ) {
            updated = true;
            return { ...story, coverImage: seed.coverImage };
          }
          return story;
        });
        if (updated) {
          localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(cleansed));
        }
      } catch (e) {
        console.error('Error migrating story images:', e);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(SEED_BOOKMARKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(SEED_HISTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MODERATION_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.MODERATION_LOGS, JSON.stringify([]));
    }
    // Set default demo session as reader if none exists
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
    }
  } catch (e) {
    console.error('Storage initialization error:', e);
  }
};

export const getFromStorage = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('hollowink_storage_update', { detail: { key, data } }));
    return true;
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
    return false;
  }
};

export { STORAGE_KEYS };

