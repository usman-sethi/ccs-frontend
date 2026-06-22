import PastPapersPage from "@/features/pastpapers/PastPapersPage";

export const metadata = {
  title: "Past Papers — CCS",
  description: "Download exam past papers by semester and subject. Uploaded by CCS members.",
  openGraph: { title: "Past Papers — CCS", description: "Study resources for CCS students." },
};

export default function Page() {
  return <PastPapersPage />;
}
