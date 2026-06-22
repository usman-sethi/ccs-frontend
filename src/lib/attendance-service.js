/**
 * Attendance service layer.
 *
 * Currently backed by localStorage. Every function is async and returns
 * plain serializable data, so swapping the internals for real fetch()
 * calls to an Express backend later requires ZERO changes in any
 * component that imports from here (ProfileAttendancePage, admin pages).
 *
 * Future equivalents (documented per function below) follow the same
 * REST shape already used in src/lib/api.js.
 */

const KEY = "ccs-attendance-v1";

function readAll() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(records) {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    /* quota */
  }
}

/** GET /api/attendance — all records (admin view) */
export async function getAttendanceRecords() {
  return readAll().sort((a, b) => b.timestamp - a.timestamp);
}

/** GET /api/attendance?eventId=... */
export async function getAttendanceForEvent(eventId) {
  return readAll().filter((r) => r.eventId === eventId);
}

/** GET /api/attendance/check?eventId=...&userId=... — duplicate check */
export async function hasMarkedAttendance(eventId, userId) {
  return readAll().some((r) => r.eventId === eventId && r.userId === userId);
}

/**
 * POST /api/attendance
 * Token freshness must already be validated by the caller (via
 * isTokenValid from qr-token.js) BEFORE calling this — this function
 * only handles persistence + duplicate prevention.
 */
export async function markAttendance({ eventId, eventName, userId, username, token }) {
  const already = await hasMarkedAttendance(eventId, userId);
  if (already) {
    return {
      ok: false,
      reason: "duplicate",
      record: readAll().find((r) => r.eventId === eventId && r.userId === userId),
    };
  }

  const record = {
    id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId,
    eventName,
    userId,
    username,
    token,
    timestamp: Date.now(),
  };

  writeAll([...readAll(), record]);
  return { ok: true, record };
}

/** DELETE /api/attendance/:id — admin only */
export async function deleteAttendanceRecord(id) {
  writeAll(readAll().filter((r) => r.id !== id));
  return true;
}

/** Seed dummy attendance records for admin demo (no-op if data exists) */
export async function seedDummyAttendance() {
  if (readAll().length > 0) return;
  const now = Date.now();
  const dummy = [
    { id: "att-demo-1", eventId: "e1", eventName: "CodeStorm Hackathon 2026", userId: "m1", username: "Ayesha Khan", token: "908324", timestamp: now - 3600_000 },
    { id: "att-demo-2", eventId: "e1", eventName: "CodeStorm Hackathon 2026", userId: "m4", username: "Bilal Ahmed", token: "908324", timestamp: now - 3500_000 },
    { id: "att-demo-3", eventId: "e2", eventName: "Intro to LLM Fine-Tuning", userId: "m3", username: "Sara Iqbal", token: "224410", timestamp: now - 86_400_000 },
  ];
  writeAll(dummy);
}
