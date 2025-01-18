import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = [
  "/sign-in",
  "/sign-up",
  // "/forgot-password",
  // "/email-verification",
  // "/reset-password",
];

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get("authjs.session-token");
  return !!token;
}
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If the user is authenticated and trying to access an auth page, redirect to dashboard
  if (isAuthenticated(req) && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (
    !isAuthenticated(req) &&
    !authPages.includes(pathname) &&
    !pathname.startsWith("/reset-password/")
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Otherwise, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!static|favicon.ico|_next|.*\\..*|api|trpc).*)", "/"],
};
