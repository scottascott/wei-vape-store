import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { isAdminAuthBypassed } from "@/lib/dev-auth-bypass";

// Next.js 16 renamed the Middleware file convention to Proxy; behavior is unchanged.
export default auth((req) => {
  if (isAdminAuthBypassed()) return;

  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isLoggedIn = !!req.auth;

  if (pathname.startsWith("/admin") && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
