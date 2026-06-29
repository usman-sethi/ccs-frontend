"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Shield,
  User as UserIcon,
  CodeXml,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export function UserMenu() {
  const {
    user,
    isAdmin,
    setIsAdmin,
    setIsDeveloper,
    loading,
    isLoggedIn,
    isDeveloper,
    signOut,
    isKnown,
  } = useAuth();
  const router = useRouter();

  if (loading) return <div className="size-9" aria-hidden />;

  if (!user && isKnown) {
    return (
      <Link
        href="/login"
        className="rounded-md px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        Sign in
      </Link>
    );
  }

  if (!user) return;

  const initials =
    (user?.fullName || "")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const handleSignOut = async () => {
    try {
      const res = await signOut();
      console.log("Sign out response:", res);

      toast.success("Signed out");
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Sign out failed");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex size-9 items-center justify-center rounded-full ring-1 ring-white/25 transition hover:ring-white/60"
          aria-label="Account menu"
        >
          <Avatar className="size-8">
            <AvatarImage src={user?.profileImage?.secure_url} alt="" />
            <AvatarFallback className="bg-white/20 text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
          {user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 size-4" /> Dashboard
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/recruitment" className="cursor-pointer">
              <Shield className="mr-2 size-4" /> Admin
            </Link>
          </DropdownMenuItem>
        )}
        {isDeveloper && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <CodeXml className="mr-2 size-4" /> Developer
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
