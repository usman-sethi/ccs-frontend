"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/shared/SectionHeader";
import { LeaderCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSiteContent } from "@/context/SiteContentContext";

export default function LeadershipPage() {
  const { content } = useSiteContent();
  const LEADERS = content.leaders;
  const [q, setQ] = useState("");
  const [pos, setPos] = useState("all");

  const positions = useMemo(
    () => Array.from(new Set(LEADERS.map((l) => l.position))),
    [LEADERS]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return LEADERS.filter((l) => {
      const matchQ =
        !s ||
        l.name.toLowerCase().includes(s) ||
        l.department.toLowerCase().includes(s) ||
        l.position.toLowerCase().includes(s);
      const matchPos = pos === "all" || l.position === pos;
      return matchQ && matchPos;
    });
  }, [q, pos, LEADERS]);

  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="The people running CCS."
        description="A student led executive team that keeps every club moving forward."
      />
      <section className="container-page py-12 md:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, department..."
              aria-label="Search leaders"
              className="pl-9"
            />
          </div>
          <Select value={pos} onValueChange={setPos}>
            <SelectTrigger className="sm:w-56" aria-label="Filter by position">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All positions</SelectItem>
              {positions.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No leaders match your filters" />
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <LeaderCard key={l.name} leader={l} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
