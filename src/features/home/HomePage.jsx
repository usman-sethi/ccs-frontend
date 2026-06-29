"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  ClubCard,
  EventCard,
  LeaderCard,
  ProjectCard,
  GalleryTile,
} from "@/components/shared/cards";
import { useSiteContent } from "@/context/SiteContentContext";
import Image from "next/image";
import HERO_IMG from "@/public/hero-bg-img.webp";
import HERO_IMG_LOW from "@/public/hero-bg-low.webp";
import HERO_IMG_HIGH from "@/public/hero-bg-high.webp";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 },
  }),
};

export default function HomePage() {
  const { isLoggedInRef, isAdmin, isDeveloper, isKnown, user } = useAuth();

  const loadedRef = useRef(null);

  const { content } = useSiteContent();
  const {
    clubs: CLUBS,
    events: EVENTS,
    leaders: LEADERS,
    projects: PROJECTS,
    stats: STATS,
    gallery: GALLERY,
    achievements: ACHIEVEMENTS,
    hero,
  } = content;

  if (isDeveloper || isAdmin) {
    hero.ctaPrimary.label = "Admin Panel";
    hero.ctaPrimary.to = "/admin/recruitment";
  } else if (isKnown) {
    hero.ctaPrimary.label = "Explore Leadership";
    hero.ctaPrimary.to = "/leadership";
  }

  useEffect(() => {
    if (!user) return; // Wait until the user is logged in

    const STORAGE_KEY = "ccs:member-update-notice:v1";

    if (!localStorage.getItem(STORAGE_KEY)) {
      toast.info(
        "We're currently updating our member records. If you've recently joined CCS, please complete your profile to help us keep our records accurate.",
      );

      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, [user]);

  return (
    <>
      {/* ──────────── HERO ──────────── */}
      <section className="relative isolate overflow-hidden min-h-[75vh] md:min-h-[86vh] flex flex-col md:justify-center">
        {/* Background image */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Image
            priority
            src={HERO_IMG_LOW}
            loading="eager"
            className={`md:object-cover ${loadedRef.current && "hidden"} object-contain md:object-[center_79%]`}
            fill
            alt=""
            sizes="100%"
          />
          <Image
            src={HERO_IMG_HIGH}
            loading="eager"
            className={`md:object-cover ${!loadedRef.current && "hidden"} object-contain md:object-[center_79%]`}
            fill
            alt=""
            sizes="100%"
            onLoad={() => {
              loadedRef.current = true;
            }}
          />
        </div>

        {/* Always-dark overlay — never shows the page bg colour through in light mode */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b md:bg-linear-to-t md:from-[rgba(0,0,0,1)] from-[rgba(0,0,0,0.88)] to-[rgba(0,0,0,0)] from-5% via-100% md:via-20%"
        />

        {/* Subtle colour tint from primary */}
        <div className="container-page md:mt-40 md:py-28 lg:py-32">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mx-auto max-w-3xl text-center"
          >
            {/* Badge */}
            {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm">
              <Sparkles
                className="size-3.5 text-primary"
                style={{ color: "var(--color-primary)" }}
              />
              {hero.badge}
            </span> */}

            {/* Heading — always white on the dark-overlay image */}
            <h1 className="mt-6 text-3xl font-bold md:font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              {hero.title}{" "}
              {/* <span style={{ color: "var(--color-primary)" }}> */}
              <span className="text-green-500">{hero.accent}</span>.
            </h1>

            <p className="mx-auto mt-1 md:mt-5 max-w-xl text-base text-white/70 md:text-lg leading-relaxed">
              {content.society.tagline}
            </p>

            <div className="mt-4 md:mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                style={{ background: "var(--color-primary)", color: "white" }}
                className="hover:opacity-90 transition-opacity"
              >
                <Link href={hero.ctaPrimary.to}>
                  {hero.ctaPrimary.label}
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Link
                href={hero.ctaSecondary.to}
                className="inline-flex h-10 not-md:hidden items-center justify-center rounded-md border border-white/40 bg-white/10 px-8 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {hero.ctaSecondary.label}
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          {/* <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4 backdrop-blur-sm">
            {STATS.map((s) => (
              <div key={s.label} className="bg-black/30 px-6 py-6 text-center">
                <p className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/55">
                  {s.label}
                </p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ──────────── CLUBS ──────────── */}
      <section className="container-page py-20 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Clubs & teams"
            title="Ten communities, one society"
            description="Our clubs are designed to foster curiosity, develop foundational knowledge, and prepare members for exciting opportunities in the future."
          />
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link href="/clubs">
              All clubs <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CLUBS.map((c, i) => {
            if (i >= 6) return;
            return (
              <motion.div key={c.slug} variants={fadeUp} custom={i}>
                <ClubCard club={c} />
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ──────────── EVENTS ──────────── */}
      <section className="border-y border-border bg-surface">
        <div className="container-page py-20 md:py-24">
          <div className="flex items-end justify-between gap-6">
            <SectionHeader
              eyebrow="What's next"
              title="Upcoming events"
              description="Hackathons, workshops, and talks open to all CCS members."
            />
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/events">
                All events <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {EVENTS.filter((e) => e.status !== "past")
              .slice(0, 3)
              .map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
          </div>
        </div>
      </section>

      {/* ──────────── LEADERSHIP ──────────── */}
      <section className="container-page py-20 md:py-24">
        <SectionHeader
          eyebrow="Leadership"
          title="Meet the people running CCS"
          description="A student-led team that keeps every club moving forward."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERS.slice(0, 4).map((l) => (
            <LeaderCard key={l.name} leader={l} />
          ))}
        </div>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/leadership">
              See full leadership <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ──────────── PROJECTS ──────────── */}
      {/* <section className="border-t border-border bg-surface">
        <div className="container-page py-20 md:py-24">
          <SectionHeader
            eyebrow="Built by members"
            title="Latest projects"
            description="A small sample of what CCS students ship together."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section> */}

      {/* ──────────── ACHIEVEMENTS + GALLERY ──────────── */}
      {/* <section className="container-page grid gap-12 py-20 md:py-24 lg:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Achievements"
            title="Recent wins"
            description="A snapshot of recent recognition across our clubs."
          />
          <ul className="mt-8 space-y-4">
            {ACHIEVEMENTS.slice(0, 4).map((a, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-lg border border-border bg-card p-4"
              >
                <span className="shrink-0 rounded-md bg-subtle px-2 py-1 text-xs font-semibold text-foreground">
                  {a.year}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeader
            eyebrow="Gallery"
            title="Moments from CCS"
            description="A glimpse at workshops, hackathons, and community days."
          />
          <div className="mt-8 grid grid-cols-3 gap-3">
            {GALLERY.slice(0, 6).map((g) => (
              <GalleryTile key={g.id} item={g} onClick={() => {}} />
            ))}
          </div>
        </div>
      </section> */}

      {/* ──────────── CTA ──────────── */}
      {!isKnown && (
        <section className="container-page pb-20 md:pb-28">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-card to-card p-10 text-center md:p-14">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Ready to build with us?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              Recruitment is open to all computing students. Pick a club, show
              up, and start shipping.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/recruitment">Apply now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
