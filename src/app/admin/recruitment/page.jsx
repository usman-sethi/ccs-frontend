"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipboardList, RefreshCw, Search, WifiOff, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRecruitmentApplications, updateRecruitmentApplication } from "@/lib/api";
import { DEMO_RECRUITMENT_APPS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const STATUS_META = {
  new:       { label: "New",       variant: "default"   },
  reviewing: { label: "Reviewing", variant: "secondary" },
  accepted:  { label: "Accepted",  variant: "secondary" },
  rejected:  { label: "Rejected",  variant: "outline"   },
};

export default function AdminRecruitmentPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRecruitmentApplications();
      setApps(res.data);
      setUsingDemo(false);
    } catch {
      setApps(DEMO_RECRUITMENT_APPS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    if (usingDemo) {
      setApps((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
      toast.success("Status updated (demo mode).");
      return;
    }
    try {
      await updateRecruitmentApplication(id, { status });
      setApps((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
      toast.success("Status updated.");
    } catch (e) {
      toast.error("Failed to update status", { description: e.message });
    }
  };

  const filtered = apps.filter((a) => {
    const s = q.toLowerCase();
    const matchQ = !s || a.fullName?.toLowerCase().includes(s) || a.email?.toLowerCase().includes(s) || a.department?.toLowerCase().includes(s);
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchQ && matchStatus;
  });

  const counts = apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Recruitment applications</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {apps.length} total · {counts.new ?? 0} new
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {usingDemo && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <WifiOff className="size-4 shrink-0" />
          <span>Backend not connected — showing demo data.</span>
        </div>
      )}

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All", count: apps.length },
          ...Object.entries(STATUS_META).map(([value, { label }]) => ({ value, label, count: counts[value] ?? 0 })),
        ].map(({ value, label, count }) => (
          <button key={value} type="button" onClick={() => setStatusFilter(value)}
            className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              statusFilter === value
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground")}>
            {label} ({count})
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search applicants…" className="pl-9" />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications found"
          description="Applications appear here when students submit the recruitment form." />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const meta = STATUS_META[a.status] ?? STATUS_META.new;
            return (
              <div key={a._id}
                className={cn("overflow-hidden rounded-xl border bg-card",
                  a.status === "new" ? "border-primary/40" : "border-border")}>
                <button type="button"
                  className="flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-accent/30"
                  onClick={() => setExpanded((p) => p === a._id ? null : a._id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{a.fullName}</p>
                      <Badge variant={meta.variant} className="text-[10px]">{meta.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.email}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {a.department && <span>{a.department}</span>}
                      {a.year && <span>{a.year} semester</span>}
                      {a.clubInterest && <span>→ {a.clubInterest}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}
                    </span>
                    {expanded === a._id
                      ? <ChevronUp className="size-4 text-muted-foreground" />
                      : <ChevronDown className="size-4 text-muted-foreground" />}
                  </div>
                </button>

                {expanded === a._id && (
                  <div className="border-t border-border px-5 py-4 space-y-4">
                    {a.motivation && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Motivation</p>
                        <p className="text-sm leading-relaxed text-foreground">{a.motivation}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      <a href={`mailto:${a.email}`} className="text-xs text-primary hover:underline">
                        Email applicant
                      </a>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Status:</span>
                        <Select value={a.status} onValueChange={(v) => updateStatus(a._id, v)}>
                          <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
