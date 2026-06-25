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
  Laptop,
  GraduationCap,
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
  Laptop,
  GraduationCap,
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
    {
      id: `${prefix}-l`,
      name: leaderName,
      role: "leader",
      title: "President",
      department: "Computing",
      year: "Final year",
      linkedin: "#",
      github: "#",
      avatar: PORTRAIT(`${prefix}1`),
      bio: "Leads the club's vision, weekly sessions, and external collaborations.",
    },
    {
      id: `${prefix}-fl`,
      name: femaleName,
      role: "female-leader",
      title: "Female Lead",
      department: "Computing",
      year: "Final year",
      linkedin: "#",
      github: "#",
      avatar: PORTRAIT(`${prefix}2`),
      bio: "Drives inclusion initiatives, mentorship circles, and community programs.",
    },
    {
      id: `${prefix}-c1`,
      name: "Hamza Raza",
      role: "co-leader",
      title: "Co-Lead",
      department: "Software Engineering",
      year: "3rd year",
      linkedin: "#",
      github: "#",
      avatar: PORTRAIT(`${prefix}3`),
    },
    {
      id: `${prefix}-m1`,
      name: "Ayesha Khan",
      role: "member",
      department: "AI",
      year: "2nd year",
      linkedin: "#",
      avatar: PORTRAIT(`${prefix}4`),
    },
    {
      id: `${prefix}-m2`,
      name: "Bilal Ahmed",
      role: "member",
      department: "Software Engineering",
      year: "2nd year",
      linkedin: "#",
      avatar: PORTRAIT(`${prefix}5`),
    },
    {
      id: `${prefix}-m3`,
      name: "Hira Nawaz",
      role: "member",
      department: "Cyber Security",
      year: "3rd year",
      linkedin: "#",
      avatar: PORTRAIT(`${prefix}6`),
    },
    {
      id: `${prefix}-m4`,
      name: "Usman Tariq",
      role: "member",
      department: "Data Science",
      year: "1st year",
      linkedin: "#",
      avatar: PORTRAIT(`${prefix}7`),
    },
  ];
}

/* ---------- Defaults ---------- */
export const DEFAULT_SITE_CONTENT = {
  society: {
    name: "CCS",
    fullName: "Core Computing Society",
    tagline: "Where computing students build, learn, and lead together.",
    description:
      "CCS unites students from Software Engineering, AI, Cyber Security, Data Science, Development, and Media into one collaborative computing community.",
    email: "corecomputingsociety@gmail.com",
    location: "Computer Science Department, University of Peshawar",
    social: {
      github: "https://github.com/corecomputingsociety-cloud",
      linkedin: "https://www.linkedin.com/company/core-computing-society/",
      instagram: "https://www.instagram.com/ccs_uop?igsh=bGY3MTlodHl2a3Nh",
      tiktok: "https://vt.tiktok.com/ZSC2MYXNH/",
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
    // { to: "/projects", label: "Projects", visible: true },
    // { to: "/gallery", label: "Gallery", visible: true },
    // { to: "/achievements", label: "Achievements", visible: true },
    // { to: "/pastpapers", label: "Past papers", visible: true },
    { to: "/contact", label: "Contact", visible: true },
  ],
  stats: [
    { label: "Active members", value: "480+" },
    { label: "Clubs & teams", value: "6" },
    { label: "Events this year", value: "37" },
    { label: "Student projects", value: "120+" },
  ],
  clubs: [
    {
      slug: "software-engineering",
      name: "Software Engineering Club",
      iconName: "Code2",
      short: "Build, collaborate, and prepare for future opportunities.",
      description:
        "A community for students interested in creating impactful solutions, developing practical skills, and working on meaningful projects together.",
      about:
        "The SE Club is the largest community in CCS. It brings together ambitious students to learn, collaborate, and build a strong foundation for future programs, projects, and professional growth.",
      tagline: "Build the future, one solution at a time.",
      members: 96,
      leads: ["Muhammad Musa"],
      people: seedMembers("se"),
    },
    {
      slug: "artificial-intelligence",
      name: "AI Club",
      iconName: "Brain",
      short: "Explore innovation, creativity, and emerging technologies.",
      description:
        "A space for curious minds to discover new ideas, tackle challenging problems, and prepare for the next generation of technology.",
      about:
        "The AI Club fosters curiosity, critical thinking, and innovation. Members explore transformative technologies, collaborate on projects, and prepare for advanced opportunities in the future.",
      tagline: "Imagine what comes next.",
      members: 68,
      leads: ["Sara Iqbal", "Bilal Ahmed"],
      people: seedMembers("ai"),
    },
    {
      slug: "cyber-security",
      name: "Cyber Security Club",
      iconName: "Shield",
      short:
        "Develop a security focused mindset, solve complex challenges, and stay ahead in digital world.",
      description:
        "A community focused on analytical thinking, problem-solving, and understanding the challenges of an increasingly connected world.",
      about:
        "The Cyber Security Club helps members develop a security-first mindset through collaborative learning, practical challenges, and opportunities that prepare them for future experiences.",
      tagline: "Think secure. Act smart.",
      members: 168,
      leads: ["Muhammad Hashir"],
      people: seedMembers("cy"),
    },
    {
      slug: "data-science",
      name: "Data Science Club",
      iconName: "Database",
      short:
        "Transform data into meaningful insights that drive smarter decisions and real-world impact.",
      description:
        "Explore how information can be transformed into meaningful insights through analysis, visualization, and problem-solving.",
      about:
        "The Data Science Club encourages members to think critically, explore real-world challenges, and build the foundations needed for data-driven opportunities ahead.",
      tagline: "Insights that inspire action.",
      members: 110,
      leads: ["Warisha", "Syed Khurram"],
      people: seedMembers("ds", "Usman Tariq", "Mariam Saleem"),
    },
    {
      slug: "computer-science",
      name: "Computer Science Club",
      iconName: "Laptop",
      short:
        "Explore computing concepts, solve problems, and build a strong foundation for future opportunities.",
      description:
        "A community for students passionate about technology, innovation, and problem-solving. Members develop analytical thinking and explore the principles that power modern computing.",
      about:
        "The Computer Science Club brings together curious and ambitious students who want to deepen their understanding of computing. Through collaboration, discussions, and hands-on experiences, members strengthen their foundations and prepare for advanced programs, projects, and future opportunities.",
      tagline: "Think. Solve. Innovate.",
      members: 80,
      leads: ["Anum Yousaf"],
      people: seedMembers("md"),
    },
    {
      slug: "study-circle",
      name: "Study Circle Team",
      iconName: "GraduationCap",
      short: "Focusing on building strong foundations and exploring new ideas.",
      description:
        "The Study Circle helps students strengthen core concepts, develop effective learning habits, and grow alongside peers in a supportive environment.",
      about:
        "The Study Circle serves as the starting point for many CCS members. It provides a space to learn, collaborate, and build the confidence and foundations needed to take on future programs, projects, and leadership opportunities.",
      tagline: "Learn today. Lead tomorrow.",
      members: 22,
      leads: ["Fajar Zeb"],
      people: seedMembers("dev", "Daniyal Sheikh", "Anum Yousaf"),
    },
    {
      slug: "media-team",
      name: "Media Team",
      iconName: "Camera",
      short: "Capturing moments and shaping the CCS identity.",
      description:
        "A creative team dedicated to visual storytelling, content creation, and strengthening the CCS brand.",
      about:
        "From event coverage to creative campaigns, the Media Team brings the CCS story to life through photography, design, video, and digital content.",
      tagline: "Create. Capture. Inspire.",
      members: 28,
      leads: ["Anum Yousaf"],
      people: seedMembers("md"),
    },
    {
      slug: "ccs-females",
      name: "CCS Females",
      iconName: "Users",
      short:
        "Empowering, connecting, and supporting women within the CCS community.",
      description:
        "A welcoming community that encourages collaboration, leadership, personal growth, and active participation across all CCS initiatives.",
      about:
        "CCS Females provides a supportive environment where members can connect, grow, and contribute to the society. Through mentorship, collaboration, and community-building, the club helps members develop confidence, leadership skills, and meaningful relationships.",
      tagline: "Connect. Grow. Lead.",
    },
    {
      slug: "ccs-core-team",
      name: "CCS Core Team",
      iconName: "Crown",
      short:
        "Leading initiatives, driving growth, and shaping the future of CCS.",
      description:
        "The leadership team responsible for planning, coordination, and ensuring the successful execution of CCS programs and activities.",
      about:
        "The CCS Core Team serves as the backbone of the society, bringing together dedicated members who oversee strategy, operations, and community development. Their efforts help create opportunities, strengthen engagement, and guide the long-term vision of CCS.",
      tagline: "Lead with purpose.",
    },
    {
      slug: "event-management",
      name: "Event Management Team",
      iconName: "Calendar",
      short: "Planning experiences that bring the CCS community together.",
      description:
        "A dynamic team responsible for organizing, coordinating, and delivering engaging events, workshops, and community activities.",
      about:
        "From initial planning to final execution, the Event Management Team ensures every CCS event runs smoothly. Members develop organizational, communication, and leadership skills while creating memorable experiences for the community.",
      tagline: "Plan. Organize. Deliver.",
    },
  ],
  leaders: [
    {
      name: "Muhammad Ahmad",
      position: "Leader & Founder",
      department: "Software Engineering",
      linkedin: "#",
      initials: "MA",
    },
    {
      name: "Bilal Bacha",
      position: "General Secretary & Co-founder",
      department: "Software Engineering",
      linkedin: "#",
      initials: "BB",
    },

    // Executive Leadership
    {
      name: "Labeena Naseer",
      position: "Female President",
      department: "Software Engineering",
      linkedin: "#",
      initials: "LN",
    },
    {
      name: "Malak Zaryab",
      position: "Male Vice President",
      department: "Software Engineering",
      linkedin: "#",
      initials: "MZ",
    },
    {
      name: "Ajwa Aleema",
      position: "Female Vice President",
      department: "Software Engineering",
      linkedin: "#",
      initials: "AA",
    },

    // Secretaries
    {
      name: "Maryam Hunain",
      position: "Female General Secretary",
      department: "Software Engineering",
      linkedin: "#",
      initials: "MH",
    },
    {
      name: "Hamza Saeed",
      position: "Male Joint Secretary",
      department: "Software Engineering",
      linkedin: "#",
      initials: "HS",
    },
    {
      name: "Kiran Noor",
      position: "Female Joint Secretary",
      department: "Software Engineering",
      linkedin: "#",
      initials: "GS",
    },

    // Finance
    {
      name: "Haris Khan",
      position: "Treasurer",
      department: "Software Engineering",
      linkedin: "#",
      initials: "HK",
    },

    // Study Circle
    {
      name: "Nasir",
      position: "Study Circle Male Head",
      department: "Software Engineering",
      linkedin: "#",
      initials: "N",
    },
    {
      name: "Fajar Zeb",
      position: "Female Study Circle Head",
      department: "Cyber Security",
      linkedin: "#",
      initials: "HA",
    },

    // Club Leads
    {
      name: "Muhammad Musa",
      position: "SE Club Male Lead",
      department: "Software Engineering",
      linkedin: "#",
      initials: "MM",
    },
    {
      name: "Waqas Ali",
      position: "AI Club Male Lead",
      department: "Software Engineering",
      linkedin: "#",
      initials: "WA",
    },
    {
      name: "Muhammad Hasher",
      position: "Cyber Club Male Lead",
      department: "Data Science",
      linkedin: "#",
      initials: "MH",
    },
    {
      name: "Waqas Ahmad",
      position: "CS Club Male Lead",
      department: "Software Engineering",
      linkedin: "#",
      initials: "WA",
    },
    {
      name: "Syed Khurram",
      position: "DS Club Male Lead",
      department: "Data Science",
      linkedin: "#",
      initials: "SK",
    },
    {
      name: "Warisha",
      position: "DS Club Female Lead",
      department: "Data Science",
      linkedin: "#",
      initials: "W",
    },

    // Team Heads
    {
      name: "Gull Salam Wazir",
      position: "Event Management Team Head",
      department: "Software Engineering",
      linkedin: "#",
      initials: "GS",
    },
    {
      name: "Jahan Zeb",
      position: "Event Management Co Head",
      department: "Software Engineering",
      linkedin: "#",
      initials: "JZ",
    },
    {
      name: "Salman Afridi",
      position: "Sports Team Head",
      department: "Data Science",
      linkedin: "#",
      initials: "SA",
    },
    {
      name: "Maleyka Javed",
      position: "Sports Team Female Head",
      department: "Software Engineering",
      linkedin: "#",
      initials: "GS",
    },
  ],
  events: [
    {
      id: "e1",
      title: "Cyber Security Bootcamp",
      date: "1st Week of July 2026",
      venue: "Online",
      status: "upcoming",
      description:
        "An introductory bootcamp designed to develop a security-first mindset, strengthen problem-solving skills, and explore the fundamentals of digital security.",
      tag: "Bootcamp",
      qrSecret: "ccs-e1-codestorm-secret",
    },
    {
      id: "e2",
      title: "AI Bootcamp",
      date: "1st Week of July 2026",
      venue: "Online",
      status: "upcoming",
      description:
        "Explore the foundations of intelligent systems, practical applications, and emerging technologies through interactive sessions and guided learning.",
      tag: "Bootcamp",
      qrSecret: "ccs-e2-llm-secret",
    },
    {
      id: "e3",
      title: "Software Engineering Bootcamp",
      date: "1st Week of July 2026",
      venue: "Online",
      status: "upcoming",
      description:
        "Learn the principles of building reliable software, working in teams, and transforming ideas into real-world solutions.",
      tag: "Bootcamp",
      qrSecret: "ccs-e3-ctf-secret",
    },
    {
      id: "e4",
      title: "Data Science Bootcamp",
      date: "1st Week of July 2026",
      venue: "Online",
      status: "upcoming",
      description:
        "Discover how data can be transformed into meaningful insights through analysis, visualization, and data-driven decision-making.",
      tag: "Bootcamp",
      qrSecret: "ccs-e4-orientation-secret",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "Campus Navigator",
      description: "AR-assisted indoor navigation across faculty buildings.",
      tech: ["React Native", "ARCore", "Supabase"],
      team: ["Ayesha K.", "Hamza R."],
      category: "Mobile",
      github: "#",
      demo: "#",
    },
    {
      id: "p2",
      name: "PhishGuard",
      description:
        "ML model that flags phishing URLs in real time for browsers.",
      tech: ["Python", "scikit-learn", "FastAPI"],
      team: ["Zain M.", "Hira N."],
      category: "AI / Security",
      github: "#",
    },
    {
      id: "p3",
      name: "GradeLens",
      description: "Privacy-first analytics over anonymized academic records.",
      tech: ["Next.js", "PostgreSQL", "DuckDB"],
      team: ["Mariam S.", "Usman T."],
      category: "Data",
      github: "#",
      demo: "#",
    },
    {
      id: "p4",
      name: "CCS Member Portal",
      description:
        "Internal portal for events, recruitment, and club resources.",
      tech: ["Next.js", "Tailwind", "Express"],
      team: ["Daniyal S."],
      category: "Web",
      github: "#",
      demo: "#",
    },
    {
      id: "p5",
      name: "QuranOCR",
      description: "Specialized OCR pipeline for classical manuscripts.",
      tech: ["PyTorch", "OpenCV"],
      team: ["Sara I.", "Bilal A."],
      category: "AI",
      github: "#",
    },
    {
      id: "p6",
      name: "EventReel",
      description: "Auto-generated event recap reels from raw footage.",
      tech: ["ffmpeg", "Whisper", "Remotion"],
      team: ["Anum Y."],
      category: "Media",
      github: "#",
      demo: "#",
    },
  ],
  achievements: [
    {
      year: "2026",
      title: "1st place — National Collegiate Hackathon",
      detail: "Team Quanta won the grand prize across 84 universities.",
      kind: "Hackathon",
    },
    {
      year: "2026",
      title: "CCS crossed 480 active members",
      detail: "A milestone for the largest computing community on campus.",
      kind: "Milestone",
    },
    {
      year: "2025",
      title: "Paper accepted at ICML Workshop",
      detail: "Joint work on efficient adapters for low-resource languages.",
      kind: "Publication",
    },
    {
      year: "2025",
      title: "3rd — InterUni CTF Championship",
      detail: "Cyber Security Club placed third out of 60 teams.",
      kind: "Competition",
    },
    {
      year: "2024",
      title: "AWS Academy partnership",
      detail: "Free certification cohorts launched for all members.",
      kind: "Certification",
    },
    {
      year: "2024",
      title: "CCS founded",
      detail: "Six independent clubs unified under one charter.",
      kind: "Milestone",
    },
  ],
  galleryCategories: [
    "Workshops",
    "Seminars",
    "Hackathons",
    "Orientation",
    "Community",
  ],
  gallery: [
    {
      id: "g1",
      category: "Hackathons",
      caption: "CodeStorm 2025 — opening ceremony",
      aspect: "wide",
      hue: 220,
      src: UNSPLASH("1505373877841-8d25f7d46678"),
    },
    {
      id: "g2",
      category: "Workshops",
      caption: "Intro to Kubernetes",
      aspect: "square",
      hue: 200,
      src: UNSPLASH("1517245386807-bb43f82c33c4"),
    },
    {
      id: "g3",
      category: "Orientation",
      caption: "Welcome night",
      aspect: "tall",
      hue: 250,
      src: UNSPLASH("1523580494863-6f3031224c94"),
    },
    {
      id: "g4",
      category: "Seminars",
      caption: "AI in industry panel",
      aspect: "wide",
      hue: 180,
      src: UNSPLASH("1591115765373-5207764f72e7"),
    },
    {
      id: "g5",
      category: "Community",
      caption: "Iftar gathering",
      aspect: "square",
      hue: 30,
      src: UNSPLASH("1529543544282-ea669407fca3"),
    },
    {
      id: "g6",
      category: "Hackathons",
      caption: "Late-night build",
      aspect: "tall",
      hue: 280,
      src: UNSPLASH("1515378791036-0648a3ef77b2"),
    },
    {
      id: "g7",
      category: "Workshops",
      caption: "Cybersec lab",
      aspect: "square",
      hue: 160,
      src: UNSPLASH("1518770660439-4636190af475"),
    },
    {
      id: "g8",
      category: "Seminars",
      caption: "Founders' chat",
      aspect: "wide",
      hue: 210,
      src: UNSPLASH("1475721027785-f74eccf877e2"),
    },
    {
      id: "g9",
      category: "Community",
      caption: "Campus cleanup",
      aspect: "square",
      hue: 120,
      src: UNSPLASH("1511632765486-a01980e01a18"),
    },
    {
      id: "g10",
      category: "Orientation",
      caption: "Club fair",
      aspect: "tall",
      hue: 260,
      src: UNSPLASH("1540575467063-178a50c2df87"),
    },
    {
      id: "g11",
      category: "Hackathons",
      caption: "Award ceremony",
      aspect: "wide",
      hue: 40,
      src: UNSPLASH("1559223607-a43c990c692c"),
    },
    {
      id: "g12",
      category: "Workshops",
      caption: "Data viz lab",
      aspect: "square",
      hue: 230,
      src: UNSPLASH("1551288049-bebda4e38f71"),
    },
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
  theme: {
    primaryHue: 155,
    primaryChroma: 0.17,
    radiusRem: 0.5,
    navHue: 165,
    navChroma: 0.17,
    navLightness: 0.44,
    navBtnHue: 252,
    navBtnChroma: 0.22,
    navBtnLightness: 0.5,
  },
};

/** Hydrate a serialized club — adds the resolved icon component */
export function hydrateClub(c) {
  return {
    ...c,
    people: c.people ?? [],
    icon: ICON_MAP[c.iconName] ?? ICON_MAP.Code2,
  };
}
