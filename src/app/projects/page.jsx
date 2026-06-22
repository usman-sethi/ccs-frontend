import ProjectsPage from "@/features/projects/ProjectsPage";

export const metadata = {
  title: "Projects — CCS",
  description: "Student projects built at Core Computing Society across web, AI, security and data.",
  openGraph: { title: "Projects — CCS", description: "Things our members shipped together." },
};

export default function Page() {
  return <ProjectsPage />;
}
