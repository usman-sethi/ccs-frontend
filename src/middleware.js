import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const verifyToken = async (token) => {
  try {
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch {
    return null;
  }
};

export async function middleware(req) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  const restrictedPaths = [
    "/projects",
    "/gallery",
    "/achievements",
    "/pastpapers",
  ];

  const authPaths = [
    "/login",
    "/signup",
    "/2fa",
    "/forgot-password",
    "/verify-email",
  ];

  const payload = await verifyToken(token);

  const isGuest = !payload;
  const isUser = payload?.role === "user";
  const isAdmin = payload?.role === "admin";

  const isAuthPath = authPaths.includes(pathname);
  const isRestrictedPath = restrictedPaths.includes(pathname);

  const isAdminPath = pathname.startsWith("/admin");

  const isAllowedAdminPath =
    pathname === "/admin/recruitment" ||
    pathname.startsWith("/admin/recruitment/");

  // Guest
  if (isGuest && isAdminPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Logged-in user
  if (isUser) {
    if (isAuthPath || isRestrictedPath || isAdminPath) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Admin
  if (isAdmin) {
    // Prevent visiting auth pages
    if (isAuthPath) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Only allow /admin/recruitments/**
    if (isAdminPath && !isAllowedAdminPath) {
      return NextResponse.redirect(new URL("/admin/recruitment", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|fonts|.*\\..*).*)"],
};
