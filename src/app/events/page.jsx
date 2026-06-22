import EventsPage from "@/features/events/EventsPage";

export const metadata = {
  title: "Events — CCS",
  description: "Upcoming and past workshops, talks, and hackathons at Core Computing Society.",
  openGraph: { title: "Events — CCS", description: "Hackathons, workshops, talks and competitions." },
};

export default function Page() {
  return <EventsPage />;
}
