"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Download,
  RefreshCw,
  Check,
  Sliders,
  ChevronDown,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/context/SiteContentContext";
import {
  QR_DESIGNS,
  renderQRToCanvas,
  downloadCanvasAsPNG,
  getSavedDesignId,
  saveDesignId,
} from "@/lib/qr-designer";
import { encodeQrPayload } from "@/lib/qr-payload";
import { cn } from "@/lib/utils";

const EXPORT_SIZES = [
  { label: "512 × 512 px (standard)", value: 512 },
  { label: "1024 × 1024 px (print)", value: 1024 },
  { label: "2048 × 2048 px (HD print)", value: 2048 },
  { label: "256 × 256 px (web icon)", value: 256 },
];

/* ─── Small design thumbnail ─── */
function DesignThumb({ design, selected, onClick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Render a mini preview QR for the theme thumbnail
    renderQRToCanvas(canvas, "CCS", design.config, 96).catch(() => {});
  }, [design]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border-2 p-0 transition-all duration-200",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border hover:border-foreground/30",
      )}
      aria-label={design.name}
      aria-pressed={selected}
    >
      <canvas
        ref={canvasRef}
        className="block w-full"
        style={{ aspectRatio: "1/1", imageRendering: "pixelated" }}
      />
      <div className="bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4">
        <p className="text-[10px] font-semibold text-white leading-tight truncate">
          {design.name}
        </p>
        <p className="text-[9px] text-white/60 leading-tight truncate">
          {design.description}
        </p>
      </div>
      {selected && (
        <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" />
        </span>
      )}
    </button>
  );
}

import backendMiddleware from "@/backend-middleware";
import { useRouter } from "next/navigation";

/* ─── Main page ─── */
export default function QrDesignerPage() {
  const { raw } = useSiteContent();
  const events = raw.events ?? [];

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const result = await backendMiddleware("/admin/qr-designer");
      if (!result) router.push("/");
    })();
  }, []);

  const mainCanvasRef = useRef(null);

  const [selectedId, setSelectedId] = useState(getSavedDesignId());
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? "");
  const [customText, setCustomText] = useState("");
  const [exportSize, setExportSize] = useState(512);
  const [activeFilter, setActiveFilter] = useState("all");
  const [rendering, setRendering] = useState(false);

  const selectedDesign =
    QR_DESIGNS.find((d) => d.id === selectedId) ?? QR_DESIGNS[0];

  // Build QR content: prefer event QR payload, fall back to custom text or CCS URL
  const getQrText = useCallback(() => {
    if (customText.trim()) return customText.trim();
    const event = events.find((e) => e.id === selectedEventId);
    if (event?.qrSecret) {
      return encodeQrPayload({
        eventId: event.id,
        eventName: event.title,
        qrSecret: event.qrSecret,
        username: "member",
      });
    }
    return "https://ccs.university.edu";
  }, [customText, selectedEventId, events]);

  const renderPreview = useCallback(async () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    setRendering(true);
    try {
      await renderQRToCanvas(canvas, getQrText(), selectedDesign.config, 380);
    } catch (e) {
      console.error("QR render error", e);
    } finally {
      setRendering(false);
    }
  }, [selectedDesign, getQrText]);

  // Re-render on design / event / custom text change
  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  const handleSelectDesign = (id) => {
    setSelectedId(id);
    saveDesignId(id);
  };

  const handleDownload = () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    // Re-render at export size first
    const offscreen = document.createElement("canvas");
    const event = events.find((e) => e.id === selectedEventId);
    const fileName = `ccs-qr-${selectedId}${event ? `-${event.id}` : ""}.png`;
    renderQRToCanvas(offscreen, getQrText(), selectedDesign.config, exportSize)
      .then(() => {
        downloadCanvasAsPNG(offscreen, fileName);
        toast.success(
          `Downloaded as ${fileName} (${exportSize}×${exportSize} px)`,
        );
      })
      .catch(() => toast.error("Download failed — try again."));
  };

  // Filter by tag
  const TAGS = ["all", "blue", "green", "white", "dark"];
  const filteredDesigns =
    activeFilter === "all"
      ? QR_DESIGNS
      : QR_DESIGNS.filter((d) => d.tags.includes(activeFilter));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Wand2 className="size-5 text-primary" /> QR Designer
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create and download styled QR codes for events.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* ── Left: Templates ── */}
        <div className="space-y-4">
          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveFilter(tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                  activeFilter === tag
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Design grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filteredDesigns.map((design) => (
              <DesignThumb
                key={design.id}
                design={design}
                selected={selectedId === design.id}
                onClick={() => handleSelectDesign(design.id)}
              />
            ))}
          </div>

          {filteredDesigns.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-6">
              No designs match this filter.
            </p>
          )}
        </div>

        {/* ── Right: Preview + controls ── */}
        <div className="space-y-5">
          {/* Live preview canvas */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
              <div>
                <p className="text-sm font-semibold">{selectedDesign.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {selectedDesign.description}
                </p>
              </div>
              <div className="flex gap-1">
                {(selectedDesign.tags ?? []).map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="text-[9px] uppercase tracking-wider"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center p-4">
              <canvas
                ref={mainCanvasRef}
                className="w-full max-w-[380px] rounded-xl"
                style={{ aspectRatio: "1/1", imageRendering: "pixelated" }}
              />
              {rendering && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60">
                  <RefreshCw className="size-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* QR content */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sliders className="size-3.5" /> QR Content
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Event</Label>
              <Select
                value={selectedEventId}
                onValueChange={(v) => {
                  setSelectedEventId(v);
                  setCustomText("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
                <div className="flex-1 border-t border-border" />
                <span className="px-2 text-[10px] text-muted-foreground">
                  OR
                </span>
                <div className="flex-1 border-t border-border" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Custom text / URL</Label>
              <Input
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setSelectedEventId("");
                }}
                placeholder="https://… or any text"
                className="text-xs font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                Leave blank to use the selected event's QR payload.
              </p>
            </div>
          </div>

          {/* Export */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Export
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Output size</Label>
              <Select
                value={String(exportSize)}
                onValueChange={(v) => setExportSize(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_SIZES.map((s) => (
                    <SelectItem key={s.value} value={String(s.value)}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleDownload}
              disabled={rendering}
            >
              <Download className="size-4" />
              Download PNG ({exportSize}×{exportSize})
            </Button>
            <p className="text-center text-[10px] text-muted-foreground">
              PNG with transparent-layer support · no watermark
            </p>
          </div>

          {/* Design tip */}
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              💡 Tip
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The CCS logo text and colours are set by the design template. To
              add new custom designs, edit
              <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[10px]">
                src/lib/qr-designer.js
              </code>
              and add an entry to{" "}
              <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[10px]">
                QR_DESIGNS
              </code>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
