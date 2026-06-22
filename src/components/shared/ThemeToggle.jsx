"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

/**
 * Standalone theme toggle button.
 * Transparent by default — works anywhere (admin, dashboard, etc.)
 */
export function ThemeToggle({ className = "", id }) {
  const { resolved, toggle, mounted } = useTheme();

  if (!mounted) return <div className="size-9" aria-hidden />;

  return (
    <button
      id={id}
      type="button"
      onClick={toggle}
      aria-label={resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${className}`}
    >
      {resolved === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
