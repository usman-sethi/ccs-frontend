import AboutPage from "@/features/about/AboutPage";

export const metadata = {
  title: "About — Core Computing Society",
  description: "Our mission, vision, history, and how Core Computing Society is structured.",
  openGraph: { title: "About — Core Computing Society", description: "Mission, vision, and structure of CCS." },
};

export default function Page() {
  return <AboutPage />;
}
