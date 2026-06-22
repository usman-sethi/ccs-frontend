import ClubDetailPage from "@/features/clubs/ClubDetailPage";

export function generateMetadata({ params }) {
  const name = params.slug
    .split("-")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ");
  return {
    title: `${name} — CCS`,
    description: `Members and leadership of ${name} at Core Computing Society.`,
  };
}

export default function Page({ params }) {
  return <ClubDetailPage slug={params.slug} />;
}
