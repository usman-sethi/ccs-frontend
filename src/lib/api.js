/**
 * API client for the CCS Express/Node backend.
 * Set NEXT_PUBLIC_API_URL in your .env.local to point to your backend.
 * Default: http://localhost:3001
 *
 * All functions throw on error so callers can catch and show toasts.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? `${window.location.origin}/api`
    : "http://localhost:4000/api/v1");
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "token";
const AUTH_STORAGE_KEY = "ccs-auth-token";

function extractAuthToken(payload) {
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.token === "string" && payload.token) return payload.token;
  if (typeof payload.accessToken === "string" && payload.accessToken) return payload.accessToken;
  if (typeof payload.jwt === "string" && payload.jwt) return payload.jwt;
  if (payload.data && typeof payload.data === "object") {
    return extractAuthToken(payload.data);
  }
  if (payload.user && typeof payload.user === "object") {
    return extractAuthToken(payload.user);
  }
  return null;
}

function getStoredAuthToken() {
  if (typeof window === "undefined") return null;

  const cookieValue = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (cookieValue) {
    return decodeURIComponent(cookieValue.slice(AUTH_COOKIE_NAME.length + 1));
  }

  return localStorage.getItem(AUTH_STORAGE_KEY);
}

function persistAuthToken(payload) {
  if (typeof window === "undefined") return;
  const token = extractAuthToken(payload);
  if (!token) return;

  const secure = window.location.protocol === "https:";
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax${secure ? "; Secure" : ""}`;
  localStorage.setItem(AUTH_STORAGE_KEY, token);
}

function clearStoredAuthToken() {
  if (typeof window === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const url = `${API_BASE}${path}`;

  const authToken = getStoredAuthToken();
  let res;
  try {
    res = await fetch(url, {
      credentials: "include",
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    throw new Error(
      `Unable to reach the CCS API at ${url}. Check the backend URL and CORS settings.`,
    );
  }

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

  const body = await res.json();
  persistAuthToken(body);
  return body;
}

/* -------- Auth -------- */

/**
 * POST /api/auth/signin
 * Expected body: { email, password }
 * Expected response: { id, email, displayName, avatarUrl, isAdmin, token }
 */
export async function signIn({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * POST /api/auth/signup
 * Expected body: { email, password, displayName }
 * Expected response: { message } (email verification required before login)
 */
export async function signUp({ email, password }) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// 2fa
export async function twoFactorAuth({ email, otp }) {
  return request("/auth/2fa", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export const resendOTP = async (email) => {
  return request("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

/**
 * POST /api/auth/logout
 */
export async function signOut() {
  return request("/auth/logout", { method: "POST" })
    .catch((err) => {
      console.log(err.message);
    })
    .finally(() => {
      clearStoredAuthToken();
    });
}

/**
 * POST /api/auth/forgot-password
 * Expected body: { email }
 */
export async function forgotPassword(email) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * POST /api/auth/reset-password
 * Expected body: { password, token }
 */
export async function resetPassword({ password, token }) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ password, token }),
  });
}

/* -------- Profile -------- */

/**
 * GET /users/profile
 * Expected response: { id, email, displayName, avatarUrl, department, year, bio, linkedin, github, isAdmin }
 */
export async function getProfile() {
  return request("/users/me");
}

/**
 * PATCH /api/profile
 * Expected body: { displayName, department, year, bio, linkedin, github }
 */
export async function updateProfile(data) {
  const hasFile = Object.values(data).some(
    (value) => value instanceof File || value instanceof Blob,
  );

  if (hasFile) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // The dashboard calls its cropped avatar `avatar`; the API stores it
        // as `profileImage` to match the user object consumed across the UI.
        formData.append(key === "avatar" ? "profileImage" : key, value);
      }
    });

    return request(`/users/${data.id}`, {
      method: "PATCH",
      body: formData,
    });
  }

  return request(`/users/${data.id}`, {
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
  return request("/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* -------- Recruitment -------- */

/**
 * POST /api/recruitment
 * Expected body: { fullName, email, phone, department, semester, club, motivation }
 */

export const fetchPositions = async () => {
  return request("/positions", {
    method: "GET",
  });
};

export async function submitRecruitment(data) {
  return request("/recruitments", {
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
  return request("/recruitments");
}

/**
 * PATCH /api/admin/recruitment/:id
 * Expected body: { status: "new" | "reviewing" | "accepted" | "rejected" }
 */
export async function updateRecruitmentApplication(id, data) {
  return request(`/recruitments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
