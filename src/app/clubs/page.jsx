import ClubsPage from "@/features/clubs/ClubsPage";

export const metadata = {
  title: "Clubs — Core Computing Society",
  description: "Six focused student communities under CCS.",
  openGraph: { title: "Clubs — CCS", description: "Software Engineering, AI, Cyber Security, Data Science, Dev, Media." },
};

export default function Page() {
  return <ClubsPage />;
}
