/**
 * Deterministic, dependency-free hash → numeric attendance token.
 *
 * NOT cryptographically secure on its own — it is sufficient for a
 * short-lived (1-minute window), low-stakes attendance check where the
 * QR code is physically displayed at the event (the real protection is
 * "you had to be in the room to see the QR in the last 60 seconds").
 *
 * When a real backend is introduced, swap djb2Hash() for an HMAC-SHA256
 * keyed with a server-side secret — the function signatures below
 * (generateAttendanceToken, isTokenValid) do not need to change.
 */

function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // force unsigned 32-bit
}

/** Epoch minute — identical for any timestamp within the same UTC minute */
export function getCurrentMinuteEpoch(date = new Date()) {
  return Math.floor(date.getTime() / 60000);
}

/**
 * token = hash(eventId + qrSecret + currentMinute)
 * Always returns a zero-padded 6-digit numeric string, e.g. "908324"
 */
export function generateAttendanceToken(eventId, qrSecret, minuteEpoch = getCurrentMinuteEpoch()) {
  const raw = `${eventId}:${qrSecret}:${minuteEpoch}`;
  const hash = djb2Hash(raw);
  const sixDigit = hash % 1_000_000;
  return String(sixDigit).padStart(6, "0");
}

/**
 * Validates a token against a small rolling window of minutes to tolerate
 * scan latency / clock drift between the displayed QR and the scan moment.
 * windowMinutes = 1 means "current minute OR the previous minute" is valid.
 */
export function isTokenValid(eventId, qrSecret, token, windowMinutes = 1) {
  if (!eventId || !qrSecret || !token) return false;
  const current = getCurrentMinuteEpoch();
  for (let offset = 0; offset <= windowMinutes; offset++) {
    if (generateAttendanceToken(eventId, qrSecret, current - offset) === token) {
      return true;
    }
  }
  return false;
}
