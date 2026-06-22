import HomePage from "@/features/home/HomePage";

export const metadata = {
  title: "CCS — Core Computing Society",
  description:
    "The home of computing students. Clubs across Software Engineering, AI, Cyber Security, Data Science and more.",
  openGraph: {
    title: "CCS — Core Computing Society",
    description: "Clubs, events, projects, and a real student computing community.",
  },
};

export default function Page() {
  return <HomePage />;
}
