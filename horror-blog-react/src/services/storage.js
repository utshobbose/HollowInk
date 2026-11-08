import { SEED_USERS, SEED_STORIES, SEED_BOOKMARKS, SEED_HISTORY } from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'hollowink_users_v1',
  CURRENT_USER: 'hollowink_session_v1',
  STORIES: 'hollowink_stories_v1',
  BOOKMARKS: 'hollowink_bookmarks_v1',
  HISTORY: 'hollowink_history_v1',
  MODERATION_LOGS: 'hollowink_moderation_logs_v1',
};

// Initialize default storage data if missing
export const initializeStorage = () => {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(SEED_STORIES));
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

