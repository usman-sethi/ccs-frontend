"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import Image from "next/image";
import CCS_LOGO from "@/public/ccs-logo.webp";

export function Footer() {
  const { isKnown } = useAuth();

  const { content } = useSiteContent();
  const SOCIETY = content.society;
  const NAV_LINKS = (content.navLinks ?? []).filter((l) => l.visible);

  return (
    <footer
      style={{ background: "var(--nav-surface)", color: "var(--nav-fg)" }}
      className="mt-24 border-t border-white/10"
    >
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand + description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-12 p-1 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white">
                <Image src={CCS_LOGO} width={74} height={74} alt="logo" />
              </span>
              <span className="text-sm font-semibold text-white">
                {SOCIETY.fullName}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              {SOCIETY.description}
            </p>
            <div className="mt-5 flex items-center gap-0.5">
              {[
                { href: SOCIETY.social.github, icon: Github, label: "GitHub" },
                {
                  href: SOCIETY.social.linkedin,
                  icon: Linkedin,
                  label: "LinkedIn",
                },
                {
                  href: SOCIETY.social.twitter,
                  icon: Twitter,
                  label: "Twitter",
                },
                {
                  href: SOCIETY.social.instagram,
                  icon: Instagram,
                  label: "Instagram",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex size-9 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.slice(0, 6).map((l) => (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="text-white/65">{SOCIETY.email}</li>
              <li className="text-white/65 text-xs leading-relaxed">
                {SOCIETY.location}
              </li>
              {!isKnown && (
                <li className="pt-1">
                  <Link
                    href="/recruitment"
                    className="inline-flex items-center gap-1 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
                  >
                    Join CCS →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {SOCIETY.fullName}. All rights
            reserved.
          </p>
          <p>Built by the {SOCIETY.name} Development Team.</p>
        </div>
      </div>
    </footer>
  );
}
