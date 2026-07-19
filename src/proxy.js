import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "token";
const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? `${window.location.origin}/api`
    : "http://localhost:4000/api/v1");

const GUEST_BLOCKED = ["/dashboard", "/admin"];
const ADMIN_ONLY = ["/admin"];
const PUBLIC_ADMIN_PATHS = ["/admin/recruitment"];

const GUEST_REDIRECT = "/login";
const NON_ADMIN_REDIRECT = "/dashboard";

function matches(pathname, list) {
  return list.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isPublicAdminPath(pathname) {
  return PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;

  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.slice(name.length + 1));
}

function buildGuestRedirect(req) {
  const redirectResponse = NextResponse.redirect(new URL(GUEST_REDIRECT, req.url));
  redirectResponse.cookies.delete(AUTH_COOKIE_NAME);
  return redirectResponse;
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const guestBlocked = matches(pathname, GUEST_BLOCKED);
  const adminOnly = matches(pathname, ADMIN_ONLY);

  if (!guestBlocked && !adminOnly) {
    return NextResponse.next();
  }

  const cookieHeader = req.headers.get("cookie") ?? "";
  const token = getCookieValue(cookieHeader, AUTH_COOKIE_NAME);

  if (!token) {
    if (guestBlocked && !isPublicAdminPath(pathname)) {
      return buildGuestRedirect(req);
    }
    return NextResponse.next();
  }

  if (!API_BASE_URL) {
    return buildGuestRedirect(req);
  }

  let isAdmin = false;
  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/users/me`, {
      headers: {
        cookie: cookieHeader,
        accept: "application/json",
      },
      redirect: "manual",
    });

    if (!response.ok) {
      throw new Error(`auth check failed: ${response.status}`);
    }

    const data = await response.json();
    isAdmin = ["admin", "developer"].includes(data?.data?.role);
  } catch {
    return buildGuestRedirect(req);
  }

  if (adminOnly && !isAdmin) {
    return NextResponse.redirect(new URL(NON_ADMIN_REDIRECT, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
