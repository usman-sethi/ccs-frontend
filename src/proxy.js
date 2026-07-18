import { NextResponse } from "next/server";

const COOKIE_NAME = "token"; // your actual auth cookie name

const GUEST_BLOCKED = ["/dashboard", "/admin"];
const ADMIN_ONLY = ["/admin"];

const GUEST_REDIRECT = "/recruitment";
const NON_ADMIN_REDIRECT = "/dashboard";

function matches(pathname, list) {
  return list.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  const guestBlocked = matches(pathname, GUEST_BLOCKED);
  const adminOnly = matches(pathname, ADMIN_ONLY);
  if (!guestBlocked && !adminOnly) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (guestBlocked) {
      return NextResponse.redirect(new URL(GUEST_REDIRECT, req.url));
    }
    return NextResponse.next();
  }

  let isAdmin = false;
  try {
    const res = await fetch(new URL("/api/auth/me", req.url), {
      headers: { cookie: req.headers.get("cookie") ?? "" },
    });
    if (!res.ok) throw new Error("not authed");
    const data = await res.json();
    isAdmin = !!data.isAdmin;
  } catch {
    if (guestBlocked) {
      const r = NextResponse.redirect(new URL(GUEST_REDIRECT, req.url));
      r.cookies.delete(COOKIE_NAME);
      return r;
    }
    return NextResponse.next();
  }

  if (adminOnly && !isAdmin) {
    return NextResponse.redirect(new URL(NON_ADMIN_REDIRECT, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};