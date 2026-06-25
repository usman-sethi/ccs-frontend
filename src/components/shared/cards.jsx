"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin, Users, Github, ExternalLink, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ClubCard({ club }) {
  const Icon = club.icon;
  return (
    <div
    // <Link
      // href={`/clubs/${club.slug}`}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-foreground/15 hover:shadow-[var(--shadow-elevated)]"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-10 items-center justify-center rounded-lg bg-subtle text-foreground">
          <Icon className="size-5" />
        </span>
        {/* <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /> */}
      </div>
      <h3 className="mt-5 text-base font-semibold tracking-tight">{club.name}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{club.short}</p>
      <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" />
          {club.members} members
        </span>
      </div>
      {/* </Link> */}
      </div>
  );
}

export function LeaderCard({ leader }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/15">
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-semibold text-primary"
        >
          {leader.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{leader.name}</p>
          <p className="text-xs text-muted-foreground">{leader.position}</p>
        </div>
        {/* <a
          href={leader.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${leader.name} on LinkedIn`}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Linkedin className="size-4" />
        </a> */}
      </div>
      {/* <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        {leader.department}
      </p> */}
    </div>
  );
}

export function EventCard({ event }) {
  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-foreground/15 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wider">
          {event.tag}
        </Badge>
        <StatusDot status={event.status} />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{event.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {event.date}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {event.venue}
        </span>
      </div>
    </article>
  );
}

function StatusDot({ status }) {
  const map = {
    upcoming: { dot: "bg-primary", text: "Upcoming" },
    ongoing: { dot: "bg-emerald-500", text: "Ongoing" },
    past: { dot: "bg-muted-foreground/50", text: "Past" },
  };
  const m = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <span className={cn("size-1.5 rounded-full", m.dot)} aria-hidden />
      {m.text}
    </span>
  );
}

export function ProjectCard({ project }) {
  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-foreground/15 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wider">
          {project.category}
        </Badge>
        <div className="flex items-center gap-1">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.name} on GitHub`}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Github className="size-4" />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.name} demo`}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{project.name}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-md bg-subtle px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        {project.team.join(" · ")}
      </p>
    </article>
  );
}

export function GalleryTile({ item, onClick }) {
  const aspect =
    item.aspect === "tall"
      ? "aspect-[3/4]"
      : item.aspect === "wide"
      ? "aspect-[4/3]"
      : "aspect-square";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border border-border bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        aspect
      )}
      aria-label={item.caption}
    >
      {item.src ? (
        <img
          src={item.src}
          alt={item.caption}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className="size-full"
          style={{
            backgroundImage: `linear-gradient(135deg, hsl(${item.hue} 60% 55% / 0.85), hsl(${(item.hue + 40) % 360} 55% 35% / 0.95))`,
          }}
          aria-hidden
        />
      )}
      <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="text-left text-xs font-medium text-white">{item.caption}</p>
      </div>
      <span className="absolute left-3 top-3 rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
        {item.category}
      </span>
    </button>
  );
}
