// Back-compat re-exports. New code should use useSiteContent() from
// "@/context/SiteContentContext". Static values still used by forms live here.
export {
  DEFAULT_SITE_CONTENT,
  ICON_MAP,
  ICON_NAMES,
  DEFAULT_MEMBER_FIELDS,
  hydrateClub,
} from "@/lib/site-content";

import { DEFAULT_SITE_CONTENT, hydrateClub } from "@/lib/site-content";

export const CLUBS = DEFAULT_SITE_CONTENT.clubs.map(hydrateClub);

// Legacy constant snapshots — used as fallbacks only.
export const SOCIETY = DEFAULT_SITE_CONTENT.society;
export const NAV_LINKS = DEFAULT_SITE_CONTENT.navLinks;
export const STATS = DEFAULT_SITE_CONTENT.stats;
export const LEADERS = DEFAULT_SITE_CONTENT.leaders;
export const EVENTS = DEFAULT_SITE_CONTENT.events;
export const PROJECTS = DEFAULT_SITE_CONTENT.projects;
export const ACHIEVEMENTS = DEFAULT_SITE_CONTENT.achievements;
export const GALLERY = DEFAULT_SITE_CONTENT.gallery;
export const GALLERY_CATEGORIES = DEFAULT_SITE_CONTENT.galleryCategories;

export const DEPARTMENTS = [
  "Software Engineering",
  "Artificial Intelligence",
  "Cyber Security",
  "Data Science",
  "Computer Science",
  "Other",
];
