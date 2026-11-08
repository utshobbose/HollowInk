import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storage';

export const authService = {
  getCurrentUser() {
    return getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
  },

  getAllUsers() {
    return getFromStorage(STORAGE_KEYS.USERS, []);
  },

  login(email, password) {
    const users = this.getAllUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password. Verify your credentials.');
    }

    // Save session without password
    const safeUser = { ...user };
    delete safeUser.password;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, safeUser);
    return safeUser;
  },

  register({ name, email, password, role = 'reader', bio = '', specialty = '' }) {
    const users = this.getAllUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (!name || !email || !password) {
      throw new Error('All required fields must be provided.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Disallow registering as admin via public registration
    const assignedRole = role === 'admin' ? 'reader' : role;

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists in the archive.');
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role: assignedRole,
      avatar: assignedRole === 'writer'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: bio.trim() || (assignedRole === 'writer' ? 'Author of dark atmospheric folklore.' : 'Reader of South Asian horror archives.'),
      specialty: specialty.trim(),
      saveOnDevice: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);

    const safeUser = { ...newUser };
    delete safeUser.password;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, safeUser);
    return safeUser;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.dispatchEvent(new CustomEvent('hollowink_storage_update', { detail: { key: STORAGE_KEYS.CURRENT_USER, data: null } }));
    return true;
  },

  updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const users = this.getAllUsers();
    const index = users.findIndex((u) => u.id === currentUser.id);

    if (index === -1) throw new Error('User record not found');

    const updatedUser = {
      ...users[index],
      ...updates,
      // Protect immutable fields
      id: users[index].id,
      role: users[index].role
    };

    users[index] = updatedUser;
    saveToStorage(STORAGE_KEYS.USERS, users);

    const safeUser = { ...updatedUser };
    delete safeUser.password;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, safeUser);
    return safeUser;
  },

  resetPassword(email, newPassword) {
    const users = this.getAllUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (index === -1) {
      throw new Error('No account found under that address.');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    users[index].password = newPassword;
    saveToStorage(STORAGE_KEYS.USERS, users);
    return true;
  },

  // Helper to switch personas in 1 click for testing
  switchPersona(roleOrEmail) {
    const users = this.getAllUsers();
    let target = users.find((u) => u.email.toLowerCase() === roleOrEmail.toLowerCase());
    if (!target) {
      target = users.find((u) => u.role === roleOrEmail);
    }
    if (target) {
      const safe = { ...target };
      delete safe.password;
      saveToStorage(STORAGE_KEYS.CURRENT_USER, safe);
      return safe;
    }
    return null;
  }
};

