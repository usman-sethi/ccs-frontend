import LeadershipPage from "@/features/leadership/LeadershipPage";

export const metadata = {
  title: "Leadership — CCS",
  description: "Meet the elected leadership team of Core Computing Society.",
  openGraph: { title: "Leadership — CCS", description: "The student team running CCS." },
};

export default function Page() {
  return <LeadershipPage />;
}
