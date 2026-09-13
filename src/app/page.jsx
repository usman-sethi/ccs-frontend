import HomePage from "@/features/home/HomePage";

export const metadata = {
  title: "CCS - Core Computing Society | Software Engineering, AI & Cybersecurity Club",
  description:
    "CCS (Core Computing Society) is a student-led computing club uniting students in Software Engineering, AI, Cyber Security, and Data Science. Explore clubs, events, projects, and join our community. Developed by Muhammad Musa and Usman Sethi.",
  keywords: [
    "CCS",
    "Core Computing Society",
    "computing club",
    "software engineering",
    "AI club",
    "cybersecurity club",
    "student computing community",
    "Muhammad Musa",
    "Usman Sethi",
  ],
  openGraph: {
    title: "CCS - Core Computing Society",
    description:
      "Join CCS: A student computing community with clubs in Software Engineering, AI, Cyber Security, and Data Science. Discover events, projects, and grow with us.",
    type: "website",
    url: "https://ccsuop.com",
  },
};

export default function Page() {
  return <HomePage />;
}
