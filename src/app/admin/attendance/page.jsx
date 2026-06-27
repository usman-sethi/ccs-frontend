"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import backendMiddleware from "@/backend-middleware";
import {
  RefreshCw,
  QrCode,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Users,
  KeyRound,
  Download,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSiteContent } from "@/context/SiteContentContext";
import {
  getAttendanceRecords,
  deleteAttendanceRecord,
  seedDummyAttendance,
} from "@/lib/attendance-service";
import { encodeQrPayload } from "@/lib/qr-payload";
import {
  renderQRToCanvas,
  downloadCanvasAsPNG,
  getSavedDesign,
} from "@/lib/qr-designer";
import { cn } from "@/lib/utils";

/* ─── QR Preview + Download Dialog ─── */
function QrDialog({ event, open, onOpenChange }) {
  const canvasRef = useRef(null);
  const [rendering, setRendering] = useState(false);
  const design = getSavedDesign();

  useEffect(() => {
    if (!open || !event || !canvasRef.current) return;
    setRendering(true);
    const payload = encodeQrPayload({
      eventId: event.id,
      eventName: event.title,
      qrSecret: event.qrSecret,
      username: "member",
    });
    renderQRToCanvas(canvasRef.current, payload, design.config, 360).finally(
      () => setRendering(false),
    );
  }, [open, event]);

  const handleDownload = () => {
    if (!canvasRef.current || !event) return;
    // Re-render at print resolution before download
    const offscreen = document.createElement("canvas");
    const payload = encodeQrPayload({
      eventId: event.id,
      eventName: event.title,
      qrSecret: event.qrSecret,
      username: "member",
    });
    renderQRToCanvas(offscreen, payload, design.config, 1024)
      .then(() => {
        const safeName = event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        downloadCanvasAsPNG(offscreen, `ccs-qr-${event.id}-${safeName}.png`);
        toast.success("QR downloaded (1024 × 1024 px)");
      })
      .catch(() => toast.error("Download failed."));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base">{event?.title}</DialogTitle>
          <DialogDescription className="text-xs mt-0.5">
            Display at the event. Token refreshes every 60 seconds
            automatically.
          </DialogDescription>
        </div>

        {/* Canvas */}
        <div className="relative flex items-center justify-center p-5">
          <canvas
            ref={canvasRef}
            className="w-full rounded-xl"
            style={{ aspectRatio: "1 / 1", imageRendering: "pixelated" }}
          />
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <RefreshCw className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-border bg-surface px-5 py-3 space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-muted-foreground flex-1">
              Style:{" "}
              <span className="font-medium text-foreground">{design.name}</span>
            </p>
            <Link
              href="/admin/qr-designer"
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
            >
              Change design <ExternalLink className="size-3" />
            </Link>
          </div>
          <Button
            className="w-full gap-2"
            onClick={handleDownload}
            disabled={rendering}
          >
            <Download className="size-4" /> Download PNG (1024 × 1024)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Event row ─── */
function EventRow({
  event,
  onShowQr,
  onRotateSecret,
  revealed,
  onToggleReveal,
  attendeeCount,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{event.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <KeyRound className="size-3" />
            <span className="font-mono">
              {revealed
                ? event.qrSecret
                : "•".repeat(Math.min(event.qrSecret?.length ?? 8, 20))}
            </span>
          </span>
          <button
            type="button"
            onClick={onToggleReveal}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={revealed ? "Hide secret" : "Show secret"}
          >
            {revealed ? (
              <EyeOff className="size-3" />
            ) : (
              <Eye className="size-3" />
            )}
          </button>
        </div>
      </div>
      <Badge variant="secondary" className="text-[10px] gap-1 shrink-0">
        <Users className="size-3" /> {attendeeCount}
      </Badge>
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 text-xs"
          onClick={onShowQr}
        >
          <QrCode className="size-3.5" /> Show & Download QR
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 gap-1.5 text-xs"
          onClick={onRotateSecret}
        >
          <RefreshCw className="size-3.5" /> Rotate secret
        </Button>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function AdminAttendancePage() {
  const { raw, update } = useSiteContent();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [revealed, setRevealed] = useState({});
  const [qrEvent, setQrEvent] = useState(null);

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const result = await backendMiddleware("/admin/attendance");
      if (!result) router.push("/");
    })();
  }, []);

  const load = async () => {
    setLoading(true);
    await seedDummyAttendance();
    setRecords(await getAttendanceRecords());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const events = raw.events ?? [];
  const countFor = (eventId) =>
    records.filter((r) => r.eventId === eventId).length;

  const rotateSecret = (eventIndex) => {
    const newSecret = `ccs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    update((draft) => {
      draft.events[eventIndex].qrSecret = newSecret;
    });
    toast.success("Secret rotated — existing QR images are now invalid.");
  };

  const handleDeleteRecord = async (id) => {
    if (!confirm("Delete this attendance record?")) return;
    await deleteAttendanceRecord(id);
    setRecords(await getAttendanceRecords());
    toast.success("Record deleted.");
  };

  const filteredRecords = records.filter((r) => {
    const s = q.toLowerCase();
    return (
      !s ||
      r.username?.toLowerCase().includes(s) ||
      r.eventName?.toLowerCase().includes(s) ||
      r.eventId?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Attendance</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {records.length} check-ins across {events.length} events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/qr-designer">
              <QrCode className="size-3.5 mr-1.5" /> QR Designer
            </Link>
          </Button>
          <Button size="sm" variant="outline" onClick={load} disabled={loading}>
            <RefreshCw
              className={cn("size-3.5 mr-1.5", loading && "animate-spin")}
            />{" "}
            Refresh
          </Button>
        </div>
      </div>

      {/* Event QR management */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Event QR codes</h2>
        <p className="text-xs text-muted-foreground">
          Click "Show & Download QR" to preview and save the styled QR for any
          event. The QR style comes from your selection in the{" "}
          <Link
            href="/admin/qr-designer"
            className="text-primary hover:underline"
          >
            QR Designer
          </Link>
          .
        </p>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No events found. Add events in the Customize panel.
          </p>
        ) : (
          events.map((event, i) => (
            <EventRow
              key={event.id}
              event={event}
              attendeeCount={countFor(event.id)}
              revealed={!!revealed[event.id]}
              onToggleReveal={() =>
                setRevealed((p) => ({ ...p, [event.id]: !p[event.id] }))
              }
              onShowQr={() => setQrEvent(event)}
              onRotateSecret={() => rotateSecret(i)}
            />
          ))
        )}
      </div>

      {/* Records table */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Check-in records</h2>
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or event…"
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No check-ins yet"
            description="Records appear here once members scan an event QR and mark attendance."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-xs text-muted-foreground">
                  <th className="px-4 py-3 text-left font-medium">Member</th>
                  <th className="px-4 py-3 text-left font-medium">Event</th>
                  <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                    Token
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Time</th>
                  <th className="px-4 py-3 text-right font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs font-medium">
                      {r.username}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">
                      {r.eventName}
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                      {r.token}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => handleDeleteRecord(r.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Dialog */}
      <QrDialog
        event={qrEvent}
        open={!!qrEvent}
        onOpenChange={(o) => !o && setQrEvent(null)}
      />
    </div>
  );
}
