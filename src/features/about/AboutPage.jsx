"use client";

import { Target, Eye, ListChecks, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/SectionHeader";
import { useSiteContent } from "@/context/SiteContentContext";

export default function AboutPage() {
  const { content } = useSiteContent();
  const { leaders: LEADERS, clubs: CLUBS } = content;

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Built by students, for students."
        description="CCS is the umbrella society for every computing discipline on campus — uniting six clubs and teams into one collaborative community."
      />

      <section className="container-page grid gap-6 py-16 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: Target,
            title: "Mission",
            body: "Empower every computing student with the community, mentorship, and opportunities to build meaningful work before they graduate.",
          },
          {
            icon: Eye,
            title: "Vision",
            body: "A campus where computing students lead by shipping — from research to products to community impact.",
          },
          {
            icon: ListChecks,
            title: "Objectives",
            body: "Run workshops, host competitions, support open-source projects, and connect students with the wider tech industry.",
          },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-border bg-card p-6">
            <span className="flex size-10 items-center justify-center rounded-lg bg-subtle text-foreground">
              <c.icon className="size-5" />
            </span>
            <h3 className="mt-5 text-base font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
          </div>
        ))}
      </section>

      {/* History */}
      <section className="border-t border-border bg-surface">
        <div className="container-page grid gap-10 py-16 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">History</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              From six clubs to one society.
            </h2>
          </div>
          <ol className="relative space-y-6 border-l border-border pl-6">
            {[
              { year: "2022", text: "Independent Software Engineering and AI clubs ran in parallel without coordination." },
              { year: "2023", text: "The first joint hackathon proved how much stronger we are together." },
              { year: "2024", text: "Core Computing Society officially founded; six clubs unified under one charter." },
              { year: "2025", text: "Membership crossed 300 students and our first international placements landed." },
              { year: "2026", text: "Today: 480+ active members, full leadership team, and a busy event calendar." },
            ].map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[31px] top-1.5 flex size-3 items-center justify-center">
                  <span className="size-2 rounded-full bg-primary" />
                </span>
                <div className="flex items-baseline gap-3">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <p className="text-sm font-semibold">{m.year}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Structure */}
      <section className="container-page py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Structure</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            How CCS is organized
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            A small executive council coordinates across six clubs. Each club has its own leads, members, and projects.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {/* Council */}
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Executive Council
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {LEADERS.slice(0, 4).map((l) => (
                <div key={l.name} className="rounded-lg bg-subtle px-3 py-2">
                  <p className="text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.position}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connector */}
          <div className="mx-auto h-6 w-px bg-border" aria-hidden />

          {/* Clubs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLUBS.map((c) => (
              <div key={c.slug} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-subtle">
                    <c.icon className="size-4" />
                  </span>
                  <p className="text-sm font-semibold">{c.name}</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {c.members} members · Led by {c.leads.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
