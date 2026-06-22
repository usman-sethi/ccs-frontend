"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/shared/SectionHeader";
import { ProjectCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { useSiteContent } from "@/context/SiteContentContext";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { content } = useSiteContent();
  const PROJECTS = content.projects;
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))],
    [PROJECTS]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return PROJECTS.filter((p) => cat === "All" || p.category === cat).filter(
      (p) =>
        !s ||
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.tech.some((t) => t.toLowerCase().includes(s))
    );
  }, [q, cat, PROJECTS]);

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Things our members built."
        description="A selection of student projects across web, mobile, AI, data, and security."
      />
      <section className="container-page py-12 md:py-16">
        <div className="flex flex-col gap-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects, tech..."
              aria-label="Search projects"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  cat === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No projects match" description="Try clearing filters." />
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
