"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTheme } from "@/context/ThemeContext";
import { UserMenu } from "./UserMenu";
import Image from "next/image";
import CCS_LOGO from "@/public/ccs-logo.webp";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MAX_INLINE = 6;

export function Navbar() {
  const { content } = useSiteContent();
  const { isKnown } = useAuth();
  const { resolved, toggle, mounted } = useTheme();
  const NAV_LINKS = (content.navLinks ?? []).filter((l) => l.visible);
  const SOCIETY = content.society;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // clear the ccs localstorage
    setTimeout(() => {
      localStorage.removeItem("ccs-site-content-v1");
    }, 500);

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const overflow = NAV_LINKS.length > MAX_INLINE;
  const inlineLinks = overflow ? NAV_LINKS.slice(0, MAX_INLINE - 1) : NAV_LINKS;
  const moreLinks = overflow ? NAV_LINKS.slice(MAX_INLINE - 1) : [];
  const moreActive = moreLinks.some((l) =>
    l.to === "/" ? pathname === "/" : pathname.startsWith(l.to),
  );

  return (
    <header
      style={{ background: "var(--nav-surface)" }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        scrolled ? "border-white/10 shadow-md" : "border-transparent",
      )}
    >
      <div className="container-page flex h-14 items-center justify-between md:h-16">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label={`${SOCIETY.fullName} home`}
        >
          <span className="flex size-9 md:size-12 p-1 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold tracking-tight text-white">
            <Image src={CCS_LOGO} alt="logo" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white inline">
            {SOCIETY.fullName}
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Primary"
        >
          {inlineLinks.map((l) => {
            const active =
              l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                href={l.to}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                {l.label}
              </Link>
            );
          })}

          {moreLinks.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    moreActive
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                  aria-label="More pages"
                >
                  More <ChevronDown className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                {moreLinks.map((l) => (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link href={l.to} className="cursor-pointer">
                      {l.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1">
          {/* Theme toggle — white icon on dark nav */}
          <button
            type="button"
            onClick={toggle}
            aria-label={
              mounted && resolved === "dark"
                ? "Switch to light"
                : "Switch to dark"
            }
            className="flex size-9 items-center justify-center rounded-md text-white/65 transition-colors hover:bg-white/10 hover:text-white"
          >
            {mounted && resolved === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          <UserMenu />

          {/* Join CCS */}
          {!isKnown && (
            <Link
              href="/recruitment"
              style={{ background: "var(--nav-btn-bg)" }}
              className="ml-1 hidden items-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md sm:inline-flex"
            >
              Join CCS
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md text-white/65 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ background: "var(--nav-surface)" }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <nav
              className="container-page flex flex-col gap-0.5 py-3"
              aria-label="Mobile"
            >
              {NAV_LINKS.map((l) => {
                const active =
                  l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
                return (
                  <Link
                    key={l.to}
                    href={l.to}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
              {!isKnown && (
                <Link
                  href="/recruitment"
                  style={{ background: "var(--nav-btn-bg)" }}
                  className="mt-2 flex items-center justify-center rounded-md py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Join CCS
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
