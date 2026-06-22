import GalleryPage from "@/features/gallery/GalleryPage";

export const metadata = {
  title: "Gallery — CCS",
  description: "Photos from CCS workshops, hackathons, orientation days and community events.",
  openGraph: { title: "Gallery — CCS", description: "Moments from Core Computing Society." },
};

export default function Page() {
  return <GalleryPage />;
}
