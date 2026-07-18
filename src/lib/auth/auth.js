/**
 * Future middleware helpers.
 * We are not using them yet.
 */

export function isAuthenticatedFromCookie(request) {
  // We will implement this in Step 3.
  return Boolean(request.cookies.get("token"));
}

export function getRoleFromCookie(request) {
  // We will implement this in Step 3.
  return request.cookies.get("role")?.value || null;
}