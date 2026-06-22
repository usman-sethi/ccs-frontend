import RecruitmentPage from "@/features/recruitment/RecruitmentPage";

export const metadata = {
  title: "Join CCS — Core Computing Society",
  description: "Apply to join Core Computing Society. Open to all computing and engineering students.",
  openGraph: { title: "Join CCS", description: "Recruitment is open. Apply today." },
};

export default function Page() {
  return <RecruitmentPage />;
}
