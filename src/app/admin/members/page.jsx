"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Shield, ShieldOff, Search, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { getMembers, toggleAdminRole } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DEMO_MEMBERS } from "@/lib/demo-data";

export default function AdminMembersPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [q, setQ] = useState("");
  const [toggling, setToggling] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data);
      setUsingDemo(false);
    } catch {
      // Backend not connected — show demo data
      setMembers(DEMO_MEMBERS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = members.filter((m) => {
    const s = q.toLowerCase();
    return !s || m.displayName?.toLowerCase().includes(s) || m.email?.toLowerCase().includes(s);
  });

  const handleToggle = async (member) => {
    if (member.id === user?.id) {
      toast.error("You cannot change your own admin role.");
      return;
    }
    setToggling(member.id);
    try {
      if (usingDemo) {
        // Optimistic update in demo mode
        setMembers((prev) =>
          prev.map((m) => m.id === member.id ? { ...m, isAdmin: !m.isAdmin } : m)
        );
        toast.success(`${member.displayName} role updated (demo mode — not persisted).`);
      } else {
        await toggleAdminRole(member.id, !member.isAdmin);
        setMembers((prev) =>
          prev.map((m) => m.id === member.id ? { ...m, isAdmin: !m.isAdmin } : m)
        );
        toast.success(`${member.displayName} is now ${!member.isAdmin ? "an admin" : "a member"}.`);
      }
    } catch (e) {
      toast.error("Failed to update role", { description: e.message });
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Members</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {members.length} registered members
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {usingDemo && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <WifiOff className="size-4 shrink-0" />
          <span>Backend not connected — showing demo data. Set <code className="font-mono text-xs">NEXT_PUBLIC_API_URL</code> to connect.</span>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email…" className="pl-9" />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No members found" description="Try a different search term." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-xs text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Member</th>
                <th className="hidden px-4 py-3 text-left font-medium md:table-cell">Department</th>
                <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">Joined</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={m.avatarUrl} alt="" />
                        <AvatarFallback className="text-xs">
                          {(m.displayName || "?")[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-xs">{m.displayName || "—"}</p>
                        <p className="text-[11px] text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                    {m.department || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-muted-foreground sm:table-cell">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {m.isAdmin
                      ? <Badge className="text-[10px]"><Shield className="mr-1 size-3" />Admin</Badge>
                      : <Badge variant="secondary" className="text-[10px]">Member</Badge>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 text-xs"
                      disabled={toggling === m.id || m.id === user?.id}
                      onClick={() => handleToggle(m)}>
                      {m.isAdmin
                        ? <><ShieldOff className="mr-1 size-3" />Demote</>
                        : <><Shield className="mr-1 size-3" />Promote</>}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
