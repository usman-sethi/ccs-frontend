"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/shared/SectionHeader";
import { ClubCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { useSiteContent } from "@/context/SiteContentContext";

export default function ClubsPage() {
  const { content } = useSiteContent();
  const CLUBS = content.clubs;
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CLUBS;
    return CLUBS.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.short.toLowerCase().includes(s) ||
        c.description.toLowerCase().includes(s)
    );
  }, [q, CLUBS]);

  return (
    <>
      <PageHeader
        eyebrow="Clubs"
        title="Find your community."
        description="Six clubs, each with weekly sessions, projects, and a clear path from beginner to lead."
      />
      <section className="container-page py-12 md:py-16">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clubs..."
            aria-label="Search clubs"
            className="pl-9"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No clubs match your search" description="Try a different keyword." />
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <ClubCard key={c.slug} club={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
