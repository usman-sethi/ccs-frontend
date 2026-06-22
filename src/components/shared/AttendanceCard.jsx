"use client";

import { CalendarCheck, Hash, Clock, CheckCircle2, AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  idle:      { label: "Ready to mark",        icon: Clock,        cls: "text-muted-foreground" },
  marking:   { label: "Marking attendance…",  icon: Loader2,      cls: "text-primary", spin: true },
  success:   { label: "Attendance marked",    icon: CheckCircle2, cls: "text-emerald-600 dark:text-emerald-400" },
  duplicate: { label: "Already marked",       icon: AlertTriangle,cls: "text-amber-600 dark:text-amber-400" },
  invalid:   { label: "QR code expired",      icon: ShieldAlert,  cls: "text-destructive" },
  error:     { label: "Something went wrong", icon: AlertTriangle,cls: "text-destructive" },
};

/**
 * Self-contained attendance card shown on the profile page when
 * eventId / eventName / token are present in the URL.
 */
export function AttendanceCard({ eventId, eventName, token, status, tokenIsValid, onMark }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  const StatusIcon = config.icon;
  const canMark = status === "idle" || status === "invalid";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Header strip */}
      <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/10 via-card to-card px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <CalendarCheck className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Event Attendance</p>
          <h2 className="text-base font-semibold tracking-tight truncate">{eventName}</h2>
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Event ID</p>
            <p className="font-mono font-medium mt-0.5">{eventId}</p>
          </div>
          <div>
            <p className="text-muted-foreground flex items-center gap-1"><Hash className="size-3" /> Token</p>
            <p className="font-mono font-medium mt-0.5 tracking-wider">{token}</p>
          </div>
        </div>

        {tokenIsValid === false && status !== "success" && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            <ShieldAlert className="size-3.5 shrink-0 mt-0.5" />
            <span>This QR code has expired (tokens refresh every minute). Ask the organizer to show the latest code.</span>
          </div>
        )}

        {/* Status row */}
        <div className={cn("flex items-center gap-2 text-sm font-medium", config.cls)}>
          <StatusIcon className={cn("size-4", config.spin && "animate-spin")} />
          {config.label}
        </div>

        {/* Action */}
        {canMark && (
          <Button className="w-full" onClick={onMark} disabled={status === "marking"}>
            {status === "marking" ? "Marking…" : "Mark Attendance"}
          </Button>
        )}

        {status === "success" && (
          <Badge variant="secondary" className="w-full justify-center py-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5 mr-1.5" /> You're checked in!
          </Badge>
        )}

        {status === "duplicate" && (
          <Badge variant="outline" className="w-full justify-center py-1.5">
            Attendance was already recorded for this event
          </Badge>
        )}
      </div>
    </div>
  );
}
