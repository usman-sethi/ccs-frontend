import { generateAttendanceToken, getCurrentMinuteEpoch } from "./qr-token";

/**
 * Shape of the data physically encoded inside the event QR image:
 * { eventId, eventName, qrSecret, username, v }
 *
 * `username` determines which profile route the scanner redirects to
 * (e.g. "isa" → /isa/profile). In production this would typically be
 * generated per-attendee (personal QR) or resolved from routing context
 * at scan time — never from "who is currently logged in" (the scanner
 * is intentionally identity-blind; see ScanPage.jsx).
 */

export function encodeQrPayload({ eventId, eventName, qrSecret, username }) {
  return JSON.stringify({ eventId, eventName, qrSecret, username, v: 1 });
}

export function decodeQrPayload(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.eventId || !parsed.qrSecret) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Builds the profile redirect URL from a decoded QR payload.
 * Username comes from the QR payload itself ("encoded in the QR flow");
 * falls back to a generic routing-context default if absent.
 *
 * Manually percent-encodes (rather than URLSearchParams, which encodes
 * spaces as "+") so the resulting URL matches the documented format,
 * e.g. /isa/profile?eventId=hackathon2026&eventName=Hackathon%202026&token=908324
 */
export function buildAttendanceRedirectUrl(qrData) {
  const { eventId, eventName, qrSecret, username } = qrData;
  const token = generateAttendanceToken(eventId, qrSecret, getCurrentMinuteEpoch());
  const routeUser = username || "member";
  const query = [
    `eventId=${encodeURIComponent(eventId)}`,
    `eventName=${encodeURIComponent(eventName)}`,
    `token=${encodeURIComponent(token)}`,
  ].join("&");
  return { url: `/${routeUser}/profile?${query}`, token };
}
