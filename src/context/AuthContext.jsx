"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "@/lib/api";

const AuthContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  forgotPassword: async () => {},
  updateProfile: async () => {},
});

const AUTH_STORAGE_KEY = "ccs-auth-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on mount
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const data = await api.signIn({ email, password });
    setUser(data);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    return data;
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    return api.signUp({ email, password, displayName });
    // No auto-login — email verification required
  }, []);

  const signOut = useCallback(async () => {
    await api.signOut();
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return api.forgotPassword(email);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const updated = await api.updateProfile(data);
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updated };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return updated;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.isAdmin ?? false,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
