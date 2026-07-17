"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Palette,
  Users,
  MessageSquare,
  ClipboardList,
  LayoutDashboard,
  ChevronRight,
  BookOpen,
  CreditCard,
  QrCode,
  Wand2,
  Award,
} from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin/recruitment", label: "Recruitment", icon: ClipboardList },
  { href: "/admin", label: "Customize", icon: Palette, exact: true },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/contact", label: "Contact", icon: MessageSquare },
  { href: "/admin/pastpapers", label: "Past Papers", icon: BookOpen },
  { href: "/admin/cards", label: "Cards", icon: CreditCard },
  { href: "/admin/attendance", label: "Attendance", icon: QrCode },
  { href: "/admin/qr-designer", label: "QR Designer", icon: Wand2 },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { isAdmin, loading, isKnown } = useAuth();

  useEffect(() => {
    if (!loading && isKnown && !isAdmin) {
      router.replace("/404"); // or "/" if preferred
    }
  }, [loading, isKnown, isAdmin, router]);

  if (loading || !isKnown) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navItems = isAdmin
    ? NAV
    : NAV.filter((item) => item.href === "/admin/recruitment");

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          href="/dashboard"
          className="hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <LayoutDashboard className="size-3.5" /> Dashboard
        </Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-foreground">Admin</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex flex-col gap-1 rounded-xl border border-border bg-card p-2">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}