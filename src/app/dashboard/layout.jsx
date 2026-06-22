"use client";

// AUTH GUARD COMMENTED OUT FOR TESTING — re-enable before production
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }) {
  // const { user, loading } = useAuth();
  // const router = useRouter();
  //
  // useEffect(() => {
  //   if (!loading && !user) router.replace("/auth");
  // }, [user, loading, router]);
  //
  // if (loading) {
  //   return (
  //     <div className="flex min-h-[60vh] items-center justify-center">
  //       <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
  //     </div>
  //   );
  // }
  // if (!user) return null;

  return <>{children}</>;
}
