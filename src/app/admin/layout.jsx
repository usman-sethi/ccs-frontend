"use client";

import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

let NAV = [
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
  const { isAdmin, loading } = useAuth();

  if (loading) return;

  NAV = !isAdmin ? NAV : NAV.filter((li) => li.href === "/admin/recruitment");

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
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
        {/* Sidebar */}
        <aside>
          <nav className="flex flex-col gap-1 rounded-xl border border-border bg-card p-2">
            {NAV.map((item) => {
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
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Page content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
