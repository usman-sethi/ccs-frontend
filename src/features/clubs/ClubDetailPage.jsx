"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Linkedin, Github, Mail, Phone, Users } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { hydrateClub } from "@/lib/site-content";
import { cn } from "@/lib/utils";

function initialsOf(name) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ClubDetailPage({ slug }) {
  const { raw } = useSiteContent();
  const serialized = raw.clubs.find((c) => c.slug === slug);
  if (!serialized) return notFound();

  const club = hydrateClub(serialized);
  const fields = raw.clubMemberFields;
  const people = club.people ?? [];

  const leader = people.find((p) => p.role === "leader");
  const femaleLeader = people.find((p) => p.role === "female-leader");
  const coLeaders = people.filter((p) => p.role === "co-leader");
  const members = people.filter((p) => p.role === "member");
  const Icon = club.icon;

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="container-page py-12 md:py-16">
          <Link
            href="/clubs"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> All clubs
          </Link>
          <div className="mt-6 flex items-start gap-5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-7" />
            </span>
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{club.name}</h1>
              {club.tagline && <p className="mt-1 text-sm text-primary">{club.tagline}</p>}
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed md:text-base">
                {club.about ?? club.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" /> {club.members} members
                </span>
                {club.leads.length > 0 && <span>· Led by {club.leads.join(" & ")}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {(leader || femaleLeader) && (
        <section className="container-page py-12 md:py-16">
          <h2 className="text-lg font-semibold tracking-tight">Leadership</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {leader && <MemberCard member={leader} fields={fields} size="lg" />}
            {femaleLeader && <MemberCard member={femaleLeader} fields={fields} size="lg" />}
          </div>
        </section>
      )}

      {coLeaders.length > 0 && (
        <section className="container-page pb-12 md:pb-16">
          <h2 className="text-lg font-semibold tracking-tight">Co-leads</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coLeaders.map((m) => (
              <MemberCard key={m.id} member={m} fields={fields} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page pb-16">
        <h2 className="text-lg font-semibold tracking-tight">Members</h2>
        {members.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No members listed yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((m) => (
              <MemberCard key={m.id} member={m} fields={fields} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function MemberCard({ member, fields, size = "md" }) {
  const showAvatar = fields.avatar && member.avatar;
  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/15",
        size === "lg" && "p-6"
      )}
    >
      <div className="flex items-center gap-4">
        {showAvatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            loading="lazy"
            className={cn(
              "shrink-0 rounded-full object-cover ring-2 ring-border",
              size === "lg" ? "size-16" : "size-12"
            )}
          />
        ) : (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold text-primary",
              size === "lg" ? "size-16 text-base" : "size-12"
            )}
            aria-hidden
          >
            {initialsOf(member.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className={cn("truncate font-semibold", size === "lg" ? "text-base" : "text-sm")}>
            {member.name}
          </p>
          {fields.title && member.title && (
            <p className="text-xs text-primary">{member.title}</p>
          )}
          {(fields.department || fields.year) && (member.department || member.year) && (
            <p className="text-[11px] text-muted-foreground">
              {[fields.department && member.department, fields.year && member.year]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      </div>

      {fields.bio && member.bio && (
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {fields.email && member.email && (
          <IconLink href={`mailto:${member.email}`} label="Email"><Mail className="size-3.5" /></IconLink>
        )}
        {fields.phone && member.phone && (
          <IconLink href={`tel:${member.phone}`} label="Phone"><Phone className="size-3.5" /></IconLink>
        )}
        {fields.linkedin && member.linkedin && (
          <IconLink href={member.linkedin} label="LinkedIn"><Linkedin className="size-3.5" /></IconLink>
        )}
        {fields.github && member.github && (
          <IconLink href={member.github} label="GitHub"><Github className="size-3.5" /></IconLink>
        )}
      </div>
    </article>
  );
}

function IconLink({ href, label, children }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
    >
      {children}
    </a>
  );
}
