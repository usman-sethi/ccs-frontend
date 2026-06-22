/**
 * API client for the CCS Express/Node backend.
 * Set NEXT_PUBLIC_API_URL in your .env.local to point to your backend.
 * Default: http://localhost:3001
 *
 * All functions throw on error so callers can catch and show toasts.
 */

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      msg = body.message || body.error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}

/* -------- Auth -------- */

/**
 * POST /api/auth/signin
 * Expected body: { email, password }
 * Expected response: { id, email, displayName, avatarUrl, isAdmin, token }
 */
export async function signIn({ email, password }) {
  return request("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * POST /api/auth/signup
 * Expected body: { email, password, displayName }
 * Expected response: { message } (email verification required before login)
 */
export async function signUp({ email, password, displayName }) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  });
}

/**
 * POST /api/auth/signout
 */
export async function signOut() {
  return request("/api/auth/signout", { method: "POST" }).catch(() => {
    /* silent — local state is cleared regardless */
  });
}

/**
 * POST /api/auth/forgot-password
 * Expected body: { email }
 */
export async function forgotPassword(email) {
  return request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * POST /api/auth/reset-password
 * Expected body: { password, token }
 */
export async function resetPassword({ password, token }) {
  return request("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ password, token }),
  });
}

/* -------- Profile -------- */

/**
 * GET /api/profile
 * Expected response: { id, email, displayName, avatarUrl, department, year, bio, linkedin, github, isAdmin }
 */
export async function getProfile() {
  return request("/api/profile");
}

/**
 * PATCH /api/profile
 * Expected body: { displayName, department, year, bio, linkedin, github }
 */
export async function updateProfile(data) {
  return request("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/* -------- Contact -------- */

/**
 * POST /api/contact
 * Expected body: { name, email, subject, message }
 */
export async function submitContact(data) {
  return request("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* -------- Recruitment -------- */

/**
 * POST /api/recruitment
 * Expected body: { fullName, email, phone, department, semester, club, motivation }
 */
export async function submitRecruitment(data) {
  return request("/api/recruitment", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* -------- Admin: Members -------- */

/**
 * GET /api/admin/members
 * Expected response: Array<{ id, displayName, avatarUrl, department, year, createdAt, isAdmin }>
 */
export async function getMembers() {
  return request("/api/admin/members");
}

/**
 * PATCH /api/admin/members/:id/role
 * Expected body: { isAdmin: boolean }
 */
export async function toggleAdminRole(userId, isAdmin) {
  return request(`/api/admin/members/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ isAdmin }),
  });
}

/* -------- Admin: Contact messages -------- */

/**
 * GET /api/admin/contact
 * Expected response: Array<{ id, name, email, subject, message, status, createdAt }>
 */
export async function getContactMessages() {
  return request("/api/admin/contact");
}

/**
 * PATCH /api/admin/contact/:id
 * Expected body: { status: "new" | "read" | "archived" }
 */
export async function updateContactMessage(id, data) {
  return request(`/api/admin/contact/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/* -------- Admin: Recruitment applications -------- */

/**
 * GET /api/admin/recruitment
 * Expected response: Array<{ id, fullName, email, department, year, clubInterest, motivation, status, createdAt }>
 */
export async function getRecruitmentApplications() {
  return request("/api/admin/recruitment");
}

/**
 * PATCH /api/admin/recruitment/:id
 * Expected body: { status: "new" | "reviewing" | "accepted" | "rejected" }
 */
export async function updateRecruitmentApplication(id, data) {
  return request(`/api/admin/recruitment/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
