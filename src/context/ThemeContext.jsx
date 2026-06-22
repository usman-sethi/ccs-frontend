"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "ccs-theme";

function applyTheme(resolved) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

function resolveTheme(theme) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  // Default: light (or system preference if already set)
  const [theme, setThemeState] = useState("light");
  const [resolved, setResolved] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || "light";
    const res = resolveTheme(stored);
    setThemeState(stored);
    setResolved(res);
    applyTheme(res);
    setMounted(true);
  }, []);

  const setTheme = (t) => {
    const res = resolveTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
    setResolved(res);
    applyTheme(res);
  };

  // Simple toggle: always switches between explicit light ↔ dark
  const toggle = () => setTheme(resolved === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
