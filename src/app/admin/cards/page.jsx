"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CreditCard, Check, X, Eye, RefreshCw, Search,
  Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CCSCard } from "@/components/shared/CCSCard";
import {
  getCardQueue, updateQueueItem, deleteQueueItem, seedDummyCardQueue,
} from "@/lib/card-status";
import { cn } from "@/lib/utils";

const STATUS_META = {
  pending:  { label: "Pending",  icon: Clock,        variant: "default",   cls: "text-amber-600 dark:text-amber-400"  },
  approved: { label: "Approved", icon: CheckCircle2, variant: "secondary", cls: "text-emerald-600 dark:text-emerald-400" },
  rejected: { label: "Rejected", icon: XCircle,      variant: "outline",   cls: "text-muted-foreground"               },
};

/* ─── Card preview dialog ─── */
function CardPreviewDialog({ application, open, onOpenChange }) {
  if (!application) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-base">Card preview</DialogTitle>
        <DialogDescription className="text-xs">
          {application.userName} · {application.email}
        </DialogDescription>
        <div className="py-3 flex flex-col items-center gap-3">
          <CCSCard
            name={application.userName}
            department={application.department || "Computing"}
            cardNumber={application.cardNumber || "•••• •••• •••• ••••"}
            validThrough="12/27"
            memberSince={application.appliedAt ? new Date(application.appliedAt).getFullYear().toString() : "2024"}
          />
          <p className="text-[11px] text-muted-foreground">Click card to flip</p>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
          {[
            ["Name",        application.userName],
            ["Email",       application.email],
            ["Department",  application.department || "—"],
            ["Year",        application.year || "—"],
            ["Card No.",    application.cardNumber],
            ["Applied",     new Date(application.appliedAt).toLocaleDateString()],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-muted-foreground">{k}</p>
              <p className="font-medium truncate">{v}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Application row ─── */
function ApplicationCard({ item, onApprove, onReject, onDelete, onPreview }) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[item.queueStatus] ?? STATUS_META.pending;
  const StatusIcon = meta.icon;

  return (
    <div className={cn(
      "overflow-hidden rounded-xl border bg-card",
      item.queueStatus === "pending" ? "border-amber-500/30" : "border-border"
    )}>
      {/* Summary row */}
      <button
        type="button"
        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-accent/30"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Avatar placeholder */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-bold text-primary">
          {item.userName?.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold truncate">{item.userName}</p>
            <Badge variant={meta.variant} className="text-[10px] gap-1 shrink-0">
              <StatusIcon className="size-2.5" /> {meta.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {item.email}
            {item.department ? ` · ${item.department}` : ""}
            {item.year ? ` · ${item.year}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">
            {new Date(item.appliedAt).toLocaleDateString()}
          </span>
          {expanded
            ? <ChevronUp className="size-4 text-muted-foreground" />
            : <ChevronDown className="size-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-4">
          {/* Card number */}
          <div className="flex items-center gap-3 rounded-lg bg-surface border border-border px-4 py-3">
            <CreditCard className="size-4 text-muted-foreground shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Card number</p>
              <p className="font-mono text-sm font-medium tracking-widest">{item.cardNumber}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5"
              onClick={() => onPreview(item)}>
              <Eye className="size-3.5" /> Preview card
            </Button>

            {item.queueStatus === "pending" && (
              <>
                <Button
                  size="sm"
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onApprove(item)}
                >
                  <Check className="size-3.5" /> Issue card
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={() => onReject(item)}
                >
                  <X className="size-3.5" /> Reject
                </Button>
              </>
            )}

            {item.queueStatus === "approved" && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-destructive hover:text-destructive"
                onClick={() => onReject(item)}
              >
                <X className="size-3.5" /> Revoke
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-destructive hover:text-destructive ml-auto"
              onClick={() => {
                if (!confirm(`Delete card application for "${item.userName}"?`)) return;
                onDelete(item.applicationId);
              }}
            >
              <X className="size-3.5" /> Delete
            </Button>
          </div>

          {item.updatedAt && (
            <p className="text-[11px] text-muted-foreground">
              {item.queueStatus === "approved" ? "Issued" : item.queueStatus === "rejected" ? "Rejected" : "Updated"}{" "}
              on {new Date(item.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ─── */
export default function AdminCardsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [previewApp, setPreviewApp] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    seedDummyCardQueue();
    setTimeout(() => {
      setItems(getCardQueue());
      setLoading(false);
    }, 80);
  }, []);

  useEffect(() => { load(); }, [load]);

  const refresh = () => setItems(getCardQueue());

  const filtered = items.filter((item) => {
    const matchStatus = statusFilter === "all" || item.queueStatus === statusFilter;
    const s = q.toLowerCase();
    const matchQ = !s
      || item.userName?.toLowerCase().includes(s)
      || item.email?.toLowerCase().includes(s)
      || item.department?.toLowerCase().includes(s)
      || item.cardNumber?.toLowerCase().includes(s);
    return matchStatus && matchQ;
  });

  const counts = items.reduce((acc, item) => {
    acc[item.queueStatus] = (acc[item.queueStatus] || 0) + 1;
    return acc;
  }, {});

  const handleApprove = (item) => {
    updateQueueItem(item.applicationId, { queueStatus: "approved", status: "issued" });
    refresh();
    toast.success(`Card issued to ${item.userName}.`);
  };

  const handleReject = (item) => {
    updateQueueItem(item.applicationId, { queueStatus: "rejected", status: "rejected" });
    refresh();
    toast.success(`Card application rejected.`);
  };

  const handleDelete = (applicationId) => {
    deleteQueueItem(applicationId);
    refresh();
    toast.success("Application deleted.");
  };

  const FILTERS = [
    { value: "all",      label: "All",      count: items.length       },
    { value: "pending",  label: "Pending",  count: counts.pending ?? 0  },
    { value: "approved", label: "Issued",   count: counts.approved ?? 0 },
    { value: "rejected", label: "Rejected", count: counts.rejected ?? 0 },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Card applications</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {items.length} total · {counts.pending ?? 0} pending approval
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={load}>
          <RefreshCw className="size-3.5 mr-1.5" /> Refresh
        </Button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label, count }) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatusFilter(value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              statusFilter === value
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, department…"
          className="pl-9"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No applications found"
          description={
            statusFilter === "pending"
              ? "No cards waiting for approval. Members apply via their dashboard."
              : "Try a different filter."
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <ApplicationCard
              key={item.applicationId}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onPreview={(a) => setPreviewApp(a)}
            />
          ))}
        </div>
      )}

      {/* Card preview dialog */}
      <CardPreviewDialog
        application={previewApp}
        open={!!previewApp}
        onOpenChange={(o) => !o && setPreviewApp(null)}
      />
    </div>
  );
}
