import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storage';
import { supabase, isSupabaseConfigured } from './supabase';

export const storyService = {
  getAllStories() {
    return getFromStorage(STORAGE_KEYS.STORIES, []);
  },

  getPublishedStories(filters = {}) {
    // If Supabase is connected in the background, we can sync or fetch from Supabase
    const stories = this.getAllStories().filter((s) => s.status === 'published');
    const { genre, region, mood, search, sort = 'newest' } = filters;

    let filtered = stories;

    if (genre && genre !== 'all') {
      filtered = filtered.filter(
        (s) => s.category?.toLowerCase() === genre.toLowerCase()
      );
    }

    if (region && region !== 'all') {
      filtered = filtered.filter(
        (s) => s.region?.toLowerCase() === region.toLowerCase()
      );
    }

    if (mood && mood !== 'all') {
      filtered = filtered.filter(
        (s) => s.mood?.toLowerCase() === mood.toLowerCase()
      );
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((s) => {
        return (
          s.title?.toLowerCase().includes(q) ||
          s.excerpt?.toLowerCase().includes(q) ||
          s.authorName?.toLowerCase().includes(q) ||
          (s.tags && s.tags.some((t) => t.toLowerCase().includes(q))) ||
          (s.body && s.body.toLowerCase().includes(q))
        );
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sort === 'oldest') {
        return new Date(a.date || a.lastModified) - new Date(b.date || b.lastModified);
      }
      if (sort === 'popular') {
        return (b.reactionsCount || 0) - (a.reactionsCount || 0);
      }
      if (sort === 'readingTime') {
        const timeA = parseInt(a.readTime) || 0;
        const timeB = parseInt(b.readTime) || 0;
        return timeA - timeB;
      }
      // default: newest
      return new Date(b.date || b.lastModified) - new Date(a.date || a.lastModified);
    });

    return filtered;
  },

  getFeaturedStory() {
    const published = this.getAllStories().filter((s) => s.status === 'published');
    const featured = published.find((s) => s.featured);
    return featured || published[0] || null;
  },

  getStoryById(id) {
    const stories = this.getAllStories();
    return stories.find((s) => String(s.id) === String(id) || s.slug === String(id)) || null;
  },

  getStoryBySlug(slug) {
    const stories = this.getAllStories();
    return stories.find((s) => s.slug === slug || String(s.id) === String(slug)) || null;
  },

  getStoriesByAuthor(authorId) {
    const stories = this.getAllStories();
    return stories.filter((s) => s.authorId === authorId);
  },

  getPublishedStoriesByAuthor(authorId) {
    const stories = this.getAllStories();
    return stories.filter((s) => s.authorId === authorId && s.status === 'published');
  },

  createStory(storyData, user) {
    if (!user || (user.role !== 'writer' && user.role !== 'admin')) {
      throw new Error('Only authorized writers can draft manuscripts.');
    }

    const stories = this.getAllStories();
    const title = storyData.title?.trim() || 'Untitled Manuscript';
    const slug = storyData.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const wordCount = storyData.body ? storyData.body.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 500;
    const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;

    const newStory = {
      id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      slug,
      title,
      authorId: user.id,
      authorName: user.name || 'Anonymous Scribe',
      category: storyData.category || 'folklore',
      region: storyData.region || 'Bengal',
      mood: storyData.mood || 'Chilling',
      readTime,
      wordCount,
      excerpt: storyData.excerpt || 'A fragment from the dark folklore archives...',
      body: storyData.body || '<p>Manuscript in progress...</p>',
      contentWarning: storyData.contentWarning || '',
      coverImage: storyData.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      tags: storyData.tags || ['Horror', 'Folklore'],
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      lastModified: new Date().toISOString(),
      status: storyData.status || 'draft',
      featured: false,
      viewsCount: 0,
      reactionsCount: 0
    };

    stories.unshift(newStory);
    saveToStorage(STORAGE_KEYS.STORIES, stories);

    // If Supabase is connected, mirror insert
    if (isSupabaseConfigured && supabase) {
      supabase.from('stories').insert([newStory]).then(({ error }) => {
        if (error) console.error('Supabase mirror insert error:', error);
      });
    }

    return newStory;
  },

  updateStory(id, updates, user) {
    const stories = this.getAllStories();
    const index = stories.findIndex((s) => String(s.id) === String(id));

    if (index === -1) {
      throw new Error('Manuscript not found in the archives.');
    }

    const story = stories[index];
    if (user.role !== 'admin' && story.authorId !== user.id) {
      throw new Error('Unauthorized to modify this manuscript.');
    }

    const wordCount = updates.body !== undefined
      ? updates.body.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
      : story.wordCount;
    const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;

    const updated = {
      ...story,
      ...updates,
      wordCount,
      readTime,
      lastModified: new Date().toISOString()
    };

    stories[index] = updated;
    saveToStorage(STORAGE_KEYS.STORIES, stories);

    // If Supabase is connected, mirror update
    if (isSupabaseConfigured && supabase) {
      supabase.from('stories').update(updated).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase mirror update error:', error);
      });
    }

    return updated;
  },

  submitStory(id, user) {
    return this.updateStory(id, { status: 'submitted', submittedAt: new Date().toISOString() }, user);
  },

  deleteStory(id, user) {
    const stories = this.getAllStories();
    const story = stories.find((s) => String(s.id) === String(id));

    if (!story) return true;
    if (user.role !== 'admin' && story.authorId !== user.id) {
      throw new Error('Unauthorized to remove this manuscript.');
    }

    const filtered = stories.filter((s) => String(s.id) !== String(id));
    saveToStorage(STORAGE_KEYS.STORIES, filtered);

    // If Supabase is connected, mirror delete
    if (isSupabaseConfigured && supabase) {
      supabase.from('stories').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase mirror delete error:', error);
      });
    }

    return true;
  },

  recordView(id) {
    const stories = this.getAllStories();
    const index = stories.findIndex((s) => String(s.id) === String(id));
    if (index !== -1) {
      stories[index].viewsCount = (stories[index].viewsCount || 0) + 1;
      saveToStorage(STORAGE_KEYS.STORIES, stories);
      if (isSupabaseConfigured && supabase) {
        supabase.from('stories').update({ views_count: stories[index].viewsCount }).eq('id', id);
      }
    }
  },

  toggleReaction(id) {
    const stories = this.getAllStories();
    const index = stories.findIndex((s) => String(s.id) === String(id));
    if (index !== -1) {
      stories[index].reactionsCount = (stories[index].reactionsCount || 0) + 1;
      saveToStorage(STORAGE_KEYS.STORIES, stories);
      if (isSupabaseConfigured && supabase) {
        supabase.from('stories').update({ reactions_count: stories[index].reactionsCount }).eq('id', id);
      }
      return stories[index].reactionsCount;
    }
    return 0;
  }
};
