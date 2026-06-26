"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandPanel } from "./BrandPanel";
import { useSiteContent } from "@/context/SiteContentContext";
import Image from "next/image";
import CCS_LOGO from "@/public/ccs-logo.webp";

export function AuthShell({
  children,
  backHref = "/",
  backLabel = "Back to site",
}) {
  const { content } = useSiteContent();

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Left: brand panel (desktop only) */}
      <BrandPanel />

      {/* Right: form area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <div
          className="flex items-center justify-between border-b border-white/10 px-5 py-4 lg:hidden"
          style={{ background: "var(--nav-surface)" }}
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 md:size-12 p-1 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold tracking-tight text-white">
              <Image src={CCS_LOGO} alt="logo" />
            </span>
            <span className="text-sm font-semibold text-white">
              {content.society.fullName}
            </span>
          </Link>
          <Link
            href={backHref}
            className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            {backLabel}
          </Link>
        </div>

        {/* Form scroll area */}
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            {/* Desktop back link */}
            <Link
              href={backHref}
              className="mb-8 hidden items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
            >
              <ArrowLeft className="size-3.5" />
              {backLabel}
            </Link>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
