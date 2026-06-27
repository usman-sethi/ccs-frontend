"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import backendMiddleware from "@/backend-middleware";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Upload,
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  Send,
  CheckCircle2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/SectionHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSiteContent } from "@/context/SiteContentContext";
import { useAuth } from "@/context/AuthContext";
import {
  addContribution,
  getContributions,
  seedDummyContributions,
} from "@/lib/pp-contributions";
import { cn } from "@/lib/utils";

/* ─── Contribute dialog ─── */
function ContributeDialog({ open, onOpenChange, semesters, user }) {
  const [semId, setSemId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [contributorName, setContributorName] = useState(
    user?.displayName || "",
  );
  const [contributorEmail, setContributorEmail] = useState(user?.email || "");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const selectedSem = semesters.find((s) => s.id === semId);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!semId || !subjectName.trim() || !file) {
      toast.error("Fill in all fields and attach a file.");
      return;
    }
    setBusy(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        addContribution({
          semesterId: semId,
          semesterName: selectedSem?.name ?? semId,
          subjectName: subjectName.trim(),
          fileName: file.name,
          fileSize: file.size,
          fileUrl: reader.result, // base64
          contributorName: contributorName.trim() || "Anonymous",
          contributorEmail: contributorEmail.trim(),
        });
        toast.success("Paper submitted!", {
          description: "An admin will review it and approve it shortly.",
        });
        onOpenChange(false);
        setSemId("");
        setSubjectName("");
        setFile(null);
        setBusy(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read file.");
        setBusy(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contribute a past paper</DialogTitle>
          <DialogDescription>
            Share a past paper with the CCS community. An admin will review and
            approve it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Your name</Label>
            <Input
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="Muhammad Usman"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Your email</Label>
            <Input
              type="email"
              value={contributorEmail}
              onChange={(e) => setContributorEmail(e.target.value)}
              placeholder="you@university.edu"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Semester</Label>
            <Select value={semId} onValueChange={setSemId}>
              <SelectTrigger aria-label="Semester">
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
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Subject name</Label>
            <Input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Data Structures"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">File</Label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-card/50 p-5 text-center transition-colors hover:border-foreground/30 hover:bg-card"
            >
              <Upload className="size-5 text-muted-foreground" />
              {file ? (
                <p className="text-sm font-medium text-foreground">
                  {file.name}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click to upload PDF, DOC, or image
                </p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={busy || !semId || !subjectName || !file}
          >
            <Send className="size-3.5 mr-1.5" />
            {busy ? "Submitting…" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Community contributions section ─── */
function CommunitySection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    seedDummyContributions();
    setItems(
      getContributions().filter((c) => c.status === "approved" && !c.inLibrary),
    );
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-5">
        <Users className="size-4 text-muted-foreground" />
        <h2 className="text-base font-semibold">Community Contributions</h2>
        <Badge variant="secondary" className="text-[10px]">
          {items.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{item.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {item.semesterName} · {item.subjectName} · by{" "}
                {item.contributorName}
              </p>
            </div>
            <a
              href={item.fileUrl}
              download={item.fileName}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label={`Download ${item.fileName}`}
            >
              <Download className="size-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Admin file upload per-subject ─── */
function SubjectRow({ sem, sub, isAdmin, onAddFile, onRemoveFile }) {
  const fileRef = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          {open ? (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground" />
          )}
          {sub.name}
          <span className="text-xs text-muted-foreground">
            ({sub.files?.length ?? 0})
          </span>
        </button>
        {isAdmin && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-xs"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-3.5" /> Upload
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onAddFile(sem.id, sub.id, f);
                e.target.value = "";
              }}
            />
          </>
        )}
      </div>

      {open && (
        <div className="mt-3 space-y-1.5 pl-5">
          {!sub.files || sub.files.length === 0 ? (
            <p className="text-xs text-muted-foreground">No files yet.</p>
          ) : (
            sub.files.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium">{f.name}</span>
                  {f.size && (
                    <span className="shrink-0 text-muted-foreground">
                      {(f.size / 1024).toFixed(0)} KB
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={f.url}
                    download={f.name}
                    className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    aria-label={`Download ${f.name}`}
                  >
                    <Download className="size-3.5" />
                  </a>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(sem.id, sub.id, f.id)}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      aria-label={`Remove ${f.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ─── */
export default function PastPapersPage() {
  const { content, update } = useSiteContent();
  const { isAdmin, user } = useAuth();
  const [q, setQ] = useState("");
  const [openSems, setOpenSems] = useState({});
  const [contributeOpen, setContributeOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const result = await backendMiddleware("pastpapers");
      if (!result) router.push("/");
    })();
  }, []);

  const semesters = useMemo(() => {
    const sems = content.pastPapers ?? [];
    if (!q.trim()) return sems;
    const s = q.toLowerCase();
    return sems
      .map((sem) => ({
        ...sem,
        subjects: (sem.subjects ?? [])
          .map((sub) => ({
            ...sub,
            files: (sub.files ?? []).filter(
              (f) =>
                f.name.toLowerCase().includes(s) ||
                sub.name.toLowerCase().includes(s) ||
                sem.name.toLowerCase().includes(s),
            ),
          }))
          .filter(
            (sub) => sub.files.length > 0 || sub.name.toLowerCase().includes(s),
          ),
      }))
      .filter(
        (sem) => sem.subjects.length > 0 || sem.name.toLowerCase().includes(s),
      );
  }, [content.pastPapers, q]);

  const toggleSem = (id) => setOpenSems((p) => ({ ...p, [id]: !p[id] }));

  const addFile = (semId, subId, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      update((draft) => {
        const sem = draft.pastPapers?.find((s) => s.id === semId);
        if (!sem) return;
        const sub = sem.subjects?.find((s) => s.id === subId);
        if (!sub) return;
        if (!sub.files) sub.files = [];
        sub.files.push({
          id: `f-${Date.now()}`,
          name: file.name,
          size: file.size,
          url: reader.result,
          addedAt: Date.now(),
        });
      });
      toast.success(`${file.name} uploaded`);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (semId, subId, fileId) => {
    update((draft) => {
      const sem = draft.pastPapers?.find((s) => s.id === semId);
      if (!sem) return;
      const sub = sem.subjects?.find((s) => s.id === subId);
      if (!sub) return;
      sub.files = (sub.files ?? []).filter((f) => f.id !== fileId);
    });
    toast.success("File removed");
  };

  const totalFiles = useMemo(
    () =>
      (content.pastPapers ?? []).reduce(
        (acc, sem) =>
          acc +
          (sem.subjects ?? []).reduce(
            (a, sub) => a + (sub.files?.length ?? 0),
            0,
          ),
        0,
      ),
    [content.pastPapers],
  );

  return (
    <>
      <PageHeader
        eyebrow="Past papers"
        title="Study resources, all in one place."
        description="Download past exam papers by semester and subject. Help the community by contributing your own."
      />
      <section className="container-page py-12 md:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search papers…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground">
              {totalFiles} files available
            </p>
            <Button
              size="sm"
              onClick={() => setContributeOpen(true)}
              className="gap-1.5"
            >
              <Plus className="size-3.5" /> Contribute a paper
            </Button>
          </div>
        </div>

        {semesters.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={FileText}
              title="No papers yet"
              description={
                isAdmin
                  ? "Expand a subject to upload the first paper."
                  : "Check back soon."
              }
            />
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {semesters.map((sem) => (
              <div
                key={sem.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => toggleSem(sem.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-center gap-3">
                    {openSems[sem.id] ? (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-semibold">{sem.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {(sem.subjects ?? []).length} subjects ·{" "}
                    {(sem.subjects ?? []).reduce(
                      (a, s) => a + (s.files?.length ?? 0),
                      0,
                    )}{" "}
                    files
                  </span>
                </button>

                {openSems[sem.id] && (
                  <div className="border-t border-border divide-y divide-border">
                    {(sem.subjects ?? []).map((sub) => (
                      <SubjectRow
                        key={sub.id}
                        sem={sem}
                        sub={sub}
                        isAdmin={isAdmin}
                        onAddFile={addFile}
                        onRemoveFile={removeFile}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Community contributions */}
        <CommunitySection />
      </section>

      {/* Contribute dialog */}
      <ContributeDialog
        open={contributeOpen}
        onOpenChange={setContributeOpen}
        semesters={content.pastPapers ?? []}
        user={user}
      />
    </>
  );
}
