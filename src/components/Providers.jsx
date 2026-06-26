"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteContentProvider>
          {children}
          <Toaster richColors />
        </SiteContentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
