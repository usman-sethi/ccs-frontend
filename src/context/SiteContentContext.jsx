"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_SITE_CONTENT,
  DEFAULT_MEMBER_FIELDS,
  hydrateClub,
} from "@/lib/site-content";

const STORAGE_KEY = "ccs-site-content-v1";
const SiteContentContext = createContext(null);

function safeRead() {
  if (typeof window === "undefined") return DEFAULT_SITE_CONTENT;
  try {
    // const raw = window.localStorage.getItem(STORAGE_KEY);
    const raw = null
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || !parsed) return DEFAULT_SITE_CONTENT;

    const rawClubs = Array.isArray(parsed.clubs) ? parsed.clubs : DEFAULT_SITE_CONTENT.clubs;
    const mergedClubs = rawClubs.map((c) => {
      const def = DEFAULT_SITE_CONTENT.clubs.find((d) => d.slug === c.slug);
      return {
        ...(def ?? {}),
        ...c,
        about: c.about ?? def?.about ?? "",
        tagline: c.tagline ?? def?.tagline ?? "",
        people: Array.isArray(c.people) && c.people.length > 0 ? c.people : (def?.people ?? []),
      };
    });

    const savedNav = Array.isArray(parsed.navLinks) ? parsed.navLinks : DEFAULT_SITE_CONTENT.navLinks;
    const savedTos = new Set(savedNav.map((l) => l.to));
    const mergedNav = [
      ...savedNav,
      ...DEFAULT_SITE_CONTENT.navLinks.filter((l) => !savedTos.has(l.to)),
    ];

    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      society: {
        ...DEFAULT_SITE_CONTENT.society,
        ...(parsed.society ?? {}),
        social: { ...DEFAULT_SITE_CONTENT.society.social, ...(parsed.society?.social ?? {}) },
      },
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero ?? {}) },
      theme: { ...DEFAULT_SITE_CONTENT.theme, ...(parsed.theme ?? {}) },
      clubMemberFields: { ...DEFAULT_MEMBER_FIELDS, ...(parsed.clubMemberFields ?? {}) },
      pastPapers: Array.isArray(parsed.pastPapers) ? parsed.pastPapers : DEFAULT_SITE_CONTENT.pastPapers,
      stats: Array.isArray(parsed.stats) ? parsed.stats : DEFAULT_SITE_CONTENT.stats,
      leaders: Array.isArray(parsed.leaders) ? parsed.leaders : DEFAULT_SITE_CONTENT.leaders,
      events: Array.isArray(parsed.events) ? parsed.events : DEFAULT_SITE_CONTENT.events,
      projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_SITE_CONTENT.projects,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : DEFAULT_SITE_CONTENT.achievements,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_SITE_CONTENT.gallery,
      galleryCategories: Array.isArray(parsed.galleryCategories) ? parsed.galleryCategories : DEFAULT_SITE_CONTENT.galleryCategories,
      navLinks: mergedNav,
      clubs: mergedClubs,
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function SiteContentProvider({ children }) {
  const [raw, setRaw] = useState(DEFAULT_SITE_CONTENT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRaw(safeRead());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* quota */
    }
  }, [raw, ready]);

  const update = useCallback((updater) => {
    setRaw((prev) => {
      const draft = structuredClone(prev);
      // Safety guards: ensure critical arrays are always defined
      if (!Array.isArray(draft.clubs)) draft.clubs = DEFAULT_SITE_CONTENT.clubs;
      if (!Array.isArray(draft.navLinks)) draft.navLinks = DEFAULT_SITE_CONTENT.navLinks;
      if (!Array.isArray(draft.stats)) draft.stats = DEFAULT_SITE_CONTENT.stats;
      if (!Array.isArray(draft.leaders)) draft.leaders = DEFAULT_SITE_CONTENT.leaders;
      if (!Array.isArray(draft.events)) draft.events = DEFAULT_SITE_CONTENT.events;
      if (!Array.isArray(draft.projects)) draft.projects = DEFAULT_SITE_CONTENT.projects;
      if (!Array.isArray(draft.gallery)) draft.gallery = DEFAULT_SITE_CONTENT.gallery;
      if (!Array.isArray(draft.achievements)) draft.achievements = DEFAULT_SITE_CONTENT.achievements;
      if (!Array.isArray(draft.pastPapers)) draft.pastPapers = DEFAULT_SITE_CONTENT.pastPapers;
      updater(draft);
      return draft;
    });
  }, []);

  const replace = useCallback((next) => setRaw(next), []);
  const reset = useCallback(() => setRaw(DEFAULT_SITE_CONTENT), []);
  const exportJson = useCallback(() => JSON.stringify(raw, null, 2), [raw]);

  const importJson = useCallback((json) => {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed !== "object" || !parsed) return { ok: false, error: "Invalid JSON shape" };
      setRaw({ ...DEFAULT_SITE_CONTENT, ...parsed });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const content = useMemo(
    () => ({
      ...raw,
      clubs: Array.isArray(raw.clubs)
        ? raw.clubs.map(hydrateClub)
        : DEFAULT_SITE_CONTENT.clubs.map(hydrateClub),
      raw,
    }),
    [raw],
  );

  return (
    <SiteContentContext.Provider value={{ content, raw, update, replace, reset, exportJson, importJson }}>
      <ThemeVars theme={raw.theme ?? DEFAULT_SITE_CONTENT.theme} />
      {children}
    </SiteContentContext.Provider>
  );
}

function ThemeVars({ theme }) {
  const hue  = theme.primaryHue    ?? 155;
  const chro = theme.primaryChroma ?? 0.17;
  const rad  = theme.radiusRem     ?? 0.5;
  const nHue = theme.navHue        ?? 240;
  const nChr = theme.navChroma     ?? 0.12;
  const nL   = theme.navLightness  ?? 0.22;
  const bHue = theme.navBtnHue     ?? 252;
  const bChr = theme.navBtnChroma  ?? 0.22;
  const bL   = theme.navBtnLightness ?? 0.50;
  const css  =
`:root{--primary:oklch(0.53 ${chro} ${hue});--ring:oklch(0.53 ${chro} ${hue});--radius:${rad}rem;--nav-surface:oklch(${nL} ${nChr} ${nHue});--nav-btn-bg:oklch(${bL} ${bChr} ${bHue});--nav-fg:oklch(0.99 0 0);}
.dark{--primary:oklch(0.62 ${chro} ${hue});--ring:oklch(0.62 ${chro} ${hue});--nav-surface:oklch(0.16 0 0);--nav-btn-bg:oklch(${bL} ${bChr} ${bHue});--nav-fg:oklch(0.88 0 0);}`;
  return <style>{css}</style>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used inside SiteContentProvider");
  return ctx;
}
