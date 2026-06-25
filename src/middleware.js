import { NextResponse } from "next/server";

export function middleware(req) {
  // const token = req.cookies.get("authToken")?.value;
  // const { pathname } = req.nextUrl;

  // const authPaths = ["/login", "/2fa", "/signup", "/forgot-password"];

  // if (token && authPaths.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // if (!token && !authPaths.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|fonts|.*\\..*).*)"],
};
