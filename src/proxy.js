import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const verifyToken = async (token) => {
  try {
    console.log("token: ", token)
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    console.log("secret: ", secret)
    const { payload } = await jwtVerify(token, secret);

    console.log("payload", payload)

    return payload;
  } catch (err) {
    console.error("JWT Verify Error:", err);
    return null;
  }
};

export async function proxy(req) {
  console.log("cookies: ", req.cookies.getAll())
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
  if (
    isGuest &&
    (isAdminPath || isRestrictedPath || pathname.startsWith("/dashboard"))
  ) {
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
    if (isAuthPath || isRestrictedPath) {
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
