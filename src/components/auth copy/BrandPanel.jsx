"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Users, Calendar, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";
import Image from "next/image";
import CCS_LOGO from "@/public/ccs-logo.webp";

const FEATURES = [
  "Access to 10 specialised clubs",
  "Bootcamps, hackathons & events",
  "Certificates & member card",
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
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
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.07]"
          aria-hidden
        >
          <defs>
            <pattern
              id="auth-dots"
              x="0"
              y="0"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
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
            <span className="flex size-9 md:size-12 p-1 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold tracking-tight text-white">
              <Image src={CCS_LOGO} alt="logo" />
            </span>
            <span className="text-sm font-semibold text-white/90 tracking-tight">
              {SOCIETY.fullName}
            </span>
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants} className="mt-16">
          <h2 className="text-4xl font-bold leading-[1.15] tracking-tight text-white">
            Build.
            <br />
            Learn.
            <br />
            <span className="text-green-400">Lead.</span>
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            {SOCIETY.tagline}
          </p>
        </motion.div>

        {/* Stats */}
        {/* <motion.div variants={itemVariants} className="mt-10">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div> */}

        {/* Feature list */}
        <motion.ul variants={itemVariants} className="mt-10 space-y-3.5">
          {FEATURES.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 text-sm text-white/75"
            >
              <CheckCircle2 className="size-4 text-green-400 shrink-0" />
              {f}
            </li>
          ))}
        </motion.ul>

        {/* Spacer */}
        <div className="flex-1" />
      </motion.div>
    </div>
  );
}
