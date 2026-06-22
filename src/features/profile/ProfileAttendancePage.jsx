"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AttendanceCard } from "@/components/shared/AttendanceCard";
import { useAuth } from "@/context/AuthContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { generateAttendanceToken, isTokenValid, getCurrentMinuteEpoch } from "@/lib/qr-token";
import { markAttendance, hasMarkedAttendance } from "@/lib/attendance-service";

/**
 * Public profile page. When eventId / eventName / token are present in
 * the URL (arrived here via QR scan redirect), an attendance card is
 * shown automatically and the page runs the full diagnostic logging
 * flow described in the attendance spec.
 *
 * This component NEVER touches localStorage directly for attendance —
 * all reads/writes go through src/lib/attendance-service.js so a future
 * backend swap requires zero changes here.
 */
export default function ProfileAttendancePage({ username }) {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { raw } = useSiteContent();

  const eventId   = searchParams.get("eventId");
  const eventName = searchParams.get("eventName");
  const token     = searchParams.get("token");
  const hasAttendanceParams = Boolean(eventId && eventName && token);

  const [status, setStatus] = useState("idle"); // idle | marking | success | duplicate | invalid | error
  const [hasLoggedDiagnostics, setHasLoggedDiagnostics] = useState(false);

  // The *internal* source of truth for this event — never trust the URL alone.
  const eventRecord = useMemo(
    () => (raw.events ?? []).find((e) => e.id === eventId),
    [raw.events, eventId]
  );

  /* ── Diagnostic logging pipeline — runs once per param set ── */
  useEffect(() => {
    if (!hasAttendanceParams || hasLoggedDiagnostics) return;

    // 1) Params received from the URL
    console.log({
      type: "ATTENDANCE_PARAMS_RECEIVED",
      eventId,
      eventName,
      token,
      profileUser: username,
      timestamp: new Date().toISOString(),
    });

    if (eventRecord?.qrSecret) {
      const qrSecret = eventRecord.qrSecret;
      const generatedToken = generateAttendanceToken(eventId, qrSecret, getCurrentMinuteEpoch());

      // 2) Internal QR data this page has access to (via the event record)
      console.log({
        type: "QR_INTERNAL_DATA",
        eventId,
        eventName: eventRecord.title ?? eventName,
        qrSecret,
        generatedToken,
      });

      // 3) Comparison between what arrived in the URL vs. internal truth
      console.log({
        type: "QR_URL_COMPARISON",
        urlEventId: eventId,
        qrEventId: eventRecord.id,
        eventIdMatch: eventId === eventRecord.id,

        urlEventName: eventName,
        qrEventName: eventRecord.title,
        eventNameMatch: eventName === eventRecord.title,

        urlToken: token,
        qrGeneratedToken: generatedToken,
        tokenMatch: token === generatedToken,
      });
    } else {
      console.warn({
        type: "QR_INTERNAL_DATA_UNAVAILABLE",
        reason: "No matching event (or missing qrSecret) found for this eventId.",
        eventId,
      });
    }

    // 4) Page loaded
    console.log({
      type: "PROFILE_PAGE_LOADED",
      eventId,
      eventName,
      token,
      username,
    });

    setHasLoggedDiagnostics(true);
  }, [hasAttendanceParams, hasLoggedDiagnostics, eventId, eventName, token, eventRecord, username]);

  /* ── Token validity (rolling 1-minute tolerance window) ── */
  const tokenIsValid = useMemo(() => {
    if (!eventRecord?.qrSecret || !token) return null; // unknown — can't verify
    return isTokenValid(eventId, eventRecord.qrSecret, token, 1);
  }, [eventRecord, eventId, token]);

  const handleMarkAttendance = async () => {
    setStatus("marking");

    const userId = user?.id ?? `demo-${username}`;
    const displayUsername = user?.displayName ?? username;

    // Duplicate check — always goes through the service layer
    const already = await hasMarkedAttendance(eventId, userId);
    if (already) {
      setStatus("duplicate");
      toast.error("Attendance already marked for this event.");
      return;
    }

    if (tokenIsValid === false) {
      setStatus("invalid");
      toast.error("This QR code has expired. Ask the organizer for the current one.");
      return;
    }

    const result = await markAttendance({
      eventId,
      eventName,
      userId,
      username: displayUsername,
      token,
    });

    if (result.ok) {
      setStatus("success");
      console.log({
        type: "ATTENDANCE_MARKED",
        eventId,
        eventName,
        userId,
        username: displayUsername,
        token,
        timestamp: new Date().toISOString(),
      });
      toast.success("Attendance marked!");
    } else {
      setStatus("duplicate");
      toast.error("Attendance already marked for this event.");
    }
  };

  const initials = username?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <section className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Basic profile header — always shown */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <Avatar className="size-14 ring-2 ring-border">
            <AvatarImage src={user?.avatarUrl} alt="" />
            <AvatarFallback className="text-lg"><User className="size-5" /></AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">@{username}</p>
            <p className="text-xs text-muted-foreground">CCS member profile</p>
          </div>
        </div>

        {/* Attendance card — only when QR params are present */}
        {hasAttendanceParams && (
          <AttendanceCard
            eventId={eventId}
            eventName={eventName}
            token={token}
            status={status}
            tokenIsValid={tokenIsValid}
            onMark={handleMarkAttendance}
          />
        )}

        {!hasAttendanceParams && (
          <p className="text-center text-sm text-muted-foreground">
            Scan an event QR code to mark your attendance — it will appear here automatically.
          </p>
        )}
      </div>
    </section>
  );
}
