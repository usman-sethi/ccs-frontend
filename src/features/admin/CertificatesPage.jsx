"use client";

// ────────────────────────────────────────────────────────────
//  CCS Certificate Admin Page
//  • Tab 1: Templates  — upload PNG/JPG, position fields visually
//  • Tab 2: Issue      — pick template + fill names → preview + download
//  • Tab 3: Issued     — history of every issued certificate
// ────────────────────────────────────────────────────────────

import {
  useCallback, useEffect, useMemo, useRef, useState,
} from "react";
import {
  Award, Plus, Upload, Trash2, Pencil, Download, Eye,
  X, Check, RefreshCw, Move, Type, Search, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  getTemplates, createTemplate, updateTemplate, deleteTemplate,
  getIssuedCertificates, issueCertificate, deleteIssuedCertificate,
  getCertificatesFor, seedDemoTemplates, seedDemoIssuedCerts,
  renderCertificateToCanvas, downloadCertificate,
  fileToDataUrl, getImageDimensions,
  CATEGORY_THEMES,
} from "@/lib/certificate-templates";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const CATEGORIES = [
  { value: "member",        label: "Member"        },
  { value: "leader",        label: "Leader"        },
  { value: "winner",        label: "Winner"        },
  { value: "workshop",      label: "Workshop"      },
  { value: "participation", label: "Participation" },
];

const FONT_FAMILIES = [
  "Georgia, serif",
  "Times New Roman, serif",
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Courier New, monospace",
  "Inter, Arial, sans-serif",
];

const FONT_WEIGHTS = ["normal", "bold", "600"];
const TEXT_ALIGNS  = ["left", "center", "right"];

/* ─────────────────────────────────────────────
   TemplateEditor  — visual drag-and-drop field editor
───────────────────────────────────────────── */
function TemplateEditor({ template, onSave, onClose }) {
  // Local draft of the template (avoid mutating the prop)
  const [draft, setDraft] = useState(() => ({
    ...template,
    fields: template.fields.map((f) => ({ ...f })),
  }));
  const [selectedFieldId, setSelectedFieldId] = useState(draft.fields[0]?.id ?? null);
  const [dragState, setDragState] = useState(null);
  const containerRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [previewing, setPreviewing] = useState(false);

  const selectedField = draft.fields.find((f) => f.id === selectedFieldId);

  // ── Helpers ──
  const updateField = (id, changes) =>
    setDraft((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, ...changes } : f)),
    }));

  const addField = () => {
    const id = `field-${Date.now()}`;
    const newField = {
      id,
      label: "New Field",
      x: Math.round(draft.bgImageWidth / 2),
      y: Math.round(draft.bgImageHeight / 2),
      fontSize: 32,
      fontFamily: "Arial, sans-serif",
      fontWeight: "normal",
      color: "#000000",
      textAlign: "center",
      shadow: false,
      placeholder: "Field text",
    };
    setDraft((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
    setSelectedFieldId(id);
  };

  const removeField = (id) => {
    setDraft((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }));
    if (selectedFieldId === id) setSelectedFieldId(draft.fields[0]?.id ?? null);
  };

  // ── Drag handlers ──
  const startDrag = useCallback((e, fieldId) => {
    e.preventDefault();
    const field = draft.fields.find((f) => f.id === fieldId);
    if (!field) return;
    setSelectedFieldId(fieldId);
    setDragState({
      fieldId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX: field.x,
      origY: field.y,
    });
  }, [draft.fields]);

  const onMouseMove = useCallback((e) => {
    if (!dragState || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = draft.bgImageWidth  / rect.width;
    const scaleY = draft.bgImageHeight / rect.height;
    const dx = (e.clientX - dragState.startClientX) * scaleX;
    const dy = (e.clientY - dragState.startClientY) * scaleY;
    updateField(dragState.fieldId, {
      x: Math.round(Math.max(0, Math.min(draft.bgImageWidth,  dragState.origX + dx))),
      y: Math.round(Math.max(0, Math.min(draft.bgImageHeight, dragState.origY + dy))),
    });
  }, [dragState, draft.bgImageWidth, draft.bgImageHeight]);

  const onMouseUp = useCallback(() => setDragState(null), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // ── Canvas preview ──
  const renderPreview = async () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    setPreviewing(true);
    const sampleValues = Object.fromEntries(
      draft.fields.map((f) => [f.id, f.placeholder])
    );
    try {
      await renderCertificateToCanvas(canvas, draft, sampleValues, 1000);
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3 shrink-0">
          <div>
            <DialogTitle className="text-base">Edit template — {draft.name}</DialogTitle>
            <DialogDescription className="text-xs mt-0.5">
              Drag fields to reposition them. Click a field to edit its style.
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={renderPreview} disabled={previewing}>
              <Eye className="size-3.5 mr-1.5" /> {previewing ? "Rendering…" : "Preview"}
            </Button>
            <Button size="sm" onClick={() => onSave(draft)}>
              <Check className="size-3.5 mr-1.5" /> Save
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* ── Left: Visual canvas editor ── */}
          <div className="flex-1 overflow-auto bg-muted/30 p-4">
            {/* Canvas preview (shows after clicking Preview) */}
            <div className="mb-3 hidden [&:has(canvas)]:block">
              <canvas
                ref={previewCanvasRef}
                className="w-full max-w-2xl mx-auto rounded-lg border border-border shadow"
                style={{ aspectRatio: `${draft.bgImageWidth} / ${draft.bgImageHeight}`, imageRendering: "pixelated" }}
              />
            </div>

            {/* Interactive field editor */}
            <div
              ref={containerRef}
              className="relative mx-auto max-w-3xl select-none"
              style={{ aspectRatio: `${draft.bgImageWidth} / ${draft.bgImageHeight}` }}
            >
              {/* Background image */}
              <img
                src={draft.bgImageDataUrl}
                alt="Certificate template"
                className="w-full h-full object-contain rounded-lg border border-border shadow"
                draggable={false}
              />

              {/* Field overlays */}
              {draft.fields.map((field) => {
                const leftPct = (field.x / draft.bgImageWidth)  * 100;
                const topPct  = (field.y / draft.bgImageHeight) * 100;
                const isSelected = selectedFieldId === field.id;

                // Approximate display font size
                const containerW = containerRef.current?.clientWidth || 800;
                const displayScale = containerW / draft.bgImageWidth;
                const displayFontSize = Math.max(8, Math.round(field.fontSize * displayScale));

                return (
                  <div
                    key={field.id}
                    className={cn(
                      "absolute cursor-move rounded px-1.5 py-0.5 transition-all",
                      isSelected
                        ? "outline outline-2 outline-primary bg-primary/10"
                        : "outline outline-1 outline-dashed outline-muted-foreground/40 hover:outline-foreground/40"
                    )}
                    style={{
                      left: `${leftPct}%`,
                      top:  `${topPct}%`,
                      transform: `translate(${field.textAlign === "center" ? "-50%" : field.textAlign === "right" ? "-100%" : "0"}, -50%)`,
                      fontSize: `${displayFontSize}px`,
                      fontFamily: field.fontFamily,
                      fontWeight: field.fontWeight || "normal",
                      color: field.color,
                      whiteSpace: "nowrap",
                      lineHeight: 1.2,
                    }}
                    onMouseDown={(e) => startDrag(e, field.id)}
                    onClick={() => setSelectedFieldId(field.id)}
                  >
                    {field.placeholder || field.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: Properties sidebar ── */}
          <div className="w-72 shrink-0 overflow-y-auto border-l border-border bg-card">
            {/* Template settings */}
            <div className="border-b border-border p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Template
              </p>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Name</Label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  className="h-7 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Category</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => setDraft((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-xs">{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fields list + add */}
            <div className="border-b border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fields</p>
                <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={addField}>
                  <Plus className="size-3 mr-0.5" /> Add
                </Button>
              </div>
              {draft.fields.map((field) => (
                <div
                  key={field.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                    selectedFieldId === field.id
                      ? "bg-accent text-foreground"
                      : "hover:bg-accent/50 text-muted-foreground"
                  )}
                  onClick={() => setSelectedFieldId(field.id)}
                >
                  <Type className="size-3 shrink-0" />
                  <span className="flex-1 text-xs truncate">{field.label}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Selected field properties */}
            {selectedField && (
              <div className="p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Field: {selectedField.label}
                </p>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Field label (admin only)</Label>
                  <Input className="h-7 text-xs" value={selectedField.label}
                    onChange={(e) => updateField(selectedField.id, { label: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Sample / placeholder text</Label>
                  <Input className="h-7 text-xs" value={selectedField.placeholder || ""}
                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })} />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium">X (px)</Label>
                    <Input type="number" className="h-7 text-xs" value={selectedField.x}
                      onChange={(e) => updateField(selectedField.id, { x: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium">Y (px)</Label>
                    <Input type="number" className="h-7 text-xs" value={selectedField.y}
                      onChange={(e) => updateField(selectedField.id, { y: Number(e.target.value) })} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Font family</Label>
                  <Select value={selectedField.fontFamily}
                    onValueChange={(v) => updateField(selectedField.id, { fontFamily: v })}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((f) => (
                        <SelectItem key={f} value={f} className="text-xs"
                          style={{ fontFamily: f }}>{f.split(",")[0]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium">Size (px)</Label>
                    <Input type="number" className="h-7 text-xs" value={selectedField.fontSize}
                      onChange={(e) => updateField(selectedField.id, { fontSize: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium">Weight</Label>
                    <Select value={selectedField.fontWeight || "normal"}
                      onValueChange={(v) => updateField(selectedField.id, { fontWeight: v })}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FONT_WEIGHTS.map((w) => (
                          <SelectItem key={w} value={w} className="text-xs capitalize">{w}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium">Color</Label>
                    <div className="flex items-center gap-1.5 h-7">
                      <input
                        type="color"
                        value={selectedField.color || "#000000"}
                        onChange={(e) => updateField(selectedField.id, { color: e.target.value })}
                        className="h-7 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
                      />
                      <Input className="h-7 text-xs flex-1 font-mono" value={selectedField.color || "#000000"}
                        onChange={(e) => updateField(selectedField.id, { color: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium">Align</Label>
                    <Select value={selectedField.textAlign || "center"}
                      onValueChange={(v) => updateField(selectedField.id, { textAlign: v })}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TEXT_ALIGNS.map((a) => (
                          <SelectItem key={a} value={a} className="text-xs capitalize">{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <Label className="text-xs font-medium">Text shadow</Label>
                  <button
                    type="button"
                    onClick={() => updateField(selectedField.id, { shadow: !selectedField.shadow })}
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      selectedField.shadow ? "bg-primary" : "bg-input"
                    )}
                  >
                    <span className={cn(
                      "inline-block size-4 rounded-full bg-background shadow transition-transform",
                      selectedField.shadow ? "translate-x-4" : "translate-x-0.5"
                    )} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────
   TemplateCard  — thumbnail in the grid
───────────────────────────────────────────── */
function TemplateCard({ template, onEdit, onDelete, onIssue }) {
  const theme = CATEGORY_THEMES[template.category] || CATEGORY_THEMES.member;
  const catLabel = CATEGORIES.find((c) => c.value === template.category)?.label ?? template.category;

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-[1.414/1] overflow-hidden bg-muted">
        <img
          src={template.bgImageDataUrl}
          alt={template.name}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* Action overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="sm" variant="secondary" className="h-7 gap-1 text-xs" onClick={() => onEdit(template)}>
            <Pencil className="size-3" /> Edit
          </Button>
          <Button size="sm" className="h-7 gap-1 text-xs" onClick={() => onIssue(template)}>
            <Award className="size-3" /> Issue
          </Button>
        </div>
      </div>
      {/* Info */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{template.name}</p>
          <Badge
            variant="secondary"
            className="mt-0.5 text-[10px]"
            style={{ backgroundColor: `${theme.ribbon}20`, color: theme.ribbon }}
          >
            {catLabel}
          </Badge>
        </div>
        <button
          type="button"
          onClick={() => onDelete(template.id)}
          className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          aria-label="Delete template"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   IssueForm  — fill values, preview, download
───────────────────────────────────────────── */
function IssueTab({ templates, defaultTemplateId }) {
  const [selectedTmplId, setSelectedTmplId] = useState(defaultTemplateId ?? templates[0]?.id ?? "");
  const [fieldValues, setFieldValues] = useState({});
  const [recipientEmail, setRecipientEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const previewCanvasRef = useRef(null);
  const [previewReady, setPreviewReady] = useState(false);

  const tmpl = templates.find((t) => t.id === selectedTmplId);

  // Reset fields when template changes
  useEffect(() => {
    if (!tmpl) return;
    const defaults = Object.fromEntries(tmpl.fields.map((f) => [f.id, ""]));
    setFieldValues(defaults);
    setPreviewReady(false);
  }, [selectedTmplId]);

  const setField = (id, val) => setFieldValues((p) => ({ ...p, [id]: val }));

  const handlePreview = async () => {
    if (!tmpl || !previewCanvasRef.current) return;
    setPreviewing(true);
    setPreviewReady(false);
    try {
      await renderCertificateToCanvas(previewCanvasRef.current, tmpl, fieldValues, 900);
      setPreviewReady(true);
    } finally {
      setPreviewing(false);
    }
  };

  const handleDownloadOnly = async () => {
    if (!tmpl) return;
    setBusy(true);
    try {
      const safeName = (fieldValues.name || "certificate").toLowerCase().replace(/\s+/g, "-");
      await downloadCertificate(tmpl, fieldValues, `${safeName}-certificate.png`);
      toast.success("Certificate downloaded (2000 × high-res PNG)");
    } catch (e) {
      toast.error("Download failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const handleIssueAndDownload = async () => {
    if (!tmpl || !fieldValues.name?.trim()) {
      toast.error("Enter the recipient's name before issuing.");
      return;
    }
    setBusy(true);
    try {
      issueCertificate({
        templateId: tmpl.id,
        templateName: tmpl.name,
        category: tmpl.category,
        recipientName: fieldValues.name,
        recipientEmail,
        fieldValues,
      });
      const safeName = fieldValues.name.toLowerCase().replace(/\s+/g, "-");
      await downloadCertificate(tmpl, fieldValues, `${safeName}-${tmpl.category}-certificate.png`);
      toast.success(`Certificate issued to ${fieldValues.name} and downloaded.`);
    } catch (e) {
      toast.error("Failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="No templates yet"
        description="Create a template in the Templates tab first."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Left: Form */}
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Certificate type</p>
          <Select value={selectedTmplId} onValueChange={setSelectedTmplId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Recipient email (optional)</Label>
            <Input
              type="email"
              placeholder="name@university.edu"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
        </div>

        {tmpl && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fill fields</p>
            {tmpl.fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label className="text-xs font-medium">{field.label}</Label>
                <Input
                  placeholder={field.placeholder}
                  value={fieldValues[field.id] ?? ""}
                  onChange={(e) => setField(field.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Button className="w-full gap-2" variant="outline" onClick={handlePreview} disabled={previewing || !tmpl}>
            <Eye className="size-4" /> {previewing ? "Generating preview…" : "Preview"}
          </Button>
          <Button className="w-full gap-2" variant="outline" onClick={handleDownloadOnly} disabled={busy || !tmpl}>
            <Download className="size-4" /> Download only (no record)
          </Button>
          <Button className="w-full gap-2" onClick={handleIssueAndDownload} disabled={busy || !tmpl}>
            <Award className="size-4" /> Issue + Download
          </Button>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="rounded-xl border border-border bg-muted/30 flex items-center justify-center p-4 min-h-[300px]">
        {previewing ? (
          <div className="text-center text-sm text-muted-foreground">
            <RefreshCw className="mx-auto size-6 animate-spin mb-2" />
            Rendering preview…
          </div>
        ) : previewReady ? (
          <canvas
            ref={previewCanvasRef}
            className="w-full rounded-lg border border-border shadow"
            style={{ aspectRatio: `${tmpl?.bgImageWidth ?? 1.414} / ${tmpl?.bgImageHeight ?? 1}`, imageRendering: "pixelated" }}
          />
        ) : (
          <div className="text-center space-y-2 text-muted-foreground">
            <Eye className="mx-auto size-8 opacity-30" />
            <p className="text-sm">Fill in the fields and click Preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   IssuedTab  — list + download + delete
───────────────────────────────────────────── */
function IssuedTab({ templates, onRefresh }) {
  const [issued, setIssued] = useState([]);
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    setIssued(getIssuedCertificates());
  }, []);

  const refresh = () => {
    setIssued(getIssuedCertificates());
    onRefresh?.();
  };

  const filtered = issued.filter((c) => {
    const s = q.toLowerCase();
    const matchQ = !s || c.recipientName?.toLowerCase().includes(s) || c.templateName?.toLowerCase().includes(s);
    const matchCat = catFilter === "all" || c.category === catFilter;
    return matchQ && matchCat;
  });

  const handleDelete = (id) => {
    if (!confirm("Delete this issued certificate permanently?")) return;
    deleteIssuedCertificate(id);
    refresh();
    toast.success("Certificate deleted.");
  };

  const handleDownload = async (cert) => {
    const tmpl = templates.find((t) => t.id === cert.templateId);
    if (!tmpl) { toast.error("Template no longer exists."); return; }
    setDownloading(cert.id);
    try {
      const safeName = cert.recipientName.toLowerCase().replace(/\s+/g, "-");
      await downloadCertificate(tmpl, cert.fieldValues, `${safeName}-${cert.category}-certificate.png`);
      toast.success("Downloaded.");
    } catch (e) {
      toast.error("Download failed", { description: e.message });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or template…" className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={refresh}>
          <RefreshCw className="size-3.5 mr-1.5" /> Refresh
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Award} title="No certificates issued yet"
          description="Use the Issue tab to generate and issue certificates." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-xs text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Recipient</th>
                <th className="hidden px-4 py-3 text-left font-medium md:table-cell">Template</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">Cert #</th>
                <th className="px-4 py-3 text-left font-medium">Issued</th>
                <th className="px-4 py-3 text-right font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((cert) => {
                const theme = CATEGORY_THEMES[cert.category] || CATEGORY_THEMES.member;
                return (
                  <tr key={cert.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold">{cert.recipientName}</p>
                      {cert.recipientEmail && (
                        <p className="text-[10px] text-muted-foreground">{cert.recipientEmail}</p>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                      {cert.templateName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-[10px]"
                        style={{ backgroundColor: `${theme.ribbon}20`, color: theme.ribbon }}>
                        {CATEGORIES.find((c) => c.value === cert.category)?.label ?? cert.category}
                      </Badge>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                      {cert.certNumber}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(cert.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-xs"
                          disabled={downloading === cert.id}
                          onClick={() => handleDownload(cert)}>
                          {downloading === cert.id
                            ? <RefreshCw className="size-3.5 animate-spin" />
                            : <Download className="size-3.5" />}
                        </Button>
                        <Button size="sm" variant="ghost"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={() => handleDelete(cert.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function CertificatesPage() {
  const [templates, setTemplates]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [editingTmpl, setEditingTmpl] = useState(null);
  const [issuingTmpl, setIssuingTmpl] = useState(null); // pre-selects in Issue tab
  const [tab, setTab]               = useState("templates");
  const fileRef = useRef(null);

  const refreshTemplates = useCallback(() => {
    setTemplates(getTemplates());
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    await seedDemoTemplates();
    const tmplList = getTemplates();
    seedDemoIssuedCerts(tmplList);
    setTemplates(tmplList);
    setLoading(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  /* ── Upload image → new template ── */
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a PNG or JPG image.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      const { width, height } = await getImageDimensions(dataUrl);
      const tmpl = await createTemplate({
        name: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        category: "member",
        bgImageDataUrl: dataUrl,
        bgImageWidth: width,
        bgImageHeight: height,
      });
      refreshTemplates();
      setEditingTmpl(tmpl);
      toast.success("Template created — position your fields and save.");
    } catch (err) {
      toast.error("Upload failed", { description: err.message });
    }
  };

  const handleSaveTemplate = (updatedDraft) => {
    updateTemplate(updatedDraft.id, updatedDraft);
    refreshTemplates();
    setEditingTmpl(null);
    toast.success("Template saved.");
  };

  const handleDeleteTemplate = (id) => {
    if (!confirm("Delete this template? Issued certificates are NOT deleted.")) return;
    deleteTemplate(id);
    refreshTemplates();
    toast.success("Template deleted.");
  };

  const handleIssueFromCard = (tmpl) => {
    setIssuingTmpl(tmpl.id);
    setTab("issue");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Award className="size-5 text-primary" /> Certificates
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload PNG/JPG templates, position text fields visually, then issue to members.
          </p>
        </div>
        <Button onClick={() => fileRef.current?.click()} className="gap-2">
          <Upload className="size-4" /> Upload template
        </Button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg"
          className="hidden" onChange={handleUpload} />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
          <TabsTrigger value="issue">Issue</TabsTrigger>
          <TabsTrigger value="issued">Issued</TabsTrigger>
        </TabsList>

        {/* ── Templates tab ── */}
        <TabsContent value="templates" className="mt-4">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[1.414/1] rounded-xl" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <EmptyState icon={Award}
              title="No templates yet"
              description="Upload a PNG or JPG certificate design to get started." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {templates.map((tmpl) => (
                <TemplateCard
                  key={tmpl.id}
                  template={tmpl}
                  onEdit={(t) => setEditingTmpl(t)}
                  onDelete={handleDeleteTemplate}
                  onIssue={handleIssueFromCard}
                />
              ))}
              {/* Upload card */}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="group flex aspect-[1.414/1] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
                <Upload className="size-6" />
                <span className="text-xs font-medium">Upload new</span>
              </button>
            </div>
          )}
        </TabsContent>

        {/* ── Issue tab ── */}
        <TabsContent value="issue" className="mt-4">
          <IssueTab
            templates={templates}
            defaultTemplateId={issuingTmpl}
          />
        </TabsContent>

        {/* ── Issued tab ── */}
        <TabsContent value="issued" className="mt-4">
          <IssuedTab templates={templates} onRefresh={refreshTemplates} />
        </TabsContent>
      </Tabs>

      {/* Visual editor dialog */}
      {editingTmpl && (
        <TemplateEditor
          template={editingTmpl}
          onSave={handleSaveTemplate}
          onClose={() => setEditingTmpl(null)}
        />
      )}
    </div>
  );
}
