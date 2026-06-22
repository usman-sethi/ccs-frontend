import {
  Code2,
  Brain,
  Shield,
  Database,
  GitBranch,
  Camera,
  Rocket,
  Cpu,
  Network,
  Layers,
  Sparkles,
  Globe,
} from "lucide-react";

/* ---------- Icons ---------- */
export const ICON_MAP = {
  Code2,
  Brain,
  Shield,
  Database,
  GitBranch,
  Camera,
  Rocket,
  Cpu,
  Network,
  Layers,
  Sparkles,
  Globe,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

/* ---------- Default member fields config ---------- */
export const DEFAULT_MEMBER_FIELDS = {
  title: true,
  department: true,
  year: true,
  bio: true,
  email: false,
  phone: false,
  linkedin: true,
  github: true,
  avatar: true,
};

/* ---------- Sample data helpers ---------- */
const UNSPLASH = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PORTRAIT = (seed) => `https://i.pravatar.cc/300?img=${seed}`;

function seedMembers(prefix, leaderName, femaleName) {
  return [
    { id: `${prefix}-l`, name: leaderName, role: "leader", title: "President", department: "Computing", year: "Final year", linkedin: "#", github: "#", avatar: PORTRAIT(`${prefix}1`), bio: "Leads the club's vision, weekly sessions, and external collaborations." },
    { id: `${prefix}-fl`, name: femaleName, role: "female-leader", title: "Female Lead", department: "Computing", year: "Final year", linkedin: "#", github: "#", avatar: PORTRAIT(`${prefix}2`), bio: "Drives inclusion initiatives, mentorship circles, and community programs." },
    { id: `${prefix}-c1`, name: "Hamza Raza", role: "co-leader", title: "Co-Lead", department: "Software Engineering", year: "3rd year", linkedin: "#", github: "#", avatar: PORTRAIT(`${prefix}3`) },
    { id: `${prefix}-m1`, name: "Ayesha Khan", role: "member", department: "AI", year: "2nd year", linkedin: "#", avatar: PORTRAIT(`${prefix}4`) },
    { id: `${prefix}-m2`, name: "Bilal Ahmed", role: "member", department: "Software Engineering", year: "2nd year", linkedin: "#", avatar: PORTRAIT(`${prefix}5`) },
    { id: `${prefix}-m3`, name: "Hira Nawaz", role: "member", department: "Cyber Security", year: "3rd year", linkedin: "#", avatar: PORTRAIT(`${prefix}6`) },
    { id: `${prefix}-m4`, name: "Usman Tariq", role: "member", department: "Data Science", year: "1st year", linkedin: "#", avatar: PORTRAIT(`${prefix}7`) },
  ];
}

/* ---------- Defaults ---------- */
export const DEFAULT_SITE_CONTENT = {
  society: {
    name: "CCS",
    fullName: "Core Computing Society",
    tagline: "Where computing students build, learn, and lead — together.",
    description:
      "CCS unites students from Software Engineering, AI, Cyber Security, Data Science, Development, and Media into one collaborative computing community.",
    email: "hello@ccs.university.edu",
    location: "Block C, Faculty of Computing, University Campus",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  hero: {
    badge: "Recruitment for 2026 is open",
    title: "The home of",
    accent: "computing students",
    bgImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=80",
    ctaPrimary: { label: "Join CCS", to: "/recruitment" },
    ctaSecondary: { label: "Explore clubs", to: "/clubs" },
  },
  navLinks: [
    { to: "/", label: "Home", visible: true },
    { to: "/about", label: "About", visible: true },
    { to: "/clubs", label: "Clubs", visible: true },
    { to: "/leadership", label: "Leadership", visible: true },
    { to: "/events", label: "Events", visible: true },
    { to: "/projects", label: "Projects", visible: true },
    { to: "/gallery", label: "Gallery", visible: true },
    { to: "/achievements", label: "Achievements", visible: true },
    { to: "/pastpapers", label: "Past papers", visible: true },
    { to: "/contact", label: "Contact", visible: true },
  ],
  stats: [
    { label: "Active members", value: "480+" },
    { label: "Clubs & teams", value: "6" },
    { label: "Events this year", value: "37" },
    { label: "Student projects", value: "120+" },
  ],
  clubs: [
    { slug: "software-engineering", name: "Software Engineering Club", iconName: "Code2", short: "Modern engineering practices, from architecture to shipping.", description: "Workshops on system design, clean code, testing, and modern frameworks. Members ship real projects together.", about: "The SE club is the largest community in CCS. We run weekly study sessions on architecture, code quality, testing, and ship at least two open-source projects each semester.", tagline: "Build software that scales.", members: 142, leads: ["Ayesha Khan", "Hamza Raza"], people: seedMembers("se", "Ayesha Khan", "Mariam Saleem") },
    { slug: "artificial-intelligence", name: "AI Club", iconName: "Brain", short: "Machine learning, deep learning, and applied research.", description: "From classical ML to LLMs and computer vision. Reading groups, paper implementations, and Kaggle teams.", about: "From classical ML to LLMs and computer vision — we run reading groups, paper-implementation sprints, and Kaggle teams every semester.", tagline: "Learn, train, and ship intelligent systems.", members: 96, leads: ["Sara Iqbal", "Bilal Ahmed"], people: seedMembers("ai", "Bilal Ahmed", "Sara Iqbal") },
    { slug: "cyber-security", name: "Cyber Security Club", iconName: "Shield", short: "Offensive and defensive security, CTFs, and red-teaming.", description: "Weekly CTF practice, hands-on labs, and capture-the-flag competitions. We host the campus security bootcamp.", about: "Weekly CTF practice, hands-on labs, and the annual campus security bootcamp. We compete in national and international CTFs.", tagline: "Break it. Defend it. Understand it.", members: 78, leads: ["Zain Malik", "Hira Nawaz"], people: seedMembers("cy", "Zain Malik", "Hira Nawaz") },
    { slug: "data-science", name: "Data Science Club", iconName: "Database", short: "Analytics, visualization, and data-driven storytelling.", description: "Statistics, SQL, BI tools, and end-to-end data pipelines. Members work on real datasets from campus partners.", about: "We build end-to-end data products with campus partners — from messy data to production dashboards.", tagline: "Turn data into decisions.", members: 64, leads: ["Mariam Saleem", "Usman Tariq"], people: seedMembers("ds", "Usman Tariq", "Mariam Saleem") },
    { slug: "development-team", name: "Development Team", iconName: "GitBranch", short: "Builds and maintains all CCS digital infrastructure.", description: "Owns the CCS website, internal tools, event platforms, and member portal. Practical, production-grade work.", about: "The team behind every CCS product — website, member portal, internal tools, and event platforms.", tagline: "Ship the platform CCS runs on.", members: 22, leads: ["Daniyal Sheikh"], people: seedMembers("dev", "Daniyal Sheikh", "Anum Yousaf") },
    { slug: "media-team", name: "Media Team", iconName: "Camera", short: "Design, photography, video, and the CCS brand.", description: "Crafts the visual identity of every event — posters, reels, recap videos, and social content.", about: "Photographers, designers, and editors crafting the visual identity of every CCS event.", tagline: "Tell every CCS story.", members: 28, leads: ["Anum Yousaf"], people: seedMembers("md", "Hamza Raza", "Anum Yousaf") },
  ],
  leaders: [
    { name: "Ahmed Raza", position: "President", department: "Software Engineering", linkedin: "#", initials: "AR" },
    { name: "Fatima Noor", position: "Vice President", department: "Artificial Intelligence", linkedin: "#", initials: "FN" },
    { name: "Hassan Ali", position: "General Secretary", department: "Cyber Security", linkedin: "#", initials: "HA" },
    { name: "Bilal Ahmed", position: "Male Leader", department: "Software Engineering", linkedin: "#", initials: "BA" },
    { name: "Sara Iqbal", position: "Female Leader", department: "Data Science", linkedin: "#", initials: "SI" },
    { name: "Usman Tariq", position: "Treasurer", department: "Software Engineering", linkedin: "#", initials: "UT" },
    { name: "Mariam Saleem", position: "Event Manager", department: "Data Science", linkedin: "#", initials: "MS" },
  ],
  events: [
    { id: "e1", title: "CodeStorm Hackathon 2026", date: "Jul 18, 2026", venue: "Main Auditorium", status: "upcoming", description: "48-hour hackathon across AI, Web, and Security tracks. Open to all CCS members.", tag: "Hackathon", qrSecret: "ccs-e1-codestorm-secret" },
    { id: "e2", title: "Intro to LLM Fine-Tuning", date: "Jun 22, 2026", venue: "Lab C-204", status: "upcoming", description: "Hands-on workshop on PEFT, LoRA, and evaluation pipelines.", tag: "Workshop", qrSecret: "ccs-e2-llm-secret" },
    { id: "e3", title: "CTF Practice Sprint", date: "Jun 8, 2026", venue: "Online", status: "ongoing", description: "Weekly capture-the-flag practice for the campus security team.", tag: "Practice", qrSecret: "ccs-e3-ctf-secret" },
    { id: "e4", title: "Orientation 2026", date: "May 12, 2026", venue: "Open Lawn", status: "past", description: "Welcoming new members across all six clubs.", tag: "Community", qrSecret: "ccs-e4-orientation-secret" },
    { id: "e5", title: "Data Viz Showcase", date: "Apr 4, 2026", venue: "Atrium", status: "past", description: "Student-led showcase of campus data dashboards.", tag: "Showcase", qrSecret: "ccs-e5-dataviz-secret" },
    { id: "e6", title: "DevTalks: Shipping at Scale", date: "Mar 19, 2026", venue: "Auditorium B", status: "past", description: "Industry engineers on building production systems.", tag: "Talk", qrSecret: "ccs-e6-devtalks-secret" },
  ],
  projects: [
    { id: "p1", name: "Campus Navigator", description: "AR-assisted indoor navigation across faculty buildings.", tech: ["React Native", "ARCore", "Supabase"], team: ["Ayesha K.", "Hamza R."], category: "Mobile", github: "#", demo: "#" },
    { id: "p2", name: "PhishGuard", description: "ML model that flags phishing URLs in real time for browsers.", tech: ["Python", "scikit-learn", "FastAPI"], team: ["Zain M.", "Hira N."], category: "AI / Security", github: "#" },
    { id: "p3", name: "GradeLens", description: "Privacy-first analytics over anonymized academic records.", tech: ["Next.js", "PostgreSQL", "DuckDB"], team: ["Mariam S.", "Usman T."], category: "Data", github: "#", demo: "#" },
    { id: "p4", name: "CCS Member Portal", description: "Internal portal for events, recruitment, and club resources.", tech: ["Next.js", "Tailwind", "Express"], team: ["Daniyal S."], category: "Web", github: "#", demo: "#" },
    { id: "p5", name: "QuranOCR", description: "Specialized OCR pipeline for classical manuscripts.", tech: ["PyTorch", "OpenCV"], team: ["Sara I.", "Bilal A."], category: "AI", github: "#" },
    { id: "p6", name: "EventReel", description: "Auto-generated event recap reels from raw footage.", tech: ["ffmpeg", "Whisper", "Remotion"], team: ["Anum Y."], category: "Media", github: "#", demo: "#" },
  ],
  achievements: [
    { year: "2026", title: "1st place — National Collegiate Hackathon", detail: "Team Quanta won the grand prize across 84 universities.", kind: "Hackathon" },
    { year: "2026", title: "CCS crossed 480 active members", detail: "A milestone for the largest computing community on campus.", kind: "Milestone" },
    { year: "2025", title: "Paper accepted at ICML Workshop", detail: "Joint work on efficient adapters for low-resource languages.", kind: "Publication" },
    { year: "2025", title: "3rd — InterUni CTF Championship", detail: "Cyber Security Club placed third out of 60 teams.", kind: "Competition" },
    { year: "2024", title: "AWS Academy partnership", detail: "Free certification cohorts launched for all members.", kind: "Certification" },
    { year: "2024", title: "CCS founded", detail: "Six independent clubs unified under one charter.", kind: "Milestone" },
  ],
  galleryCategories: ["Workshops", "Seminars", "Hackathons", "Orientation", "Community"],
  gallery: [
    { id: "g1", category: "Hackathons", caption: "CodeStorm 2025 — opening ceremony", aspect: "wide", hue: 220, src: UNSPLASH("1505373877841-8d25f7d46678") },
    { id: "g2", category: "Workshops", caption: "Intro to Kubernetes", aspect: "square", hue: 200, src: UNSPLASH("1517245386807-bb43f82c33c4") },
    { id: "g3", category: "Orientation", caption: "Welcome night", aspect: "tall", hue: 250, src: UNSPLASH("1523580494863-6f3031224c94") },
    { id: "g4", category: "Seminars", caption: "AI in industry panel", aspect: "wide", hue: 180, src: UNSPLASH("1591115765373-5207764f72e7") },
    { id: "g5", category: "Community", caption: "Iftar gathering", aspect: "square", hue: 30, src: UNSPLASH("1529543544282-ea669407fca3") },
    { id: "g6", category: "Hackathons", caption: "Late-night build", aspect: "tall", hue: 280, src: UNSPLASH("1515378791036-0648a3ef77b2") },
    { id: "g7", category: "Workshops", caption: "Cybersec lab", aspect: "square", hue: 160, src: UNSPLASH("1518770660439-4636190af475") },
    { id: "g8", category: "Seminars", caption: "Founders' chat", aspect: "wide", hue: 210, src: UNSPLASH("1475721027785-f74eccf877e2") },
    { id: "g9", category: "Community", caption: "Campus cleanup", aspect: "square", hue: 120, src: UNSPLASH("1511632765486-a01980e01a18") },
    { id: "g10", category: "Orientation", caption: "Club fair", aspect: "tall", hue: 260, src: UNSPLASH("1540575467063-178a50c2df87") },
    { id: "g11", category: "Hackathons", caption: "Award ceremony", aspect: "wide", hue: 40, src: UNSPLASH("1559223607-a43c990c692c") },
    { id: "g12", category: "Workshops", caption: "Data viz lab", aspect: "square", hue: 230, src: UNSPLASH("1551288049-bebda4e38f71") },
  ],
  pastPapers: [
    {
      id: "sem-1",
      name: "Semester 1",
      subjects: [
        { id: "sub-1-1", name: "Programming Fundamentals", files: [] },
        { id: "sub-1-2", name: "Calculus I", files: [] },
        { id: "sub-1-3", name: "English Composition", files: [] },
      ],
    },
    {
      id: "sem-2",
      name: "Semester 2",
      subjects: [
        { id: "sub-2-1", name: "Object-Oriented Programming", files: [] },
        { id: "sub-2-2", name: "Discrete Mathematics", files: [] },
      ],
    },
    {
      id: "sem-3",
      name: "Semester 3",
      subjects: [
        { id: "sub-3-1", name: "Data Structures", files: [] },
        { id: "sub-3-2", name: "Digital Logic Design", files: [] },
      ],
    },
  ],
  clubMemberFields: DEFAULT_MEMBER_FIELDS,
  theme: { primaryHue: 155, primaryChroma: 0.17, radiusRem: 0.5, navHue: 240, navChroma: 0.12, navLightness: 0.22, navBtnHue: 252, navBtnChroma: 0.22, navBtnLightness: 0.50 },
};

/** Hydrate a serialized club — adds the resolved icon component */
export function hydrateClub(c) {
  return {
    ...c,
    people: c.people ?? [],
    icon: ICON_MAP[c.iconName] ?? ICON_MAP.Code2,
  };
}
