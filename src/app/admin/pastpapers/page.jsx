"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import backendMiddleware from "@/backend-middleware";
import {
  FileText,
  Check,
  X,
  Download,
  RefreshCw,
  Search,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  getContributions,
  updateContribution,
  deleteContribution,
  markInLibrary,
  seedDummyContributions,
} from "@/lib/pp-contributions";
import { useSiteContent } from "@/context/SiteContentContext";
import { cn } from "@/lib/utils";

const STATUS_META = {
  pending: { label: "Pending", icon: Clock, variant: "default" },
  approved: { label: "Community", icon: CheckCircle2, variant: "secondary" },
  in_library: { label: "In Library", icon: BookOpen, variant: "secondary" },
  rejected: { label: "Rejected", icon: XCircle, variant: "outline" },
};

function AddToLibraryDialog({ contribution, open, onOpenChange, onConfirm }) {
  const { content } = useSiteContent();
  const semesters = content.pastPapers ?? [];
  const [semId, setSemId] = useState("");
  const [subId, setSubId] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [mode, setMode] = useState("existing");
  const selectedSem = semesters.find((s) => s.id === semId);

  useEffect(() => {
    if (contribution && open) {
      const match = semesters.find(
        (s) =>
          s.id === contribution.semesterId ||
          s.name === contribution.semesterName,
      );
      if (match) setSemId(match.id);
      if (contribution.subjectName) setNewSubName(contribution.subjectName);
    }
  }, [contribution, open]);

  const handleConfirm = () => {
    if (!semId) {
      toast.error("Select a semester");
      return;
    }
    if (mode === "existing" && !subId) {
      toast.error("Select a subject");
      return;
    }
    if (mode === "new" && !newSubName.trim()) {
      toast.error("Enter a subject name");
      return;
    }
    onConfirm({
      semId,
      subId: mode === "existing" ? subId : null,
      newSubName: mode === "new" ? newSubName.trim() : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add to official library</DialogTitle>
          <DialogDescription>
            Place <span className="font-medium">{contribution?.fileName}</span>{" "}
            into a semester and subject. It will be removed from Community
            Contributions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Semester</Label>
            <Select
              value={semId}
              onValueChange={(v) => {
                setSemId(v);
                setSubId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedSem && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {[
                  ["existing", "Existing subject"],
                  ["new", "New subject"],
                ].map(([m, lbl]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      mode === m
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              {mode === "existing" ? (
                <Select value={subId} onValueChange={setSubId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedSem.subjects ?? []).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Operating Systems"
                />
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!semId}>
            <BookOpen className="size-3.5 mr-1.5" />
            Add to library
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ContributionCard({
  item,
  onApprove,
  onReject,
  onDelete,
  onAddToLibrary,
}) {
  const [expanded, setExpanded] = useState(false);
  const displayStatus = item.inLibrary ? "in_library" : item.status;
  const meta = STATUS_META[displayStatus] ?? STATUS_META.pending;
  const StatusIcon = meta.icon;
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card",
        item.status === "pending" ? "border-amber-500/30" : "border-border",
      )}
    >
      <button
        type="button"
        className="flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-accent/30"
        onClick={() => setExpanded((p) => !p)}
      >
        <FileText className="size-4 shrink-0 text-muted-foreground mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold truncate">{item.fileName}</p>
            <Badge
              variant={meta.variant}
              className="text-[10px] gap-1 shrink-0"
            >
              <StatusIcon className="size-2.5" />
              {meta.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.semesterName} · {item.subjectName}
          </p>
          <p className="text-xs text-muted-foreground">
            By {item.contributorName}
            {item.contributorEmail ? ` · ${item.contributorEmail}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">
            {new Date(item.submittedAt).toLocaleDateString()}
          </span>
          {expanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-surface border border-border px-3 py-2">
            <FileText className="size-4 text-muted-foreground shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{item.fileName}</p>
              {item.fileSize && (
                <p className="text-[11px] text-muted-foreground">
                  {(item.fileSize / 1024).toFixed(0)} KB
                </p>
              )}
            </div>
            <a
              href={item.fileUrl}
              download={item.fileName}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Download"
            >
              <Download className="size-3.5" />
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {item.status === "pending" && (
              <>
                <Button
                  size="sm"
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onApprove(item)}
                >
                  <Check className="size-3.5" />
                  Approve (community)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => onAddToLibrary(item)}
                >
                  <BookOpen className="size-3.5" />
                  Add to library
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={() => onReject(item)}
                >
                  <X className="size-3.5" />
                  Reject
                </Button>
              </>
            )}
            {item.status === "approved" && !item.inLibrary && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => onAddToLibrary(item)}
              >
                <Plus className="size-3.5" />
                Move to library
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-destructive hover:text-destructive ml-auto"
              onClick={() => {
                if (
                  !confirm(
                    `Delete "${item.fileName}"? Removes from community and library.`,
                  )
                )
                  return;
                onDelete(item);
              }}
            >
              <X className="size-3.5" />
              Delete
            </Button>
          </div>
          {item.inLibrary && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <BookOpen className="size-3" />
              Added to official library
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPastPapersPage() {
  const { update } = useSiteContent();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [libraryDialog, setLibraryDialog] = useState(null);

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const result = await backendMiddleware("/admin/pastpapers");
      if (!result) router.push("/");
    })();
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    seedDummyContributions();
    setTimeout(() => {
      setItems(getContributions());
      setLoading(false);
    }, 80);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => setItems(getContributions());

  const filtered = items.filter((item) => {
    const ds = item.inLibrary ? "in_library" : item.status;
    const matchStatus = statusFilter === "all" || ds === statusFilter;
    const s = q.toLowerCase();
    const matchQ =
      !s ||
      item.fileName?.toLowerCase().includes(s) ||
      item.contributorName?.toLowerCase().includes(s) ||
      item.subjectName?.toLowerCase().includes(s) ||
      item.semesterName?.toLowerCase().includes(s);
    return matchStatus && matchQ;
  });

  const counts = items.reduce((acc, item) => {
    const k = item.inLibrary ? "in_library" : item.status;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const handleApprove = (item) => {
    updateContribution(item.id, { status: "approved", inLibrary: false });
    refresh();
    toast.success("Approved — visible in Community Contributions.");
  };
  const handleReject = (item) => {
    updateContribution(item.id, { status: "rejected" });
    refresh();
    toast.success("Rejected.");
  };

  const handleDelete = (item) => {
    if (item.inLibrary) {
      update((draft) => {
        for (const sem of draft.pastPapers ?? []) {
          for (const sub of sem.subjects ?? []) {
            sub.files = (sub.files ?? []).filter(
              (f) => f.url !== item.fileUrl && f.name !== item.fileName,
            );
          }
        }
      });
    }
    deleteContribution(item.id);
    refresh();
    toast.success("Deleted from all locations.");
  };

  const handleAddToLibraryConfirm = ({ semId, subId, newSubName }) => {
    if (!libraryDialog) return;
    const item = libraryDialog;
    update((draft) => {
      const sem = draft.pastPapers?.find((s) => s.id === semId);
      if (!sem) return;
      let tid = subId;
      if (!tid) {
        const ns = { id: `sub-${Date.now()}`, name: newSubName, files: [] };
        (sem.subjects = sem.subjects ?? []).push(ns);
        tid = ns.id;
      }
      const sub = sem.subjects?.find((s) => s.id === tid);
      if (!sub) return;
      if (!sub.files) sub.files = [];
      if (!sub.files.some((f) => f.url === item.fileUrl)) {
        sub.files.push({
          id: `f-${Date.now()}`,
          name: item.fileName,
          size: item.fileSize,
          url: item.fileUrl,
          addedAt: Date.now(),
          contributor: item.contributorName,
        });
      }
    });
    markInLibrary(item.id);
    refresh();
    setLibraryDialog(null);
    toast.success(
      `"${item.fileName}" added to library. Removed from Community Contributions.`,
    );
  };

  const FILTERS = [
    { value: "all", label: "All", count: items.length },
    { value: "pending", label: "Pending", count: counts.pending ?? 0 },
    { value: "approved", label: "Community", count: counts.approved ?? 0 },
    { value: "in_library", label: "Library", count: counts.in_library ?? 0 },
    { value: "rejected", label: "Rejected", count: counts.rejected ?? 0 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Past paper submissions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {items.length} total · {counts.pending ?? 0} pending
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={load}>
          <RefreshCw className="size-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>
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
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {label} ({count})
          </button>
        ))}
      </div>
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, subject, contributor…"
          className="pl-9"
        />
      </div>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No submissions found"
          description={
            statusFilter === "pending"
              ? "No papers waiting for review."
              : "Try a different filter."
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <ContributionCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onAddToLibrary={(c) => setLibraryDialog(c)}
            />
          ))}
        </div>
      )}
      {libraryDialog && (
        <AddToLibraryDialog
          open={!!libraryDialog}
          onOpenChange={(o) => !o && setLibraryDialog(null)}
          contribution={libraryDialog}
          onConfirm={handleAddToLibraryConfirm}
        />
      )}
    </div>
  );
}
