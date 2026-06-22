/**
 * Demo / seed data for admin pages.
 * Shown when the Express backend isn't connected yet.
 * In production, each admin page fetches from the real API.
 */

const now = Date.now();
const daysAgo = (d) => new Date(now - 86_400_000 * d).toISOString();

/* ── Members ── */
export const DEMO_MEMBERS = [
  { id: "m1", displayName: "Ayesha Khan",  email: "ayesha@uni.edu",  department: "Software Engineering", year: "3rd year",   isAdmin: false, avatarUrl: "https://i.pravatar.cc/300?img=1",  createdAt: daysAgo(120) },
  { id: "m2", displayName: "Hamza Raza",   email: "hamza@uni.edu",   department: "Artificial Intelligence", year: "2nd year", isAdmin: false, avatarUrl: "https://i.pravatar.cc/300?img=3",  createdAt: daysAgo(110) },
  { id: "m3", displayName: "Sara Iqbal",   email: "sara@uni.edu",    department: "Data Science",          year: "Final year", isAdmin: true,  avatarUrl: "https://i.pravatar.cc/300?img=5",  createdAt: daysAgo(200) },
  { id: "m4", displayName: "Bilal Ahmed",  email: "bilal@uni.edu",   department: "Cyber Security",        year: "3rd year",   isAdmin: false, avatarUrl: "https://i.pravatar.cc/300?img=7",  createdAt: daysAgo(90)  },
  { id: "m5", displayName: "Hira Nawaz",   email: "hira@uni.edu",    department: "Computer Science",      year: "2nd year",   isAdmin: false, avatarUrl: "https://i.pravatar.cc/300?img=9",  createdAt: daysAgo(60)  },
  { id: "m6", displayName: "Usman Tariq",  email: "usman@uni.edu",   department: "Software Engineering",  year: "1st year",   isAdmin: false, avatarUrl: "https://i.pravatar.cc/300?img=11", createdAt: daysAgo(14)  },
  { id: "m7", displayName: "Mariam Saleem",email: "mariam@uni.edu",  department: "Data Science",          year: "Final year", isAdmin: false, avatarUrl: "https://i.pravatar.cc/300?img=13", createdAt: daysAgo(180) },
  { id: "m8", displayName: "Zain Malik",   email: "zain@uni.edu",    department: "Cyber Security",        year: "3rd year",   isAdmin: false, avatarUrl: "https://i.pravatar.cc/300?img=15", createdAt: daysAgo(80)  },
];

/* ── Contact messages ── */
export const DEMO_CONTACT_MESSAGES = [
  {
    id: "c1",
    name: "Ali Hassan",
    email: "ali.hassan@techcorp.com",
    subject: "Partnership inquiry — internship drive",
    message: "Hi CCS team, we are from TechCorp and would like to discuss a potential partnership for our upcoming internship drive in Q3. We are looking to hire 15–20 students from Software Engineering and AI departments. Please let me know who I should contact.",
    status: "new",
    createdAt: daysAgo(0.2),
  },
  {
    id: "c2",
    name: "Dr. Naveed Ahmed",
    email: "naveed.ahmed@university.edu",
    subject: "Workshop collaboration — Cloud Computing",
    message: "Dear CCS, I am coordinating with the CS department to organize a 2-day workshop on Cloud Computing and DevOps. I believe CCS students would greatly benefit. Can we set up a meeting this week?",
    status: "read",
    createdAt: daysAgo(2),
  },
  {
    id: "c3",
    name: "Fatima Sheikh",
    email: "fatima.sheikh@gmail.com",
    subject: "Question about recruitment",
    message: "Assalam o Alaikum! I am a 1st year student in Software Engineering. I wanted to ask if recruitment is still open for the AI Club. I missed the initial deadline but I am very interested.",
    status: "new",
    createdAt: daysAgo(1),
  },
  {
    id: "c4",
    name: "Ahmed Developers PK",
    email: "info@ahmeddev.pk",
    subject: "Sponsorship for CodeStorm 2026",
    message: "We are a software house based in Islamabad and we are interested in sponsoring CodeStorm 2026. Our budget is flexible and we would love to talk about branding opportunities, mentorship sessions, and hiring from the event.",
    status: "archived",
    createdAt: daysAgo(10),
  },
  {
    id: "c5",
    name: "Zara Hussain",
    email: "zara.h@outlook.com",
    subject: "Past papers request — Semester 4",
    message: "Hello, I am a 2nd year student and I could not find Semester 4 OOP papers on your site. Could you please add them? I have some papers from last year I can contribute as well.",
    status: "new",
    createdAt: daysAgo(0.5),
  },
];

/* ── Recruitment applications ── */
export const DEMO_RECRUITMENT_APPS = [
  {
    id: "r1",
    fullName: "Muhammad Umer",
    email: "umer@uni.edu",
    phone: "+92 300 1112233",
    department: "Software Engineering",
    year: "2nd",
    clubInterest: "Development Team",
    motivation: "I have been building web apps with React and Node.js for the past year. I want to contribute to CCS's digital infrastructure and help build tools that make students' lives easier. I have experience with open-source projects on GitHub and I am comfortable working in a team environment.",
    status: "new",
    createdAt: daysAgo(0.3),
  },
  {
    id: "r2",
    fullName: "Nadia Qureshi",
    email: "nadia@uni.edu",
    phone: "+92 321 9988776",
    department: "Artificial Intelligence",
    year: "3rd",
    clubInterest: "AI Club",
    motivation: "I have completed the fast.ai course and Andrew Ng's ML specialization. I am currently working on a research paper on efficient fine-tuning of language models for low-resource Urdu NLP. I want to work alongside like-minded people and participate in Kaggle competitions as a team.",
    status: "reviewing",
    createdAt: daysAgo(3),
  },
  {
    id: "r3",
    fullName: "Kamran Baig",
    email: "kamran@uni.edu",
    phone: "+92 333 5544332",
    department: "Cyber Security",
    year: "2nd",
    clubInterest: "Cyber Security Club",
    motivation: "I practice CTF challenges on HackTheBox regularly and I am ranked in the top 5% globally. I want to be part of a team that competes in national and international CTFs. I can also help mentor beginners in the club.",
    status: "accepted",
    createdAt: daysAgo(7),
  },
  {
    id: "r4",
    fullName: "Sana Pervaiz",
    email: "sana@uni.edu",
    phone: "+92 345 6677889",
    department: "Computer Science",
    year: "1st",
    clubInterest: "Software Engineering Club",
    motivation: "I am just starting my programming journey but I am very passionate about it. I have built a few small projects with Python and I am currently learning JavaScript. I want to be part of a supportive community where I can grow.",
    status: "new",
    createdAt: daysAgo(0.1),
  },
  {
    id: "r5",
    fullName: "Tariq Mehmood",
    email: "tariq@uni.edu",
    phone: "+92 311 2233445",
    department: "Data Science",
    year: "Final year",
    clubInterest: "Data Science Club",
    motivation: "Working on my final year project in predictive analytics for student dropout rates. I have strong SQL and Python skills and I have worked on 3 data-driven projects for local NGOs. Happy to contribute to club projects and mentor juniors.",
    status: "rejected",
    createdAt: daysAgo(14),
  },
];
