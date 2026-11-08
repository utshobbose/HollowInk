import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { initializeStorage, STORAGE_KEYS } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    const current = authService.getCurrentUser();
    setUser(current);
    setLoading(false);

    const handleStorageUpdate = (e) => {
      if (!e.detail || e.detail.key === STORAGE_KEYS.CURRENT_USER) {
        setUser(authService.getCurrentUser());
      }
    };

    window.addEventListener('hollowink_storage_update', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('hollowink_storage_update', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const login = async (email, password) => {
    const loggedInUser = authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (userData) => {
    const registered = authService.register(userData);
    setUser(registered);
    return registered;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updated = authService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const switchPersona = (roleOrEmail) => {
    const switched = authService.switchPersona(roleOrEmail);
    if (switched) {
      setUser(switched);
    }
    return switched;
  };

  const value = {
    user,
    role: user?.role || 'visitor',
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    switchPersona
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

