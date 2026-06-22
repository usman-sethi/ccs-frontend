import { Suspense } from "react";
import ProfileAttendancePage from "@/features/profile/ProfileAttendancePage";

export function generateMetadata({ params }) {
  return {
    title: `@${params.username} — CCS Profile`,
    description: "CCS member profile and event attendance.",
  };
}

export default function Page({ params }) {
  return (
    <Suspense>
      <ProfileAttendancePage username={params.username} />
    </Suspense>
  );
}
