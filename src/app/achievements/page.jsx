import AchievementsPage from "@/features/achievements/AchievementsPage";

export const metadata = {
  title: "Achievements — CCS",
  description: "A running timeline of CCS wins, publications, and milestones.",
  openGraph: { title: "Achievements — CCS", description: "Wins worth remembering." },
};

export default function Page() {
  return <AchievementsPage />;
}
