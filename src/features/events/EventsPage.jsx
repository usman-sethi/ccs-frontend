"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/shared/SectionHeader";
import { EventCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSiteContent } from "@/context/SiteContentContext";

const TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "past", label: "Past" },
];

export default function EventsPage() {
  const { content } = useSiteContent();
  const EVENTS = content.events;
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("upcoming");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return EVENTS.filter((e) => e.status === tab).filter(
      (e) =>
        !s ||
        e.title.toLowerCase().includes(s) ||
        e.venue.toLowerCase().includes(s) ||
        e.description.toLowerCase().includes(s) ||
        e.tag.toLowerCase().includes(s)
    );
  }, [q, tab, EVENTS]);

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="What's happening at CCS."
        description="Bootcamps, talks, hackathons and competitions open to all members."
      />
      <section className="container-page py-12 md:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
              ))}
            </TabsList>
            {TABS.map((t) => <TabsContent key={t.value} value={t.value} />)}
          </Tabs>

          <div className="relative max-w-md flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events..."
              aria-label="Search events"
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="Nothing scheduled here yet" description="Check back soon." />
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
