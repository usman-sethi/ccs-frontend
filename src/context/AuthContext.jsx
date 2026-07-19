"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as api from "@/lib/api";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  isLoggedInRef: null,
  isRecruited: false,
  isAdmin: false,
  isDeveloper: false,
  isKnown: false,
  setIsKnown: async () => {},
  setIsRecruited: async () => {},
  setIsAdmin: false,
  setIsDeveloper: false,
  setIsKnown: false,
  signIn: async () => {},
  signUp: async () => {},
  twoFactorAuth: async () => {},
  resendOTP: async () => {},
  signOut: async () => {},
  forgotPassword: async () => {},
  getProfile: async () => {},
  updateProfile: async () => {},
});

const AUTH_STORAGE_KEY = "ccs-auth-user";
const DEMO_AUTH_COOKIE = "token";
const DEMO_AUTH_VALUE = "demo-otp-session";

function hasDemoAuthCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${DEMO_AUTH_COOKIE}=${DEMO_AUTH_VALUE}`));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecruited, setIsRecruited] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const isLoggedInRef = useRef(null);
  const [isKnown, setIsKnown] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsKnown(true);
    }
  }, [loading]);

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
    setIsDeveloper(user?.role === "developer");
  }, [user]);

  const signIn = useCallback(async (email, password) => {
    return await api.signIn({ email, password });
  }, []);

  const signUp = useCallback(async (email, password) => {
    return api.signUp({ email, password });
    // No auto-login — email verification required
  }, []);

  const twoFactorAuth = useCallback(async (email, otp) => {
    return api.twoFactorAuth({ email, otp });
    // No auto-login — email verification required
  }, []);

  const resendOTP = useCallback(async (email) => {
    return api.resendOTP(email);
  }, []);

  const signOut = useCallback(async () => {
    if (!user && !isLoggedInRef.current) return;
    const res = await api.signOut();

    setIsAdmin(false);
    setIsDeveloper(false);
    isLoggedInRef.current = false;

    setUser(null);
    if (typeof document !== "undefined") {
      document.cookie = `${DEMO_AUTH_COOKIE}=${DEMO_AUTH_VALUE}; path=/; max-age=0; SameSite=Lax`;
    }
    localStorage.removeItem("loggedIn");
    localStorage.removeItem(AUTH_STORAGE_KEY);

    return res;
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return api.forgotPassword(email);
  }, []);

  const getProfile = useCallback(async () => {
    if (hasDemoAuthCookie()) {
      const demoUser = {
        email: "demo@example.com",
        name: "Demo User",
        role: "user",
      };
      setUser(demoUser);
      isLoggedInRef.current = true;
      return demoUser;
    }

    try {
      const me = await api.getProfile();
      if (me.success) {
        setUser(me.data);
        isLoggedInRef.current = true;
        return me.data;
      }
      setUser(null);
      isLoggedInRef.current = false;
      return null;
    } catch {
      setUser(null);
      isLoggedInRef.current = false;
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      await getProfile();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [getProfile]);

  const updateProfile = useCallback(async (data) => {
    const updated = await api.updateProfile(data);
    return updated;
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedInRef,
        isRecruited,
        loading,
        isKnown,
        setIsKnown,
        isAdmin,
        setIsAdmin,
        setIsDeveloper,
        setIsKnown,
        isDeveloper,
        isRecruited,
        setIsRecruited,
        signIn,
        signUp,
        twoFactorAuth,
        resendOTP,
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
