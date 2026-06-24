"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Users, Calendar, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";

const FEATURES = [
  "Access to 6 specialised clubs",
  "Workshops, hackathons & events",
  "Certificates & member card",
  "Past papers & study resources",
];

const TESTIMONIAL = {
  quote: "Joining CCS was the best decision I made in university. The community, the projects, the events — it all added up to something I couldn't get anywhere else.",
  author: "Ayesha Khan",
  role: "SE Club Lead · Class of 2026",
  avatar: "AK",
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function BrandPanel() {
  const { content } = useSiteContent();
  const SOCIETY = content.society;
  const stats = content.stats.slice(0, 3);

  return (
    <div
      className="relative hidden lg:flex lg:w-[42%] shrink-0 flex-col overflow-hidden"
      style={{ background: "var(--nav-surface)" }}
    >
      {/* ── Decorative background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Dot grid */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden>
          <defs>
            <pattern id="auth-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-dots)" />
        </svg>

        {/* Gradient blobs */}
        <div
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-20"
          style={{ background: "var(--nav-btn-bg)", filter: "blur(60px)" }}
        />
        <div
          className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full opacity-15"
          style={{ background: "var(--nav-btn-bg)", filter: "blur(50px)" }}
        />
        <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-white opacity-5" />
      </div>

      {/* ── Content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex h-full flex-col px-10 py-12"
      >
        {/* Logo */}
        <motion.div variants={itemVariants}>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur-sm">
              {SOCIETY.name}
            </span>
            <span className="text-sm font-semibold text-white/90 tracking-tight">
              {SOCIETY.fullName}
            </span>
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants} className="mt-16">
          <h2 className="text-4xl font-bold leading-[1.15] tracking-tight text-white">
            Build.<br />Learn.<br />
            <span style={{ color: "var(--nav-btn-bg)" }}>Lead.</span>
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            {SOCIETY.tagline}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="mt-10">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature list */}
        <motion.ul variants={itemVariants} className="mt-10 space-y-3.5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-white/75">
              <CheckCircle2
                className="size-4 shrink-0"
                style={{ color: "var(--nav-btn-bg)" }}
              />
              {f}
            </li>
          ))}
        </motion.ul>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Testimonial */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
        >
          <p className="text-sm italic leading-relaxed text-white/70">
            &ldquo;{TESTIMONIAL.quote}&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
              {TESTIMONIAL.avatar}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{TESTIMONIAL.author}</p>
              <p className="text-[10px] text-white/45">{TESTIMONIAL.role}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
